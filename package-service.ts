import { readFileSync } from "fs";
import { build } from "esbuild";
import copyFiles from 'copyfiles';
const [majorNodeVersion] = readFileSync(".nvmrc", "utf-8").trim().split(".");

(async () => {
  try {
    await build({
      entryPoints: [
          "src/handler.ts",
          "src/functions/*.ts"
      ],
      bundle: true,
      minify: false,
      sourcemap: false,
      logLevel: "info",
      platform: "node",
      target: `node${majorNodeVersion}`,
      outdir: 'dist',
    });

    console.log("\x1b[36m%s\x1b[0m", "\nProject compiled successfully.");
  } catch {
    process.exit(1);
  }

  try {
    copyFiles(['src/config/config.yml', 'dist/config/'], { up: true }, (error) => {
      if (error) {
        throw error;
      }
      console.log('\x1b[36m%s\x1b[0m', '\nConfig YML copied successfully.');
    });
  } catch (error) {
    console.error('Failed to copy YML config:', error);
    process.exit(1);
  }
})();
