import fs from "fs";
import { Document } from "@langchain/core/documents";
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import envConf from "../envconf.js";

const jsonFilePath = "./subtitles_chunks.json";

async function indexing() {
  // load raw JSON
  const raw = JSON.parse(fs.readFileSync(jsonFilePath, "utf-8"));

  // Convert to LangChain Document objects
  const docs = raw.map((item) => {
    return new Document({
      pageContent: item.text, // content to embed
      metadata: {
        course: item.course,
        video: item.video,
        start: item.start,
        end: item.end,
      },
    });
  });

  // make the LLM ready to create embeddings
  const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-large",
    apiKey: envConf.openAIApiKey,
  });

  // create embeddings and store in vector db
  const vectorStore = await QdrantVectorStore.fromDocuments(docs, embeddings, {
    url: "http://localhost:6333",
    collectionName: "nodejs-course",
  });

  console.log("Indexing done...");
}

indexing();

export default indexing;
