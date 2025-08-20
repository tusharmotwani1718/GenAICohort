import axios from "axios";
import * as cheerio from "cheerio";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import envConf from "../envconf.js";

/**
 * Fetches text content from a URL and indexes it into Qdrant
 * @param {string} url - Webpage URL
 * @param {string} urlName - A collection name identifier
 */
async function indexUrlContext(url, urlName) {
  if (!url || !urlName) {
    throw new Error("Both url and urlName are required.");
  }

  // 1. Fetch HTML
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  // 2. Extract visible text (basic version: remove scripts, styles, etc.)
  $("script, style, noscript").remove();
  const rawText = $("body").text().replace(/\s+/g, " ").trim();

  if (!rawText || rawText.length < 50) {
    throw new Error("No meaningful text found at the provided URL.");
  }

  // 3. Split text into chunks
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 100,
  });
  const chunks = await splitter.createDocuments([rawText]);

  // 4. Generate embeddings
  const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-large",
    apiKey: envConf.openAIApiKey,
  });

  // 5. Store in Qdrant
  await QdrantVectorStore.fromDocuments(chunks, embeddings, {
    url: "http://localhost:6333",
    collectionName: `collection-${urlName}`,
  });

  return { success: true, message: "URL context indexed successfully." };
}

export default indexUrlContext;
