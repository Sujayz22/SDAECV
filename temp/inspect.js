const fs = require('fs');
const path = require('path');

const docsPath = path.join(__dirname, '../data/all-documents.json');
if (!fs.existsSync(docsPath)) {
  console.error('File not found:', docsPath);
  process.exit(1);
}

const docs = JSON.parse(fs.readFileSync(docsPath, 'utf8'));
console.log('Total documents:', docs.length);

const types = {};
for (const doc of docs) {
  types[doc._type] = (types[doc._type] || 0) + 1;
}

console.log('Document types summary:');
console.log(JSON.stringify(types, null, 2));
