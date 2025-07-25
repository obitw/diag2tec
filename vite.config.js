import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // Configuration de base pour le déploiement sur GitHub Pages
  const base = process.env.NODE_ENV === 'production' 
    ? '/diag2tec/' 
    : '/';

  return {
    base,
    plugins: [
      vue(),
      vueDevTools(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    // Configuration du serveur de développement
    server: {
      host: true,
      port: 3000,
      open: true
    },
    // Optimisation pour la production
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      rollupOptions: {
        output: {
          manualChunks: {
            vue: ['vue', 'vue-router'],
          },
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name.split('.');
            const ext = info[info.length - 1];
            if (['png', 'jpg', 'jpeg', 'gif', 'svg'].includes(ext)) {
              return `assets/images/[name]-[hash][extname]`;
            }
            return `assets/${ext}/[name]-[hash][extname]`;
          },
        },
      },
    },
    // Configuration pour le chargement des assets
    assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg'],
    // Configuration pour copier les assets statiques
    publicDir: 'public',
  };
});
