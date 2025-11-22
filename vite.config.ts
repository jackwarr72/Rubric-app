import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    base: './', // Ensures assets are loaded correctly on GitHub Pages
    define: {
      // Maps the VITE_API_KEY from .env to process.env.API_KEY in the code
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY)
    }
  };
});