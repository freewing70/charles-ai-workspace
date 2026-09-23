import fs from 'fs';
import path from 'path';
import { generateSearchIndex } from '../src/lib/content';

const ROOT_DIR = process.cwd();
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const OUTPUT_FILE = path.join(PUBLIC_DIR, 'search-index.json');

console.log('[Search Index Builder] Generating static search index for public build...');

// Strictly public items only
const searchIndex = generateSearchIndex(false);

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(searchIndex, null, 2), 'utf-8');
console.log(`\x1b[32m[Success] Built static search index with ${searchIndex.length} items to ${OUTPUT_FILE}\x1b[0m`);
