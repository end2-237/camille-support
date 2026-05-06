import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL);
const TTL = 60 * 60 * 2; // 2 heures d'inactivité réinitialise la conversation
const MAX_MESSAGES = 20;

export async function getHistory(phone) {
  const raw = await redis.get(`history:${phone}`);
  return raw ? JSON.parse(raw) : [];
}

export async function addMessage(phone, role, content) {
  const history = await getHistory(phone);
  history.push({ role, content });
  if (history.length > MAX_MESSAGES) history.splice(0, history.length - MAX_MESSAGES);
  await redis.setex(`history:${phone}`, TTL, JSON.stringify(history));
}
