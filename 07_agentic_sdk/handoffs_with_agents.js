import { Agent, tool, run } from "@openai/agents";
import axios from "axios";
import 'dotenv/config';
import { z } from 'zod';
import dotenv from 'dotenv';
import { RECOMMENDED_PROMPT_PREFIX } from '@openai/agents-core/extensions';

dotenv.config({
    path: '../.env'
})


// github get user tool:
const getGithubUserTool = new tool({
    name: 'get_github_user',
    description: 'Gives the github details of a user',
    parameters: z.object({
        username: z.string()
    }),
    async execute(input) {
        try {
            const response = await axios.get(`https://api.github.com/users/${input.username}`)
    
            return response.data;
        } catch (error) {
            throw new Error(`error running tool... ${error}`)
        }
    }

})


// get weather details tool:
const getWeatherDeatilsTool = new tool({
    name: 'get_weather_details',
    description: 'Gives the weather details of a particular city.',
    parameters: z.object({
        cityName: z.string()
    }),
    async execute(input) {
        try {
            const url = `https://wttr.in/${input.cityName.toLowerCase()}?format=%C+%t`;
            const { data } = await axios.get(url, { responseType: 'text' });
            return `The current weather of ${input.cityName} is ${data}`;
        } catch (error) {
            throw new Error(`error running tool... ${error}`)
        }
    }
})

// Agent 1:
const socialCareerAdviceAgent = new Agent({
    name: "social_career_advice",
    instructions: `
        You are a helpful tech career assistant who gives career advices to tech persons.

        Rules: 
        - Do not answer any question that is not related to tech career adivce.
    `,
    tools: [getGithubUserTool],
})

// Agent 2:
const weatherAdviceAgent = new Agent({
    name: 'weather_adivce',
    instructions: `
        You are an helpful agent whose main goal is to give proper advices to the user as per the weather conditions of his city or the one he is going to.

        Rules: 
        - Do not answer any question that is not related to weather adivce.
    `,
    tools: [getWeatherDeatilsTool]

})



// triage agent:
const triageAgent = Agent.create({
    name: 'Triage Agent',
    instructions: `
    ${RECOMMENDED_PROMPT_PREFIX} 
    You determine which agent to use based on the user's query. You have to use the agents available to you as handoffs for answering the user query.`,
    handoffs: [socialCareerAdviceAgent, weatherAdviceAgent]
})


// run agent orchestration:
const chatWithAgent = async (userQuery) => {
    const result = await run(triageAgent, userQuery);
    // console.log("history: ", result.history)
    return result.finalOutput;
}

const query = 'What is the weather of Jaipur right now?';
const response = await chatWithAgent(query);
console.log(`Agent: ${response}`)