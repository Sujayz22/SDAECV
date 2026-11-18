o# Dev delta (change-only)

Append a short block per session. Agents: read this when continuing work or when `@dev-delta.md` is attached.

## 2026-06-04

- **Done:** Lean context workflow scaffolded (Cursor rules, vault split, slim WARP, AGENTS.md).
- **Touch:** `.cursor/rules/*`, `SDAECV/**`, `WARP.md`, `AGENTS.md`, `.gitignore`
- **Intent:** Minimize token usage; Tier 2 docs only for CMS/security tasks.
- **Skip:** Full codebase exploration; CMS architecture notes for UI-only tasks.
- **Next:** Use delta + `@` file refs for normal feature work.
- **Fix:** Fixed blog layout and navbar styling so that the fixed footer doesn't overlap contents (added `z-10` to main containers) and navbar links are visible on light backgrounds (added `dark` prop).
- **Touch:** `components/Navbar.tsx`, `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`
- **Intent:** Restore designed blog pages stack order and text visibility.
- **Feature:** Designed a premium, awards-worthy footer branding section with the church logo (using a styled gradient background container with the material church symbol) and church name. Styled CTA buttons and social media links with micro-animations and glowing details to make the website feel highly premium.
- **Touch:** `components/FooterContent.tsx`
- **Intent:** Make footer brand-cohesive and awards-worthy as requested.
## 2026-06-05 (Session 1)

- **Done:** Switched the Navbar logo dynamically between `/logo_white.png` and `/logo.png` based on scroll state, menu state, and dark/light theme logic. Updated Footer logo to use the correct white logo asset.
- **Touch:** `components/Navbar.tsx`, `components/FooterContent.tsx`
- **Intent:** Ensure brand-correct white logo is used on dark/transparent backgrounds, and dark logo is used on scrolled light backgrounds.

## 2026-06-06 (Session 1)

- **Done:** Initiating creation of `/connect` page with a prayer request form and informational sections.
- **Touch:** `app/connect/page.tsx` [NEW], `app/connect/ConnectClient.tsx` [NEW]
- **Intent:** Provide a premium prayer request form and connection info page following the church visual design.

## 2026-06-08 (Session 1)

- **Done:** Researched mapcn, downloaded source components, and installed dependencies (`maplibre-gl`, `lucide-react`).
- **Touch:** `components/ui/map.tsx` [NEW], `app/history/HistoryClient.tsx`
- **Intent:** Integrate mapcn map and scroll-staggered flight arcs from Vellore on the history page.

## 2026-06-08 (Session 2)

- **Done:** Swapped style URLs to OpenFreeMap, locked container heights via style attributes, added ResizeObserver triggers to auto-resize canvas, and added CDN layout stylesheet. Verified successful build and rendering.
- **Touch:** `components/ui/map.tsx`, `app/layout.tsx`, `app/history/WorldMapSection.tsx`
- **Intent:** Resolve map visibility and rendering collapse issues on the history page.

## 2026-06-25 (Session 1)

- **Done:** Created visual contrast for the CTA bottom sections so they don't blend with the footer.
- **Touch:** `app/about/page.tsx`, `app/connect/ConnectClient.tsx`
- **Intent:** Update CTA sections to use the clean light cream container layout to separate them visually from the dark footer.

## 2026-07-01 (Session 1)

- **Done:** Initiating overhaul of the About page, including scroll-scaling hero video, magnetic hover effect, and "Local Commitments" section.
- **Touch:** `app/about/page.tsx`, `app/about/AboutClient.tsx`
- **Intent:** Redesign the About page to improve visual engagement and connect to the History page.

## 2026-07-02 (Session 1)

- **Done:** Planning layout update for Connect page to support tabs toggling between 'Prayer & Inquiries' and 'Our Ministries'.
- **Touch:** `app/connect/ConnectClient.tsx`
- **Intent:** Allow users to toggle between 'Prayer & Inquiries' and 'Our Ministries' containing the 7 active church ministries.

## 2026-07-02 (Session 2)

- **Done:** Created `/media/videos` page, populated playlists from YouTube (Graceful Giants: 13 videos, Let's Sing: 9 videos), added livestream, and updated Navbar dropdown.
- **Touch:** `components/Navbar.tsx`, `app/media/videos/page.tsx` [NEW], `app/media/videos/VideosClient.tsx` [NEW]
- **Intent:** Provide a high-quality video archive and livestream showcase integrated into the navigation.

## 2026-07-02 (Session 3)

- **Done:** Initiating implementation of Smart API Shield Route, interactive Watch Live component, and Video Embed & Grid component.
- **Touch:** `app/api/live-check/route.ts` [NEW], `components/WatchLiveButton.tsx` [NEW], `components/VideoEmbedGrid.tsx` [NEW]
- **Intent:** Protect YouTube Data API quota with smart gatekeeping/caching and show real-time live status on the frontend.

## 2026-07-02 (Session 4)

- **Done:** Modified WatchLiveButton to hide entirely when offline, removed "Live Stream" navigation link from dropdown, and bypassed time gate check for live testing.
- **Touch:** `components/WatchLiveButton.tsx`, `components/Navbar.tsx`, `app/api/live-check/route.ts`
- **Intent:** Streamline navigation layout, hide offline buttons, and allow testing of YouTube live status dynamically at any time.

## 2026-07-03 (Session 1)

- **Done:** Integrated calendar events with Add to Calendar dropdown action buttons (Google / Apple Calendars) adjusting GMT offset. Configured mobile auto-hide logic for the floating quick connect widget when the mobile navbar menu opens. Corrected weekly program names and timings (Friday AY Service at 7:30 PM, Saturday Sabbath School at 8:45 AM, Divine Service at 10:30 AM, Outreach at 3:30 PM, and Saturday Vespers at 5:00 PM) across the site.
- **Touch:** `lib/calendar.ts` [NEW], `components/AddToCalendar.tsx` [NEW], `app/events/EventsClient.tsx`, `components/EventsSection.tsx`, `components/Navbar.tsx`, `components/QuickConnectWidget.tsx`, `app/globals.css`, `components/WelcomeSection.tsx`, `components/FooterContent.tsx`, `app/visit/VisitClient.tsx`, `app/connect/ConnectClient.tsx`, `app/media/videos/VideosClient.tsx`, `components/MessageSection.tsx`, `components/AnnouncementsSection.tsx`
- **Intent:** Implement calendar actions, apply responsive menu mobile widget auto-hiding, and correct all site schedules.

