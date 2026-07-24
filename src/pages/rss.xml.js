import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { publishedOnly } from '../lib/content';

export async function GET(context) {
  const posts = publishedOnly(await getCollection('posts')).sort(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime(),
  );

  return rss({
    title: 'Bryce Campbell — Writing',
    description: 'Build logs and notes on software, keyboards, CAD, PCB design, and 3D printing.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/writing/${post.id}/`,
    })),
  });
}
