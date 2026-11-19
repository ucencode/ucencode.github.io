import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).optional().default([]),
    draft: z.boolean().optional().default(false),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    /** Position on the homepage and in prev/next navigation, ascending. */
    order: z.number(),
    /** Card preview image; `src` is relative to the Markdown file, inside `src/assets/projects/`. */
    image: z.object({ src: image(), alt: z.string() }).optional(),
    projectStack: z.array(z.string()),
    links: z.array(z.object({ label: z.string(), url: z.url() })).optional().default([]),
  }),
});

export const collections = { blog, projects };
