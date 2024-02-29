import { readFileSync } from "fs";
import { build } from "esbuild";
const [majorNodeVersion] = readFileSync(".nvmrc", "utf-8").trim().split(".");

(async () => {
  try {
    await build({
      entryPoints: ["src/handler.ts"],
      bundle: true,
      minify: true,
      sourcemap: false,
      logLevel: "info",
      platform: "node",
      target: `node${majorNodeVersion}`,
      outfile: "handler.js",
    });

    console.log("\x1b[36m%s\x1b[0m", "\nProject compiled successfully.");
  } catch {
    process.exit(1);
  }
})();
