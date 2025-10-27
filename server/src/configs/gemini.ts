
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey: string | undefined = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("❌ GEMINI_API_KEY is not defined in .env file");
}

const ai = new GoogleGenerativeAI(apiKey);

export async function main(topic: string): Promise<string> {
  const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
  Write a detailed blog post about ${topic}.

  Requirements:
  - Use a professional yet engaging tone.  
  - Provide an informative introduction, body, and conclusion.  
  - Include at least 3–5 recent statistics, studies, or news references (as of 2024/2025).  
  - Break down the blog into sections with clear subheadings.  
  - Add examples, expert insights, and practical takeaways.  
  - Keep it optimized for SEO: use keywords naturally, add a meta description, and suggest 3 title ideas.  
  - Length: at least 1200 words.
  `;

  const result = await model.generateContent(prompt);

  return result.response.text();
}
export default main;