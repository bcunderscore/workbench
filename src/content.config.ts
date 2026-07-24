import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ pattern: '*.{md,mdx}', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      category: z.enum(['software', 'keyboard', 'cad', 'pcb', '3d-printing']),
      date: z.coerce.date(),
      featured: z.boolean().default(false),
      status: z.enum(['active', 'completed', 'shelved']).default('active'),
      links: z
        .object({
          repo: z.string().url().optional(),
          live: z.string().url().optional(),
        })
        .optional(),
      cover: image().optional(),
      gallery: z.array(image()).default([]),
      specs: z.record(z.string(), z.string()).optional(),
    }),
});

const posts = defineCollection({
  loader: glob({ pattern: '*.{md,mdx}', base: './src/content/posts' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      featured: z.boolean().default(false),
      tags: z.array(z.string()).default([]),
      cover: image().optional(),
      project: reference('projects').optional(),
    }),
});

export const collections = { projects, posts };
