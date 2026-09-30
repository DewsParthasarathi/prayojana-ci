import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 8080,
    allowedHosts: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@layouts": path.resolve(__dirname, "./src/layouts"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@routes": path.resolve(__dirname, "./src/routes"),
      "@store": path.resolve(__dirname, "./src/store"),
      "@data": path.resolve(__dirname, "./src/data"),
    },
  },
});
