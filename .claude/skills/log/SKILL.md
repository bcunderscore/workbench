---
name: log
description: Use when Bryce says "log this session", invokes /log, or a working session is wrapping up with meaningful progress worth recording
---

# Log Session to Worklog

Record what happened this session in the Notion Worklog so future posts have raw material.

## Steps

1. Summarize the session in 2–4 factual bullets: what was done, what was surprising, any gotcha a future post could use. This is a log, not prose — Bryce's writing voice is not required here.
2. Create one entry in the **Worklog** data source: `collection://2b0cdf0c-9e59-4165-83fe-f0cf7e2350a2` (Notion MCP, `notion-create-pages`).
   - `Entry`: short title (what the session was)
   - `date:Date:start`: today (YYYY-MM-DD)
   - `Area`: one of `site | keyboards | 3d printing | software | writing`
   - `Post-worthy`: `__YES__` if any bullet could seed or feed a post
   - `Notes`: the bullets, single paragraph
3. Check the last entry first (`notion-search` in that data source) — if one already covers today's work, update it instead of duplicating.
4. If the session surfaced a NEW post idea, add it to the **Content Pipeline** (`collection://7fade333-6e2c-4c42-b0b1-1ec3ff0f7284`) as `Status: idea` with a one-line Note. Don't duplicate existing ideas — search the pipeline first.

## Common mistakes

- Writing polished prose — bullets are enough; over-writing kills the habit.
- Logging routine noise (dependency bumps, typo fixes) as post-worthy.
