import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api': {
        target: 'https://study-material-backend.fly.dev',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path
      }
    },
  },
  preview: {
    host: "0.0.0.0",
    port: 5000,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  
  // ===== OPTIMIZED BUILD SETTINGS =====
  build: {
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production', // Remove console.logs in production
        drop_debugger: true,
      },
    },
    
    // Optimize chunk splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react', '@radix-ui/react-toast', '@radix-ui/react-tooltip'],
          'gsap-vendor': ['gsap'],
          'query-vendor': ['@tanstack/react-query'],
        },
      },
    },
    
    // Increase chunk size warning limit (optional)
    chunkSizeWarningLimit: 1000,
    
    // Enable source maps only in dev
    sourcemap: mode === 'development',
  },
  
  // ===== OPTIMIZED CSS SETTINGS =====
  css: {
    devSourcemap: mode === 'development',
  },
}));