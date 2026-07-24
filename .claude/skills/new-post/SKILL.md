---
name: new-post
description: Use when Bryce wants to start a new post, project entry, or asks to scaffold content (/new-post <title or slug>)
---

# Scaffold a New Post or Project Entry

## Steps

1. Determine type (post vs project entry) and a kebab-case slug from the title. The filename becomes the URL: `my-post.mdx` → `/writing/my-post/`.
2. Copy the template — `docs/templates/post.mdx` or `docs/templates/project.mdx` — to `src/content/posts/<slug>.mdx` or `src/content/projects/<slug>.mdx`. Templates must NOT be copied into the collection with their `_`/template names.
3. Fill in only: `title`, `description` (one honest sentence, Bryce can rewrite), `date` (today), and for projects `categories` (first = primary). Strip the template's instructional comments. **Keep `draft: true`.**
4. Leave the body as a one-line placeholder — the prose is Bryce's to write (see CLAUDE.md hard rules). Never draft it for him.
5. Add a **Content Pipeline** entry (`collection://7fade333-6e2c-4c42-b0b1-1ec3ff0f7284`): `Status: drafting`, matching Type, one-line Note. If an `idea` entry for it already exists, update that entry's status instead.
6. Tell Bryce the file path and the dev preview URL (localhost:4321). Do not commit — drafts are committed when he chooses.

## Common mistakes

- Removing `draft: true` at scaffold time — publishing is a separate, deliberate step (/publish).
- Writing body prose "to be helpful."
