
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
    console.error("Lumina Advisor Error: API_KEY is missing from environment variables.");
    return "The advisor system is not configured correctly. Please ensure the API_KEY is set in your hosting provider's dashboard.";
  }

  try {
    // Correct initialization using the process.env.API_KEY directly as required.
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: userMessage,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    if (!response || !response.text) {
      throw new Error("Empty response received from Gemini API");
    }

    let text = response.text;
    
    // Robust cleanup to ensure no Markdown characters leak through
    const cleanText = text
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/#/g, '')
      .trim();

    return cleanText;
  } catch (error: any) {
    // Log the full error to the console for easier debugging by the developer
    console.error("Lumina Advisor - Gemini API Error:", {
      message: error.message,
      status: error.status,
      error
    });

    if (error.message?.includes("API key not valid")) {
      return "The advisor is currently offline due to an invalid API key configuration.";
    }

    return "The academic advisor is currently busy. Please check back shortly.";
  }
};
