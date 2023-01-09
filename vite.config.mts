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
    dir: pn("./"),
  });
  const first = await res.next();
  const pkg = first.value;
  const properties = pkg.properties;
  const base = process.env.CF_PAGES ? "/" : properties["http.path"];
  const api = "https://api.konsumation.workers.dev/";
  const production = mode === "production";

  let frontend = properties["http.origin"] + properties["http.path"];
  let backend = properties["http.origin"] + properties["http.api.path"];
  let rewrite = (path) => path.substring(api.length);

  if (
    !production &&
    // hack
    process.arch !== "arm64"
  ) {
    mkdirSync("build/db", { recursive: true });
    const konsum = execFile(
      "node",
      [
        "node_modules/@konsumation/konsum/src/konsum-cli.mjs",
        "-c",
        "tests/config",
        "start",
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

  console.log("#####set vite variables done", api)
  const open = process.env.CI ? {} : { open: true };

  return {
    root: "src",
    base,
    worker: { format: "es" },
    plugins: [
      svelte({
        compilerOptions: {
          dev: !production,
        },
      }),
    ],
    optimizeDeps: {
      exclude: [
        ...Object.keys(pkg.dependencies).filter((d) => d.startsWith("svelte")),
      ],
    },

    build: {
      outDir: "../build",
      target: "esnext",
      emptyOutDir: true,
      minify: production,
      sourcemap: true,
    },

    server: {
      host: true,
      ...open,
      proxy: {
        [api]: {
          target: "https://api.konsumation.workers.dev/",
          rewrite,
        },
      },
    },
  };
});
