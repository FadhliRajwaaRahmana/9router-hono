const http = require("http");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const { pathToFileURL } = require("url");

const origCreate = http.createServer.bind(http);

// Per-process secret proving x-9r-real-ip was stamped below rather than sent by the client.
const PEER_TOKEN = crypto.randomBytes(24).toString("hex");
process.env.NINEROUTER_PEER_TOKEN = PEER_TOKEN;

let backgroundRefreshStarted = false;
let honoApp = null;

// Initialize Hono Fast-Path Gateway (Compiled with esbuild into dist/honoGateway.mjs)
async function initHonoFastPath() {
  try {
    const modPath = path.join(__dirname, "dist", "honoGateway.mjs");
    if (fs.existsSync(modPath)) {
      const m = await import(pathToFileURL(modPath).href);
      honoApp = m.honoApp;
      console.log("⚡ [Hono] Fast-Path Engine Active: /v1/* sub-millisecond routing enabled");
    }
  } catch (err) {
    console.error("[Hono] Fast-path initialization error:", err);
  }
}
initHonoFastPath();

function startBackgroundTokenRefreshFromCustomServer() {
  if (backgroundRefreshStarted) return;
  backgroundRefreshStarted = true;
  const modPath = path.join(__dirname, "src", "sse", "services", "backgroundTokenRefresh.js");
  import(pathToFileURL(modPath).href)
    .then((m) => {
      try {
        m.startBackgroundTokenRefresh();
      } catch (e) {
        console.error("[BackgroundTokenRefresh] start failed:", e && e.message ? e.message : e);
      }
      const stop = () => {
        try {
          m.stopBackgroundTokenRefresh();
        } catch {}
      };
      process.once("SIGINT", stop);
      process.once("SIGTERM", stop);
    })
    .catch((e) => {
      if (process.env.DEBUG_BACKGROUND_TOKEN_REFRESH) {
        console.error("[BackgroundTokenRefresh] import failed:", e && e.message ? e.message : e);
      }
    });
}

function isHonoFastPathCandidate(method, url) {
  if (!honoApp) return false;
  const upperMethod = (method || "GET").toUpperCase();

  const pathname = url.split("?")[0];
  if (
    pathname === "/dashboard" ||
    pathname === "/" ||
    pathname.startsWith("/api/dashboard/") ||
    pathname === "/v1/models" ||
    pathname === "/api/v1/models" ||
    pathname.startsWith("/v1/models/")
  ) {
    return true;
  }

  if (upperMethod !== "POST" && upperMethod !== "OPTIONS") return false;

  return (
    pathname.startsWith("/v1/chat/completions") ||
    pathname.startsWith("/api/v1/chat/completions") ||
    pathname.startsWith("/v1/messages") ||
    pathname.startsWith("/api/v1/messages") ||
    pathname.startsWith("/v1/responses") ||
    pathname.startsWith("/api/v1/responses") ||
    pathname.startsWith("/codex") ||
    pathname.startsWith("/responses") ||
    pathname.startsWith("/v1/search") ||
    pathname.startsWith("/api/v1/search") ||
    pathname.startsWith("/v1/web/fetch") ||
    pathname.startsWith("/api/v1/web/fetch") ||
    pathname.startsWith("/v1/embeddings") ||
    pathname.startsWith("/api/v1/embeddings")
  );
}

function nodeReqToWebRequest(req) {
  const host = req.headers.host || "127.0.0.1:20129";
  const protocol = req.socket && req.socket.encrypted ? "https" : "http";
  const fullUrl = `${protocol}://${host}${req.url}`;

  const headers = new Headers();
  for (const [key, val] of Object.entries(req.headers)) {
    if (Array.isArray(val)) {
      for (const v of val) headers.append(key, v);
    } else if (val !== undefined) {
      headers.set(key, val);
    }
  }

  const method = (req.method || "GET").toUpperCase();
  const init = { method, headers };

  if (method !== "GET" && method !== "HEAD") {
    init.body = new ReadableStream({
      start(controller) {
        req.on("data", (chunk) => controller.enqueue(chunk));
        req.on("end", () => controller.close());
        req.on("error", (err) => controller.error(err));
      },
    });
    // @ts-ignore
    init.duplex = "half";
  }

  return new Request(fullUrl, init);
}

