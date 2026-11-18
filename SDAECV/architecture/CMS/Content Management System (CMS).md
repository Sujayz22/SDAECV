---
tags: [cms, data, configuration]
created: 2026-06-25
---

## Sanity.io
We are using Sanity's **Free Forever** tier as our centralized backend data store ("Content Lake").

### Free Tier Quotas & Guardrails
*   **User Seats:** 20 maximum (allows wide volunteer/staff access).
*   **Documents:** Up to 10,000 unique records (blogs, sermons, events).
*   **API Calls:** 1 Million CDN requests per month.
*   **Media Storage:** 100 GB asset capacity.

### Content Structure
Data models will be decoupled into specific collections mapped via Sanity schemas:
1. `blogs` - Weekly reflections, pastor's notes.
2. `events` - Service times, upcoming church activities, community outreach.
3. `announcements` - Banner updates, urgent notices.
4. users - Profiles, roles, contact information.

---
Next Step: Review user segmentation rules in [[04 Studio Customization]].