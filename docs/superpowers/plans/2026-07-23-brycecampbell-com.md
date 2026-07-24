# brycecampbell.com Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy brycecampbell.com — a static portfolio + blog ("workbench") with a cutting-mat design system, projects and posts content collections, and adaptive project pages.

**Architecture:** Fully static Astro site (v7 as installed). Two content collections (`projects`, `posts`) with zod-typed frontmatter drive every page. Theming is CSS custom properties switched by a `data-theme` attribute ("Black Mat" default, "Green Mat" alternate) with a no-flash inline script. One pure TypeScript utility (`buildActivity`) merges collections for the homepage stream and is unit-tested with vitest; everything else is verified by `astro check` + production builds + grep on `dist/`.

**Tech Stack:** Astro ^7 (resolved 7.1.3 at install), Tailwind CSS ^4 (via `@tailwindcss/vite`), MDX (`@astrojs/mdx`), `@astrojs/rss`, TypeScript (strict), vitest, Vercel.

**Spec:** `docs/superpowers/specs/2026-07-23-brycecampbell-com-design.md`

## Global Constraints

- Repo root: `/Users/brycecampbell/Development/brycecampbell.com` (git repo already initialized, branch `main`). All paths below are relative to it.
- Node >= 22 (already installed — KeebStudio requires it).
- `site: 'https://brycecampbell.com'` in Astro config; fully static output, no adapters, no backend, no forms.
- Dependencies limited to: `astro`, `@astrojs/mdx`, `@astrojs/rss`, `tailwindcss`, `@tailwindcss/vite`, and dev deps `@astrojs/check`, `typescript`, `vitest`. Do not add other libraries (no typography plugin, no lightbox, no analytics).
- Project categories are exactly: `software | keyboard | cad | pcb | 3d-printing` (3d-printing added at Bryce's request during Task 11).
- Theme names are exactly `black` (default for all visitors, regardless of system preference) and `green`; persisted under the localStorage key `theme`.
- Accent green (Black Mat): `#3ddc97`. Green Mat base gradient: `#0f8a5f → #2ebd85 → #49d19c`.
- Monospace for labels/nav/specs, sans-serif for body — system font stacks only, no webfont files.
- No placeholder content ships: every content file is real. Content requiring Bryce's input (keyboard build, /uses gear list) is gathered in Task 11 — do not invent specs, gear, or dates.
- Internal links use trailing slashes (`/projects/`, `/writing/foo/`) to match Astro's default `directory` build format.
- Design reference photos live in `docs/design-refs/` (Work Louder cutting mats, angled + flat). The mat's visual vocabulary — grid with major/minor lines, edge rulers, corner label block, angle guides, dotted grid — is the approved decoration palette. Use it sparingly; grid + ruler + label block are in scope now, angle guides/dotted grid are future polish, not v1.
- Every task ends with a commit. Run all commands from the repo root.

## File Structure

```
astro.config.mjs             Astro config: site, MDX, Tailwind vite plugin, shiki
package.json / tsconfig.json / vitest.config.ts / .gitignore
public/favicon.svg           BC_ mark
src/styles/global.css        Tailwind import, theme tokens, mat texture, mdx-body styles
src/content.config.ts        projects + posts collections (zod schemas)
src/content/projects/*.mdx   project entries
src/content/posts/*.mdx      blog posts
src/lib/activity.ts          buildActivity() — merge/sort/limit for homepage stream
src/lib/activity.test.ts     vitest unit tests
src/layouts/BaseLayout.astro html shell, meta/OG, no-flash theme script
src/components/Nav.astro     BC_ logo, section links, ThemeToggle
src/components/ThemeToggle.astro
src/components/Footer.astro  links row + ruler-tick strip
src/components/ProjectCard.astro
src/components/ActivityList.astro
src/components/SpecSheet.astro
src/components/GalleryGrid.astro
src/pages/index.astro        hybrid homepage
src/pages/projects/index.astro    grid + filter chips
src/pages/projects/[slug].astro   adaptive detail page
src/pages/writing/index.astro
src/pages/writing/[slug].astro
src/pages/about.astro
src/pages/uses.astro         (Task 11 — needs Bryce's input)
src/pages/rss.xml.js
src/pages/404.astro
src/assets/                  project photos (Task 11)
```

---

### Task 1: Project Scaffold

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`, `public/favicon.svg`, `src/styles/global.css`, `src/pages/index.astro`

**Interfaces:**
- Produces: working `npm run build` / `npm run check`; `src/styles/global.css` exists for Task 2 to extend; scripts `dev|build|preview|check|test|astro`.

- [ ] **Step 1: Write `package.json`**

```json
{
  "name": "brycecampbell.com",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "test": "vitest run",
    "astro": "astro"
  }
}
```

- [ ] **Step 2: Install dependencies**

Run:
```bash
npm install astro @astrojs/mdx @astrojs/rss tailwindcss @tailwindcss/vite
npm install -D @astrojs/check typescript vitest
```
Expected: installs succeed; `package.json` gains dependency entries (astro resolved to ^7 — plan originally said 6; v7 verified working).

- [ ] **Step 3: Write config files**

`astro.config.mjs`:
```js
// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://brycecampbell.com',
  integrations: [mdx()],
  markdown: {
    shikiConfig: { theme: 'github-dark-default' },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
```

`tsconfig.json`:
```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

`.gitignore`:
```
node_modules/
dist/
.astro/
.vercel/
.superpowers/
.DS_Store
```

- [ ] **Step 4: Write minimal styles, favicon, and index page**

`src/styles/global.css`:
```css
@import "tailwindcss";
```

`public/favicon.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="6" fill="#3ddc97"/><text x="32" y="43" font-family="ui-monospace,Menlo,monospace" font-size="24" font-weight="700" text-anchor="middle" fill="#101112">BC_</text></svg>
```

`src/pages/index.astro`:
```astro
---
import '../styles/global.css';
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Bryce Campbell</title>
  </head>
  <body>
    <h1 class="text-2xl font-bold">Workbench under construction</h1>
  </body>
</html>
```

- [ ] **Step 5: Verify build**

Run: `npm run build && ls dist/index.html`
Expected: build succeeds, `dist/index.html` listed.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: scaffold Astro 6 + Tailwind 4 + MDX project"
```

---

### Task 2: Cutting Mat Theme System + BaseLayout

**Files:**
- Modify: `src/styles/global.css` (replace entirely with version below)
- Create: `src/layouts/BaseLayout.astro`
- Modify: `src/pages/index.astro` (replace entirely)

**Interfaces:**
- Consumes: `src/styles/global.css` from Task 1.
- Produces: `BaseLayout` with props `{ title: string; description: string }` and a default slot — every later page imports it from `../layouts/BaseLayout.astro` (or `../../` from subdirectories). Tailwind color utilities available everywhere: `ink, muted, accent, accent-ink, surface, surface-border, surface-text, surface-muted, surface-accent, rule`. CSS classes `.mdx-body` (long-form content) and theme tokens `--ruler-bg/--ruler-border/--ruler-text` (used by Task 3's footer). Layout renders `<Nav />`/`<Footer />` **only after Task 3** — in this task leave the two placeholder HTML comments shown below where they will go.

- [ ] **Step 1: Replace `src/styles/global.css`**

```css
@import "tailwindcss";

/* ---------- Cutting-mat themes ----------
   Black Mat is the default (also for no-JS visitors via :root fallback).
   Green Mat is the flip side, toggled via data-theme on <html>. */
:root,
:root[data-theme='black'] {
  --bg: #1a1b1d;
  --bg-layer: none;
  --grid-minor: rgba(255, 255, 255, 0.045);
  --grid-major: rgba(255, 255, 255, 0.1);
  --text: #e9eaec;
  --muted-c: #9aa0a6;
  --accent-c: #3ddc97;
  --accent-ink-c: #101112;
  --surface-c: #212326;
  --surface-border-c: #34373b;
  --surface-text-c: #e9eaec;
  --surface-muted-c: #9aa0a6;
  --surface-accent-c: #3ddc97;
  --rule-c: #34373b;
  --ruler-bg: #141517;
  --ruler-border: #2a2c2f;
  --ruler-text: #6a6f75;
}

:root[data-theme='green'] {
  --bg: #2ebd85;
  --bg-layer: linear-gradient(135deg, #0f8a5f 0%, #2ebd85 55%, #49d19c 100%);
  --grid-minor: rgba(255, 255, 255, 0.14);
  --grid-major: rgba(255, 255, 255, 0.35);
  --text: #ffffff;
  --muted-c: rgba(255, 255, 255, 0.85);
  --accent-c: #ffffff;
  --accent-ink-c: #0f8a5f;
  --surface-c: rgba(255, 255, 255, 0.94);
  --surface-border-c: rgba(255, 255, 255, 0.94);
  --surface-text-c: #1e2a25;
  --surface-muted-c: #5b6660;
  --surface-accent-c: #0f8a5f;
  --rule-c: rgba(255, 255, 255, 0.4);
  --ruler-bg: rgba(255, 255, 255, 0.16);
  --ruler-border: rgba(255, 255, 255, 0.4);
  --ruler-text: rgba(255, 255, 255, 0.9);
}

/* Map tokens into Tailwind v4 utilities (text-ink, bg-surface, border-rule, …) */
@theme inline {
  --color-ink: var(--text);
  --color-muted: var(--muted-c);
  --color-accent: var(--accent-c);
  --color-accent-ink: var(--accent-ink-c);
  --color-surface: var(--surface-c);
  --color-surface-border: var(--surface-border-c);
  --color-surface-text: var(--surface-text-c);
  --color-surface-muted: var(--surface-muted-c);
  --color-surface-accent: var(--surface-accent-c);
  --color-rule: var(--rule-c);
}

/* Mat surface: base color + optional gradient on <html>, grid lines on <body>.
   Fine grid every 20px, heavier major line every 100px — pure CSS, no images. */
html {
  background-color: var(--bg);
  background-image: var(--bg-layer);
  background-attachment: fixed;
}

body {
  color: var(--text);
  background-image:
    linear-gradient(var(--grid-major) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-major) 1px, transparent 1px),
    linear-gradient(var(--grid-minor) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-minor) 1px, transparent 1px);
  background-size:
    100px 100px,
    100px 100px,
    20px 20px,
    20px 20px;
}

