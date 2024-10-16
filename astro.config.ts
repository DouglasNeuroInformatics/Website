import path from 'node:path';

import { defineConfig } from 'astro/config';

export default defineConfig({
  vite: {
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, 'src')
      }
    }
  }
});
