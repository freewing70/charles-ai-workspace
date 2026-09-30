import rss from '@astrojs/rss';
import { getAllItems } from '../lib/content';
import { getContentRoute } from '../lib/assets';

export async function GET(context) {
  const items = getAllItems(false);

  return rss({
    title: 'FreewingBiz · Charles AI Workspace',
    description: 'AI × Knowledge × Creation × A Better Tomorrow — 探索、學習、創作與分享個人 AI 工作資產。',
    site: context.site || 'https://freewing.biz',
    items: items.map((item) => ({
      title: item.meta.title,
      pubDate: new Date(item.meta.created || item.meta.updated),
      description: item.meta.summary,
      link: getContentRoute(item.meta.type, item.meta.id),
      customData: `<category>${item.meta.category}</category>`,
    })),
    customData: `<language>zh-tw</language>`,
  });
}
