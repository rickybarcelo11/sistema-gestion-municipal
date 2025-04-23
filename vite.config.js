import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'pages/index.html'),
        arboles: resolve(__dirname, 'pages/arboles.html'),
        tareas: resolve(__dirname, 'pages/tareas.html'),
        trabajadores: resolve(__dirname, 'pages/trabajadores.html'),
        informes: resolve(__dirname, 'pages/informes.html'),
      },
    },
  },
  server: {
    port: 3000,
  },
}) 