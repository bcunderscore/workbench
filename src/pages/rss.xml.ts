import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPublished } from '../lib/content';

export async function GET(context: APIContext) {
  const posts = await getPublished('posts');

  return rss({
    title: 'Bryce Campbell — Writing',
    description: 'Build logs and notes on software, keyboards, CAD, PCB design, and 3D printing.',
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/writing/${post.id}/`,
    })),
  });
}
