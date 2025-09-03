import 'dotenv/config';
import { Agent, run } from '@openai/agents';
import dotenv from 'dotenv';

dotenv.config({
    path: '../.env'
})

let database = []; // messages imported from db...

const agent = new Agent({
    name: "Helpful assistant",
    model: "gpt-4.1-mini",
    instructions: `
    
    You are a helpful assistant.
    
    `
})

/*
// Normal LLM call:
async function main(userQuery) {
    const result = await run(
        agent,
        userQuery
    )

    return result.finalOutput;
}

// by default llm calls are stateless:
await main('hey there, my name is tushar');
const response = await main('do you know my name?');
console.log(response);
*/


// give the context to the llm: (Short term Memory -> messages array is sliding...)
async function main(userQuery) {
    const result = await run(
        agent,
        database.concat({
            role: 'user',
            content: userQuery
        }) // append the user message to messages db.
    )

    database = result.history; // all the context to the db messages.

    return result.finalOutput;
}

await main('hey there, my name is tushar');
const response = await main('do you know my name?');
console.log(response);



