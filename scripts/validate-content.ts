import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { ContentMetadataSchema } from '../src/lib/schema';

const ROOT_DIR = process.cwd();
const CONTENT_DIR = path.join(ROOT_DIR, 'content');
const DATA_ITEMS = path.join(ROOT_DIR, 'data', 'items.json');

let hasError = false;
const seenIds = new Set<string>();

console.log('[Validator] Validating metadata schema across content files...');

// 1. Check data/items.json if exists
if (fs.existsSync(DATA_ITEMS)) {
  try {
    const raw = fs.readFileSync(DATA_ITEMS, 'utf-8');
    const items = JSON.parse(raw);
    for (const item of items) {
      const res = ContentMetadataSchema.safeParse(item);
      if (!res.success) {
        console.error(`[Schema Error] data/items.json item ${item.id || 'unknown'}:`, res.error.format());
        hasError = true;
      } else {
        if (seenIds.has(res.data.id)) {
          console.error(`[Duplicate ID Error] ID '${res.data.id}' is repeated in data/items.json`);
          hasError = true;
        }
        seenIds.add(res.data.id);
      }
    }
  } catch (err) {
    console.error('Failed to parse data/items.json:', err);
    hasError = true;
  }
}

// 2. Check content/ directory
if (fs.existsSync(CONTENT_DIR)) {
  const subdirs = fs.readdirSync(CONTENT_DIR);
  for (const subdir of subdirs) {
    const subpath = path.join(CONTENT_DIR, subdir);
    if (fs.statSync(subpath).isDirectory()) {
      const files = fs.readdirSync(subpath);
      for (const file of files) {
        if (file.endsWith('.md') || file.endsWith('.markdown')) {
          const filePath = path.join(subpath, file);
          const raw = fs.readFileSync(filePath, 'utf-8');
          const { data } = matter(raw);

          const inferredId = data.id || path.basename(file, path.extname(file));
          const inferredType = data.type || subdir.replace(/s$/, '');

          const payload = {
            id: inferredId,
            title: data.title || inferredId,
            type: inferredType,
            category: data.category || 'General',
            summary: data.summary || '',
            created: data.created || new Date().toISOString().split('T')[0],
            updated: data.updated || new Date().toISOString().split('T')[0],
            version: data.version || '1.0',
            status: data.status || 'active',
            visibility: data.visibility || 'public',
            tags: Array.isArray(data.tags) ? data.tags : [],
            tools: Array.isArray(data.tools) ? data.tools : [],
            cover: data.cover,
            featured: Boolean(data.featured),
            relatedSkills: data.relatedSkills,
            relatedProjects: data.relatedProjects,
            relatedPresentations: data.relatedPresentations,
            playUrl: data.playUrl,
            repositoryUrl: data.repositoryUrl,
            downloadUrl: data.downloadUrl,
          };

          const res = ContentMetadataSchema.safeParse(payload);
          if (!res.success) {
            console.error(`[Schema Error] File ${filePath}:`, res.error.format());
            hasError = true;
          } else {
            if (seenIds.has(res.data.id)) {
              console.error(`[Duplicate ID Error] Duplicate ID '${res.data.id}' found in ${filePath}`);
              hasError = true;
            }
            seenIds.add(res.data.id);
          }
        }
      }
    }
  }
}

if (hasError) {
  console.error('\x1b[31m[Validation Failed] Content metadata validation found errors.\x1b[0m');
  process.exit(1);
} else {
  console.log(`\x1b[32m[Validation Success] All ${seenIds.size} content entries passed schema validation.\x1b[0m`);
}
