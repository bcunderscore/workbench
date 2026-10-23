import { describe, expect, it } from 'vitest';
import { newestFirst, publishedOnly } from './content';

const entry = (id: string, draft: boolean) => ({ id, data: { draft } });

describe('publishedOnly', () => {
  it('filters out drafts when includeDrafts is false', () => {
    const entries = [entry('live', false), entry('wip', true)];
    expect(publishedOnly(entries, false).map((e) => e.id)).toEqual(['live']);
  });

  it('keeps drafts when includeDrafts is true (dev preview)', () => {
    const entries = [entry('live', false), entry('wip', true)];
    expect(publishedOnly(entries, true).map((e) => e.id)).toEqual(['live', 'wip']);
  });

  it('returns an empty array for empty input', () => {
    expect(publishedOnly([], false)).toEqual([]);
  });
});

describe('newestFirst', () => {
  it('orders entries by date, newest first', () => {
    const dated = (id: string, date: string) => ({ id, data: { date: new Date(date) } });
    const entries = [dated('mid', '2026-05-01'), dated('old', '2025-01-01'), dated('new', '2026-09-30')];
    expect(entries.sort(newestFirst).map((e) => e.id)).toEqual(['new', 'mid', 'old']);
  });
});

describe('collection access', () => {
  it('goes through getPublished, so drafts never reach a production page', () => {
    const sources = import.meta.glob<string>(['/src/**/*.{astro,ts,mdx}', '!/src/lib/content.ts', '!/src/**/*.test.ts'], {
      query: '?raw',
      import: 'default',
      eager: true,
    });
    const offenders = Object.keys(sources).filter((path) => sources[path].includes('getCollection('));
    expect(offenders, 'use getPublished() from src/lib/content.ts').toEqual([]);
  });
});
