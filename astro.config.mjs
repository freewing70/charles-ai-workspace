import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://freewingbiz.com',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/search')
    })
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});
