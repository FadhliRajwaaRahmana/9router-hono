import { Hono } from "hono";
import { handleChat } from "@/sse/handlers/chat.js";
import { handleSearch } from "@/sse/handlers/search.js";
import { handleFetch } from "@/sse/handlers/fetch.js";
import { handleEmbeddings } from "@/sse/handlers/embeddings.js";
import { initTranslators } from "open-sse/translator/index.js";
import { buildModelsList } from "./modelsHandler.js";

await initTranslators();

const honoApp = new Hono();

// Match LLM chat completions (Sub-millisecond fast path)
honoApp.post("/v1/chat/completions", async (c) => handleChat(c.req.raw));
honoApp.post("/api/v1/chat/completions", async (c) => handleChat(c.req.raw));
honoApp.post("/v1/messages", async (c) => handleChat(c.req.raw));
honoApp.post("/api/v1/messages", async (c) => handleChat(c.req.raw));
honoApp.post("/v1/responses", async (c) => handleChat(c.req.raw));
honoApp.post("/api/v1/responses", async (c) => handleChat(c.req.raw));
honoApp.all("/codex/*", async (c) => handleChat(c.req.raw));
honoApp.all("/responses", async (c) => handleChat(c.req.raw));

// Match Search & Fetch
honoApp.post("/v1/search", async (c) => handleSearch(c.req.raw));
honoApp.post("/api/v1/search", async (c) => handleSearch(c.req.raw));
honoApp.post("/v1/web/fetch", async (c) => handleFetch(c.req.raw));
honoApp.post("/api/v1/web/fetch", async (c) => handleFetch(c.req.raw));
honoApp.post("/v1/embeddings", async (c) => handleEmbeddings(c.req.raw));
honoApp.post("/api/v1/embeddings", async (c) => handleEmbeddings(c.req.raw));

// Match Models (Sub-millisecond fast path)
honoApp.get("/v1/models", async (c) => {
  const raw = await buildModelsList(["llm"]);
  const data = Array.isArray(raw) ? raw : (raw?.data || []);
  return c.json({ object: "list", data });
});
honoApp.get("/api/v1/models", async (c) => {
  const raw = await buildModelsList(["llm"]);
  const data = Array.isArray(raw) ? raw : (raw?.data || []);
  return c.json({ object: "list", data });
});

export { honoApp };
