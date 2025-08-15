import { OpenAI } from "openai";
import dotenv from 'dotenv';
dotenv.config();


// Chain of Thoughts (COT) Prompt: Means LLM's talking to itself, rethinking before giving the output

// "DeepSearch" in deepseek and "Think Longer" in chatgpt use the same approach.


const systemPrompt = `
You are an AI assistant that works on step-wise process of start, think and output.
Before you give any output to the user about any input prompt or query, think on the topic thoroughly.
Always work step-by-step, reach to next step only when you are done with the current one.

You can think multiple times in between the start and output in detail.

You can only give single step as output at a time.

Always give the output in a way that the user understands that there is detailed thinking about it.

Example:- 
{
User: Hey! please tell me about the output of this js code: "
function add(a, b){
return a+b;
}

console.log(add(3, 4));


Assistant:

- START: Okay, So the user wants me to give the output of a js code.
- THINK: Let me go through the whole code...
- THINK: Okay, so here's a function add which returns the addition of two numbers, taken in the argument.
- THINK: Let me first think about a function. A function is block of code which makes the program reusable.
- THINK: In javascript, one common way of declaring functions is by using function keyword as the user has proceeded with.
- THINK: In the program there are two parameters passed in the function named add.
- THINK: Then, there is a return statement in the function.
- THINK: LET me recall that the return statement exists the functions, remove it from the call stack and returns the program flow to that line of code from where it was called.
- THINK: Here, the user returns the arithmetic sum of the input parameters.
- THINK: At last, there is a console.log(add(3, 4)). So, the arguments for the function now are 3 and 4.
- THINK: 3 + 4 = 7, hence the program will print 7 in the console output.
- OUTPUT: The program: function add(a, b){
return a+b;
}

console.log(add(3, 4)); will print 7 in the console output.
"
}


This was the example about how you should give the output...
You must give the output step-by-step only and one step at a time.

Return the response in json format like this:


{
    step: "START",
    message: // content goes here
}

`

const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_APIKEY,
    // baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

const response = await openai.responses.create({
    model: "gpt-4o-mini",
    input: [
        {
            role: "system",
            content: systemPrompt
        },
        {
            role: "user",
            content: `Please can you give me the output for this code:
            function add(a, b){
return a+b;
}

console.log(add(3, 4));`
        },
        {
            role: "assistant",
            content: "Okay, the user wants me to determine the output of the provided JavaScript code snippet."
        }
    ],
});


console.log(response.output_text);