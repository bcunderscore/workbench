import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { publishedOnly } from '../lib/content';

const STATIC_PAGES = ['/', '/projects/', '/writing/', '/about/', '/uses/'];

export async function GET(context: APIContext) {
  const projects = publishedOnly(await getCollection('projects'));
  const posts = publishedOnly(await getCollection('posts'));

  const entries = [
    ...STATIC_PAGES.map((path) => ({ path, lastmod: undefined })),
    ...projects.map((p) => ({ path: `/projects/${p.id}/`, lastmod: p.data.date })),
    ...posts.map((p) => ({ path: `/writing/${p.id}/`, lastmod: p.data.date })),
  ];

  const urls = entries.map(({ path, lastmod }) => {
    const loc = `<loc>${new URL(path, context.site)}</loc>`;
    return `  <url>${loc}${lastmod ? `<lastmod>${lastmod.toISOString().slice(0, 10)}</lastmod>` : ''}</url>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
}
