const store = new Map();
const TTL = 2 * 60 * 60 * 1000; // 2 heures
const MAX_MESSAGES = 20;

export function getHistory(phone) {
  const entry = store.get(phone);
  if (!entry) return [];
  if (Date.now() - entry.updatedAt > TTL) {
    store.delete(phone);
    return [];
  }
  return entry.messages;
}

export function addMessage(phone, role, content) {
  const history = getHistory(phone);
  history.push({ role, content });
  if (history.length > MAX_MESSAGES) history.splice(0, history.length - MAX_MESSAGES);
  store.set(phone, { messages: history, updatedAt: Date.now() });
}
