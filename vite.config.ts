import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import Terminal from "vite-plugin-terminal";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      vue(),
      tailwindcss(),
      mode === "development" &&
        Terminal({
          console: "terminal",
          output: ["terminal", "console"],
        }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      allowedHosts: [env.VITE_PREVIEW_HOST],
    },
  };
});
