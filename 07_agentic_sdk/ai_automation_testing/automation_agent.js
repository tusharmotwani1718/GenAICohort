import { Agent, tool, run } from "@openai/agents";
import { z } from "zod";
import { OpenAI } from "openai";
import envConf from "../../envconf.js";
import { chromium } from "playwright";
import Tesseract from 'tesseract.js';
import fs from 'fs';

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
const playwrightTakeScreenshot = new tool({
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
            throw new Error(`Error taking screenshot... ${error}`)
        }


    }
})


// ------------------------------
// Tool: Locate by label
// ------------------------------
const playwrightLocateByLabel = new tool({
    name: 'locate_by_label',
    description: 'A playwright tool to locate an form element by the label name.',
    parameters: z.object({
        pageId: z.string().describe('page id where the element is present'),
        label: z.string().describe('name of the label to be located'),
    }),
    async execute(input) {
        try {
            const { pageId, label } = input;
            const page = pageStore.get(pageId);

            await page.getByLabel(label);

            return `Form element located successfully.`
        } catch (error) {
            throw new Error(`Error locating element: ${error}`)
        }

    }
})


// -------------------------------
// Tool: Locate by role and Check/Click
// -------------------------------
const playwrightLocateByRole = new tool({
    name: 'playwright_locate_by_role',
    description: 'A Playwright tool to locate an element by role and then check or click it.',
    parameters: z.object({
        pageId: z.string().describe('page id of the page where the element is present'),
        roleName: z.string().describe('role of the element (e.g., "button", "checkbox", "link")'),
        name: z.string().describe('text node of the element'),
        task: z.enum(['check', 'click']).default('click'),
    }),
    async execute(input) {
        try {
            const { pageId, roleName, task, name } = input;

            const page = pageStore.get(pageId);

            const locator = await page.getByRole(roleName, { name: name })

            if (task === 'click') {
                await locator.click();
            } else if (task === 'check') {
                await locator.check();
            }

            return `Successfully executed ${task} on element with role "${roleName}" and name "${name}"`;

        } catch (error) {
            throw new Error(`Error locating element... ${error}`)
        }

    }
})


// -------------------------------
// Tool: get the dom contents of an element
// -------------------------------
const playwrightGetDomContents = tool({
    name: 'get_dom_contents',
    description: 'Fetch structured information about form inputs, labels, and buttons inside a form/container.',
    parameters: z.object({
        pageId: z.string().describe('id of the page where the element is present'),
        element: z.string().describe('CSS selector for the form or container element. can be element name as well.'),
        getContentsType: z.enum(['innerHTML', 'outerHTML']).describe('type of dom contents you want to get of the element').default('innerHTML')
    }),
    async execute(input) {
        try {
            const { pageId, element, getContentsType } = input;
            const page = pageStore.get(pageId);

            const getElementContents = page.locator(element);

            await getElementContents.evaluate(
                (el, type) => el[type],
                getContentsType
            );

            return `contents fetched successfully.`; 
        } catch (error) {
            return `error fetching structured dom content... ${error}`;
        }
    }
});


// -------------------------------
// Tool: Fill any form element by label name
// -------------------------------
const fillElementByLabel = new tool({
    name: 'fill_element_by_label',
    description: 'A tool to fill any input element by taking its label name.',
    parameters: z.object({
        pageId: z.string().describe('id of the page where the input element is present'),
        labelName: z.string().describe('Label name of the input which is to be filled'),
        fillText: z.string().describe('text to fill in the input').default('')
    }),
    async execute(input) {
        try {
            const { pageId, labelName, fillText } = input;

            const page = await pageStore.get(pageId);

            await page.getByLabel(labelName).fill(fillText);

            return `Input was located and filled successfully.`
        } catch (error) {
            return `Error filling the input element: ${error}`
        }
    }
})

