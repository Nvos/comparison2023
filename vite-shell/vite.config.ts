import { defineConfig, Plugin } from 'vite';



// https://vitejs.dev/config/
export default defineConfig({
  // resolve: {
  //   alias: {
  //     'app-react': 'http://localhost:7000/app-react/app.js'
  //   }
  // },
  resolve: {
    alias: [{find: /^@app\/(.*)/, replacement: 'http://localhost:7000/app-$1/app.js'}]
    // alias: {
      // '@app/react': 'http://localhost:7000/app-react/app.js'
    // }
  },
  build: {
    rollupOptions: {
      external: ['react', 'react-dom', 'app-react'],
    },
  },
  server: {
    port: 3000,
  },
  preview:{
    port: 3000,
  }
})
