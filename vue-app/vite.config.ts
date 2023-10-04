import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  base: '', 
  plugins: [vue()],
  build: {
    outDir: "../public",
    rollupOptions: {
      output: {
        manualChunks: undefined,
        inlineDynamicImports: false,
        entryFileNames: 'assets/[name].js',   
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
  server: {
    port: 3000,
    open: true,
    cors: true,
  }
});
