import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

puppeteer.use(StealthPlugin());

const outputDir = path.join(__dirname, "cloned-site");

function absoluteUrl(url, base) {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  if (url.startsWith("//")) return "https:" + url;
  return new URL(url, base).href;
}

async function downloadFile(fileUrl, filePath) {
  try {
    const { data } = await axios.get(fileUrl, { responseType: "arraybuffer" });
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, data);
    console.log("✅ Downloaded:", fileUrl, "→", filePath);
    // Add small random delay to avoid triggering rate limits
    await new Promise(res => setTimeout(res, Math.random() * 500 + 200));
  } catch (err) {
    console.log("❌ Failed:", fileUrl, err.message);
  }
}

function sanitizePath(urlPath) {
  return urlPath.split("?")[0].replace(/[?#&=]/g, "_");
}

async function getRenderedHTML(url) {
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();

  // Randomized user-agent & headers
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
  );
  await page.setExtraHTTPHeaders({
    "Accept-Language": "en-US,en;q=0.9"
  });

  try {
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
    await page.waitForTimeout(Math.random() * 2000 + 1000); // 1-3 sec delay
  } catch (err) {
    console.log("❌ Puppeteer navigation error:", err.message);
  }

  const html = await page.content();
  await browser.close();
  return html;
}

async function cloneSite(urlToClone) {
  console.log("🔹 Cloning site:", urlToClone);

  const renderedHtml = await getRenderedHTML(urlToClone);
  const $ = cheerio.load(renderedHtml);

  // ---- Handle <img> ----
  for (const el of $("img").toArray()) {
    let src = $(el).attr("src") || $(el).attr("data-src");
    if (!src || src.startsWith("data:")) continue;

    let absUrl = absoluteUrl(src, urlToClone);
    if (absUrl.includes("/_next/image")) {
      const parsed = new URL(absUrl);
      const realUrl = parsed.searchParams.get("url");
      if (realUrl) absUrl = absoluteUrl(realUrl, urlToClone);
    }
    if (!absUrl) continue;

    const urlObj = new URL(absUrl);
    const relativePath = sanitizePath(urlObj.pathname);
    const filePath = path.join(outputDir, relativePath);

    $(el).attr("src", "." + relativePath);
    $(el).removeAttr("srcset");

    await downloadFile(absUrl, filePath);
  }

  // ---- Handle CSS files ----
  for (const el of $("link[rel='stylesheet']").toArray()) {
    const href = $(el).attr("href");
    if (!href) continue;

    const cssUrl = absoluteUrl(href, urlToClone);
    try {
      const { data: css } = await axios.get(cssUrl);
      const urlObj = new URL(cssUrl);
      const relativePath = sanitizePath(urlObj.pathname);
      const localCssPath = path.join(outputDir, relativePath);

      let cssContent = css;
      const regex = /url\((.*?)\)/g;
      let match;
      while ((match = regex.exec(css)) !== null) {
        let imgUrl = match[1].replace(/['"]/g, "");
        if (imgUrl.startsWith("data:")) continue;

        const absImgUrl = absoluteUrl(imgUrl, cssUrl);
        if (!absImgUrl) continue;

        const imgObj = new URL(absImgUrl);
        const imgRelativePath = sanitizePath(imgObj.pathname);
        const imgPath = path.join(outputDir, imgRelativePath);

        cssContent = cssContent.replace(imgUrl, "." + imgRelativePath);
        await downloadFile(absImgUrl, imgPath);
      }

      fs.mkdirSync(path.dirname(localCssPath), { recursive: true });
      fs.writeFileSync(localCssPath, cssContent);
      $(el).attr("href", "." + relativePath);
    } catch (err) {
      console.log("❌ Failed CSS:", cssUrl, err.message);
    }
  }

  // ---- Save HTML ----
  fs.mkdirSync(outputDir, { recursive: true });
  const indexPath = path.join(outputDir, "index.html");
  fs.writeFileSync(indexPath, $.html(), "utf-8");

  // ---- Fix paths ----
  let fixedHtml = fs.readFileSync(indexPath, "utf-8");
  fixedHtml = fixedHtml.replace(/(href|src)="\/_next\//g, '$1="./_next/');
  fixedHtml = fixedHtml.replace(/(href|src)="\/images\//g, '$1="./images/');
  fixedHtml = fixedHtml.replace(/(href|src)="\//g, '$1="./');
  fixedHtml = fixedHtml.replace(/\s+srcset="[^"]*"/g, "");

  fs.writeFileSync(indexPath, fixedHtml, "utf-8");

  console.log("🎉 Fully rendered site cloned to", outputDir);
  return `Website cloned successfully at ${outputDir}`;
}

export default cloneSite;
