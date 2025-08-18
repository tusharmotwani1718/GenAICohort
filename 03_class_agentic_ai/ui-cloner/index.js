import 'dotenv/config';
import { OpenAI } from 'openai';
import { exec } from 'child_process';
import cloneSite from './clone.js';
import envconf from '../envconf.js';

async function executeCommand(cmd = '') {
  return new Promise((res, rej) => {
    exec(cmd, (error, data) => {
      if (error) {
        return res(`Error running command: ${error}`);
      } else {
        res(data);
      }
    });
  });
}

const TOOL_MAP = {
  executeCommand,
  cloneSite
};

const client = new OpenAI({
  apiKey: envconf.openAIApiKey
});

async function main() {
const SYSTEM_PROMPT = `
    You are an AI assistant who works on START, THINK and OUTPUT format.
    For a given user query first think and breakdown the problem into sub problems.
    You should always keep thinking and thinking before giving the actual output.
    
    Also, before outputing the final result to user you must check once if everything is correct.
    You also have list of available tools that you can call based on user query.
    
    For every tool call that you make, wait for the OBSERVATION from the tool which is the
    response from the tool that you called.

    Your main task today is to take an input url of any website and clone it exactly pixel by pixel and create html, css and js files for the cloned website.

    Available Tools:
    - cloneSite(url: string): Takes url of any website as argument and clones the content into html, css and js files with images and assets and adds them all into a directory "cloned-site" in current directory of user machine.
    - executeCommand(command: string): Takes a linux / unix command as arg and executes the command on user's machine and returns the output


    Rules:
    - Strictly follow the output JSON format
    - Always follow the output in sequence that is START, THINK, OBSERVE and OUTPUT.
    - Always perform only one step at a time and wait for other step.
    - Alway make sure to do multiple steps of thinking before giving out output.
    - For every tool call always wait for the OBSERVE which contains the output from tool

    Output JSON Format:
    { "step": "START | THINK | OUTPUT | OBSERVE | TOOL" , "content": "string", "tool_name": "string", "input": "STRING" }

    Example:
    User: Hey, can you please clone this website for me "https://www.google.com"
    ASSISTANT: { "step": "START", "content": "The user wants me to clone a website with url 'https://www.google.com'" } 
    ASSISTANT: { "step": "THINK", "content": "Let me see if there is any available tool for this" } 
    ASSISTANT: { "step": "THINK", "content": "I see that there is a tool available cloneSite which takes an input url as argument and creates clone in local directory of the user machine." } 
    ASSISTANT: { "step": "THINK", "content": "I need to call cloneSite for url 'https://www.google.com' to clone the website" }
    ASSISTANT: { "step": "TOOL", "input": 'https://www.google.com', "tool_name": "cloneSite" }
    DEVELOPER: { "step": "OBSERVE", "content": "The website is cloned successfully and is saved at 'cloned-site' folder in current directory of the user's machine" }
    ASSISTANT: { "step": "THINK", "content": "Great, the website is cloned successfully and is saved at 'cloned-site' folder in current directory of the user's machine" }
    ASSISTANT: { "step": "THINK", "content": "Let me just confirm that the cloned website is available at the path or not." }
    ASSISTANT: { "step": "THINK", "content": "Let me see if there is any tool available by which I can check the current directory or the contents of any directory in the user's machine." }
    ASSISTANT: { "step": "THINK", "content": "I see that there is a tool available executeCommand which takes an input command as argument and returns the result" }
    ASSISTANT: { "step": "THINK", "content": "I need to call executeCommand first to check the pwd of the user machine and then to check the directory contents to ensure that the clone site folder is created and available" }
    ASSISTANT: { "step": "TOOL", "input": '// input commands', "tool_name": "executeCommand" }
    DEVELOPER: { "step": "OBSERVE", "content": "The directory 'cloned-site' is available at the user's machine." }
    ASSISTANT: { "step": "THINK", "content": "Great, Now I can see the directory 'cloned-site' is available at the user's machine which ensures that the site is cloned successfully" }
    ASSISTANT: { "step": "OUTPUT", "content": "The site 'https://www.google.com' is cloned successfully and available at your local machine in the current directory and inside the folder 'cloned-site'" }
  `;


  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: 'Clone the website https://code.visualstudio.com/' },
  ];

  while (true) {
    const response = await client.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: messages
    });

    const rawContent = response.choices[0].message.content;
    let parsedContent;
    try {
      parsedContent = JSON.parse(rawContent);
    } catch (err) {
      console.error("Failed to parse OpenAI response:", rawContent);
      break;
    }

    messages.push({ role: 'assistant', content: JSON.stringify(parsedContent) });

    const step = parsedContent.step;

    if (step === 'START' || step === 'THINK') {
      console.log(step === 'START' ? '🔥' : '🧠', parsedContent.content);
      continue;
    }

    if (step === 'TOOL') {
      const toolName = parsedContent.tool_name;
      if (!TOOL_MAP[toolName]) {
        messages.push({ role: 'developer', content: `There is no such tool as ${toolName}` });
        continue;
      }

      const responseFromTool = await TOOL_MAP[toolName](parsedContent.input);
      console.log(`🛠️ ${toolName}(${parsedContent.input}) =`, responseFromTool);

      messages.push({
        role: 'developer',
        content: JSON.stringify({ step: 'OBSERVE', content: responseFromTool })
      });
      continue;
    }

    if (step === 'OUTPUT') {
      console.log('🤖', parsedContent.content);
      break;
    }
  }

  console.log('Done...');
}

main();
