import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "./src/components"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@modules": path.resolve(__dirname, "./src/modules"),
      "@services": path.resolve(__dirname, "./src/services"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@stores": path.resolve(__dirname, "./src/stores"),
      "@types": path.resolve(__dirname, "./src/types/index.ts"),
      "@utils": path.resolve(__dirname, "./src/utils"),
    },
  },
  server: {
    port: 5173,
    host: true,
    strictPort: false,
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      ".ngrok-free.dev",
      ".ngrok.io",
      "*.railway.app",
      "*.ngrok.io",
      "*.ngrok-free.dev",
      "*.ngrok.com",
      "*.ngrok.me",
      "*.ngrok.net",
      "*.ngrok.org",
      "*.ngrok.io",
      "*.ngrok-free.dev",
    ],
  },
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});
