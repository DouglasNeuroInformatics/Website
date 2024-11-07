import { createConfig } from '@douglasneuroinformatics/prettier-config';

const config = createConfig({
  astro: true,
  tailwindcss: true
});

config.plugins?.push('prettier-plugin-astro-organize-imports');

// @ts-ignore
config.astroOrganizeImportsMode = 'SortAndCombine';

export default config;
