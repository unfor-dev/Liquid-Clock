import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ["three"],
          vendor: ["react", "react-dom"],
          drei: ["@react-three/drei"],
        },
      },
    },
  },
  server: {
    host: true,
    port: 5173,
  },
});
