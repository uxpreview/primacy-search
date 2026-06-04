import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  // GitHub Pages serves from a /<repo>/ subpath; Vercel + local serve from root.
  base: process.env.DEPLOY_TARGET === "gh-pages" ? "/primacy-search/" : "/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
