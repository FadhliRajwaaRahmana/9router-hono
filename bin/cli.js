#!/usr/bin/env node

import { startServer } from "../dist/server.js";

const args = process.argv.slice(2);
let port = 20129;
let host = "0.0.0.0";

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--port" || args[i] === "-p") {
    port = Number(args[i + 1]) || 20129;
    i++;
  } else if (args[i] === "--host" || args[i] === "-h") {
    host = args[i + 1] || "0.0.0.0";
    i++;
  } else if (args[i] === "--help") {
    console.log(`
9Router Hono CLI
Usage:
  9router-hono [options]

Options:
  -p, --port <number>   Port to listen on (default: 20129)
  -h, --host <string>   Host to bind to (default: 0.0.0.0)
  --help                Show this help message
`);
    process.exit(0);
  }
}

startServer(port, host);
