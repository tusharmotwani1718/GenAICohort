import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from '@langchain/openai';
import { QdrantVectorStore } from "@langchain/qdrant";
import envConf from '../envconf.js';

const pathToPdf = './nodejs.pdf'

async function indexing(pathToPdf) {

    // loading the document
    const loader = new PDFLoader(pathToPdf);
    const docs = await loader.load();

    // make the LLM ready to create embeddings:
    const embeddings = new OpenAIEmbeddings({
        model :"text-embedding-3-large",
        apiKey: envConf.openAIApiKey
    })

    // create embeddings and store to vector db:
    const vectorStore = QdrantVectorStore.fromDocuments(docs, embeddings, {
        url: "http://localhost:6333",
        collectionName: "nodejs-pdf"
    })

    console.log("Indexing done...")
}


indexing(pathToPdf);