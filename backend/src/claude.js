import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT =
  process.env.SYSTEM_PROMPT ||
  "Tu es un agent de support client. Réponds en français, de façon concise et professionnelle.";

export async function getReply(history) {
  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: history,
  });
  return response.content[0].text;
}
