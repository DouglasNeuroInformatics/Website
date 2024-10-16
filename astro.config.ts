import path from 'node:path';

import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';

export default defineConfig({
  build: {
    assets: '_assets'
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
    tailwind({
      configFile: path.resolve(import.meta.dirname, 'tailwind.config.cjs')
    })
  ],
  output: 'static',
  server: {
    port: 3000
  },
  site: 'https://douglasneuroinformatics.ca',
  vite: {
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, 'src')
      }
    }
  }
});
