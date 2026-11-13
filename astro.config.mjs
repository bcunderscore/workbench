// @ts-check
import { defineConfig, envField } from 'astro/config';
import mdx from '@astrojs/mdx';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://brycecampbell.com',
  integrations: [mdx()],
  // Pages stay prerendered; only routes with `prerender = false` (the contact API) run as functions.
  adapter: vercel(),
  env: {
    schema: {
      RESEND_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
  markdown: {
    shikiConfig: { theme: 'github-dark-default' },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
