import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

export const analyzeUrgency = async (title, description) => {
  try {
    const prompt = `You are an NGO assistant. Classify this community request:
'${title} - ${description}'
Respond in JSON only, no explanation:
{
  "urgency": "Low" or "Medium" or "High" or "Critical",
  "category": "Medical" or "Food" or "Cleanup" or "Education" or "Other",
  "reason": "one short sentence why"
}`;
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonStr = text.replace(/```json\n?|```\n?/gi, '').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("AI unavailable, please try again");
  }
};

export const matchVolunteers = async (requestDetails) => {
  try {
    const prompt = `You are a volunteer coordinator. Given this task:
Task: '${requestDetails.title}' in '${requestDetails.location}' - Urgency: '${requestDetails.urgency}'
Rank these volunteers and explain why each is or isn't ideal:
1. Aarav Sharma - Skills: Driving, Distribution - 1.2km away
2. Priya Mehta - Skills: Medical, First Aid - 0.8km away  
3. Rohan Desai - Skills: Physical Labor, Driving - 2.1km away
Respond in JSON only:
[
  { "name": "...", "score": 91, "reason": "one sentence" },
  { "name": "...", "score": 84, "reason": "one sentence" },
  { "name": "...", "score": 71, "reason": "one sentence" }
]`;
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonStr = text.replace(/```json\n?|```\n?/gi, '').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("AI unavailable, please try again");
  }
};

export const streamExecutiveSummary = async (onChunk) => {
  try {
    const prompt = `You are an NGO data analyst. Write a 2-sentence executive summary for an NGO coordinator based on this data:
- Active Requests: 3
- Urgent Cases: 2
- Top Locality: Viman Nagar (Medical)
- Volunteer Matching Rate: 85%
- Most Active Day: Saturday
Keep it concise, actionable and professional.`;
    
    const result = await model.generateContentStream(prompt);
    for await (const chunk of result.stream) {
      onChunk(chunk.text());
    }
  } catch (error) {
    console.error("Gemini Error:", error);
    onChunk("AI unavailable, please try again");
  }
};
