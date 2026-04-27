import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

export const analyzeUrgency = async (title, description) => {
  try {
    const prompt = `
      Analyze the following task for a volunteer routing system.
      Title: ${title}
      Description: ${description}

      Determine the urgency (Low, Medium, High, Critical) and the category (Medical, Food, Physical Labor, Teaching).
      Return ONLY a valid JSON object matching this schema:
      {"urgency": "High", "category": "Food"}
    `;
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonStr = text.replace(/```json\n?|```\n?/gi, '').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini Error:", error);
    return { urgency: "Medium", category: "Physical Labor" }; // Fallback
  }
};

export const matchVolunteers = async (requestDetails, allVolunteers) => {
  try {
    const scored = allVolunteers.filter(v => v.available).map(vol => {
      let score = 0;
      if (vol.location === requestDetails.location) score += 10;
      const commonSkills = vol.skills.filter(s => requestDetails.skillsNeeded?.includes(s));
      if (commonSkills.length > 0) score += commonSkills.length * 5;
      return { ...vol, score };
    });
    
    const top3 = scored.sort((a, b) => b.score - a.score).slice(0, 3);
    if (top3.length === 0) return [];

    const prompt = `
      You are an AI volunteer matcher. Explain in ONE concise sentence per volunteer WHY they are a good match for this request.
      Request: ${requestDetails.title} (Location: ${requestDetails.location}, Needs: ${requestDetails.skillsNeeded?.join(', ')})
      Volunteers:
      ${top3.map((v, i) => `[${i+1}] ${v.name} (Location: ${v.location}, Skills: ${v.skills.join(', ')})`).join('\n')}

      Return ONLY a JSON array of strings (one string explanation per volunteer, maintaining the same order). Example: ["Reason 1", "Reason 2", "Reason 3"]
    `;
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonStr = text.replace(/```json\n?|```\n?/gi, '').trim();
    const reasons = JSON.parse(jsonStr);

    return top3.map((v, i) => ({
      ...v,
      reason: reasons[i] || "AI determined this is a strong match based on location and skills."
    }));
  } catch (error) {
    console.error("Gemini Error:", error);
    return allVolunteers.filter(v => v.available).slice(0, 3).map(v => ({...v, reason: "Fallback: AI matching offline."}));
  }
};

export const summarizeReport = async (data) => {
  try {
    const prompt = `
      Analyze this weekly volunteer request data (requests vs resolved) and provide a concise, 1-2 sentence executive summary of the trends.
      Data: ${JSON.stringify(data)}
      Return only the summary text without any surrounding quotes or markdown.
    `;
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error("Gemini Error:", error);
    return "System temporarily unavailable to generate AI insights.";
  }
};
