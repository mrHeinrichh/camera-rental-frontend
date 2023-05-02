import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "url";

const srcPath = fileURLToPath(new URL("./src", import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": srcPath,
      // "@components": `${srcPath}/components`,
      // "@features": `${srcPath}/features`,
      // "@api": `${srcPath}/app/api`,
    },
  },
  server: {
    port: 6969,
  },
});
