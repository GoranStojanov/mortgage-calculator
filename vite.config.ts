import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages project site base path:
  // https://ubuntu-apps.github.io/mortgage-calculator/
  base: '/mortgage-calculator/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png'],
      manifest: {
        name: 'Mortgage Calculator',
        short_name: 'Mortgage',
        description: 'Calculate your monthly mortgage payment',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        scope: '/mortgage-calculator/',
        start_url: '/mortgage-calculator/',
        orientation: 'portrait',
        icons: [
          {
            // Relative to manifest location, resolves to /mortgage-calculator/icons/icon-192.png
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})
