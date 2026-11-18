# Agents

Lean context workflow — minimize tokens during development.

## Always (automatic)

- `.cursor/rules/sdaecv-index.mdc` — stack, paths, when to load deep docs

## Scoped (when matching files are open)

- `sdaecv-components.mdc` — `components/**`
- `sdaecv-app.mdc` — `app/**`

## On demand only

- `SDAECV/dev-delta.md` — current session: touched files, intent, skip list
- `SDAECV/00-index.md` — links to architecture notes
- `WARP.md` — commands + index (not full spec)

Do **not** read `SDAECV/architecture/cms-wordpress.md` or `security.md` for isolated UI/component edits.

## Prompt pattern

1. Update `SDAECV/dev-delta.md` (3–5 lines).
2. One-sentence goal + `@` only files you expect to change.
3. Avoid “explore the codebase” unless structure is unknown.
