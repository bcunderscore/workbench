import { getCollection, type CollectionKey } from 'astro:content';

type Draftable = { data: { draft: boolean } };
type Dated = { data: { date: Date } };

/**
 * Drop draft entries. Defaults to including drafts in dev (local preview at
 * real URLs) and excluding them in production builds.
 */
export function publishedOnly<T extends Draftable>(
  entries: T[],
  includeDrafts: boolean = import.meta.env.DEV,
): T[] {
  return includeDrafts ? entries : entries.filter((e) => !e.data.draft);
}

export const newestFirst = (a: Dated, b: Dated): number =>
  b.data.date.getTime() - a.data.date.getTime();

/** The only way pages read a collection: drafts dropped, newest first. */
export async function getPublished<C extends CollectionKey>(collection: C) {
  return publishedOnly(await getCollection(collection)).sort(newestFirst);
}
