import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// En desarrollo, todo lo que empiece con /api se reenvía al backend de Spring Boot.
// Así el navegador cree que frontend y backend son el mismo origen y no hay problemas de CORS.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'http://localhost:8080', changeOrigin: true },
    },
  },
})