/* Theme-toggle glyph visibility (used by ThemeToggle component) */
:root[data-theme='black'] [data-when='green'] { display: none; }
:root[data-theme='green'] [data-when='black'] { display: none; }

/* ---------- Long-form MDX content ---------- */
.mdx-body {
  line-height: 1.75;
}
.mdx-body > * + * { margin-top: 1em; }
.mdx-body h2 { margin-top: 2em; font-size: 1.25rem; font-weight: 800; }
.mdx-body h3 { margin-top: 1.5em; font-weight: 700; }
.mdx-body a { color: var(--accent-c); text-decoration: underline; }
.mdx-body ul { list-style: disc; padding-left: 1.5rem; }
.mdx-body ol { list-style: decimal; padding-left: 1.5rem; }
.mdx-body li + li { margin-top: 0.35em; }
.mdx-body blockquote { border-left: 3px solid var(--accent-c); padding-left: 1rem; color: var(--muted-c); }
.mdx-body code { font-family: var(--font-mono); font-size: 0.875em; }
.mdx-body :not(pre) > code {
  background: var(--surface-c);
  border: 1px solid var(--surface-border-c);
  color: var(--surface-text-c);
  padding: 0.1em 0.35em;
  border-radius: 3px;
}
.mdx-body pre {
  padding: 1rem;
  border: 1px solid var(--surface-border-c);
  overflow-x: auto;
  font-size: 0.85rem;
}
.mdx-body img { width: 100%; height: auto; }
```

- [ ] **Step 2: Create `src/layouts/BaseLayout.astro`**

```astro
---
import '../styles/global.css';

interface Props {
  title: string;
  description: string;
}

const { title, description } = Astro.props;
const canonical = new URL(Astro.url.pathname, Astro.site);
---

