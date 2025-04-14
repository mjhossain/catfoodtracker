import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    host: true, // Listen on all addresses
    hmr: true, // Enable hot module replacement
    cors: true, // Enable CORS for all origins
    // Allow the specific Replit domain
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '0.0.0.0'
    ],
    // No proxy needed for our setup
    proxy: null,
  },
});