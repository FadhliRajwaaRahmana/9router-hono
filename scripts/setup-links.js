import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const nm = path.join(root, "node_modules");

if (fs.existsSync(nm)) {
  const openSseTarget = path.join(root, "open-sse");
  const openSseLink = path.join(nm, "open-sse");
  if (!fs.existsSync(openSseLink) && fs.existsSync(openSseTarget)) {
    try {
      fs.symlinkSync(openSseTarget, openSseLink, "junction");
    } catch {}
  }

  const atDir = path.join(nm, "@");
  if (!fs.existsSync(atDir)) {
    fs.mkdirSync(atDir, { recursive: true });
  }

  for (const sub of ["lib", "shared", "sse"]) {
    const target = path.join(root, "src", sub);
    const link = path.join(atDir, sub);
    if (!fs.existsSync(link) && fs.existsSync(target)) {
      try {
        fs.symlinkSync(target, link, "junction");
      } catch {}
    }
  }
}
