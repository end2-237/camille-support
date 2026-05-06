import { getHistory, addMessage } from "./history.js";
import { getReply } from "./claude.js";

const EVOLUTION_URL = process.env.EVOLUTION_URL;
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY;

async function sendMessage(instance, phone, text) {
  await fetch(`${EVOLUTION_URL}/message/sendText/${instance}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: EVOLUTION_API_KEY,
    },
    body: JSON.stringify({
      number: phone,
      text,
    }),
  });
}

export async function handleWebhook(req, res) {
  // Répondre immédiatement à Evolution API
  res.sendStatus(200);

  const event = req.body;

  // On ne traite que les messages entrants texte
  if (event?.event !== "messages.upsert") return;
  const message = event?.data;
  if (!message || message.key?.fromMe) return;

  const text = message.message?.conversation || message.message?.extendedTextMessage?.text;
  if (!text) return;

  const phone = message.key.remoteJid;
  const instance = event.instance;

  try {
    await addMessage(phone, "user", text);
    const history = await getHistory(phone);
    const reply = await getReply(history);
    await addMessage(phone, "assistant", reply);
    await sendMessage(instance, phone, reply);
  } catch (err) {
    console.error("Erreur lors du traitement du message:", err);
  }
}
