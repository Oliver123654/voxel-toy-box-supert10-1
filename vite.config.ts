import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import netlify from "@netlify/vite-plugin";

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const options = {
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
      '/api': {
        target: mode=='development' ? 'http://localhost:8888' : 'https://voxeltoybox.netlify.app/', // Backend server
        changeOrigin: true, // Ensure the request appears to come from the frontend server
      },
    },
      },
      plugins: [react(), netlify()],
      define: {
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.OPENROUTER_API_KEY': JSON.stringify(env.OPENROUTER_API_KEY),
        'process.env.OPENROUTER_MODEL': JSON.stringify(env.OPENROUTER_MODEL),
        'process.env.GITHUB_TOKEN': JSON.stringify(env.GITHUB_TOKEN),
        'process.env.API_BASE_URL': JSON.stringify(env.API_BASE_URL),

        'process.env.SERVER_MODE': JSON.stringify(env.SERVER_MODE),

      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
          model: "/model",
          utils: "/utils"

        }
      }
    };
    return options
});
