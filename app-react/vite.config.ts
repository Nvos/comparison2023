import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      fileName: 'app',
      entry: './src/main.tsx',
      formats: ['es']
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        name: 'app',
      }
    },
  },
  // build: {
  //   lib: {
  //     fileName: 'app',
  //     entry: './src/main.tsx',
  //     formats: ['es']
  //   },
  //   minify: false,
  //   rollupOptions: {
  //     external: ['react', 'react-dom'],
  //   },
  // },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
})
