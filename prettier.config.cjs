// @ts-check

/** @type {import("prettier").Config} */
module.exports =  {
  plugins: ['prettier-plugin-astro', 'prettier-plugin-tailwindcss'],
  htmlWhitespaceSensitivity: 'ignore',
  printWidth: 120,
  singleQuote: true,
  trailingComma: 'none',
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro'
      }
    }
  ]
};
