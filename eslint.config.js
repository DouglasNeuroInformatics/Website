import { config } from '@douglasneuroinformatics/eslint-config';

export default config({
  astro: {
    enabled: true
  },
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  typescript: {
    enabled: true
  }
});
