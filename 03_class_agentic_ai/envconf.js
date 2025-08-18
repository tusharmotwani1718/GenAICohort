// envConf.js
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Ensure __dirname works in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the .env file explicitly
const result = dotenv.config({ path: path.join(__dirname, '.env') });

if (result.error) {
  throw new Error(`Failed to load .env file: ${result.error}`);
}

// Check for missing environment variables
const requiredEnvVars = ['OPEN_AI_APIKEY', 'GEMINI_API_KEY'];
for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

// Export configuration safely
const envConf = {
  openAIApiKey: process.env.OPEN_AI_APIKEY,
  geminiApiKey: process.env.GEMINI_API_KEY
};

export default envConf;
