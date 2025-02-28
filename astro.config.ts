import path from 'node:path';

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import { toString } from 'mdast-util-to-string';
import getReadingTime from 'reading-time';

export default defineConfig({
  build: {
    assets: '_assets',
    inlineStylesheets: 'always'
  },
  compressHTML: true,
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en',
          fr: 'fr'
        }
      }
    }),
    mdx()
  ],
  markdown: {
    remarkPlugins: [
      () => {
        return function (tree, { data }) {
          const textOnPage = toString(tree);
          const readingTime = getReadingTime(textOnPage);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          (data.astro as any).frontmatter.readingTime = readingTime.minutes;
        };
      }
    ]
  },
  output: 'static',
  server: {
    port: 3000
  },
  site: 'https://douglasneuroinformatics.ca',
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, 'src')
      }
    }
  }
});
