
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
  // Access the API key from environment variables
  const apiKey = process.env.API_KEY;

  // Diagnostic logging (safe)
  if (!apiKey) {
    console.error("Lumina Global Error: process.env.API_KEY is undefined in the browser.");
  } else {
    console.log(`Lumina Diagnostic: API Key detected (Length: ${apiKey.length})`);
  }

  if (!apiKey || apiKey === "") {
    return "Advisor Error: No API key detected. Please verify your Vercel Environment Variables and ensure your build process injects them into the frontend.";
  }

  try {
    // Initialize the Gemini API client
    const ai = new GoogleGenAI({ apiKey });
    
    // Generate content using the recommended model for basic text tasks
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: userMessage }] }],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    if (!response || !response.text) {
      throw new Error("The AI service returned an empty response.");
    }

    // Clean up the response to remove any accidental markdown
    const text = response.text;
    const cleanText = text
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/#/g, '')
      .trim();

    return cleanText;
  } catch (error: any) {
    // Robust error message extraction to prevent [object Object]
    let detailedError = "Unknown Error";
    
    if (error instanceof Error) {
      detailedError = error.message;
    } else if (typeof error === 'object') {
      try {
        detailedError = JSON.stringify(error);
      } catch (e) {
        detailedError = "Could not stringify error object";
      }
    } else {
      detailedError = String(error);
    }

    console.error("Lumina Advisor - Gemini API Failure:", detailedError);
    console.debug("Full Error Object:", error);

    if (detailedError.includes("API key not valid")) {
      return "The advisor is offline: The provided API Key is invalid or has expired.";
    }

    if (detailedError.includes("403") || detailedError.includes("permission")) {
      return "The advisor is offline: Access denied. Check your API key permissions.";
    }

    return `Advisor is currently unavailable. (Reason: ${detailedError.substring(0, 50)}...)`;
  }
};
