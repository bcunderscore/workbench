---
name: publish
description: Use when Bryce says content is ready to publish, asks to push posts/projects live, or invokes /publish
---

# Publish Content — Preflight and Ship

Push = production deploy. This checklist exists because content mistakes here are public.

## Preflight (all steps, in order)

1. `git status --porcelain src/content/ src/assets/` — list every content change. For each, state its **visibility effect**: publishes (draft removed / new file), unpublishes (draft added / deletion), or edits existing.
2. Untracked assets check: any `cover:`/`gallery:` path in changed frontmatter must exist and be tracked — an untracked image breaks the Vercel build.
3. Run `npm test`, `npm run check` (0 errors expected), `npm run build`. In the built `dist/`, verify each entry that should publish exists and each draft/deletion is absent.
4. Present Bryce the visibility summary (what goes live, what disappears) and **get an explicit yes** before committing. Never bundle unrelated code changes into a content publish.
5. Commit content + assets only (no Co-Authored-By trailer), push. Wait for the deploy, then curl the live URL(s) to confirm.
6. Update the **Content Pipeline** (`collection://7fade333-6e2c-4c42-b0b1-1ec3ff0f7284`): `Status: published`, set `Live URL`. Offer to /log the session.

## Common mistakes

- `git add -A` sweeping in unrelated work-in-progress content (e.g., a half-rewritten post marked draft that would unpublish the live version).
- Skipping the dist verification because "check passed" — schema validity ≠ intended visibility.
