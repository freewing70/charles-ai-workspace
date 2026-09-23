import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { ContentMetadataSchema, type ContentMetadata, type SearchIndexItem } from './schema';
import { getContentRoute } from './assets';

const ROOT_DIR = process.cwd();
const DATA_ITEMS_PATH = path.join(ROOT_DIR, 'data', 'items.json');
const CONTENT_DIR = path.join(ROOT_DIR, 'content');

export interface LoadedItem {
  meta: ContentMetadata;
  content: string; // Markdown body or HTML
  filePath?: string;
}

/**
 * Loads all items. If includePrivate is false (default in public build),
 * items with visibility === 'private' are strictly discarded.
 */
export function getAllItems(includePrivate = false): LoadedItem[] {
  const items: LoadedItem[] = [];
  const seenIds = new Set<string>();

  // 1. Read from data/items.json if exists
  if (fs.existsSync(DATA_ITEMS_PATH)) {
    try {
      const raw = fs.readFileSync(DATA_ITEMS_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        for (const rawItem of parsed) {
          const validated = ContentMetadataSchema.parse(rawItem);
          if (!includePrivate && validated.visibility === 'private') {
            continue;
          }
          if (seenIds.has(validated.id)) {
            console.warn(`[Content Warning] Duplicate ID detected: ${validated.id}`);
            continue;
          }
          seenIds.add(validated.id);

          let bodyContent = '';
          if (validated.contentPath) {
            const resolvedPath = path.resolve(ROOT_DIR, validated.contentPath);
            if (fs.existsSync(resolvedPath)) {
              bodyContent = fs.readFileSync(resolvedPath, 'utf-8');
            }
          }

          items.push({
            meta: validated,
            content: bodyContent,
            filePath: validated.contentPath,
          });
        }
      }
    } catch (err) {
      console.error('Error reading data/items.json:', err);
    }
  }

  // 2. Scan content/ directory subfolders: skills, tutorials, presentations, projects, notes
  if (fs.existsSync(CONTENT_DIR)) {
    const subdirs = fs.readdirSync(CONTENT_DIR);
    for (const subdir of subdirs) {
      const subpath = path.join(CONTENT_DIR, subdir);
      if (fs.statSync(subpath).isDirectory()) {
        const files = fs.readdirSync(subpath);
        for (const file of files) {
          if (file.endsWith('.md') || file.endsWith('.markdown')) {
            const filePath = path.join(subpath, file);
            const rawContent = fs.readFileSync(filePath, 'utf-8');
            const { data, content } = matter(rawContent);

            // Infer ID and type if missing
            const inferredId = data.id || path.basename(file, path.extname(file));
            const inferredType = data.type || subdir.replace(/s$/, ''); // e.g. skills -> skill

            try {
              const metaCandidate = {
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

              const validated = ContentMetadataSchema.parse(metaCandidate);

              if (!includePrivate && validated.visibility === 'private') {
                continue;
              }

              if (seenIds.has(validated.id)) {
                // Already loaded, don't duplicate
                continue;
              }
              seenIds.add(validated.id);

              items.push({
                meta: validated,
                content,
                filePath,
              });
            } catch (validationErr) {
              console.warn(`[Content Validation Error] File ${filePath}:`, validationErr);
            }
          }
        }
      }
    }
  }

  // Sort by updated date descending
  return items.sort((a, b) => b.meta.updated.localeCompare(a.meta.updated));
}

export function getItemById(id: string, includePrivate = false): LoadedItem | undefined {
  const all = getAllItems(includePrivate);
  return all.find((item) => item.meta.id === id);
}

export function getItemsByType(type: string, includePrivate = false): LoadedItem[] {
  const all = getAllItems(includePrivate);
  return all.filter((item) => item.meta.type === type);
}

export function generateSearchIndex(includePrivate = false): SearchIndexItem[] {
  const items = getAllItems(includePrivate);
  // Exclude private and unlisted from public search index
  const searchable = items.filter(
    (item) => item.meta.visibility === 'public'
  );

  return searchable.map((item) => ({
    id: item.meta.id,
    title: item.meta.title,
    type: item.meta.type,
    category: item.meta.category,
    summary: item.meta.summary,
    tags: item.meta.tags,
    tools: item.meta.tools,
    created: item.meta.created,
    updated: item.meta.updated,
    url: getContentRoute(item.meta.type, item.meta.id),
    cover: item.meta.cover,
    featured: item.meta.featured,
  }));
}
