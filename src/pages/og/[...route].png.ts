import { OGImageRoute } from 'astro-og-canvas';
import { getCollection } from 'astro:content';
import { publishedOnly } from '../../lib/content';

const posts = publishedOnly(await getCollection('posts'));
const pages = Object.fromEntries(posts.map((post) => [post.id, post.data]));

export const { getStaticPaths, GET } = await OGImageRoute({
  pages,
  // The route file itself already ends in `.png` (`[...route].png.ts`), so
  // return the raw slug here rather than letting the library append its own
  // `.png` extension — otherwise generated files end up as `*.png.png`.
  getSlug: (path) => path,
  getImageOptions: (_path, page: (typeof pages)[string]) => ({
    title: page.title,
    description: 'brycecampbell.com',
    logo: { path: './src/assets/og/bc-logo.png', size: [220] as [number] },
    bgImage: { path: './src/assets/og/mat-bg.png', fit: 'cover' as const },
    border: { color: [61, 220, 151] as [number, number, number], width: 24, side: 'inline-start' as const },
    padding: 70,
    font: {
      title: {
        color: [233, 234, 236] as [number, number, number],
        size: 64,
        lineHeight: 1.25,
        weight: 'Bold' as const,
        families: ['JetBrains Mono'],
      },
      description: {
        color: [154, 160, 166] as [number, number, number],
        size: 30,
        families: ['JetBrains Mono'],
      },
    },
    fonts: [
      './src/assets/og/fonts/JetBrainsMono-Bold.ttf',
      './src/assets/og/fonts/JetBrainsMono-Regular.ttf',
    ],
  }),
});