<!doctype html>
<html lang="en" data-theme="black">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link
      rel="alternate"
      type="application/rss+xml"
      title="Bryce Campbell — Writing"
      href={new URL('rss.xml', Astro.site)}
    />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={canonical} />
    <script is:inline>
      // Apply saved theme before first paint — no flash. Black Mat is the default.
      document.documentElement.dataset.theme =
        localStorage.getItem('theme') === 'green' ? 'green' : 'black';
    </script>
  </head>
  <body class="flex min-h-dvh flex-col font-sans text-ink">
    <!-- Nav goes here (Task 3) -->
    <main class="mx-auto w-full max-w-3xl flex-1 px-5 py-10">
      <slot />
    </main>
    <!-- Footer goes here (Task 3) -->
  </body>
</html>
```

- [ ] **Step 3: Replace `src/pages/index.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout
  title="Bryce Campbell — software, keyboards, CAD & PCB"
  description="The workbench of Bryce Campbell: software projects, keyboard builds, and notes on CAD and PCB design."
>
  <h1 class="text-3xl font-extrabold leading-tight sm:text-4xl">
    The workbench of<br />Bryce Campbell
  </h1>
  <p class="mt-2 font-mono text-sm text-accent">// software · keyboards · CAD · PCB</p>
</BaseLayout>
```

- [ ] **Step 4: Verify**

Run: `npm run build && grep -c "dataset.theme" dist/index.html && grep -c "data-theme=\"black\"" dist/index.html`
Expected: build succeeds; both grep counts are `1`.

Run: `npm run dev` briefly and load http://localhost:4321 — dark mat background with visible grid, mint heading accent. In devtools console run `document.documentElement.dataset.theme = 'green'` — page turns emerald with white grid. Stop the dev server.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: cutting-mat theme system and BaseLayout"
```

---

### Task 3: Nav, ThemeToggle, Footer (ruler)

**Files:**
- Create: `src/components/Nav.astro`, `src/components/ThemeToggle.astro`, `src/components/Footer.astro`
- Modify: `src/layouts/BaseLayout.astro` (replace the two placeholder comments)

**Interfaces:**
- Consumes: theme tokens + `[data-when]` CSS from Task 2; localStorage key `theme`.
- Produces: site chrome on every page that uses `BaseLayout`. No props on any of the three components.

- [ ] **Step 1: Create `src/components/ThemeToggle.astro`**

```astro
<button
  id="theme-toggle"
  type="button"
  aria-label="Switch between Black Mat and Green Mat themes"
  class="rounded-full border border-muted px-2 py-0.5 font-mono text-xs text-muted transition-colors hover:border-accent hover:text-accent"
>
  <span data-when="black">◑</span><span data-when="green">◐</span>
</button>

<script>
  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'green' ? 'black' : 'green';
    document.documentElement.dataset.theme = next;
    localStorage.setItem('theme', next);
  });
</script>
```

- [ ] **Step 2: Create `src/components/Nav.astro`**

```astro
---
import ThemeToggle from './ThemeToggle.astro';

const links = [
  { href: '/projects/', label: '/projects' },
  { href: '/writing/', label: '/writing' },
  { href: '/about/', label: '/about' },
];
const path = Astro.url.pathname;
---

<header class="mx-auto w-full max-w-3xl px-5 pt-6">
  <nav class="flex items-center justify-between" aria-label="Main">
    <a href="/" class="bg-accent px-2 py-0.5 font-mono text-sm font-bold text-accent-ink">BC_</a>
    <div class="flex items-center gap-4 font-mono text-sm">
      {
        links.map((l) => (
          <a
            href={l.href}
            aria-current={path.startsWith(l.href) ? 'page' : undefined}
            class="text-muted transition-colors hover:text-accent aria-[current=page]:text-accent"
          >
            {l.label}
          </a>
        ))
      }
      <ThemeToggle />
    </div>
  </nav>
</header>
```

- [ ] **Step 3: Create `src/components/Footer.astro`**

```astro
---
const ticks = Array.from({ length: 13 }, (_, i) => i * 5);
const year = new Date().getFullYear();
---

<footer class="mt-16">
  <div class="mx-auto w-full max-w-3xl px-5 pb-4">
    <div class="flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-muted">
      <span>© {year} Bryce Campbell</span>
      <span class="flex gap-4">
        <a class="transition-colors hover:text-accent" href="/uses/">/uses</a>
        <a class="transition-colors hover:text-accent" href="/rss.xml">/rss</a>
        <a class="transition-colors hover:text-accent" href="https://github.com/Bryceacampbell">github</a>
        <a class="transition-colors hover:text-accent" href="mailto:bryceacampbell7@gmail.com">email</a>
      </span>
    </div>
    <p class="mt-3 text-right font-mono text-[9px] uppercase tracking-wider text-muted opacity-70">
      bc_ · self healing · est. ©2026 · all code &amp; some solder
    </p>
  </div>
  <div class="ruler" aria-hidden="true">
    {ticks.map((t) => <span>{t}</span>)}
  </div>
</footer>

<style>
  /* Cutting-mat ruler strip — site-wide signature detail */
  .ruler {
    display: flex;
    align-items: flex-end;
    gap: 15px;
    overflow: hidden;
    height: 18px;
    padding: 0 10px 2px;
    background-color: var(--ruler-bg);
    border-top: 1px solid var(--ruler-border);
    color: var(--ruler-text);
    font-family: var(--font-mono);
    font-size: 8px;
  }
</style>
```

- [ ] **Step 4: Wire into `src/layouts/BaseLayout.astro`**

Add imports to the frontmatter:
```astro
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
```
Replace `<!-- Nav goes here (Task 3) -->` with `<Nav />` and `<!-- Footer goes here (Task 3) -->` with `<Footer />`.

- [ ] **Step 5: Verify**

Run: `npm run build && grep -c "BC_" dist/index.html && grep -c "theme-toggle" dist/index.html && grep -c "ruler" dist/index.html`
Expected: build succeeds; every grep count >= 1.

