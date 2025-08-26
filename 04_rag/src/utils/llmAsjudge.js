import envConf from "../../envconf.js";
import OpenAI from "openai";


const client = new OpenAI({
    apiKey: envConf.geminiApiKey,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
})

async function llmJudge(userQuery, relevantChunk) {
    const systemPrompt = `
    You are an expert judge llm. You are provided with a user query and some relevant chunk generated based on the user query by some source documents.

    You have to rate at a scale of [0-3] based on how relevant the retrieved chunk is based on the user query.

    Make the rules strict and do not inflate the result scores.

    the user query is ${userQuery}

    the chunk retrieved is ${relevantChunk}

    Here's the scoring criteria:
    0: The search result has no relevance to the user query.

    1: The search result has low relevance to the user query. It may contain some information that is very slightly related to the user query but not enough to answer it. The search result contains some references or very limited information about some entities present in the user query. In case the query is a statement on a topic, the search result should be tangentially related to it.

    2: The search result has medium relevance to the user query. If the user query is a question, the search result may contain some information that is relevant to the user query but not enough to answer it. If the user query is a search phrase/sentence, either the search result is centered around most but not all entities present in the user query, or if all the entities are present in the result, the search result while not being centered around it has medium level of relevance. In case the query is a statement on a topic, the search result should be related to the topic.

    3: The search result has high relevance to the user query. If the user query is a question, the search result contains information that can answer the user query. Otherwise, if the search query is a search phrase/sentence, it provides relevant information about all entities that are present in the user query and the search result is centered around the entities mentioned in the query. In case the query is a statement on a topic, the search result should be either directly addressing it or be on the same topic.

    You should think step by step about the user query and the search result and rate the search result. Be critical and strict with your ratings to ensure accuracy.


    At last return the relevance score, nothing else. No text, no suggestions, no thoughts, just a score as 0, 1, 2 or 3.
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
                content: `User Query: ${userQuery}\nRelevant Chunk: ${relevantChunk}`,
            },
        ]
    })

    console.log(response.choices[0].message.content);
}


const query = "Can you please tell me about debugging in nodejs?";

const chunk = `
Document {
    pageContent: 'Version 1.0 \n' +
      '12 \n' +
      '$ node app.js \n' +
      'Doing some work... \n' +
      'Your Node.js scripts don’t share a global score. This means variables created in one \n' +
      'scripts are not accessible in a different script. The only way to share values between \n' +
      'scripts is by using require with module.exports. \n' +
      'Lesson 4: Importing npm Modules \n' +
      'When you install Node.js, you also get npm. npm is a package manager that allows you to \n' +
      'install and use third-party npm libraries in your code. This opens up a world of possibilities, \n' +    
      'as there are npm packages for everything from email sending to file uploading. In this \n' +
      'lesson, you’ll learn how to integrate npm into your Node.js app. \n' +
      'Initializing npm \n' +
      'Your Node.js application needs to initialize npm before npm can be used. You can run npm \n' +
      'init from the root of your project to get that done. That command will ask you a series of \n' +
      'questions about the project and it’ll use the information to generate a package.json file in \n' +       
      'the root of your project. \n' +
      'Here’s an example. \n' +
      '{ \n' +
      '  "name": "notes-app", \n' +
      '  "version": "1.0.0", \n' +
      '  "description": "", \n' +
      '  "main": "app.js", \n' +
      '  "scripts": { \n' +
      '    "test": "echo \\"Error: no test specified\\" && exit 1" \n' +
      '  }, \n' +
      '  "author": "", \n' +
      '  "license": "ISC", \n' +
      '} \n' +
      'Installing an npm Module \n' +
      'You’re now ready to install an npm module. This is done using the npm command which \n' +
      'was set up when Node.js was installed. You can use npm install to install a new module \n' +
      'in your project. ',
    metadata: { source: './nodejs.pdf', pdf: [Object], loc: [Object] },
    id: 'f98756c0-0541-4183-b1a1-fc8aa3d8c65e'
  }`


llmJudge(query, chunk)