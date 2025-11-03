import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: "Miss_Nadya Makeup - Запись к визажисту",
        short_name: "Miss_Nadya Makeup",
        description: "Онлайн запись к профессиональному визажисту",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#ff69b4",
        icons: [
          {
            src: "./icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "./icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp,woff2}'],
        navigateFallback: '/index.html',
      }
    })
  ],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]'
      }
    }
  },
  base: './'
})