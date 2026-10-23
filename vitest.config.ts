/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    include: ['src/**/*.test.ts'],
    // West of UTC, so a date formatted in local time shows up a day early.
    env: { TZ: 'America/Los_Angeles' },
  },
});
