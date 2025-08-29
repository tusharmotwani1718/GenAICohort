import { chromium } from 'playwright';


const browser = await chromium.launch({
    channel: 'chrome', // use system-installed Chrome
    headless: false,
    chromiumSandbox: true,
    env: {},
    args: ["--disable-extensions", "--disable-file-system"],
});

const page = await browser.newPage();

// await page.goto("https://bing.com", {waitUntil: "networkidle"});
await page.goto("https://ui.chaicode.com/",
    { waitUntil: "networkidle" }
)


// const content = await page.content();

// console.log("content: ", content);

const dom = page.locator('button')
const contents = await dom.evaluate("el => el.outerHTML")

console.log("contents: ", contents);



// await page.screenshot({path: "bing.png", fullPage: false});

// Fill username and password
// await page.getByLabel('Enter Mail:').fill('chai@google.com');
// await page.getByLabel('Enter Password:').fill('chai@123');


// Click the login button
// await page.getByRole('button', { name: 'Submit' }).click();


// Wait until redirected or dashboard is visible
// await page.waitForURL('https://www.google.com/**'); // or page.waitForSelector('h1.welcome')

// take the screenshot
// const buffer = await page.screenshot({
//     path: 'images/image.png',
//     fullPage: false
// });
// console.log(buffer.toString('base64'))

// await page.waitForTimeout(5000);


browser.close();