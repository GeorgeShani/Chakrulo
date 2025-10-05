import { genAI } from "../config/gemini.config";

export const getGeminiModel = (modelName: string = "gemini-2.0-flash") => {
  return genAI.getGenerativeModel({ model: modelName });
};
