---
name: feature
description: Use when starting non-trivial feature work on the workbench site — new functionality, significant refactors, or anything beyond a small fix (/feature <idea>)
---

# Feature Loop — Design to Deployed to Logged

Orchestrates the full workbench feature workflow. Each stage is a REQUIRED SUB-SKILL — this skill only sequences them and adds the site-specific steps the generic skills can't know.

## Sequence

1. **Design** — REQUIRED SUB-SKILL: superpowers:brainstorming (skip only if an approved spec already exists in `docs/superpowers/specs/`). Specs and plans live in `docs/superpowers/`.
2. **Plan** — REQUIRED SUB-SKILL: superpowers:writing-plans.
3. **Isolate** — REQUIRED SUB-SKILL: superpowers:using-git-worktrees. Never build features directly on `main`: push to main auto-deploys production.
4. **Execute** — REQUIRED SUB-SKILL: superpowers:subagent-driven-development.
5. **Finish** — REQUIRED SUB-SKILL: superpowers:finishing-a-development-branch. After merge to main, verify the live site.

## Site constraints that bind every stage

- CLAUDE.md hard rules apply (frozen dependencies; all prose is Bryce's; no co-author trailers; never commit his `src/content/` edits without asking).
- Keep `npm run check` at 0 errors / 0 warnings / 0 hints.

## Post-flight (the part generic skills always skip)

1. Invoke the **log** skill — record the feature session in the Worklog.
2. Hub-and-spoke check: a shipped feature is usually a future post. Search the **Content Pipeline** (`collection://7fade333-6e2c-4c42-b0b1-1ec3ff0f7284`) and add or update the deep-dive idea for this feature.
3. If the feature changed the content workflow or schema, update CLAUDE.md and `docs/templates/`.
