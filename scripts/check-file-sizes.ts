import fs from 'fs';
import path from 'path';

const MAX_FILE_SIZE_MB = 10;
const WARN_FILE_SIZE_MB = 5;

const ASSETS_DIR = path.resolve(process.cwd(), 'public/assets');
const CONTENT_DIR = path.resolve(process.cwd(), 'content');

function checkDir(dir: string) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      checkDir(fullPath);
    } else {
      const stats = fs.statSync(fullPath);
      const sizeMB = stats.size / (1024 * 1024);

      if (sizeMB > MAX_FILE_SIZE_MB) {
        console.error(`\x1b[31m[ERROR] File too large: ${fullPath} (${sizeMB.toFixed(2)} MB > ${MAX_FILE_SIZE_MB} MB threshold).\x1b[0m`);
        console.error('Large binaries (videos, high-res archives, large PDFs) must be hosted on Object Storage (R2/S3) instead of Git.');
        process.exit(1);
      } else if (sizeMB > WARN_FILE_SIZE_MB) {
        console.warn(`\x1b[33m[WARNING] File size is high: ${fullPath} (${sizeMB.toFixed(2)} MB). Consider moving to Object Storage.\x1b[0m`);
      }
    }
  }
}

console.log('[Audit] Checking static assets and content file sizes...');
checkDir(ASSETS_DIR);
checkDir(CONTENT_DIR);
console.log('\x1b[32m[Audit Pass] All assets comply with Git storage limits.\x1b[0m');
