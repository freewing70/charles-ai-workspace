import { Marked } from 'marked';

const markedInstance = new Marked();

// Override heading renderer to convert any H1 (depth 1) into H2 (depth 2)
// This guarantees that rendered markdown content never creates duplicate H1 tags on detail pages
markedInstance.use({
  renderer: {
    heading({ tokens, depth }) {
      const text = this.parser.parseInline(tokens);
      const level = depth === 1 ? 2 : depth;
      return `<h${level}>${text}</h${level}>\n`;
    }
  }
});

const ALERT_CONFIG: Record<string, { icon: string; title: string; className: string }> = {
  NOTE: { icon: 'ℹ️', title: '附註說明 · Note', className: 'alert-note' },
  TIP: { icon: '💡', title: '實戰訣竅 · Pro Tip', className: 'alert-tip' },
  IMPORTANT: { icon: '⚡', title: '重要原則 · Important', className: 'alert-important' },
  WARNING: { icon: '⚠️', title: '關鍵警告 · Warning', className: 'alert-warning' },
  CAUTION: { icon: '🚨', title: '高危警示 · Caution', className: 'alert-caution' },
};

/**
 * Safely parse markdown content into HTML, ensuring no duplicate H1 tags are rendered
 * and transforming GitHub style alert blocks into rich callouts.
 */
export function renderMarkdown(content: string): string {
  if (!content) return '';
  let html = markedInstance.parse(content) as string;

  // Transform GitHub style blockquote alerts: > [!CAUTION] / > [!TIP]
  html = html.replace(
    /<blockquote>\s*<p>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\](?:\s*<br\s*\/?>)?([\s\S]*?)<\/blockquote>/gi,
    (_, type: string, body: string) => {
      const key = type.toUpperCase();
      const cfg = ALERT_CONFIG[key] || ALERT_CONFIG.NOTE;
      return `<div class="alert-callout ${cfg.className}">
  <div class="alert-title">${cfg.icon} <span>${cfg.title}</span></div>
  <div class="alert-body"><p>${body.trim()}</p></div>
</div>`;
    }
  );

  return html;
}
