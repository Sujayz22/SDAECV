---
tags: [architecture, infrastructure, hosting]
created: 2026-06-25
---

# Infrastructure Stack

## Vercel
*   **Tier:** Hobby ($0)
*   **Role:** Production hosting, globally distributed edge network, and execution of static builds.
*   **Limits Tracked:** Up to 100GB/month bandwidth (more than sufficient for low-to-medium church traffic).

## GitHub
*   **Tier:** Free
*   **Role:** Source control hosting. Storing frontend source code in a **private repository** to protect codebase security and environment structural setups.

## Asset Pipeline
*   **Provider:** Sanity Content Lake Media CDN.
*   **Decisions:** Scaled back the initial plan to use Cloudinary. Sanity’s native 100GB asset storage and bandwidth allowance handles image storage directly out of the box, simplifying asset linking.

---
Back to [[00 Project Overview|Project Overview]]