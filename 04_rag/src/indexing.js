import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from '@langchain/openai';
import { QdrantVectorStore } from "@langchain/qdrant";
import envConf from '../envconf.js';

// const pathToPdf = './nodejs.pdf'

async function indexing(pathToFile, originalFileName) {

    // loading the document
    const loader = new PDFLoader(pathToFile);
    const docs = await loader.load();

    // make the LLM ready to create embeddings:
    const embeddings = new OpenAIEmbeddings({
        model :"text-embedding-3-large",
        apiKey: envConf.openAIApiKey
    })

    // create embeddings and store to vector db:
    const vectorStore = QdrantVectorStore.fromDocuments(docs, embeddings, {
        url: "http://localhost:6333",
        collectionName: `collection-${originalFileName}`
    })

    console.log("Indexing done...")
}


// indexing(pathToPdf);

export default indexing;