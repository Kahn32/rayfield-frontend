import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  root: path.resolve(__dirname), // 👈 frontend root
  base: "./", // 👈 IMPORTANT: allow Vercel to serve static assets correctly
  build: {
    outDir: "dist", // 👈 Ensure output folder is dist
    emptyOutDir: true,
  },
  server: {
    host: "::",
    port: 8080,
    proxy: {
      // 🔥 Forward /api requests to backend server during local dev
      "/api": {
        target: "http://localhost:3000", // backend URL
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // 👈 point to frontend/src
    },
  },
}));