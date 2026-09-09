import { Hono } from "hono";
import { handleChat } from "./src/sse/handlers/chat.js";
import { handleSearch } from "./src/sse/handlers/search.js";
import { handleFetch } from "./src/sse/handlers/fetch.js";
import { handleEmbeddings } from "./src/sse/handlers/embeddings.js";
import { initTranslators } from "./open-sse/translator/index.js";

// Initialize translators once at boot
await initTranslators();

const honoApp = new Hono();

// Match LLM chat completions
honoApp.post("/v1/chat/completions", async (c) => {
  return await handleChat(c.req.raw);
});
honoApp.post("/api/v1/chat/completions", async (c) => {
  return await handleChat(c.req.raw);
});

// Match Claude Messages
honoApp.post("/v1/messages", async (c) => {
  return await handleChat(c.req.raw);
});
honoApp.post("/api/v1/messages", async (c) => {
  return await handleChat(c.req.raw);
});

// Match OpenAI Responses API / Codex
honoApp.post("/v1/responses", async (c) => {
  return await handleChat(c.req.raw);
});
honoApp.post("/api/v1/responses", async (c) => {
  return await handleChat(c.req.raw);
});
honoApp.all("/codex/*", async (c) => {
  return await handleChat(c.req.raw);
});
honoApp.all("/responses", async (c) => {
  return await handleChat(c.req.raw);
});

// Match Search & Fetch
honoApp.post("/v1/search", async (c) => {
  return await handleSearch(c.req.raw);
});
honoApp.post("/api/v1/search", async (c) => {
  return await handleSearch(c.req.raw);
});
honoApp.post("/v1/web/fetch", async (c) => {
  return await handleFetch(c.req.raw);
});
honoApp.post("/api/v1/web/fetch", async (c) => {
  return await handleFetch(c.req.raw);
});

// Match Embeddings
honoApp.post("/v1/embeddings", async (c) => {
  return await handleEmbeddings(c.req.raw);
});
honoApp.post("/api/v1/embeddings", async (c) => {
  return await handleEmbeddings(c.req.raw);
});

export { honoApp };
