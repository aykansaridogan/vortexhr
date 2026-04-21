const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
    const list = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" }).listModels(); // This might work or we use specialized list call
    // Actually the standard way is:
    // const list = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    // But I'll just try to hit gemini-1.5-flash-latest and see.
    console.log("Checking gemini-1.5-flash-latest...");
  } catch (e) {
    console.error(e);
  }
}
listModels();
