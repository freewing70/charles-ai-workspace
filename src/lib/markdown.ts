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

/**
 * Safely parse markdown content into HTML, ensuring no duplicate H1 tags are rendered.
 */
export function renderMarkdown(content: string): string {
  if (!content) return '';
  return markedInstance.parse(content) as string;
}
