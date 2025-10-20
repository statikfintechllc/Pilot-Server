import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import path from "path";

const projectRoot = process.env.PROJECT_ROOT || import.meta.dirname;
import { defineConfig, PluginOption } from "vite";
import { fileURLToPath, URL } from 'node:url'

const projectRoot = fileURLToPath(new URL('.', import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(projectRoot, 'src')
    }
  },
  server: {
    port: 4173,
    host: '0.0.0.0'
  },
  preview: {
    port: 4174,
    host: '0.0.0.0'
  }
});
