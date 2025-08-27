import { Agent, tool, run } from "@openai/agents";
import { z } from "zod";
import { OpenAI } from "openai";
import envConf from "../../envconf.js";
import { chromium } from "playwright";

// ------------------------------
// OpenAI setup
// ------------------------------
new OpenAI({
    apiKey: envConf.openAIApiKey,
});

// ------------------------------
// In-memory stores for objects.
// This is needed because we can only pass serailizable json data between tools of an agent, whereas the playwright returns non-serializable json data. So, we keep an object mapping and instead of sharing the data returned by playwright (non-serializable json data) between tools, we share the required id, example for browser and page. We store the data required in the map store so that the tools can get them with the id.
// ------------------------------
const browserStore = new Map();
const pageStore = new Map();
let browserCounter = 0;
let pageCounter = 0;


// TOOLS:   

// ------------------------------
// Tool: Launch Browser
// ------------------------------
const playwrightLaunchBrowser = new tool({
    name: "playwright_launch_browser",
    description: "Launch a new browser instance using Playwright",
    parameters: z.object({
        channel: z.string().describe("Browser channel (chrome, msedge, etc)").default("chrome"),
        isHeadless: z.boolean().describe("Run browser in headless mode").default(false),
        args: z.array(z.string()).describe("Additional args for browser").default([
            "--disable-extensions",
            "--disable-file-system",
        ]),
    }),
    async execute(input) {
        const browser = await chromium.launch({
            channel: input.channel,
            headless: input.isHeadless,
            args: input.args,
        });

        const browserId = `browser-${++browserCounter}`;
        browserStore.set(browserId, browser);

        return { browserId };
    },
});

// ------------------------------
// Tool: Create New Page
// ------------------------------
const playwrightCreateNewPage = new tool({
    name: "playwright_create_page",
    description: "Create a new page in an existing browser",
    parameters: z.object({
        browserId: z.string().describe("ID of the launched browser"),
    }),
    async execute(input) {
        const browser = browserStore.get(input.browserId);
        if (!browser) throw new Error("Invalid browserId");

        const page = await browser.newPage();

        const pageId = `page-${++pageCounter}`;
        pageStore.set(pageId, page);

        return { pageId };
    },
});

// ------------------------------
// Tool: Navigate to URL
// ------------------------------
const playwrightNavigateToUrl = new tool({
    name: "playwright_navigate_to_url",
    description: "Navigate a page to a given URL",
    parameters: z.object({
        pageId: z.string().describe("ID of the page"),
        url: z.string().describe("URL to navigate to"),
        waitUntil: z.enum(["load", "domcontentloaded", "networkidle"]).default("networkidle"),
    }),
    async execute(input) {
        const page = pageStore.get(input.pageId);
        if (!page) throw new Error("Invalid pageId");

        await page.goto(input.url, { waitUntil: input.waitUntil });

        return { success: true, message: `Visited ${input.url}` };
    },
});

// ------------------------------
// Tool: Wait for Timeout
// ------------------------------
const playwrightWaitForTimeout = new tool({
    name: "playwright_wait_for_timeout",
    description: "Wait for a given timeout on a page",
    parameters: z.object({
        pageId: z.string().describe("ID of the page"),
        timeout: z.number().describe("Milliseconds to wait").default(5000),
    }),
    async execute(input) {
        const page = pageStore.get(input.pageId);
        if (!page) throw new Error("Invalid pageId");

        await page.waitForTimeout(input.timeout);

        return { success: true, message: `Waited ${input.timeout}ms` };
    },
});

// ------------------------------
// Tool: Close Browser
// ------------------------------
const playwrightCloseBrowser = new tool({
    name: "playwright_close_browser",
    description: "Close an existing browser",
    parameters: z.object({
        browserId: z.string().describe("ID of the browser to close"),
    }),
    async execute(input) {
        const browser = browserStore.get(input.browserId);
        if (!browser) throw new Error("Invalid browserId");

        await browser.close();
        browserStore.delete(input.browserId);

        return { success: true, message: "Browser closed successfully" };
    },
});

// ------------------------------
// Tool: Take Screenshot
// ------------------------------
const playwrightTakeScreeshot = new tool({
    name: 'playwright_take_screenshot',
    description: 'A playwright tool to take screenshot of any opened page',
    parameters: z.object({
        pageId: z.string().describe('page id to take the screenshot of the specified page.'),
        path: z.string().default('images/image.png').describe('File to save the screenshot.'),
        takeFullScreen: z.boolean().describe('specifies whether to take screenshot of full screen or not.').default(false)
    }),
    async execute(input) {
        try {
            const { pageId, path, takeFullScreen } = input;

            const page = pageStore.get(pageId);

            await page.screenshot({
                path, 
                fullPage: takeFullScreen
            })

            return `Screenshot was successfully taken.`;
        } catch (error) {
            throw new Error(`Error taking screenshot...`, error)
        }


    }
})


// AGENT:
// ------------------------------
// Agent Definition
// ------------------------------
const automationAgent = new Agent({
    name: "automation_agent",
    instructions: `
    You are an automation and testing agent.

    You can launch browsers, create pages, navigate to URLs, wait, and close browsers.

    Rules:
    - Always use the provided tools.
    - Never return raw objects; always use IDs (browserId, pageId).
  `,
    tools: [
        playwrightLaunchBrowser,
        playwrightCreateNewPage,
        playwrightNavigateToUrl,
        playwrightWaitForTimeout,
        playwrightCloseBrowser,
        playwrightTakeScreeshot
    ],
});

// ------------------------------
// Runner
// ------------------------------
async function chatWithAgent(query) {
    const result = await run(automationAgent, query);
    console.log(result.finalOutput);
}

// Example run
chatWithAgent(
    "Open url https://www.piyushgarg.dev in chrome browser, take the screenshot of the full screen and all the contents loaded. Wait there for 5 seconds, and then close the browser."
);
