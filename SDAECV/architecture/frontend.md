# Frontend architecture

## Stack

- Next.js 16 App Router, React 19, TypeScript
- Tailwind CSS 4 — tokens in `app/globals.css` (`@theme`)
- Framer Motion — section and menu animations
- Lenis — `components/SmoothScroll.tsx` wraps the homepage
- Icons: Material Symbols (CDN in `app/layout.tsx`)
- Fonts: Inter (body), Plus Jakarta Sans (display) via `next/font`

## Homepage composition

`app/page.tsx` order:

`Navbar` → `Hero` → `MissionSection` → `MessageSection` → `EventsSection` → `Footer` (all inside `SmoothScroll`).

## Design tokens (`app/globals.css`)

| Token | Value |
|--------|--------|
| primary | `#4b207f` |
| secondary | `#e36520` |
| accent | `#448d21` |
| denim / ming | section card accents |
| dark | `#1d1d20` |

Use Tailwind theme classes (`text-primary`, etc.) — do not hardcode hex in components unless necessary.

## Component conventions

- `'use client'` when using hooks, events, or browser APIs
- One file per major section under `components/`
- **CurveMenu** (`CurveMenu/Menu.tsx`, `Curve.tsx`) — fullscreen nav, SVG curve, Framer variants
- **Footer** — sticky + clip-path parallax on desktop; simpler on mobile

## Animation

- Variants pattern: see `CurveMenu/Menu.tsx`
- CSS keyframes in `globals.css`: `slideUp`, `fadeIn`
- Menu easing: `[0.76, 0, 0.24, 1]`

## Deployment (planned)

Vercel, ISR when CMS is wired — see [[cms-wordpress]].
