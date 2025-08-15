import express from 'express';
import cors from 'cors';
import hiteshPersona from './prompts/persona/hiteshPersona.js';
import piyushPersona from './prompts/persona/piyushPersona.js';


const app = express();
app.use(cors({
    origin: 'http://localhost:5173', // React dev server URL
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));
app.use(express.json());

app.post('/api/persona/hitesh', async (req, res) => {
    try {
        const { chatInputs } = req.body; // ✅ Extract the array
        const response = await hiteshPersona(chatInputs);
        res.json({ reply: response });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/persona/piyush', async (req, res) => {
    try {
        const { chatInputs } = req.body; // ✅ Extract the array
        const response = await piyushPersona(chatInputs);
        res.json({ reply: response });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(3001, () => {
    console.log('Server running on http://localhost:3001');
});
