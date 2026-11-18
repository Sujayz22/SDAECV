# WARP.md

Guidance for WARP (warp.dev) and agents. **Keep this file short** — deep specs live in the vault.

## Project

SDA English Church Vellore (SDAECV) — Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4.

## Commands

```bash
npm run dev      # localhost:3000
npm run build
npm run start
npm run lint
```

## Context index (read on demand)

| Topic | Path |
|--------|------|
| Vault hub | `SDAECV/00-index.md` |
| Session scope (change-only) | `SDAECV/dev-delta.md` |
| Frontend, tokens, sections | `SDAECV/architecture/frontend.md` |
| WordPress, ISR, API | `SDAECV/architecture/cms-wordpress.md` |
| Security & performance | `SDAECV/architecture/security.md` |
| Cursor agents | `AGENTS.md` |

**Default for UI work:** `@` changed files + `dev-delta.md` only. Do not load CMS/security docs unless the task requires them.

## Current code reality

Phase 1 homepage is static in `components/` — no WordPress fetch layer in repo yet. CMS notes describe the target architecture.
