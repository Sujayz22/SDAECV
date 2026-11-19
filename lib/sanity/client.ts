import { createClient } from "next-sanity";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2026-07-05",
  useCdn: true, // Set to false if you need to bypass CDN for real-time reads
});

// Authenticated client for mutations (only used in server API routes / Server Actions)
export const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2026-07-05",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});
