
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message } from "../types";

export const getGeminiExplanation = async (
  topic: string, 
  history: Message[] = []
): Promise<string> => {
  // Always use process.env.API_KEY directly when initializing the GoogleGenAI client instance
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  // Prepare contents for chat history if needed, but for simple explanations 
  // we'll use a direct prompt with context
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

    return response.text || "I couldn't generate an explanation at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error: Unable to connect to the AI service. Please check your network or API key.";
  }
};
