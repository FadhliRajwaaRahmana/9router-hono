import esbuild from "esbuild";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

console.log("Bundling 9router-hono with esbuild...");

await esbuild.build({
  entryPoints: [path.join(root, "src/server.js")],
  bundle: true,
  platform: "node",
  target: "node18",
  format: "esm",
  outfile: path.join(root, "dist/server.js"),
  alias: {
    "@": path.join(root, "src"),
    "open-sse": path.join(root, "open-sse"),
  },
  loader: {
    ".html": "text"
  },
  external: [
    "better-sqlite3",
    "sql.js",
    "undici",
    "hono",
    "@hono/node-server",
    "fsevents",
    "bun:sqlite",
    "node:sqlite"
  ],
  banner: {
    js: `import { createRequire as __createRequire } from "node:module";\nconst require = __createRequire(import.meta.url);`
  }
});

console.log("✅ Bundled successfully into dist/server.js");
