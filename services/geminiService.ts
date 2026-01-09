
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are LuminaGPT, the Virtual Academic Advisor for Lumina Institute of Technology. 
Your tone is professional, encouraging, and helpful. 
You provide information about Lumina Institute of Technology, including:
- Academic programs (CS, AI, Design, Business).
- Campus life (clubs, athletics, housing).
- Admission requirements (applications due Dec 1st).
- Financial aid.

CRITICAL: Do NOT use Markdown formatting. Do NOT use asterisks for bolding (e.g., **text**). Do NOT use asterisks or dashes for bullet points. 
Use plain text only. If you need to list items, use plain numbers (1., 2., etc.) or just start a new line with a simple dash. 
Keep responses concise and avoid any special symbols.
If asked about something outside of college advice, politely redirect to academic topics.
`;

export const getGeminiResponse = async (userMessage: string) => {
  const apiKey = process.env.API_KEY;

  if (!apiKey || apiKey === "") {
    console.error("Lumina Advisor Configuration Error: API_KEY is missing.");
    return "Advisor Configuration Error: No API key found. Please ensure API_KEY is set in your Vercel Project Settings.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: userMessage }] }],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    if (!response || !response.text) {
      throw new Error("The API returned an empty or invalid response.");
    }

    const text = response.text;
    
    // Robust cleanup to ensure no Markdown characters leak through
    const cleanText = text
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/#/g, '')
      .trim();

    return cleanText;
  } catch (error: any) {
    // Improved error logging to avoid [object Object] in consoles
    const errorMsg = error?.message || "Unknown error occurred";
    console.error("Lumina Advisor - Gemini API Error Message:", errorMsg);
    console.error("Lumina Advisor - Full Error Context:", error);

    if (errorMsg.includes("API key not valid")) {
      return "Critical: The provided API Key is invalid. Please check your Google AI Studio settings.";
    }

    if (errorMsg.includes("User location is required")) {
      return "The advisor encountered a location-based error. Please try again.";
    }

    return `The advisor is currently experiencing an issue: ${errorMsg.substring(0, 60)}... Please try again later.`;
  }
};
