import Tesseract from 'tesseract.js';
import fs from 'fs';

async function readTextFromImage(imagePath) {
    const { data: { text } } = await Tesseract.recognize(imagePath, 'eng');
    return text;
}

// Example usage
const text = await readTextFromImage('images/before_signup_fill.png');
console.log('Extracted text:', text);
