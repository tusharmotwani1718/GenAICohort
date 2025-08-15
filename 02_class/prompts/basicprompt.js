import {OpenAI} from "openai";
import dotenv from 'dotenv';
dotenv.config();




const openai = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

const response = await openai.chat.completions.create({
    model: "gemini-2.0-flash",
    messages: [
        // {
        //     role: "user",
        //     content: "hey! how are you",
        // },

       // by default the llms do not keep the memory, so whenever you want to continue in the same context, send the stack of messages or conversation like this:

       {
         role: "user",
         content: "Hey! how are you? Tushar this side."
       },
       {
         role: "assistant",
         content: "Hello Tushar, how can I assist you today"
       },
       {
         role: "user",
         content: "Do you know my name now?"
       }

       // ...continue the messages to keep the context remembered by the llm.
       // these are also known as cache tokens. The latest message you sent to the llm is input token, the other previous contexts you given are treated as cache tokens.
        
    ],
});


console.log(response.choices[0].message.content);