
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message } from "../types";

const MAX_RETRIES = 1;

/**
 * Safely retrieves the API key from process.env.
 * Prevents ReferenceErrors in browser environments where 'process' is not defined.
 */
const getApiKey = () => {
  try {
    return process.env.GERMINI_API_KEY;
  } catch (e) {
    console.warn("Process environment not found, API_KEY may be missing.");
    return undefined;
  }
};

export const getGeminiExplanation = async (
  topic: string, 
  history: Message[] = [],
  retryCount = 0
): Promise<string> => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    const errorMsg = "API Key is missing. Ensure 'API_KEY' is set in your Vercel Environment Variables.";
    console.error(errorMsg);
    return `Error: ${errorMsg}`;
  }

  const systemInstruction = `You are a world-class AI researcher and educator. 
  The user is exploring an AI Ecosystem Landscape diagram and has clicked on "${topic}". 
  Provide a concise but insightful explanation (2-3 paragraphs max). 
  Use bold text for key terms and bullet points for lists.`;

  const prompt = history.length === 0 
    ? `Explain the role of "${topic}" in the AI ecosystem.`
    : history[history.length - 1].text;

  try {
    // Create instance right before call as recommended
    const ai = new GoogleGenAI({ apiKey });
    
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const candidate = response.candidates?.[0];
    if (candidate?.finishReason === 'SAFETY') {
      return "The explanation for this topic was filtered by safety guidelines.";
    }

    if (!response.text) {
      throw new Error("No text returned from the model.");
    }

    return response.text;
  } catch (error: any) {
    // CRITICAL: Log detailed error for Vercel debugging
    console.group("Gemini API Error Detail");
    console.error("Message:", error.message);
    console.error("Status:", error.status);
    console.dir(error);
    console.groupEnd();

    if (retryCount < MAX_RETRIES && (!error.status || error.status >= 500)) {
      console.log(`Retrying... (${retryCount + 1})`);
      return getGeminiExplanation(topic, history, retryCount + 1);
    }

    // Specific user-facing messages based on error content
    if (error.message?.includes('403')) {
      return "Connection Error (403): This model might be restricted in your deployment region. Try a different region in Vercel settings.";
    }
    if (error.message?.includes('429')) {
      return "Rate Limit Error (429): Too many requests. Please wait a moment.";
    }
    if (error.message?.includes('API key not valid')) {
      return "Configuration Error: The API Key provided is invalid. Please check your Google AI Studio settings.";
    }

    return `Unable to connect to AI service. Technical detail: ${error.message || 'Check browser console for logs.'}`;
  }
};
