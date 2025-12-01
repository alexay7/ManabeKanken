import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import svgr from "vite-plugin-svgr";
import tanstackRouter from "@tanstack/router-plugin/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
      react(),
    tailwindcss(),
    svgr()
  ],
    server:{
      allowedHosts: ['localhost',"7342e0b7cba0.ngrok-free.app"]
    },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
