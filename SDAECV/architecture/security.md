# Security & performance

Load with [[cms-wordpress]] work or deployment/hardening tasks — not for routine UI edits.

## WordPress hardening

- Disable XML-RPC
- Limit login attempts
- CORS restricted to frontend domain
- Public REST limited to public content
- Do not expose WP admin in the public UI

## Frontend performance

- No client-side fetch for main content
- `next/image` for images
- Lazy-load YouTube embeds
- Avoid unnecessary dependencies
- Lighthouse target: 90+
