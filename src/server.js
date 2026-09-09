import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import { initTranslators } from "open-sse/translator/index.js";
import { handleChat } from "./sse/handlers/chat.js";
import { handleSearch } from "./sse/handlers/search.js";
import { handleFetch } from "./sse/handlers/fetch.js";
import { handleEmbeddings } from "./sse/handlers/embeddings.js";
import { getSettings, getApiKeys, validateApiKey } from "./lib/localDb.js";
import { buildModelsList } from "./modelsHandler.js";
import { registerDashboardRoutes } from "./dashboardApi.js";
import DASHBOARD_HTML from "./dashboard.html";

const app = new Hono();

// Global CORS middleware
app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["*"],
    exposeHeaders: ["*"],
  })
);

// Initialize Translators once on startup
await initTranslators();

// Optional API Key Authentication Middleware for /v1/*
app.use("/v1/*", async (c, next) => {
  const settings = await getSettings();
  if (!settings.requireApiKey) {
    return await next();
  }

  const authHeader = c.req.header("Authorization") || "";
  const apiKey = authHeader.replace(/^Bearer\s+/i, "").trim() || c.req.header("x-api-key");

  if (!apiKey) {
    return c.json({ error: { message: "Missing API key (requireApiKey=true)", type: "authentication_error" } }, 401);
  }

  const valid = await validateApiKey(apiKey);
  if (!valid) {
    return c.json({ error: { message: "Invalid API key (requireApiKey=true)", type: "authentication_error" } }, 401);
  }

  await next();
});

// Root & Health Check
// Register dashboard API endpoints
registerDashboardRoutes(app);

// Serve Modern Dashboard UI at /dashboard and root / (if browser accepts html)
app.get("/dashboard", (c) => {
  return c.html(DASHBOARD_HTML);
});

app.get("/", (c) => {
  const accept = c.req.header("accept") || "";
  if (accept.includes("text/html")) {
    return c.html(DASHBOARD_HTML);
  }
  return c.json({
    name: "9router-hono",
    status: "running",
    engine: "Hono (Ultra-Fast Proxy)",
    dashboard: "/dashboard",
    endpoints: [
      "/v1/chat/completions",
      "/v1/messages",
      "/v1/responses",
      "/v1/models",
      "/v1/search",
      "/v1/web/fetch",
      "/v1/embeddings",
    ],
  });
});

app.get("/health", (c) => c.text("OK"));

// Models endpoints
app.get("/v1/models", async (c) => {
  try {
    const list = await buildModelsList(["llm"]);
    return c.json(list);
  } catch (err) {
    return c.json({ error: { message: err.message || "Failed to build models list" } }, 500);
  }
});

app.get("/v1/models/:kind", async (c) => {
  const kind = c.req.param("kind");
  try {
    const list = await buildModelsList([kind]);
    return c.json(list);
  } catch (err) {
    return c.json({ error: { message: err.message || "Failed to build models list" } }, 500);
  }
});

// LLM Fast-Path: OpenAI format
app.post("/v1/chat/completions", async (c) => {
  return await handleChat(c.req.raw);
});

// LLM Fast-Path: Anthropic Claude Messages format
app.post("/v1/messages", async (c) => {
  return await handleChat(c.req.raw);
});

// LLM Fast-Path: OpenAI Responses format
app.post("/v1/responses", async (c) => {
  return await handleChat(c.req.raw);
});

// Search & Web Fetch
app.post("/v1/search", async (c) => {
  return await handleSearch(c.req.raw);
});

app.post("/v1/web/fetch", async (c) => {
  return await handleFetch(c.req.raw);
});

// Embeddings
app.post("/v1/embeddings", async (c) => {
  return await handleEmbeddings(c.req.raw);
});

// Rewrite /codex/* -> /v1/responses compatibility
app.all("/codex/*", async (c) => {
  return await handleChat(c.req.raw);
});

export { app };

export function startServer(port = 20129, host = "0.0.0.0") {
  console.log(`\n🚀 9Router Hono Engine starting on http://${host}:${port}`);
  console.log(`⚡ Routing Layer: Hono RegExpRouter (Sub-millisecond)`);
  console.log(`💾 SQLite Storage: Active (~/.9router/db/data.sqlite)`);

  const server = serve({
    fetch: app.fetch,
    port,
    hostname: host,
  });

  return server;
}

if (process.argv[1] && process.argv[1].endsWith("server.js")) {
  const port = Number(process.env.PORT) || 20129;
  const host = process.env.HOST || "0.0.0.0";
  startServer(port, host);
}
