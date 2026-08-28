import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  server: {
    port: 5173,  // Frontend chạy trên port 5173 (Backend chạy trên port 8000)
    host: '127.0.0.1',
    
    // Proxy API requests tới backend (port 8000)
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      },
      // Proxy cho Ollama (AI engine) nếu cần
      '/ollama': {
        target: 'http://127.0.0.1:11434',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/ollama/, ''),
      },
    },

    // Watch optimization
    watch: {
      ignored: ['**/node_modules/**'],
    },
  },
})
