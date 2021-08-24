import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
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
        "svelte-command",
        "svelte-common",
        "svelte-guard-history-router",
        "svelte-session-manager"
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
