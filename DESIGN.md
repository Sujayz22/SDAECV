# SDAECV Design System

This document outlines the visual system, design tokens, component standards, and animation behaviors currently implemented in the SDAECV Next.js application.

---

## 1. Core Principles

*   **Cinematic Depth**: Use multi-layer gradients, overlays, and vignettes to create immersive visual frames, particularly on major header/hero components.
*   **Elegant Warmth**: Contrast deep, dark colors with warm, parchment-like backgrounds (sand/peach) to evoke a welcoming, organic feel.
*   **Dynamic Motion**: Employ smooth animations, hover transitions, dynamic headers, and interactive page components (accordions, timeline elements, menu path-morphing).

---

## 2. Typography

The typeface system combines modern display sans, clean body copy, and a refined editorial serif for long-form content.

*   **Display Font**: `'Plus Jakarta Sans'`, sans-serif (used for main headers, section titles, and action items).
*   **Body Font**: `'Inter'`, sans-serif (used for paragraphs, UI elements, navigation, and lists).
*   **Editorial Serif**: `'Newsreader'`, serif (used for drop-caps, blockquotes, and headers inside the blog article template).

---

## 3. Color Palette

All custom colors are mapped as CSS custom properties in `globals.css` and linked directly into Tailwind CSS 4 theme config.

### Brand Colors
| Token | Hex Value | Visual Usage |
| :--- | :--- | :--- |
| `primary` | `#5b2d9c` | Brand purple. Core button backgrounds, primary accents, active highlights. |
| `secondary` | `#e36520` | Brand orange. Key CTAs ("Plan Your Visit", "Watch Live"), notifications. |
| `accent` | `#448d21` | Brand green. Leaf/nature highlights, tertiary focus. |

### Semantic & Background Palette
| Token | Hex Value | Visual Usage |
| :--- | :--- | :--- |
| `ink` | `#140d23` | Deep purple-black. Site headings, dark section background fills. |
| `sand` | `#f8f4ef` | Warm parchment. Default page background, section contrasts. |
| `peach` | `#fdebd4` | Warm peach. Accent surfaces, highlighted modules, callouts. |
| `muted` | `#7a6d8e` | Muted purple-gray. Secondary subheadings, captions, body copy contrast. |

### Legacy Aliases
*   `dark` / `foreground`: `#140d23`
*   `neutral-surface` / `background`: `#f8f4ef`
*   `denim`: `#2f557f`
*   `ming`: `#3e8391`
*   `blog-primary`: `#004d40`
*   `blog-accent`: `#ffb800`

---

## 4. Shadows & Depth

| Shadow Name | Definition | Aesthetic Objective |
| :--- | :--- | :--- |
| `shadow-soft` | `0 10px 40px -10px rgba(20, 13, 35, 0.08)` | Soft, floating elevation for cards and cards over sand background. |
| `shadow-glow` | `0 0 20px rgba(91, 45, 156, 0.3)` | Luminous aura for active navigation options or premium elements. |
| `shadow-warm` | `0 20px 60px -15px rgba(227, 101, 32, 0.15)` | Dynamic, warm shadow glow specifically under warm/orange highlights. |

---

## 5. Animations & Keyframes

Powered by **Framer Motion** and tailored CSS keyframe animations in `globals.css`:

### CSS Keyframes
*   `slideUp`: Translates from `10px` offset and fades in. Used for staggered content entry.
*   `fadeIn`: Fades opacity from `0` to `1`.
*   `fadeInUp`: Translates from `20px` offset with custom cubic bezier timing.

### Framer Motion Curves
*   Fluid Menu Easing: `[0.76, 0, 0.24, 1]` — used for the navigation curve morphing.
*   Spring Transitions: `[0.6, 0.01, -0.05, 0.9]` — used for micro-interactions.

---

## 6. Key Components

### Navbar
*   **Behavior**: Transparent on mount, transitions to solid colored base on scroll.
*   **Dynamic Assets**: Uses `logo_white.png` when scroll is at zero (over dark heroes) and transitions to `logo.png` (darker branding) when scrolled down.

### Hero
*   **Parallax**: Parallax translation (`translateY(scrollY * 0.4)`) on scroll.
*   **Visual Assets**: Uses `/church.jpg` as full-screen bg.
*   **Effects**: Multi-layered overlay (vignette `radial-gradient(ellipse at center, transparent 40%, rgba(11,8,20,0.7) 100%)`, 3.5% opacity vector noise SVG texture, gradient boundaries).

### CurveMenu
*   **Design**: Full-screen slide-out side menu using custom SVG path morphing (from curved border to flat edge) to deliver a modern, smooth feeling.

### Footer
*   **Design**: Desktop sticky scroll reveal footer using layout overlays and dynamic clip-path boundaries.

### Interactive "About Us" Page
*   **History Timeline**: Vertical sequence detailing milestones.
*   **Beliefs Accordion**: Smooth client-side disclosure controls to expand and collapse church doctrinal statement summaries.
*   **Leadership Grid**: Hover cards with micro-animations highlighting pastors, elders, and ministry directors.