Run: `npm run dev`, load the site — clicking ◑ flips to Green Mat, reload keeps Green Mat, clicking ◐ flips back. Stop the dev server.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: nav with theme toggle and ruler footer"
```

---

### Task 4: Content Collections + Seed Content

**Files:**
- Create: `src/content.config.ts`, `src/content/projects/keebstudio.mdx`, `src/content/posts/rebuilding-brycecampbell-com.mdx`

**Interfaces:**
- Produces: collections `projects` and `posts` queried via `getCollection('projects')` / `getCollection('posts')`. Entry `id` is the filename without extension (e.g. `keebstudio`) and is used directly in URLs. Projects data shape: `{ title, description, category: 'software'|'keyboard'|'cad'|'pcb', date: Date, featured: boolean, status: 'active'|'completed'|'shelved', links?: { repo?, live? }, cover?: ImageMetadata, gallery: ImageMetadata[], specs?: Record<string,string> }`. Posts data shape: `{ title, description, pubDate: Date, tags: string[], cover?: ImageMetadata, project?: { collection: 'projects'; id: string } }`.

- [ ] **Step 1: Create `src/content.config.ts`**

```ts
import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      category: z.enum(['software', 'keyboard', 'cad', 'pcb']),
      date: z.coerce.date(),
      featured: z.boolean().default(false),
      status: z.enum(['active', 'completed', 'shelved']).default('active'),
      links: z
        .object({
          repo: z.string().url().optional(),
          live: z.string().url().optional(),
        })
        .optional(),
      cover: image().optional(),
      gallery: z.array(image()).default([]),
      specs: z.record(z.string(), z.string()).optional(),
    }),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      tags: z.array(z.string()).default([]),
      cover: image().optional(),
      project: reference('projects').optional(),
    }),
});

export const collections = { projects, posts };
```

- [ ] **Step 2: Create `src/content/projects/keebstudio.mdx`**

(Facts sourced from the KeebStudio README — Bryce may polish wording later, but nothing here is invented.)

```mdx
---
title: KeebStudio
description: Made-to-order 3D-printed keyboard case customization — a web-based 3D configurator backed by Shopify, Supabase, and automated filament inventory sync.
category: software
date: 2026-06-01
featured: true
status: active
links:
  repo: https://github.com/Bryceacampbell/keebstudio
---

KeebStudio is where the keyboard obsession and the software career collide: customers
pick colors for every part of a 3D-printed keyboard case in a web-based 3D configurator
(Build Studio), and we print and ship the result through Shopify.

The interesting engineering lives in the plumbing. Supabase is the single source of
truth — a Bambu Labs sync job scrapes filament inventory hourly and writes availability
into the database, which flows through to Shopify product variants automatically. A
three.js render service on Cloud Run generates product imagery from the same part
models customers configure against. The whole thing is an NX monorepo: Build Studio,
an admin UI, a CLI for catalog and stock management, and the sync services.
```

- [ ] **Step 3: Create `src/content/posts/rebuilding-brycecampbell-com.mdx`**

```mdx
---
title: Rebuilding brycecampbell.com
description: The old site was jank, so I tore it down and rebuilt it as a workbench — Astro, Tailwind, and a design system based on a cutting mat.
pubDate: 2026-07-23
tags: [meta, astro]
---

The old version of this site had been bothering me for a while, so I did the only
reasonable thing: took it down entirely and started over.

The rebuild is Astro + Tailwind, fully static, deployed on Vercel. The design system
is based on the self-healing cutting mat on my desk — the dark side is the default
theme, and the toggle in the nav flips the mat over to the green side. The grid you
see in the background is pure CSS, and the ruler along the bottom of every page is
there because a workbench without measurement marks is just a table.

Everything I make lives in one place now: software projects, keyboard builds, and —
as I get deeper into CAD and PCB design — build logs for those too. If it's on the
bench, it ends up here.
```

- [ ] **Step 4: Verify schemas**

Run: `npm run check && npm run build`
Expected: `astro check` reports 0 errors; build succeeds (collections validate at build time). A wrong `category` value would fail the build — that's the schema working.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: content collections with KeebStudio and first post"
```

---

### Task 5: Activity Stream Utility (TDD)

**Files:**
- Create: `vitest.config.ts`, `src/lib/activity.test.ts`, `src/lib/activity.ts`

**Interfaces:**
- Produces: `buildActivity(projects, posts, limit = 8): ActivityItem[]` and `type ActivityItem = { type: 'project' | 'post'; title: string; description: string; date: Date; url: string; label: string }`. Inputs are structurally typed (`{ id, data: {...} }`) so collection entries pass directly and tests need no Astro imports. Projects get `label = category`, posts get `label = 'writing'`; URLs are `/projects/<id>/` and `/writing/<id>/`; result sorted newest first, truncated to `limit`.

- [ ] **Step 1: Create `vitest.config.ts`**

```ts
/// <reference types="vitest" />
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    include: ['src/**/*.test.ts'],
  },
});
```

- [ ] **Step 2: Write the failing test — `src/lib/activity.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import { buildActivity } from './activity';

const project = (id: string, date: string, category = 'software') => ({
  id,
  data: { title: `Project ${id}`, description: `About ${id}`, date: new Date(date), category },
});

const post = (id: string, pubDate: string) => ({
  id,
  data: { title: `Post ${id}`, description: `About ${id}`, pubDate: new Date(pubDate) },
});

describe('buildActivity', () => {
  it('merges projects and posts sorted newest first', () => {
    const items = buildActivity([project('a', '2026-01-01')], [post('b', '2026-03-01')]);
    expect(items.map((i) => i.title)).toEqual(['Post b', 'Project a']);
  });

  it('maps urls and labels per type', () => {
    const items = buildActivity([project('keeb', '2026-01-01', 'keyboard')], [post('log', '2025-01-01')]);
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
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL — cannot resolve `./activity`.

- [ ] **Step 4: Implement `src/lib/activity.ts`**

```ts
export type ActivityItem = {
  type: 'project' | 'post';
  title: string;
  description: string;
  date: Date;
  url: string;
  label: string;
};

type ProjectEntry = {
  id: string;
  data: { title: string; description: string; date: Date; category: string };
};

type PostEntry = {
  id: string;
  data: { title: string; description: string; pubDate: Date };
};

