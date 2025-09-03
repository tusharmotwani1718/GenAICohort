import { Agent, run } from '@openai/agents';
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

// agent for guardrail
const guardrailAgent = new Agent({
    name: 'Guardrail Check',
    instructions: `Check if the user is giving their mobile number to you. Return true if you detect a phone number in the input.`,
    outputType: z.object({
        isMobileNumber: z.boolean().describe("True if the user is providing a mobile number"),
        reasoning: z.string()
    })
});

// check guardrail condition - FIXED
const checkMobileInput = {
    name: 'Mobile Input Guardrail',
    execute: async ({ input }) => {
        try {
            const result = await run(guardrailAgent, input); // Added await
            console.log(`👤: ${input}`);
            console.log(`🛡️ Guardrail result:`, result);

            return {
                tripleWireTiggered: result.isMobileNumber // Direct access to the property
            };
        } catch (error) {
            console.error('Guardrail error:', error);
            return { tripleWireTiggered: false };
        }
    }
};

// main agent:
const agent = new Agent({
    name: 'helpful_agent',
    instructions: `You are a helpful assistant`,
    inputGuardrails: [checkMobileInput]
});

async function chat(query) {
    const response = await run(agent, query);
    return response.finalOutput;
}

// Test with phone number
const query = `Hey my name is Tushar! Here's my mobile number: 909092112`;
const response = await chat(query);
console.log(`🤖: ${response}`);