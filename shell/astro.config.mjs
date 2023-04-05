import { defineConfig } from 'astro/config';
import react from "@astrojs/react";
import svelte from "@astrojs/svelte";

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  output: 'server',
  integrations: [
    react(),
     svelte(),
    {
    name: 'importmap-externals',
    hooks: {
      'astro:build:setup': ({
        vite,
        target
      }) => {
        vite.build.rollupOptions["external"] = ['react', 'react-dom'];
      }
    }
  }
],
vite: {
  ssr: {
    format: 'esm',
    external: ['app-react', 'app-svelte', 'react', 'react-dom'],
  }
},
  // vite: {
  //   build: {
  //     rollupOptions: {
  //       external: ['react-app', 'svelte-app', 'react', 'react-dom', 'react-dom-router'],
  //     }
  //   }
  // },
  adapter: node({
    mode: "standalone"
  })
});