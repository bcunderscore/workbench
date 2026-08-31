# bc_ brand assets

Vector masters for the `bc_` mark. Letterforms are **outlined** JetBrains Mono Bold
(the typeface the OG cards already use) — no `<text>`, no font-family lookup, so every
surface renders identically regardless of the fonts installed on the viewing machine.

## Files

| File | Use |
| --- | --- |
| `bc-mark.svg` | Mark alone, `fill="currentColor"`. **The in-app one** — inherits theme color. |
| `bc-mark-ink.svg` | Mark alone, locked to ink `#101112`. Light backgrounds, print, single-color. |
| `bc-mark-white.svg` | Mark alone, locked to white. Dark backgrounds, single-color. |
| `bc-badge.svg` | Primary lockup: mint chip + ink mark. Use when the mark needs its own ground. |
| `bc-badge-ink.svg` | Lockup inverted — ink chip, white mark. |
| `bc-badge-white.svg` | Lockup on white chip, ink mark. Mono reproduction. |

## Geometry

- Mark viewBox is exactly its ink bounding box: `1663 × 868` (ratio 1.916).
- Badge is `220 × 132`, corner radius `11` (5% of width), mark set to `143` wide and centered.
- Colors: mint `#3ddc97` (`--color-accent`), ink `#101112` (`--color-accent-ink`).

## Raster derivatives

Generated from these masters, not maintained by hand:

- `public/favicon.svg` — 64 × 64 badge, radius 6
- `public/icon-192.png`, `public/icon-512.png`, `public/apple-touch-icon.png` — full-bleed
  mint squares (no radius; the OS masks them)
- `src/assets/og/bc-logo.png` — 220 × 132, consumed by `src/pages/og/[...route].png.ts`
- `public/og-default.png` — badge composited at (125, 47), 234 × 118

## In-app usage

Import as a component; Astro inlines it, so `currentColor` and utility classes both work:

```astro
import Mark from '../assets/brand/bc-mark.svg';

<a href="/" aria-label="bc_ — home" class="bg-accent px-2 py-1.5 text-accent-ink">
  <Mark class="h-3 w-auto" aria-hidden="true" />
</a>
```

Name the mark at the usage site (`aria-label` on the link, `aria-hidden` on the SVG) —
`bc-mark.svg` deliberately carries no `role`/`aria-label` of its own.

The footer colophon (`bc_ · self healing · est.`) is set as text on purpose: it reads as a
line of type, not as a logo placement.
