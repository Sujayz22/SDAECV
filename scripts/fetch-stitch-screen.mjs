/**
 * Fetch Stitch screen HTML + screenshot from hosted download URLs.
 * Usage: STITCH_API_KEY=... node scripts/fetch-stitch-screen.mjs <projectId> <screenId> [slug]
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { stitch } from "@google/stitch-sdk";

const [projectId, screenId, slug = screenId] = process.argv.slice(2);
if (!projectId || !screenId) {
  console.error(
    "Usage: node scripts/fetch-stitch-screen.mjs <projectId> <screenId> [folder-slug]",
  );
  process.exit(1);
}

if (!process.env.STITCH_API_KEY) {
  console.error("STITCH_API_KEY is required");
  process.exit(1);
}

const outDir = join(
  process.cwd(),
  "stitch",
  projectId,
  slug,
);

const project = stitch.project(projectId);
const screen = await project.getScreen(screenId);
const htmlUrl = await screen.getHtml();
const imageUrl = await screen.getImage();

console.log("HTML URL:", htmlUrl);
console.log("Image URL:", imageUrl);

await mkdir(outDir, { recursive: true });

const [htmlRes, imgRes] = await Promise.all([
  fetch(htmlUrl),
  fetch(imageUrl),
]);

if (!htmlRes.ok) throw new Error(`HTML download failed: ${htmlRes.status}`);
if (!imgRes.ok) throw new Error(`Image download failed: ${imgRes.status}`);

const html = await htmlRes.text();
const imgBuf = Buffer.from(await imgRes.arrayBuffer());

const contentType = imgRes.headers.get("content-type") ?? "";
const imgExt = contentType.includes("png")
  ? "png"
  : contentType.includes("jpeg") || contentType.includes("jpg")
    ? "jpg"
    : "png";

await Promise.all([
  writeFile(join(outDir, "screen.html"), html, "utf8"),
  writeFile(join(outDir, `screenshot.${imgExt}`), imgBuf),
  writeFile(
    join(outDir, "metadata.json"),
    JSON.stringify(
      {
        projectId,
        screenId,
        slug,
        title: "Church Blog Page",
        htmlUrl,
        imageUrl,
        fetchedAt: new Date().toISOString(),
      },
      null,
      2,
    ),
    "utf8",
  ),
]);

console.log(`Saved to ${outDir}`);
