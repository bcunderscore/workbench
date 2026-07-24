import { describe, expect, it } from 'vitest';
import { buildActivity } from './activity';

const project = (id: string, date: string, categories = ['software']) => ({
  id,
  data: { title: `Project ${id}`, description: `About ${id}`, date: new Date(date), categories },
});

const post = (id: string, date: string) => ({
  id,
  data: { title: `Post ${id}`, description: `About ${id}`, date: new Date(date) },
});

describe('buildActivity', () => {
  it('merges projects and posts sorted newest first', () => {
    const items = buildActivity([project('a', '2026-01-01')], [post('b', '2026-03-01')]);
    expect(items.map((i) => i.title)).toEqual(['Post b', 'Project a']);
  });

  it('maps urls and labels per type, using the first category as the label', () => {
    const items = buildActivity(
      [project('keeb', '2026-01-01', ['keyboard', '3d-printing'])],
      [post('log', '2025-01-01')],
    );
    expect(items[0]).toMatchObject({ type: 'project', url: '/projects/keeb/', label: 'keyboard' });
    expect(items[1]).toMatchObject({ type: 'post', url: '/writing/log/', label: 'writing' });
  });

  it('applies the limit after merging', () => {
    const projects = [project('a', '2026-01-01'), project('b', '2026-01-02')];
    const posts = [post('c', '2026-01-03')];
    expect(buildActivity(projects, posts, 2).map((i) => i.title)).toEqual(['Post c', 'Project b']);
  });

  it('returns an empty array for empty inputs', () => {
    expect(buildActivity([], [])).toEqual([]);
  });
});
