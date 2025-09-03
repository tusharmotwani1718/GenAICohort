import { Memory } from 'mem0ai/oss';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';

dotenv.config({
    path: "../.env"
})

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});



const memory = new Memory({
    version: 'v1.1',
    embedder: {
        provider: 'openai',
        config: {
            apiKey: process.env.OPENAI_API_KEY || '',
            model: 'text-embedding-3-small',
        },
    },
    vectorStore: {
        provider: 'qdrant',
        config: {
            collectionName: "memories",
            embeddingModelDims: 1536,
            host: 'localhost',
            port: 6333
        }
    },
    llm: {
        provider: 'openai',
        config: {
            apiKey: process.env.OPENAI_API_KEY || '',
            model: 'gpt-4-turbo-preview',
        },
    },
});


async function chat(query) {

    // relevant searches in memory as per the vector embeddings of the user query.
    const searches = await memory.search(query, { userId: 'tushar_89' })
    // console.log(`Search Results: ${searches.results}`)

    // fetch memory strings only:
    const memStr = searches.results.map((e) => 
        e.memory
    ).join(`\n`)
    
    // pass the relevant searches in system prompt:
    const systemPrompt = `
        Available info: 
        ${memStr}
    `

    const response = await client.chat.completions.create({
        model: 'gpt-4.1-mini',
        messages: [
            {
                role: 'assistant',
                content: systemPrompt
            },
            {
                role: 'user',
                content: query
            }
        ]
    })

    console.log(`\n\n\n🤖: ${response.choices[0].message.content}`)

    // add to memory:
    console.log('\n\nAdding to memory...')

    await memory.add(
        [
            {
                role: 'user',
                content: query
            },
            {
                role: 'assistant',
                content: response.choices[0].message.content
            }
        ], { userId: 'tushar_89' }) // add memory to the specific user (the id generally comes from db)

    console.log(`Added to memory...📝`)
}


chat('Do you know my name?');