// -------------------------------
// Tool: Fill any form element by id name
// -------------------------------
const fillElementById = new tool({
    name: 'fill_element_by_id',
    description: 'A playwright tool to fill a form input by getting its id name.',
    parameters: z.object({
        pageId: z.string().describe('id of the page where the input element is present'),
        idName: z.string().describe('Id name of the input which is to be filled'),
        fillText: z.string().describe('text to fill in the input').default('')
    }),
    async execute(input) {
        try {
            const { pageId, idName, fillText } = input;

            const page = await pageStore.get(pageId);

            await page.fill(`#${idName}`, fillText);

            return `Input with id ${idName} was located and filled successfully.`
        } catch (error) {
            return `Error filling the input element: ${error}`
        }
    }
})

// -------------------------------
// Tool: Fetch text from image
// -------------------------------
const fetchTextFromImage = new tool({
    name: "fetch_text_from_image",
    parameters: z.object({
        path: z.string().describe('Path of the image.')
    }),
    async execute(input) {
        const { path } = input;

        const { data: { text } } = await Tesseract.recognize(path, 'eng');

        return `Text from image fetched successfully.`;
    }

})

// AGENT:
// ------------------------------
// Agent Definition
// ------------------------------
const automationAgent = new Agent(

    {
        name: "automation_agent",
        model: "gpt-5-nano",
        instructions: `
            You are an automation agent that can fill web forms, take screenshots, and verify actions.

            

            Rules:
            1. You do NOT assume the user knows HTML ids, labels, or internal field names.
            2. Do not solely depend on the information provided by user to perform the task.
            3. Use the tools provided to you to get more information about how the task should be approached.
            4. Never assume that the information provided by the user is completey correct and do not go on to perform the task being provided with the information given by user only. Use your own tools to infer more knowledge and correct facts about the task that is to be done before proceeding.
            5. Always take a screenshot of the webpage **before** and **after** performing tasks to verify success.
            6. Never return raw IDs or HTML elements to the user; always use the structured tools internally.
            7. Validate that all user-provided values are filled in the right fields.
            8. Your goal is to let a normal user give high-level instructions, and you decide what maps where.
            9. You have to perform the given task step by step.
            10. Move to next step only after completing the previous step successfully.
            11. You can use multiple tools to complete a step. If a step is not completed by some tool, you can retry with other available tools. But ensure to complete the step, before moving to next step.
            12. Close the launched browser immediately(if-any) after the task is completed.


            For example:
            Your user can provide form-filling instructions in natural language, like:
            "Fill my signup form with First Name = John, Last Name = Doe, Email = john@example.com, Password = Abcd@1234".

            You have to infer that where is the form present in the website (it can be inside some route, sub-route or anywhere), what are the fields available and what details should be filled in what field. Use the tools available for all this.

            Use your own intelligence to predict obvious things while performing the tasks. 

            Like, if user has provided 'Password' value but the form to be filled has a 'Confirm Password' field as well, then fill this field with the same value as that of Password provided by the user.

            STRICTLY follow all the rules above.

  `,
        tools: [
            playwrightLaunchBrowser,
            playwrightCreateNewPage,
            playwrightNavigateToUrl,
            playwrightWaitForTimeout,
            playwrightCloseBrowser,
            playwrightTakeScreenshot,
            fetchTextFromImage,
            playwrightLocateByLabel,
            fillElementByLabel,
            fillElementById,
            playwrightGetDomContents,
            playwrightLocateByRole
        ],

    });

// ------------------------------
// Runner
// ------------------------------
async function chatWithAgent(query) {
    const result = await run(automationAgent, query, {
        maxTurns: 15
    });
    console.log(result.finalOutput);
    console.log("history: ", result.history)
}

// Example run
chatWithAgent(
    `
    Open chrome browser

    Open the url https://ui.chaicode.com/auth-sada/signup Find the signup form and fill it with my details as:

    Full Name: Tushar Motwani,
    Email Address: tusharmotwani89@gmail.com,
    Password: Dummy@989898,



    Click on the button "Create Account".

    
    `
);
