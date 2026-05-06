import express from "express";
import { handleWebhook } from "./webhook.js";

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.post("/webhook", handleWebhook);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend démarré sur le port ${PORT}`));
