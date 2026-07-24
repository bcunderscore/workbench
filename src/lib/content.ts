type Draftable = { data: { draft: boolean } };

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
