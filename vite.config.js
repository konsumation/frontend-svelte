import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const production = mode === "production";

  return {
    root: "src",
    base: "/services/konsum/",

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
        "/api": {
          target: "http://localhost:12345",
          rewrite: path => path.replace(/^\/api/, "")
        }
      }
    },

    define: {
      api: JSON.stringify("/services/konsum/api"),
      base: JSON.stringify("/services/konsum"),
      proxyTarget: JSON.stringify("http://localhost:12345"),
      title: JSON.stringify("Konsum"),
      version: JSON.stringify("1.2.3")
    }
  };
});