export function buildActivity(
  projects: ProjectEntry[],
  posts: PostEntry[],
  limit = 8,
): ActivityItem[] {
  const items: ActivityItem[] = [
    ...projects.map((p) => ({
      type: 'project' as const,
      title: p.data.title,
      description: p.data.description,
      date: p.data.date,
      url: `/projects/${p.id}/`,
      label: p.data.category,
    })),
    ...posts.map((p) => ({
      type: 'post' as const,
      title: p.data.title,
      description: p.data.description,
      date: p.data.pubDate,
      url: `/writing/${p.id}/`,
      label: 'writing',
    })),
  ];

  return items.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, limit);
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm test`
Expected: PASS — 4 tests passing.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: buildActivity utility with vitest coverage"
```

---

### Task 6: ProjectCard, ActivityList, and the Real Homepage

**Files:**
- Create: `src/components/ProjectCard.astro`, `src/components/ActivityList.astro`
- Modify: `src/pages/index.astro` (replace entirely)

**Interfaces:**
- Consumes: collections (Task 4), `buildActivity`/`ActivityItem` (Task 5), theme utilities (Task 2).
- Produces: `ProjectCard` with props `{ project: CollectionEntry<'projects'> }` — root element carries `data-category={category}` (Task 7's filter relies on this). `ActivityList` with props `{ items: ActivityItem[] }`.

- [ ] **Step 1: Create `src/components/ProjectCard.astro`**

```astro
---
import { Image } from 'astro:assets';
import type { CollectionEntry } from 'astro:content';

interface Props {
  project: CollectionEntry<'projects'>;
}

const { project } = Astro.props;
const { title, description, category, status, cover } = project.data;
---

<a
  href={`/projects/${project.id}/`}
  data-category={category}
  class="block border border-surface-border bg-surface transition-transform hover:-translate-y-0.5"
  style="border-top: 2px solid var(--surface-accent-c);"
>
  {
    cover && (
      <Image
        src={cover}
        alt={title}
        widths={[400, 800]}
        sizes="(min-width: 640px) 400px, 100vw"
        class="aspect-[3/2] w-full object-cover"
      />
    )
  }
  <div class="p-4">
    <div class="mb-1 flex items-center justify-between font-mono text-[11px] uppercase tracking-wide">
      <span class="text-surface-accent">{category}</span>
      <span class="text-surface-muted">{status}</span>
    </div>
    <h3 class="font-bold text-surface-text">{title}</h3>
    <p class="mt-1 text-sm text-surface-muted">{description}</p>
  </div>
</a>
```

- [ ] **Step 2: Create `src/components/ActivityList.astro`**

```astro
---
import type { ActivityItem } from '../lib/activity';

interface Props {
  items: ActivityItem[];
}

const { items } = Astro.props;
const fmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
---

<ul>
  {
    items.map((item) => (
      <li class="border-t border-rule last:border-b">
        <a
          href={item.url}
          class="flex items-baseline justify-between gap-4 py-2.5 transition-colors hover:text-accent"
        >
          <span class="min-w-0 truncate">{item.title}</span>
          <span class="flex shrink-0 items-baseline gap-3 font-mono text-xs">
            <span class="text-accent">{item.label}</span>
            <span class="text-muted">{fmt.format(item.date)}</span>
          </span>
        </a>
      </li>
    ))
  }
</ul>
```

- [ ] **Step 3: Replace `src/pages/index.astro`**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../layouts/BaseLayout.astro';
import ProjectCard from '../components/ProjectCard.astro';
import ActivityList from '../components/ActivityList.astro';
import { buildActivity } from '../lib/activity';

const projects = await getCollection('projects');
const posts = await getCollection('posts');

const featured = projects
  .filter((p) => p.data.featured)
  .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
  .slice(0, 3);

const activity = buildActivity(projects, posts, 8);
---

<BaseLayout
  title="Bryce Campbell — software, keyboards, CAD & PCB"
  description="The workbench of Bryce Campbell: software projects, keyboard builds, and notes on CAD and PCB design."
>
  <h1 class="text-3xl font-extrabold leading-tight sm:text-4xl">
    The workbench of<br />Bryce Campbell
  </h1>
  <p class="mt-2 font-mono text-sm text-accent">// software · keyboards · CAD · PCB</p>

  {
    featured.length > 0 && (
      <section class="mt-10">
        <h2 class="mb-3 font-mono text-xs uppercase tracking-widest text-muted">Featured</h2>
        <div class="grid gap-4 sm:grid-cols-2">
          {featured.map((project) => (
            <ProjectCard project={project} />
          ))}
        </div>
      </section>
    )
  }

  <section class="mt-10">
    <h2 class="mb-3 font-mono text-xs uppercase tracking-widest text-muted">Recent activity</h2>
    <ActivityList items={activity} />
  </section>
</BaseLayout>
```

- [ ] **Step 4: Verify**

Run: `npm run check && npm run build && grep -c "KeebStudio" dist/index.html && grep -c "Rebuilding brycecampbell.com" dist/index.html`
Expected: 0 check errors; build succeeds; both greps >= 1 (KeebStudio appears in Featured and the stream; the post appears in the stream).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: homepage with featured projects and activity stream"
```

---

### Task 7: Projects Index with Filter Chips

**Files:**
- Create: `src/pages/projects/index.astro`

**Interfaces:**
- Consumes: `ProjectCard` (Task 6) — filtering targets its `data-category` attribute.
- Produces: `/projects/` page. Filter buttons carry `data-filter` (`all|software|keyboard|cad|pcb`) and `aria-pressed`.

- [ ] **Step 1: Create `src/pages/projects/index.astro`**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import ProjectCard from '../../components/ProjectCard.astro';

const projects = (await getCollection('projects')).sort(
  (a, b) => b.data.date.getTime() - a.data.date.getTime(),
);
const filters = ['all', 'software', 'keyboard', 'cad', 'pcb'];
---

<BaseLayout
  title="Projects — Bryce Campbell"
  description="Software projects, keyboard builds, CAD models, and PCB designs by Bryce Campbell."
>
  <h1 class="text-2xl font-extrabold">Projects</h1>

  <div class="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter projects by category">
    {
      filters.map((f) => (
        <button
          type="button"
          data-filter={f}
          aria-pressed={f === 'all' ? 'true' : 'false'}
          class="border border-rule px-3 py-1 font-mono text-xs text-muted transition-colors hover:border-accent hover:text-accent aria-[pressed=true]:border-accent aria-[pressed=true]:bg-accent aria-[pressed=true]:text-accent-ink"
        >
          {f}
        </button>
      ))
    }
  </div>

  <div id="project-grid" class="mt-6 grid gap-4 sm:grid-cols-2">
    {projects.map((project) => <ProjectCard project={project} />)}
  </div>

  <script>
    const buttons = document.querySelectorAll<HTMLButtonElement>('[data-filter]');
    const cards = document.querySelectorAll<HTMLElement>('#project-grid [data-category]');

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
        cards.forEach((card) => {
          card.style.display = filter === 'all' || card.dataset.category === filter ? '' : 'none';
        });
      });
    });
  </script>
