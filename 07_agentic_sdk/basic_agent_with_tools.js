import { Agent, tool, run } from "@openai/agents";
import axios from "axios";
import 'dotenv/config';
import { z } from 'zod';
import { OpenAI } from 'openai';
import envConf from "../envconf.js";


const client = new OpenAI({
    apiKey: envConf.openAIApiKey
})


// github get user tool:
const getGithubUserTool = new tool({
    name: 'get_github_user',
    description: 'Gives the github details of a user',
    parameters: z.object({
        username: z.string()
    }),
    async execute(input) {
        const response = await axios.get(`https://api.github.com/users/${input.username}`)

        return response.data;
    }

})

const socialCareerAdvice = new Agent({
    name: "social_career_advice",
    instructions: `
        You are a helpful tech career assistant who gives career advices to tech persons.

        Rules: 
        - Do not answer any question that is not related to tech career adivce.
    `,
    tools: [getGithubUserTool]
})


async function chatWithAgent(query) {
    const result = await run(socialCareerAdvice, query);
    console.log(result.finalOutput);
    // console.log("history: ", result.history);
}


chatWithAgent('Hey, my github username is tusharmotwani1718, any advices?');