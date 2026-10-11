import fs from 'node:fs';

export interface NewspaperStory {
  id: string;
  number: string;
  isLead: boolean;
  title: string;
  subline?: string;
  paragraphs: string[];
  whyMatters?: string;
  sourceUrl?: string;
  sourceText?: string;
}

export function parseNewspaperHtml(filePath: string): NewspaperStory[] {
  if (!fs.existsSync(filePath)) return [];
  const html = fs.readFileSync(filePath, 'utf8');
  const stories: NewspaperStory[] = [];

  // Parse lead story (story-1)
  const leadMatch = html.match(/<article class="lead">([\s\S]*?)<\/article>/i);
  if (leadMatch) {
    const content = leadMatch[1];
    const title = (content.match(/<h2>([\s\S]*?)<\/h2>/i) || [])[1]?.replace(/<[^>]+>/g, '').trim() || '';
    const subline = (content.match(/<p class="deck">([\s\S]*?)<\/p>/i) || [])[1]?.replace(/<[^>]+>/g, '').trim();
    
    const bodyMatch = content.match(/<div class="story-body">([\s\S]*?)<\/div>/i);
    const paragraphs: string[] = [];
    if (bodyMatch) {
      const pMatches = [...bodyMatch[1].matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)];
      for (const p of pMatches) {
        paragraphs.push(p[1].replace(/<[^>]+>/g, '').trim());
      }
    }

    const whyMatch = content.match(/<div class="why">([\s\S]*?)<\/div>/i);
    let whyMatters: string | undefined;
    if (whyMatch) {
      whyMatters = whyMatch[1].replace(/<[^>]+>/g, '').replace(/^為什麼重要[：:]\s*/, '').trim();
    }

    const sourceMatch = content.match(/<a class="source-link" href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i);

    stories.push({
      id: 'story-1',
      number: '01',
      isLead: true,
      title,
      subline,
      paragraphs,
      whyMatters,
      sourceUrl: sourceMatch ? sourceMatch[1] : undefined,
      sourceText: sourceMatch ? sourceMatch[2].replace(/<[^>]+>/g, '').trim() : undefined,
    });
  }

  // Parse stories 2 to 5
  const otherMatches = [...html.matchAll(/<article class="story" id="story-(\d+)">([\s\S]*?)<\/article>/gi)];
  for (const match of otherMatches) {
    const num = match[1];
    const content = match[2];
    const title = (content.match(/<h2>([\s\S]*?)<\/h2>/i) || [])[1]?.replace(/<[^>]+>/g, '').trim() || '';
    const subline = (content.match(/<p class="subline">([\s\S]*?)<\/p>/i) || [])[1]?.replace(/<[^>]+>/g, '').trim();

    const pMatches = [...content.matchAll(/<p(?:\s+[^>]*)?>([\s\S]*?)<\/p>/gi)];
    const paragraphs: string[] = [];
    for (const p of pMatches) {
      if (p[0].includes('class="subline"') || p[0].includes('class="kicker"')) continue;
      paragraphs.push(p[1].replace(/<[^>]+>/g, '').trim());
    }

    const whyMatch = content.match(/<div class="why">([\s\S]*?)<\/div>/i);
    let whyMatters: string | undefined;
    if (whyMatch) {
      whyMatters = whyMatch[1].replace(/<[^>]+>/g, '').replace(/^為什麼重要[：:]\s*/, '').trim();
    }

    const sourceMatch = content.match(/<a class="source-link" href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i);

    stories.push({
      id: `story-${num}`,
      number: String(num).padStart(2, '0'),
      isLead: false,
      title,
      subline,
      paragraphs,
      whyMatters,
      sourceUrl: sourceMatch ? sourceMatch[1] : undefined,
      sourceText: sourceMatch ? sourceMatch[2].replace(/<[^>]+>/g, '').trim() : undefined,
    });
  }

  return stories;
}