</BaseLayout>
```

- [ ] **Step 2: Verify**

Run: `npm run build && grep -c "data-filter" dist/projects/index.html && grep -c "data-category=\"software\"" dist/projects/index.html`
Expected: build succeeds; first grep = 5 (all/software/keyboard/cad/pcb), second >= 1.

Run: `npm run dev`, open /projects/ — clicking `keyboard` hides KeebStudio; clicking `all` restores it; active chip renders filled (accent background). Stop the dev server.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: projects index with category filter chips"
```

---

### Task 8: Adaptive Project Detail Page

**Files:**
- Create: `src/components/SpecSheet.astro`, `src/components/GalleryGrid.astro`, `src/pages/projects/[slug].astro`

**Interfaces:**
- Consumes: collections (Task 4), theme utilities (Task 2).
- Produces: `/projects/<id>/` pages. `SpecSheet` props: `{ specs: Record<string, string> }`. `GalleryGrid` props: `{ images: ImageMetadata[]; title: string }`. Adaptive rules: spec sheet renders only when `specs` exists, gallery only when `gallery.length > 0`, buttons only when `links.repo`/`links.live` exist, related posts only when posts reference the project.

- [ ] **Step 1: Create `src/components/SpecSheet.astro`**

```astro
---
interface Props {
  specs: Record<string, string>;
}

const { specs } = Astro.props;
---

<section
  class="border border-surface-border bg-surface p-4"
  style="border-top: 2px solid var(--surface-accent-c);"
>
  <h2 class="mb-2 font-mono text-[11px] uppercase tracking-wide text-surface-accent">Spec sheet</h2>
  <dl>
    {
      Object.entries(specs).map(([key, value]) => (
        <div class="flex justify-between gap-4 border-t border-rule py-1.5 font-mono text-xs first:border-t-0">
          <dt class="uppercase text-surface-muted">{key}</dt>
          <dd class="text-right text-surface-text">{value}</dd>
        </div>
      ))
    }
  </dl>
</section>
```

- [ ] **Step 2: Create `src/components/GalleryGrid.astro`**

```astro
---
import { Image } from 'astro:assets';

interface Props {
  images: ImageMetadata[];
  title: string;
}

const { images, title } = Astro.props;
---

<div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
  {
    images.map((img, i) => (
      <Image
        src={img}
        alt={`${title} — photo ${i + 1}`}
        widths={[300, 600]}
        sizes="(min-width: 640px) 33vw, 50vw"
        class="aspect-square w-full object-cover"
        loading="lazy"
      />
    ))
  }
</div>
```

- [ ] **Step 3: Create `src/pages/projects/[slug].astro`**

```astro
---
import { getCollection, render } from 'astro:content';
import { Image } from 'astro:assets';
import BaseLayout from '../../layouts/BaseLayout.astro';
import SpecSheet from '../../components/SpecSheet.astro';
import GalleryGrid from '../../components/GalleryGrid.astro';

export async function getStaticPaths() {
  const projects = await getCollection('projects');
  return projects.map((project) => ({ params: { slug: project.id }, props: { project } }));
}

const { project } = Astro.props;
const { title, description, category, date, status, links, cover, gallery, specs } = project.data;
const { Content } = await render(project);

const relatedPosts = (await getCollection('posts'))
  .filter((p) => p.data.project?.id === project.id)
  .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());

const fmt = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' });
---

<BaseLayout title={`${title} — Bryce Campbell`} description={description}>
  <p class="font-mono text-xs uppercase tracking-widest text-accent">{category}</p>
  <h1 class="mt-1 text-3xl font-extrabold">{title}</h1>
  <p class="mt-2 text-muted">{description}</p>
  <p class="mt-2 font-mono text-xs text-muted">{fmt.format(date)} · {status}</p>

  {
    (links?.repo || links?.live) && (
      <div class="mt-4 flex gap-3 font-mono text-sm">
        {links?.repo && (
          <a
            href={links.repo}
            class="border border-accent px-3 py-1 text-accent transition-colors hover:bg-accent hover:text-accent-ink"
          >
            repo ↗
          </a>
        )}
        {links?.live && (
          <a
            href={links.live}
            class="border border-accent px-3 py-1 text-accent transition-colors hover:bg-accent hover:text-accent-ink"
          >
            live ↗
          </a>
        )}
      </div>
    )
  }

  {
    cover && (
      <Image
        src={cover}
        alt={title}
        widths={[800, 1600]}
        sizes="(min-width: 768px) 768px, 100vw"
        class="mt-8 w-full"
      />
    )
  }

  {specs && <div class="mt-8"><SpecSheet specs={specs} /></div>}

  {gallery.length > 0 && <div class="mt-8"><GalleryGrid images={gallery} title={title} /></div>}

  <div class="mdx-body mt-8"><Content /></div>

  {
    relatedPosts.length > 0 && (
      <section class="mt-10">
        <h2 class="mb-3 font-mono text-xs uppercase tracking-widest text-muted">Build logs & posts</h2>
        <ul>
          {relatedPosts.map((p) => (
            <li class="border-t border-rule last:border-b">
              <a
                href={`/writing/${p.id}/`}
                class="flex items-baseline justify-between gap-4 py-2.5 transition-colors hover:text-accent"
              >
                <span>{p.data.title}</span>
                <span class="shrink-0 font-mono text-xs text-muted">
                  {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(p.data.pubDate)}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    )
  }
</BaseLayout>
```

- [ ] **Step 4: Verify**

