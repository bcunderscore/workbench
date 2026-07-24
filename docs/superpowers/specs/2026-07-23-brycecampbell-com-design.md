# brycecampbell.com — Design Spec

**Date:** 2026-07-23
**Status:** Approved (brainstorm session with visual companion)

## Purpose

Personal portfolio site for Bryce Campbell — senior software engineer, keyboard builder, and budding CAD/PCB designer. The site is a "workbench": a curated front door to projects (software, keyboards, CAD, PCB) plus a blog for build logs and technical writing. Replaces the old brycecampbell.com, which was taken down.

## Identity & Homepage

Portfolio-first presentation over a unified content model ("everything is a thing I made or wrote"). The homepage is a **hybrid**:

1. Brief intro ("The workbench of Bryce Campbell" — software · keyboards · CAD · PCB)
2. 2–3 **featured** projects (hand-picked via frontmatter flag)
3. **Recent activity stream** — projects and posts merged, newest first

## Stack

- **Astro** (latest) + **Tailwind CSS v4** + **MDX**, TypeScript
- Fully static output — no backend, database, or forms
- Deployed on **Vercel**, domain `brycecampbell.com`
- Repo: `~/Development/brycecampbell.com`

## Content Model

Two Astro content collections with zod-typed frontmatter.

### `projects`

| Field | Type | Notes |
|---|---|---|
| `title` | string | required |
| `description` | string | required, used on cards + meta tags |
| `category` | `software \| keyboard \| cad \| pcb \| 3d-printing` | required, drives filtering + adaptive template |
| `date` | date | required, position in activity stream |
| `featured` | boolean | default false; featured projects appear on homepage |
| `status` | `active \| completed \| shelved` | default `active` |
| `links` | `{ repo?, live? }` | optional |
| `cover` | image | optional, card + hero image |
| `gallery` | image[] | optional, photo grid on detail page |
| `specs` | record<string, string> | optional, freeform key/value spec sheet (switches, keycaps, plate, firmware, layout, …) |

Body: free-form MDX (the story of the project).

### `posts`

| Field | Type | Notes |
|---|---|---|
| `title` | string | required |
| `description` | string | required |
| `pubDate` | date | required |
| `tags` | string[] | default [] |
| `cover` | image | optional |
| `project` | reference to `projects` | optional — links a build log to its project |

**Adaptive project detail page:** one template. If `specs` exists → render spec sheet; if `gallery` exists → render photo grid; if `links.repo`/`links.live` exist → render repo/live buttons. Related posts (posts referencing this project) listed automatically. No per-category templates.

## Pages & Routing

| Route | Content |
|---|---|
| `/` | Hybrid homepage (intro, featured, activity stream) |
| `/projects` | All projects, filter chips: All / Software / Keyboards / CAD / PCB (client-side filtering, minimal JS) |
| `/projects/[slug]` | Adaptive detail page |
| `/writing` | Post list, newest first |
| `/writing/[slug]` | Post page (MDX, code highlighting) |
| `/about` | Story, Carvana background, keyboard obsession; GitHub / LinkedIn / email links (contact = links, no form) |
| `/uses` | Desk, keyboards in rotation, editor, tools |
| `/rss.xml` | RSS feed for posts |
| `404` | Themed 404 page |

Out of scope for v1: resume/CV page, contact form, comments, analytics, search, lightbox.

## Theming — the Cutting Mat system

Inspired by the Work Louder self-healing cutting mat (black side / green side). Reference photos: `docs/design-refs/cutting-mat-angled.webp` and `docs/design-refs/cutting-mat-flat.avif`. The flat photo defines the wider decoration vocabulary (edge rulers, corner label block, angle guides, dotted grid) — grid, ruler strip, and a footer label block are v1; the rest is future polish.

- **Two themes** via CSS custom properties on `data-theme` attribute:
  - **Black Mat** — default for all visitors regardless of system preference. Near-black base (`#1a1b1d` family), subtle grid, **mint green accent** (`#3ddc97` family) on labels, links, category tags, card accents, logo mark.
  - **Green Mat** — emerald gradient base (`#0f8a5f → #49d19c`), white grid lines, white content cards with dark text.
- Toggle in the nav; persisted in `localStorage`; inline head script applies theme before paint (no flash).
- **Mat texture:** pure CSS gradients — fine grid (20px) + heavier major lines (100px). No image assets for texture.
- **Ruler detail:** ruler-tick strip rendered as a footer element (site-wide signature detail).
- **Typography:** monospace font for labels, categories, spec sheets, nav (`/projects /writing /about`); sans-serif for body/headings. Logo mark: `BC_` badge.

## Images & Performance

- Photos in `src/assets`, processed by Astro's built-in image optimization (responsive sizes, lazy loading, modern formats).
- Galleries: simple responsive grid, no lightbox in v1.
- Target: static everything, near-perfect Lighthouse scores.

## Error Handling & Edge Cases

- Themed 404 page.
- Empty states: sections render gracefully with few/zero entries (e.g., writing index before first post).
- Missing optional frontmatter (no cover, no specs, no gallery) must render cleanly — adaptive template omits absent sections.
- Theme script must not flash wrong theme on load.

## Testing & Verification

- `astro check` + successful production build in CI (Vercel).
- Zod schemas validate all frontmatter at build time.
- Manual pass: both themes across all pages, mobile + desktop widths.
- RSS validates; internal links resolve (build-time link check).

## Launch Content (v1 seed)

Real content only — no placeholders:

- Keebstudio (software project)
- 1–2 keyboard builds (with specs + photos)
- Short first post (e.g., site rebuild note or a build log)
- About + Uses pages written
