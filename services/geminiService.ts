
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message } from "../types";

const MAX_RETRIES = 2;

export const getGeminiExplanation = async (
  topic: string, 
  history: Message[] = [],
  retryCount = 0
): Promise<string> => {
  // Always use process.env.API_KEY directly when initializing the GoogleGenAI client instance
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
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

    // Check if the content was blocked by safety filters
    const candidate = response.candidates?.[0];
    if (candidate?.finishReason === 'SAFETY') {
      return "I'm sorry, but I cannot provide an explanation for this specific topic due to safety guidelines.";
    }

    if (!response.text) {
      throw new Error("Empty response from model");
    }

    return response.text;
  } catch (error: any) {
    // Log the actual error to the console for easier debugging on Vercel
    console.error("Gemini API Full Error Context:", {
      message: error.message,
      status: error.status,
      details: error,
      topic,
      retryCount
    });

    // If it's a transient network error or rate limit, try a simple retry
    if (retryCount < MAX_RETRIES) {
      const delay = Math.pow(2, retryCount) * 1000;
      console.warn(`Attempting retry ${retryCount + 1} in ${delay}ms...`);
      await new Promise(res => setTimeout(res, delay));
      return getGeminiExplanation(topic, history, retryCount + 1);
    }

    // Friendly user-facing error messages based on common issues
    if (error.message?.includes('429')) {
      return "The service is currently busy (Rate Limit reached). Please wait a moment and try clicking again.";
    }
    
    if (error.message?.includes('API key')) {
      return "There's an issue with the AI configuration (API Key). Please ensure the environment variables are correctly set in Vercel.";
    }

    return `Unable to connect to the AI service. (Technical detail: ${error.message || 'Unknown Error'})`;
  }
};
