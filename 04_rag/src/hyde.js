import envConf from "../envconf.js";
import OpenAI from "openai";


const client = new OpenAI({
    apiKey: envConf.geminiApiKey,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
})


async function hyde(query) {

    const systemPrompt = `
        You are an AI assistant who answers the user queries. Based on the data you have, you have to generate response for the question that the user has asked or the topic that the user wants to know about.

        Answer like a basic LLM who is working to solve user queries.
    `

    const response = await client.chat.completions.create({
        model: "gemini-2.0-flash",
        messages: [
            {
                role: "system",
                content: systemPrompt
            },
            {
                role: "user",
                content: query,
            },
        ]
    })

    // console.log(response.choices[0].message.content);

    const responseFromLLM = response.choices[0].message.content;

    return responseFromLLM;
}




export default hyde;

// const llmResponse = await hyde("Explain about node js");
// console.log(llmResponse);
