import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://freewingbiz.com',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/search') && !page.includes('/projects') && !page.includes('/notes')
    })
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});
