
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message } from "../types";

const MAX_RETRIES = 2;

/**
 * Safely access the API key. 
 * Prevents "process is not defined" errors that crash the entire app in some browser environments.
 */
const safeGetApiKey = (): string | undefined => {
  try {
    // Standard access for Vercel/Node/Bundled environments
    return process.env.API_KEY;
  } catch (e) {
    console.error("Critical: 'process' global is not defined. Ensure your build environment supports process.env or provides a shim.");
    return undefined;
  }
};

export const getGeminiExplanation = async (
  topic: string, 
  history: Message[] = [],
  retryCount = 0
): Promise<string> => {
  const apiKey = safeGetApiKey();
  
  if (!apiKey) {
    console.error("Gemini Error: API_KEY is undefined. Check Vercel environment variables.");
    return "Error: API Key is missing. Please configure 'API_KEY' in your Vercel project environment settings and redeploy.";
  }

  const systemInstruction = `You are a world-class AI researcher and educator. 
  The user is exploring an AI Ecosystem Landscape diagram and has clicked on "${topic}". 
  Provide a concise but insightful explanation (2-3 paragraphs max) of what this is, 
  its historical context, and how it relates to the broader AI field. 
  Use formatting like bullet points or bold text where appropriate. 
  Keep the tone professional yet accessible.`;

  const prompt = history.length === 0 
    ? `Explain the role of "${topic}" in the AI ecosystem.`
    : history[history.length - 1].text;

  try {
    // Create new instance per request to ensure fresh state and key access
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
      return "I'm sorry, but I cannot provide an explanation for this specific topic due to safety guidelines.";
    }

    if (!response.text) {
      throw new Error("Empty response from model");
    }

    return response.text;
  } catch (error: any) {
    // Extensive logging for remote debugging in Vercel logs/Browser console
    console.group(`Gemini API Error (Attempt ${retryCount + 1})`);
    console.error("Message:", error.message);
    console.error("Status:", error.status);
    console.dir(error);
    console.groupEnd();

    // Retry logic for transient errors or rate limits
    if (retryCount < MAX_RETRIES && (error.status === 429 || error.status >= 500 || !error.status)) {
      const delay = Math.pow(2, retryCount) * 1000;
      await new Promise(res => setTimeout(res, delay));
      return getGeminiExplanation(topic, history, retryCount + 1);
    }

    // Specific user-facing messages for common API errors
    if (error.message?.includes('403')) {
      return "Error: Access Denied (403). Your API key might not have permission for this model or region. Check Google AI Studio project settings.";
    }
    if (error.message?.includes('401')) {
      return "Error: Invalid API Key (401). Please verify your key in Google AI Studio and update Vercel env vars.";
    }
    if (error.message?.includes('429')) {
      return "Error: Too many requests (429). Please wait a moment.";
    }

    return `Error: Unable to connect to the AI service. (${error.message || 'Check browser console for details'})`;
  }
};
