import { describe, expect, it } from 'vitest';
import css from '../styles/global.css?raw';
import { THEME_COLORS } from './theme';

describe('THEME_COLORS', () => {
  it.each(Object.entries(THEME_COLORS))('matches the %s theme background', (theme, color) => {
    const block = css.match(new RegExp(`:root\\[data-theme='${theme}'\\] \\{([^}]*)\\}`))?.[1];
    expect(block?.match(/--bg:\s*([^;]+);/)?.[1]).toBe(color);
  });
});
