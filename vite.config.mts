import { mkdirSync, readFileSync } from "fs";
import { execFile } from "child_process";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";
import { extractFromPackage } from "npm-pkgbuild";
import { fileURLToPath } from "url";

function pn(path) {
  return fileURLToPath(new URL(path, import.meta.url));
}

const encodingOptions = { encoding: "utf8" };

export default defineConfig(async ({ command, mode }) => {
  const res = extractFromPackage({
    dir: pn("./")
  });
  const first = await res.next();
  const pkg = first.value;
  const properties = pkg.properties;
  const base = properties["http.path"] + "/";
  const api = properties["http.api.path"];
  const production = mode === "production";

  let target = "http://localhost:12345";

  if (!production) {
    mkdirSync("build/db", { recursive: true });
    const konsum = execFile(
      "node",
      [
        "node_modules/@konsumation/konsum/src/konsum-cli.mjs",
        "-c",
        "tests/config",
        "start"
      ],
      (error, stdout, stderr) => console.log(error, stdout, stderr)
    );

    const { http } = JSON.parse(
      readFileSync("tests/config/config.json", encodingOptions)
    );

    target = `http://localhost:${http.port}/`;
  }

  process.env["VITE_API"] = api;
  process.env["VITE_NAME"] = properties.name;
  process.env["VITE_DESCRIPTION"] = properties.description;
  process.env["VITE_VERSION"] = properties.version;

  const open = process.env.CI ? {} : { open: target };

  return {
    root: "src",
    base,
    worker: { format: "es" },
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
      target: "esnext",
      emptyOutDir: true,
      minify: production,
      sourcemap: true
    },

    server: {
      host: true,
      ...open,
      proxy: {
        [api]: {
          target,
          rewrite: path => path.substring(api.length)
        }
      }
    }
  };
});