Run: `npm run check && npm run build && grep -c "repo ↗" dist/projects/keebstudio/index.html; grep -c "Spec sheet" dist/projects/keebstudio/index.html`
Expected: 0 check errors; build succeeds; `repo ↗` grep = 1; `Spec sheet` grep prints 0 and exits non-zero (KeebStudio has no `specs` — that's the adaptive template correctly omitting the section).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: adaptive project detail pages with spec sheet and gallery"
```

---

### Task 9: Writing Index + Post Pages

**Files:**
- Create: `src/pages/writing/index.astro`, `src/pages/writing/[slug].astro`

**Interfaces:**
- Consumes: `posts` collection (Task 4), `.mdx-body` styles (Task 2).
- Produces: `/writing/` and `/writing/<id>/` pages. Post pages link back to a referenced project when `post.data.project` is set.

- [ ] **Step 1: Create `src/pages/writing/index.astro`**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';

const posts = (await getCollection('posts')).sort(
  (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime(),
);
const fmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
---

<BaseLayout
  title="Writing — Bryce Campbell"
  description="Build logs and notes on software, keyboards, CAD, and PCB design."
>
  <h1 class="text-2xl font-extrabold">Writing</h1>

  {
    posts.length === 0 ? (
      <p class="mt-6 text-muted">Nothing here yet — the first post is still on the bench.</p>
    ) : (
      <ul class="mt-6">
        {posts.map((post) => (
          <li class="border-t border-rule last:border-b">
            <a href={`/writing/${post.id}/`} class="group block py-4">
              <div class="flex items-baseline justify-between gap-4">
                <h2 class="font-bold transition-colors group-hover:text-accent">{post.data.title}</h2>
                <span class="shrink-0 font-mono text-xs text-muted">{fmt.format(post.data.pubDate)}</span>
              </div>
              <p class="mt-1 text-sm text-muted">{post.data.description}</p>
            </a>
          </li>
        ))}
      </ul>
    )
  }
</BaseLayout>
```

- [ ] **Step 2: Create `src/pages/writing/[slug].astro`**

```astro
---
import { getCollection, getEntry, render } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';

export async function getStaticPaths() {
  const posts = await getCollection('posts');
  return posts.map((post) => ({ params: { slug: post.id }, props: { post } }));
}

const { post } = Astro.props;
const { Content } = await render(post);
const project = post.data.project ? await getEntry(post.data.project) : undefined;
const fmt = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
---

<BaseLayout title={`${post.data.title} — Bryce Campbell`} description={post.data.description}>
  <p class="font-mono text-xs uppercase tracking-widest text-accent">writing</p>
  <h1 class="mt-1 text-3xl font-extrabold">{post.data.title}</h1>
  <p class="mt-2 font-mono text-xs text-muted">
    {fmt.format(post.data.pubDate)}
    {post.data.tags.length > 0 && <> · {post.data.tags.join(' · ')}</>}
  </p>

  {
    project && (
      <p class="mt-3 font-mono text-sm">
        <a href={`/projects/${project.id}/`} class="text-accent underline">
          ↳ part of {project.data.title}
        </a>
      </p>
    )
  }

  <div class="mdx-body mt-8"><Content /></div>
</BaseLayout>
```

- [ ] **Step 3: Verify**

Run: `npm run check && npm run build && grep -c "Rebuilding brycecampbell.com" dist/writing/index.html && ls dist/writing/rebuilding-brycecampbell-com/index.html`
Expected: 0 check errors; build succeeds; grep >= 1; post HTML file exists.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: writing index and post pages"
```

---

### Task 10: About, RSS, 404

**Files:**
- Create: `src/pages/about.astro`, `src/pages/rss.xml.js`, `src/pages/404.astro`

**Interfaces:**
- Consumes: `posts` collection (Task 4), `BaseLayout` (Task 2/3).
- Produces: `/about/`, `/rss.xml`, and the 404 page. The nav's `/about` link and the footer's `/rss.xml` link (already rendered since Task 3) stop 404ing.

- [ ] **Step 1: Create `src/pages/about.astro`**

(Facts only: Carvana ~5 years, keyboard building, CAD/PCB learning, GitHub + email. Bryce reviews the wording in Task 11.)

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout
  title="About — Bryce Campbell"
  description="Senior software engineer, keyboard builder, and maker of things."
>
  <h1 class="text-2xl font-extrabold">About</h1>

  <div class="mdx-body mt-6">
    <p>
      I'm Bryce — a senior software engineer, most recently five years at Carvana. I love
      writing code, and the side projects on this site are what happens when that doesn't
      switch off at the end of the workday.
    </p>
    <p>
      My other obsession is building keyboards: sourcing switches, tuning stabilizers,
      flashing QMK, and generally spending unreasonable amounts of attention on the thing
      I type on. That hobby keeps pulling me deeper down the hardware rabbit hole — I'm
      currently learning CAD and PCB design, and writing about it as I go.
    </p>
    <p>
      This site is the workbench where all of it lands: software, keyboards, and whatever
      gets made next.
    </p>
  </div>

  <div class="mt-8 flex gap-3 font-mono text-sm">
    <a
      href="https://github.com/Bryceacampbell"
      class="border border-accent px-3 py-1 text-accent transition-colors hover:bg-accent hover:text-accent-ink"
    >
      github ↗
    </a>
    <a
      href="mailto:bryceacampbell7@gmail.com"
      class="border border-accent px-3 py-1 text-accent transition-colors hover:bg-accent hover:text-accent-ink"
    >
      email
    </a>
  </div>
</BaseLayout>
```

- [ ] **Step 2: Create `src/pages/rss.xml.js`**

```js
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = (await getCollection('posts')).sort(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime(),
  );

  return rss({
    title: 'Bryce Campbell — Writing',
    description: 'Build logs and notes on software, keyboards, CAD, and PCB design.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/writing/${post.id}/`,
    })),
  });
}
```

- [ ] **Step 3: Create `src/pages/404.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="404 — Bryce Campbell" description="Page not found.">
  <p class="font-mono text-xs uppercase tracking-widest text-accent">404</p>
  <h1 class="mt-1 text-3xl font-extrabold">Off the mat.</h1>
  <p class="mt-2 text-muted">
    This page doesn't exist. <a href="/" class="text-accent underline">Head back to the workbench</a>.
  </p>
