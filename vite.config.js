import { readFile } from "fs/promises";
import { mkdirSync, readFileSync } from "fs";
import { execFile } from "child_process";

import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vitejs.dev/config/
export default defineConfig(async ({ command, mode }) => {
  const pkg = JSON.parse(
    await readFile(new URL("package.json", import.meta.url).pathname, {
      encoding: "utf8"
    })
  );

  const production = mode === "production";
  let target = "http://localhost:12345";

  if (!production) {
    mkdirSync("build/db", { recursive: true });
    const konsum = execFile(
      "node",
      ["node_modules/konsum/src/konsum-cli.mjs", "-c", "tests/config", "start"],
      (error, stdout, stderr) => {
        console.log(error, stdout, stderr);
      }
    );
  
    const { http } = JSON.parse(
      readFileSync("tests/config/config.json", { endoding: "utf8" })
    );
  
    target = `http://localhost:${http.port}/`;
  }
  
  const base = "/services/konsum/";
  const api = `${base}api`;

  process.env["VITE_API"] = api;
  process.env["VITE_NAME"] = pkg.name;
  process.env["VITE_DESCRIPTION"] = pkg.description;
  process.env["VITE_VERSION"] = pkg.version;

  return {
    root: "src",
    base,

    plugins: [
      svelte({
        compilerOptions: {
          dev: !production
        }
      })
    ],
    optimizeDeps: {
      exclude: [
        ...Object.keys(pkg.dependencies).filter(d => d.startsWith("svelte"))
      ]
    },

    build: {
      outDir: "../build",
      minify: production
    },

    server: {
      proxy: {
        [api]: {
          target,
          rewrite: path => path.substring(api.length)
        }
      }
    }
  };
});
