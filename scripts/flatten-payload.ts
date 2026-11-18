import * as fs from 'fs';
import * as path from 'path';

function run() {
  const payloadPath = path.join(__dirname, '../data/sanity-migrated-payload.json');
  if (!fs.existsSync(payloadPath)) {
    console.error(`sanity-migrated-payload.json not found`);
    process.exit(1);
  }

  const raw = fs.readFileSync(payloadPath, 'utf8');
  const data = JSON.parse(raw);

  // Flatten everything into a single array
  const allDocs = [
    ...data.categories,
    ...data.authors,
    ...data.posts
  ];

  const outputPath = path.join(__dirname, '../data/all-documents.json');
  fs.writeFileSync(outputPath, JSON.stringify(allDocs, null, 2), 'utf8');
  console.log(`Flattened ${allDocs.length} documents to ${outputPath}`);
}

run();
