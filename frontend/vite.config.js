import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // Izinkan akses dari Docker Network (0.0.0.0)
    strictPort: true,
    port: 5173,
    watch: {
      usePolling: true, // PENTING untuk Windows: Agar hot-reload jalan
    },
  },
});
