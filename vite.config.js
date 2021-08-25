import { readFile } from "fs/promises";
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

  const base = "/services/konsum/";
  const api = "api";

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
        ...Object.keys(pkg.dependencies).filter(d => d.startsWith('svelte'))
      ]
    },

    build: {
      minify: production
    },

    server: {
      proxy: {
        [`${base}${api}`]: {
          target: "http://localhost:12345",
          rewrite: path => path.replace(/^\/services\/konsum\/api/, "")
        }
      }
    }
  };
});
