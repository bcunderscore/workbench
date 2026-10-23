import { describe, expect, it } from 'vitest';
import { formatFull, formatLong, formatShort } from './dates';

describe('date formatting west of UTC', () => {
  it('formatShort keeps the frontmatter day', () => {
    expect(formatShort(new Date('2026-03-01'))).toBe('Mar 1, 2026');
  });

  it('formatLong keeps the frontmatter month', () => {
    expect(formatLong(new Date('2026-03-01'))).toBe('March 2026');
  });

  it('formatFull keeps the frontmatter day across a year boundary', () => {
    expect(formatFull(new Date('2027-01-01'))).toBe('January 1, 2027');
  });
});
