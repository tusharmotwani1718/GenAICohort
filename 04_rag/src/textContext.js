import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import envConf from "../envconf.js";

/**
 * Indexes raw text into Qdrant
 * @param {string} text - The text content provided by user
 * @param {string} textName - A collection name identifier (like a virtual "file")
 */
async function indexTextContext(text, textName) {
  if (!text || !textName) {
    throw new Error("Both text and textName are required.");
  }

  // 1. Split text into smaller chunks
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 100,
  });

  const chunks = await splitter.createDocuments([text]);

  // 2. Generate embeddings
  const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-large",
    apiKey: envConf.openAIApiKey,
  });

  // 3. Store in Qdrant
  await QdrantVectorStore.fromDocuments(chunks, embeddings, {
    url: "http://localhost:6333",
    collectionName: `collection-${textName}`, // keep consistent naming
  });

  return { success: true, message: "Text context indexed successfully." };
}

export default indexTextContext;
