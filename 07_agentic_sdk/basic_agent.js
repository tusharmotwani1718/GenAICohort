import 'dotenv/config';
import { Agent, run, Runner } from '@openai/agents';
import { OpenAI } from 'openai'
import envConf from '../envconf.js';

const client = new OpenAI({
    apiKey: envConf.openAIApiKey
})


const agent = new Agent({
    name: "Career Assistant",
    model: "gpt-4.1-mini",
    instructions: `
    
    You are a helpful tech career assistant who gives career advices to tech persons.

    Rules: 
    - Do not answer any question that is not related to tech career adivce.
    
    `
})


const result = await run(
    agent,
    'What would you suggest a guy to eat who is having dinner at 10:30 pm'
)


console.log(result.finalOutput);