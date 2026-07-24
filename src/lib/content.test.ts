import { describe, expect, it } from 'vitest';
import { publishedOnly } from './content';

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
