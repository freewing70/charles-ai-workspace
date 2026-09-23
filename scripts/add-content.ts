import fs from 'fs';
import path from 'path';
import readline from 'readline';

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query: string): Promise<string> =>
  new Promise((resolve) => rl.question(query, resolve));

async function main() {
  console.log('\x1b[36m=== Charles AI Workspace - 新增內容精靈 ===\x1b[0m\n');

  const rawTitle = await question('1. 標題 (Title): ');
  if (!rawTitle.trim()) {
    console.error('標題不可為空！');
    process.exit(1);
  }

  const rawType = await question('2. 類型 [skill / tutorial / presentation / project / note] (預設 skill): ');
  const type = ['skill', 'tutorial', 'presentation', 'project', 'note'].includes(rawType.trim())
    ? rawType.trim()
    : 'skill';

  const defaultId = slugify(rawTitle);
  const rawId = await question(`3. 唯一識別碼 ID (預設: ${defaultId}): `);
  const id = rawId.trim() || defaultId;

  const rawCategory = await question('4. 分類 Category (例如 Image Generation / Prompt / Dev): ');
  const category = rawCategory.trim() || 'General';

  const rawSummary = await question('5. 簡要描述 Summary: ');
  const summary = rawSummary.trim() || '尚無描述';

  const rawTags = await question('6. 標籤 Tags (以逗號分隔，例如 AI, Prompt, Workflow): ');
  const tags = rawTags
    ? rawTags.split(',').map((t) => t.trim()).filter(Boolean)
    : [];

  const rawTools = await question('7. 使用工具 Tools (以逗號分隔，例如 Codex, Midjourney): ');
  const tools = rawTools
    ? rawTools.split(',').map((t) => t.trim()).filter(Boolean)
    : [];

  const rawVisibility = await question('8. 可見度 Visibility [public / private / unlisted] (預設 public): ');
  const visibility = ['public', 'private', 'unlisted'].includes(rawVisibility.trim())
    ? rawVisibility.trim()
    : 'public';

  const today = new Date().toISOString().split('T')[0];

  const frontmatter = `---
id: "${id}"
title: "${rawTitle.trim()}"
type: "${type}"
category: "${category}"
summary: "${summary}"
created: "${today}"
updated: "${today}"
version: "1.0"
status: "active"
visibility: "${visibility}"
tags: ${JSON.stringify(tags)}
tools: ${JSON.stringify(tools)}
cover: "/assets/placeholder.svg"
featured: false
---

# ${rawTitle.trim()}

在此撰寫主要內容、指引或說明...
`;

  const targetDir = path.join(process.cwd(), 'content', `${type}s`);
  fs.mkdirSync(targetDir, { recursive: true });
  const targetFile = path.join(targetDir, `${id}.md`);

  if (fs.existsSync(targetFile)) {
    console.error(`\x1b[31m[Error] 檔案已存在: ${targetFile}\x1b[0m`);
    process.exit(1);
  }

  fs.writeFileSync(targetFile, frontmatter, 'utf-8');
  console.log(`\n\x1b[32m[Success] 成功建立新內容項目：${targetFile}\x1b[0m`);
  console.log('請直接編輯該 Markdown 檔案，隨後執行驗證與建置。');
  rl.close();
}

main().catch((err) => {
  console.error(err);
  rl.close();
  process.exit(1);
});
