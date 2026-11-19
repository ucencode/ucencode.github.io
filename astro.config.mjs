import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import rehypeFigure from './src/lib/rehype-figure.mjs';

export default defineConfig({
  site: 'https://ucencode.github.io',
  output: 'static',
  build: {
    assets: 'assets',
  },
  markdown: {
    rehypePlugins: [rehypeFigure],
  },
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': new URL('./src', import.meta.url).pathname,
      },
    },
  },
});
