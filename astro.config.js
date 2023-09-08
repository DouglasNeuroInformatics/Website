import { defineConfig, sharpImageService } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from "@astrojs/react";
import getReadingTime from 'reading-time';
import { toString } from 'mdast-util-to-string';

// https://astro.build/config
export default defineConfig({
  build: {
    assets: '_assets'
  },
  compressHTML: true,
  image: {
    service: sharpImageService()
  },
  integrations: [tailwind(), react()],
  markdown: {
    remarkPlugins: [() => {
      return function (tree, {
        data
      }) {
        const textOnPage = toString(tree);
        const readingTime = getReadingTime(textOnPage);
        data.astro.frontmatter.readingTime = readingTime.minutes;
      };
    }]
  }
});