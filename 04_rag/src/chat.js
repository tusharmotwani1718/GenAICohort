import { OpenAIEmbeddings } from '@langchain/openai';
import { QdrantVectorStore } from "@langchain/qdrant";
import OpenAI from 'openai';
import envConf from '../envconf.js';
import { translateQuery, hyde } from './index.js';


// openai model for responses:
const client = new OpenAI({
    apiKey: envConf.openAIApiKey
});


async function chat(fileName, userQuery, inputs) {

    // make the LLM ready to create embeddings:
    const embeddings = new OpenAIEmbeddings({
        model: "text-embedding-3-large",
        apiKey: envConf.openAIApiKey
    })

    const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings,
        {
            url: "http://localhost:6333",
            collectionName: `nodejs-course`
        }
    )

    const vectorSearcher = vectorStore.asRetriever({
        k: 3, // no of chunks to give after search
    })

    // translate the query:
    // console.log("Translating Query.... ✍️");
    // const translatedQuery = await translateQuery(userQuery);
    // // console.log("Translated query: ", translatedQuery);
    


    // get response from LLM:
    // console.log("Getting response from LLM... 🤖 ");
    // const llmResponse = await hyde(translatedQuery);

    // console.log("LLM response: ", llmResponse);


    // generate relevant chunks:
    const relevantChunks = await vectorSearcher.invoke(userQuery);

    console.log("relevant chunks: ", relevantChunks);

    const systemPrompt = `
    You are an ai assistant that answers user's query related to a pdf based on the context available to you from a pdf file with context and page number.

    Also give the source (page number/title/chapter number) from the pdf too from which you have extracted info.

    Do not answer anything that is beyond the available context.


    Do not give your reply with html or semantic tags like backslash n or 'br', if you want a line break or new line give the spacing from your side only, not with tags.

    Strictly exclude line break tags and other tags to format the response, include them only when they should available at response as raw text

    Context: 
    ${JSON.stringify(relevantChunks)}

   
    `

    inputs = [
        { role: "system", content: systemPrompt },
        {
            role: "user",
            content: userQuery
        }
        // ...inputs
    ]



    const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: inputs
    })

    console.log(`🤖: ${response.choices[0].message.content}`)

    // return `🤖: ${response.choices[0].message.content}`

}


// to use the function directly from backend

const userQuery = "Who is Piyush?";
chat("", userQuery); // remove fileName from the parameter in the chat function while using it directly from the backend.


export default chat;

