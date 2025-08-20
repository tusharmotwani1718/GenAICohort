import { OpenAIEmbeddings } from '@langchain/openai';
import { QdrantVectorStore } from "@langchain/qdrant";
import OpenAI from 'openai';
import envConf from '../envconf.js';


const client = new OpenAI({
    apiKey: envConf.openAIApiKey 
});

async function chat(userQuery) {

    // make the LLM ready to create embeddings:
    const embeddings = new OpenAIEmbeddings({
        model: "text-embedding-3-large",
        apiKey: envConf.openAIApiKey
    })

    const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings,
        {
            url: "http://localhost:6333",
            collectionName: "nodejs-pdf"
        }
    )

    const vectorSearcher = vectorStore.asRetriever({
        k: 3, // no of chunks to give after search
    })

    const relevantChunks = await vectorSearcher.invoke(userQuery);

    const systemPrompt = `
    You are an ai assistant that answers user's query related to a pdf based on the context available to you from a pdf file with context and page number.

    Also give the source (page number/title/chapter number) from the pdf too from which you have extracted info.

    Do not answer anything that is beyond the available context:

    Context: 
    ${JSON.stringify(relevantChunks)}
    `

    const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userQuery }
        ]
    })

    console.log(`🤖: ${response.choices[0].message.content}`)
}


const userQuery = "Can you please tell me about debugging in nodejs?";
chat(userQuery);