async function pipeWebResponseToNode(webRes, nodeRes) {
  nodeRes.statusCode = webRes.status;
  webRes.headers.forEach((val, key) => {
    nodeRes.setHeader(key, val);
  });

  if (!webRes.body) {
    nodeRes.end();
    return;
  }

  const reader = webRes.body.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      nodeRes.write(Buffer.from(value));
    }
    nodeRes.end();
  } catch (err) {
    nodeRes.destroy(err);
  }
}

// Wrap Next HTTP server: derive client IP, handle Hono Fast-Path, pass everything else to Next.js
http.createServer = (...args) => {
  const handler = args.find((a) => typeof a === "function");
  const rest = args.filter((a) => typeof a !== "function");
  if (!handler) return origCreate(...args);

  const wrapped = async (req, res) => {
    const socketIp = req.socket && req.socket.remoteAddress ? req.socket.remoteAddress : "";
    const xff = req.headers["x-forwarded-for"];
    const xRealIp = req.headers["x-real-ip"];
    const viaProxy = !!(xff || xRealIp);
    const isLoopbackProxy = socketIp === "127.0.0.1" || socketIp === "::1" || socketIp === "::ffff:127.0.0.1";
    const proxyIp = xRealIp || (xff ? String(xff).split(",")[0].trim() : "");
    const ip = isLoopbackProxy && proxyIp ? proxyIp : socketIp;

    delete req.headers["x-9r-real-ip"];
    delete req.headers["x-forwarded-for"];
    delete req.headers["x-9r-via-proxy"];
    delete req.headers["x-9r-peer-token"];
    req.headers["x-9r-real-ip"] = ip;
    req.headers["x-9r-peer-token"] = PEER_TOKEN;
    if (viaProxy) req.headers["x-9r-via-proxy"] = "1";

    // ⚡ HONO FAST-PATH: Intercept LLM /v1/* requests and route directly through Hono
    if (isHonoFastPathCandidate(req.method, req.url)) {
      try {
        const webReq = nodeReqToWebRequest(req);
        const webRes = await honoApp.fetch(webReq);
        await pipeWebResponseToNode(webRes, res);
        return;
      } catch (err) {
        console.error("[Hono] Fast-path routing error, fallback to Next:", err);
      }
    }

    // 🖥️ FULL NEXT.JS DASHBOARD & SYSTEM APIS: Handled by original Next.js server
    return handler(req, res);
  };

  const server = origCreate(...rest, wrapped);
  server.once("listening", () => {
    startBackgroundTokenRefreshFromCustomServer();
  });

  const origEmit = server.emit;
  server.emit = function (event, ...eventArgs) {
    const [req, socket, head] = eventArgs;
    if (event !== "upgrade" || String(req.headers.upgrade || "").toLowerCase() !== "h2c") {
      return origEmit.call(this, event, ...eventArgs);
    }

    const contentLength = Number(req.headers["content-length"] || 0);
    if (!Number.isSafeInteger(contentLength) || contentLength < 0) {
      socket.destroy();
      return true;
    }
    const chunks = [head];
    let received = head.length;
    const serve = () => {
      const replay = new http.IncomingMessage(socket);
      Object.assign(replay, { method: req.method, url: req.url, headers: req.headers, complete: true });
      if (received) replay.push(Buffer.concat(chunks, received).subarray(0, contentLength));
      replay.push(null);
      const res = new http.ServerResponse(replay);
      res.shouldKeepAlive = false;
      res.assignSocket(socket);
      res.once("finish", () => socket.end());
      Promise.resolve().then(() => wrapped(replay, res)).catch((error) => {
        console.error("Failed to downgrade h2c request", error);
        socket.destroy();
      });
    };
    if (received >= contentLength) serve();
    else {
      socket.on("data", function readBody(chunk) {
        chunks.push(chunk);
        received += chunk.length;
        if (received < contentLength) return;
        socket.off("data", readBody);
        serve();
      });
      socket.resume();
    }
    delete req.headers.upgrade;
    delete req.headers["http2-settings"];
    req.headers.connection = "close";
    return true;
  };
  return server;
};

function startMain() {
  const standalone = path.join(__dirname, "server.js");
  if (fs.existsSync(standalone)) {
    require(standalone);
  } else {
    const nextBin = require.resolve("next/dist/bin/next");
    process.argv = [process.argv[0], nextBin, "start", ...process.argv.slice(2)];
    require(nextBin);
  }
}

if (require.main === module || process.env._NINEROUTER_CLI === "1") {
  startMain();
}

module.exports = { startMain };
