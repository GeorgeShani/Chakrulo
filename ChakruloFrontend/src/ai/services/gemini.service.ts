"use server";
import { getGeminiModel } from "../models/gemini.model";

export async function generateText(prompt: string, modelName?: string) {
  const model = getGeminiModel(modelName);
  const result = await model.generateContent(prompt);
  return result.response.text();
}
