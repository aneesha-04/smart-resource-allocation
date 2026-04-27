import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI("AIzaSyCidFG_IcvYasusCBL3vcYjpxkxeRC8DwM");
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

async function run() {
  try {
    const result = await model.generateContent("Hello, how are you?");
    console.log("Success:", result.response.text());
  } catch (error) {
    console.error("Error:", error.message);
  }
}

run();
