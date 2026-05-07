import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT =
  process.env.SYSTEM_PROMPT ||
  "Tu es un agent de support client. Réponds en français, de façon concise et professionnelle.";

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-lite",
  systemInstruction: SYSTEM_PROMPT,
});

export async function getReply(history) {
  // Convertir l'historique au format Gemini (role: user/model)
  const geminiHistory = history.slice(0, -1).map((msg) => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }],
  }));

  const lastMessage = history[history.length - 1].content;

  const chat = model.startChat({ history: geminiHistory });
  const result = await chat.sendMessage(lastMessage);
  return result.response.text();
}
