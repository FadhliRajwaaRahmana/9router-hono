# 9Router Hono 🚀

Ultra-fast, headless, sub-millisecond LLM routing proxy for [9Router](https://github.com/decolua/9router) powered by [Hono](https://hono.dev).

## Highlights

- ⚡ **Ultra-low latency**: Hono RegExpRouter delivers routing decisions in **<0.5ms**, completely eliminating Next.js router & context overhead (~15-30ms).
- 💾 **Seamless Shared Database**: Uses your existing 9router SQLite database (`~/.9router/db/data.sqlite`) — all 600+ accounts, nodes, and keys work instantly.
- 🎯 **Full Protocol Compatibility**:
  - `/v1/chat/completions` (OpenAI format)
  - `/v1/messages` (Claude / Claude Code Messages API)
  - `/v1/responses` & `/codex/*` (OpenAI Responses format)
  - `/v1/models` (OpenAI models catalog)
  - `/v1/search` & `/v1/web/fetch`
  - `/v1/embeddings`
- 🖼️ **Antigravity Image Preservation**: Fully carries over direct-route Claude $\to$ Gemini image blocks and tool argument sanitization.

## Installation

```bash
npm install -g 9router-hono
```

## Quick Start

```bash
# Start server on port 20129
9router-hono --port 20129

# Or with custom host
9router-hono -p 20129 -h 127.0.0.1
```

## Running with Bun (Recommended for Extreme Speed)

```bash
cd /path/to/9router-hono
bun run start:bun
```

## License

MIT
