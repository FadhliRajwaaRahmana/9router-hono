import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export async function resolve(specifier, context, nextResolve) {
  try {
    return await nextResolve(specifier, context);
  } catch (err) {
    if (err.code === "ERR_MODULE_NOT_FOUND" || err.code === "ERR_UNSUPPORTED_DIR_IMPORT") {
      const parentURL = context.parentURL;
      if (parentURL && parentURL.startsWith("file:")) {
        const parentPath = fileURLToPath(parentURL);
        const parentDir = path.dirname(parentPath);

        let targetPath = null;
        if (specifier.startsWith("./") || specifier.startsWith("../")) {
          targetPath = path.resolve(parentDir, specifier);
        } else if (specifier.startsWith("@/")) {
          const rootDir = path.resolve(parentDir, "..");
          targetPath = path.resolve(rootDir, "src", specifier.slice(2));
        }

        if (targetPath) {
          if (fs.existsSync(`${targetPath}.js`)) {
            return { url: pathToFileURL(`${targetPath}.js`).href, format: "module", shortCircuit: true };
          }
          if (fs.existsSync(path.join(targetPath, "index.js"))) {
            return { url: pathToFileURL(path.join(targetPath, "index.js")).href, format: "module", shortCircuit: true };
          }
        }
      }

      // Also handle node_modules resolution with missing .js
      if (specifier.includes("/node_modules/")) {
        // try appending .js
      }
    }
    throw err;
  }
}