</BaseLayout>
```

- [ ] **Step 4: Verify**

Run: `npm run check && npm run build && grep -c "Rebuilding brycecampbell.com" dist/rss.xml && ls dist/404.html dist/about/index.html`
Expected: 0 check errors; build succeeds; RSS grep = 1; both files exist.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: about page, RSS feed, and 404"
```

---

### Task 11: Bryce-Specific Content (CHECKPOINT — needs user input)

**Files:**
- Create: `src/pages/uses.astro`, `src/content/projects/<keyboard-build-slug>.mdx`, `src/assets/<keyboard-photos>`
- Possibly modify: `src/pages/about.astro`, `src/content/projects/keebstudio.mdx` (wording tweaks)

**Interfaces:**
- Consumes: `projects` schema (Task 4) — the keyboard entry uses `category: keyboard`, `specs`, and `gallery`; adaptive detail page (Task 8) renders them with no code changes.
- Produces: launch content complete per spec.

**This task cannot be done without Bryce.** Do not invent keyboard specs, gear lists, or dates. Ask, then write.

- [ ] **Step 1: Gather content from Bryce**

Ask for:
1. **Keyboard build**: which build to feature first; its name; specs (switches, keycaps, plate, case, firmware, layout — whatever applies); rough build date; 2–6 photos; a few sentences or bullet points about the build story. (He has a `vial-qmk` fork — the featured build likely runs Vial/QMK; confirm rather than assume.)
2. **/uses**: current daily-driver keyboard(s), editor + fonts/tools, desk hardware, CAD/PCB tools he's learning (e.g., Fusion 360? KiCad? — confirm), anything else he wants listed.
3. Quick review of the About page and KeebStudio wording from Tasks 4/10.

- [ ] **Step 2: Add the keyboard build entry**

Copy photos into `src/assets/<build-slug>/`. Create `src/content/projects/<build-slug>.mdx` with this shape (values from Step 1 — the example keys below are the *format*, not content to copy):

```mdx
---
title: <Build name>
description: <One-sentence description>
category: keyboard
date: <build date>
featured: true
status: completed
cover: ../../assets/<build-slug>/<main-photo>.jpg
gallery:
  - ../../assets/<build-slug>/<photo-2>.jpg
  - ../../assets/<build-slug>/<photo-3>.jpg
specs:
  switches: <...>
  keycaps: <...>
  plate: <...>
  firmware: <...>
---

<Build story from Bryce's notes>
```

- [ ] **Step 3: Create `src/pages/uses.astro`**

Structure (fill sections from Step 1 answers; drop any section Bryce has nothing for):

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';

const sections = [
  { heading: 'Keyboards', items: [/* from Bryce */] },
  { heading: 'Software', items: [/* from Bryce */] },
  { heading: 'Desk', items: [/* from Bryce */] },
  { heading: 'Making', items: [/* from Bryce: CAD/PCB/printing tools */] },
];
---

<BaseLayout title="Uses — Bryce Campbell" description="The hardware and software on Bryce Campbell's workbench.">
  <h1 class="text-2xl font-extrabold">Uses</h1>
  <p class="mt-2 text-muted">What's on the bench right now.</p>
  {
    sections.map((s) => (
      <section class="mt-8">
        <h2 class="mb-2 font-mono text-xs uppercase tracking-widest text-accent">{s.heading}</h2>
        <ul class="mdx-body">
          {s.items.map((item) => (
            <li>{item}</li>
          ))}
        </ul>
      </section>
    ))
  }
</BaseLayout>
```

Note: the `items` arrays contain plain strings like `'Boba U4T switches on the daily driver'`. The comment placeholders above MUST be replaced with real content before committing — committing this file with empty arrays is a task failure.

- [ ] **Step 4: Verify**

Run: `npm run check && npm run build && ls dist/uses/index.html && grep -c "Spec sheet" dist/projects/<build-slug>/index.html`
Expected: 0 check errors; build succeeds; uses page exists; spec sheet grep = 1 (adaptive template now renders specs + gallery for the keyboard entry).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: keyboard build entry and uses page"
```

---

### Task 12: Final Verification + Vercel Deploy

**Files:**
- None created (deploy configuration lives in Vercel; `.vercel/` is gitignored)

**Interfaces:**
- Consumes: the complete site.
- Produces: live preview deployment, then production at brycecampbell.com.

- [ ] **Step 1: Full local verification**

Run: `npm run check && npm test && npm run build`
Expected: 0 check errors, 4 tests passing, clean build.

- [ ] **Step 2: Manual two-theme pass**

Run `npm run preview` and visit every route: `/`, `/projects/`, `/projects/keebstudio/`, the keyboard build page, `/writing/`, the post page, `/about/`, `/uses/`, `/rss.xml`, plus a bogus URL for the 404. On each page: toggle Black Mat ↔ Green Mat, check text contrast and card readability in both, and check mobile width (~375px) in devtools responsive mode. Fix anything broken before deploying. Stop the server.

- [ ] **Step 3: Deploy preview to Vercel**

Run: `npx vercel deploy` (link as a new Vercel project named `brycecampbell-com` when prompted; framework auto-detects as Astro). If CLI auth is needed, Bryce runs `npx vercel login` himself.
Expected: preview URL returned. Open it and spot-check the homepage and one project page.

- [ ] **Step 4: Get Bryce's go-ahead, then promote to production**

Show Bryce the preview URL. On approval:
Run: `npx vercel --prod`
Then have Bryce attach the domain (he owns brycecampbell.com): either in the Vercel dashboard (Project → Settings → Domains) or via `npx vercel domains add brycecampbell.com` if DNS is already on Vercel.
Expected: https://brycecampbell.com serves the site.

- [ ] **Step 5: Verify production and commit any final tweaks**

Check https://brycecampbell.com/: homepage loads, theme toggle persists across reloads, `/rss.xml` validates (paste into https://validator.w3.org/feed/), OG tags present (`curl -s https://brycecampbell.com/ | grep og:title`).

```bash
git add -A
git commit -m "chore: launch brycecampbell.com" --allow-empty
```
