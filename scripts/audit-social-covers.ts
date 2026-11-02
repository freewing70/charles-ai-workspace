import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { execSync } from 'node:child_process';

const contentDirs = [
  'content/skills',
  'content/tutorials',
  'content/newspapers',
  'content/notes',
  'content/presentations',
  'content/projects',
];

// Get list of git tracked files
const trackedFiles = new Set(
  execSync('git ls-files', { encoding: 'utf-8' })
    .split('\n')
    .map(f => f.trim().replace(/\\/g, '/'))
    .filter(Boolean)
);

console.log('==============================================');
console.log('🔍 FULL-SITE SOCIAL COVER & OG:IMAGE AUDIT');
console.log('==============================================\n');

let issuesFound = 0;
let checkedCount = 0;

// 1. Check default layout fallback image
const defaultFallback = 'public/assets/freewing-hero-reference.png';
if (!fs.existsSync(defaultFallback)) {
  console.error(`❌ MainLayout default image missing: ${defaultFallback}`);
  issuesFound++;
} else if (!trackedFiles.has(defaultFallback)) {
  console.error(`❌ MainLayout default image untracked in Git: ${defaultFallback}`);
  issuesFound++;
} else {
  console.log(`✓ MainLayout default fallback: ${defaultFallback} (OK, tracked in Git)`);
}

// 2. Scan all content markdown files
for (const dir of contentDirs) {
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));

  for (const file of files) {
    const filePath = path.join(dir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(content);
    checkedCount++;

    const cover = data.cover;
    const isLocalOnly = !trackedFiles.has(filePath.replace(/\\/g, '/'));

    // If the content file itself is untracked (e.g. unpublished parts), note it
    if (isLocalOnly) {
      // It's unpublished local draft, but still check if its cover exists
    }

    if (!cover) {
      console.warn(`⚠️ [${dir}/${file}] No cover defined in frontmatter`);
      continue;
    }

    // Resolve what MainLayout does:
    // If ends with .svg -> rewrites to .png
    let resolvedCover = cover;
    if (cover.endsWith('.svg')) {
      resolvedCover = cover.replace(/\.svg$/, '.png');
    }

    const localAssetPath = path.join('public', resolvedCover.replace(/^\//, '')).replace(/\\/g, '/');

    // Check if resolved file exists
    if (!fs.existsSync(localAssetPath)) {
      console.error(`❌ [${file}] OG Image NOT FOUND on disk: ${localAssetPath} (from cover: ${cover})`);
      issuesFound++;
      continue;
    }

    // Check if resolved file is an SVG (Social crawlers don't render SVG)
    if (resolvedCover.endsWith('.svg')) {
      console.error(`❌ [${file}] OG Image is SVG (will break on Threads/FB/X): ${resolvedCover}`);
      issuesFound++;
      continue;
    }

    // If the article is published (tracked in Git), the cover MUST be tracked in Git!
    if (!isLocalOnly && !trackedFiles.has(localAssetPath)) {
      console.error(`❌ [${file}] Published article's cover is UNTRACKED in Git (will 404 online!): ${localAssetPath}`);
      issuesFound++;
      continue;
    }

    // Check file extension
    const ext = path.extname(localAssetPath).toLowerCase();
    if (!['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) {
      console.error(`❌ [${file}] Non-standard raster image format: ${ext}`);
      issuesFound++;
      continue;
    }
  }
}

// 3. Scan static pages in src/pages
const staticPages = [
  'src/pages/index.astro',
  'src/pages/about.astro',
  'src/pages/privacy.astro',
  'src/pages/search.astro',
  'src/pages/timeline.astro',
  'src/pages/skills/index.astro',
  'src/pages/tutorials/index.astro',
  'src/pages/newspapers/index.astro',
  'src/pages/presentations/index.astro',
  'src/pages/projects/index.astro',
  'src/pages/notes/index.astro',
];

for (const page of staticPages) {
  if (!fs.existsSync(page)) continue;
  const pageContent = fs.readFileSync(page, 'utf-8');
  checkedCount++;

  // Check if page specifies an image prop in <MainLayout ... image="..."
  const match = pageContent.match(/<MainLayout[^>]*\bimage=["']([^"']+)["']/);
  if (match) {
    const imgProp = match[1];
    let resolved = imgProp.endsWith('.svg') ? imgProp.replace(/\.svg$/, '.png') : imgProp;
    const diskPath = path.join('public', resolved.replace(/^\//, '')).replace(/\\/g, '/');

    if (!fs.existsSync(diskPath)) {
      console.error(`❌ [${page}] Image prop NOT FOUND on disk: ${diskPath}`);
      issuesFound++;
    } else if (!trackedFiles.has(diskPath)) {
      console.error(`❌ [${page}] Image prop UNTRACKED in Git: ${diskPath}`);
      issuesFound++;
    } else {
      console.log(`✓ [${page}] Custom cover: ${diskPath} (OK, tracked in Git)`);
    }
  } else {
    // Uses default fallback
    console.log(`✓ [${page}] Uses MainLayout default fallback (OK)`);
  }
}

console.log('\n==============================================');
console.log(`Audit Summary: Checked ${checkedCount} items.`);
if (issuesFound === 0) {
  console.log('🎉 ALL PUBLISHED COVERS & OG:IMAGES PASS AUDIT! ZERO ISSUES FOUND.');
} else {
  console.log(`⚠️ FOUND ${issuesFound} ISSUES REQUIRING ATTENTION.`);
}
console.log('==============================================');
