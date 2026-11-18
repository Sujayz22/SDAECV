---
tags: [automation, workflow, git]
created: 2026-06-25
---


## Content Publishing Pipeline

```mermaid
graph TD
    A[Staff Logs into Sanity Studio] --> B[Edits/Publishes a Document]
    B --> C[Sanity Saves to Cloud CDN]
    C --> D[Sanity Webhook fires a POST request]
    D --> E[Vercel receives webhook ping]
    E --> F[Vercel fetches raw API data]
    F --> G[Vercel compiles static HTML/CSS/JS]
    G --> H[Site goes live instantly]