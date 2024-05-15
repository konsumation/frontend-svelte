import { mkdirSync, readFileSync } from "node:fs";
import { execFile } from "node:child_process";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { compression } from "vite-plugin-compression2";
import { defineConfig } from "vite";
import { extractFromPackage } from "npm-pkgbuild";
import { fileURLToPath } from "node:url";

function pn(path) {
  return fileURLToPath(new URL(path, import.meta.url));
}

const encodingOptions = { encoding: "utf8" };

export default defineConfig(async ({ command, mode }) => {
  const res = extractFromPackage(
    {
      dir: pn("./"),
      mode
    },
    process.env
  );

  const first = await res.next();
  const pkg = first.value;
  const properties = pkg.properties;
  const base = properties["http.path"]; // CF_PAGES automatically uses value from mf-hosting-cloudflare
  const api = properties["http.api.path"];
  const production = mode === "production";

  let frontend = properties["http.origin"] + properties["http.path"];
  let backend = properties["http.origin"] + properties["http.api.path"];
  let rewrite = path => path.substring(api.length);

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

    backend = `http://localhost:${http.port}/`;
  }

  process.env["VITE_API"] = api;
  process.env["VITE_NAME"] = properties.name;
  process.env["VITE_DESCRIPTION"] = properties.description;
  process.env["VITE_VERSION"] = properties.version;

  return {
    root: "src",
    base,
    worker: { format: "es" },
    plugins: [
      svelte({
        compilerOptions: {
          dev: !production
        }
      }),
      compression({
        algorithm: "brotliCompress",
        exclude: [
          /\.(br)$/,
          /\.(gz)$/,
          /\.(png)$/,
          /\.(jpg)$/,
          /\.(webp)$/,
          /\.(svg)$/
        ],
        threshold: 500
      })
    ],
    optimizeDeps: {
      exclude: [
        ...Object.keys(pkg.dependencies).filter(d => d.startsWith("svelte"))
      ]
    },

    build: {
      outDir: "../build",
      emptyOutDir: true,
      minify: production,
      sourcemap: true
    },

    server: {
      host: true,
      proxy: {
        [api]: {
          target: backend,
          rewrite
        }
      }
    }
  };
});
