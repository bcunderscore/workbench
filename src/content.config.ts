import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Drafts live in each collection's gitignored drafts/ folder, so they never reach the public
// repo or a Vercel build. The id drops the folder, so a draft keeps its URL once published.
const collection = (name: string) =>
  glob({
    pattern: ['*.{md,mdx}', 'drafts/*.{md,mdx}', '!_*', '!drafts/_*'],
    base: `./src/content/${name}`,
    generateId: ({ entry }) => entry.replace(/^drafts\//, '').replace(/\.mdx?$/, ''),
  });

export const PROJECT_CATEGORIES = ['software', 'keyboard', 'cad', 'pcb', '3d-printing'] as const;

const projects = defineCollection({
  loader: collection('projects'),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      categories: z.array(z.enum(PROJECT_CATEGORIES)).min(1),
      date: z.coerce.date(),
      draft: z.boolean().default(false),
      featured: z.boolean().default(false),
      status: z.enum(['active', 'completed', 'shelved']).default('active'),
      links: z
        .object({
          repo: z.url().optional(),
          live: z.url().optional(),
        })
        .optional(),
      cover: image().optional(),
      gallery: z.array(image()).default([]),
      specs: z.record(z.string(), z.string()).optional(),
    }),
});

const posts = defineCollection({
  loader: collection('posts'),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      draft: z.boolean().default(false),
      featured: z.boolean().default(false),
      tags: z.array(z.string()).default([]),
      cover: image().optional(),
      project: reference('projects').optional(),
    }),
});

export const collections = { projects, posts };
