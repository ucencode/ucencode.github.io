import { readdirSync, readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import rehypeFigure from './src/lib/rehype-figure.mjs';

// Sitemap lastmod: a blog post uses its pubDate, every other page the build date.
const blogDir = new URL('./src/content/blog/', import.meta.url);
const postDates = Object.fromEntries(
  readdirSync(blogDir)
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const match = readFileSync(new URL(file, blogDir), 'utf8').match(/^pubDate:\s*(\S+)/m);
      return [file.replace(/\.md$/, ''), match ? new Date(match[1]) : null];
    }),
);
const buildDate = new Date();

export default defineConfig({
  site: 'https://ucencode.github.io',
  output: 'static',
  build: {
    assets: 'assets',
  },
  markdown: {
    rehypePlugins: [rehypeFigure],
  },
  integrations: [
    react(),
    sitemap({
      serialize(item) {
        const slug = item.url.match(/\/blog\/([^/]+)\/$/)?.[1];
        item.lastmod = (postDates[slug ?? ''] ?? buildDate).toISOString();
        return item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': new URL('./src', import.meta.url).pathname,
      },
    },
  },
});
