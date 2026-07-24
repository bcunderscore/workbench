# workbench — brycecampbell.com

Bryce Campbell's personal portfolio + blog. Astro 7 + Tailwind 4 + MDX, fully static,
TypeScript strict. Deployed on Vercel: **every push to `main` deploys to production**
at https://brycecampbell.com.

## Commands

- `npm run dev` — dev server at localhost:4321 (Astro 7 runs it as a background daemon;
  `npx astro dev stop` / `status` / `logs` to manage it)
- `npm test` — vitest (covers `src/lib/`)
- `npm run check` — astro check; keep it at 0 errors / 0 warnings / 0 hints
- `npm run build` — production build (drafts excluded)

## Hard rules

- **All prose is Bryce's.** Never write, expand, or polish post/page/project prose —
  scaffold structure, frontmatter, and factual specs only, and flag anything drafted
  as placeholder for his rewrite. Writing practice is a goal of this site.
- **No `Co-Authored-By` trailers** in commit messages — commits are attributed to
  Bryce alone.
- **Don't commit files under `src/content/`** that Bryce has edited without asking —
  push = publish.
- Dependencies are deliberately minimal; don't add packages without asking.

## Workflow commands (.claude/skills/)

- `/feature <idea>` — full feature loop (superpowers chain + worktree + post-flight logging)
- `/new-post <title>` — scaffold content from docs/templates + pipeline entry
- `/publish` — content preflight (visibility diff, asset check, build verify) then ship
- `/log` — session summary to the Notion Worklog

## Architecture notes

- Content: two collections in `src/content.config.ts` (`projects`, `posts`).
  Copy `docs/templates/post.mdx` or `project.mdx` into the collection folder to
  create entries — the templates document every frontmatter field. (They live in
  docs/ because the dev watcher doesn't reliably honor the `!_*` glob exclusion.)
- Drafts: `draft: true` renders in dev only; `publishedOnly()` (src/lib/content.ts)
  must wrap every `getCollection` call.
- Categories are single-sourced as `PROJECT_CATEGORIES` in content.config.ts;
  first category in a project's list is its primary (activity-stream label).
- Theming: two-theme "cutting mat" system via CSS custom properties on
  `data-theme` (black default / green), all tokens in `src/styles/global.css`.
  Design references in `docs/design-refs/`.
- Shared UI: `Card.astro` is the base for Project/Post cards; `label-mono` and
  `btn-accent` utilities in global.css; date formatting via `src/lib/dates.ts`.
- Spec and plan history: `docs/superpowers/`.

## Known deferred items

- Green Mat body-text contrast is below WCAG AA — planned design pass, don't hotfix.
