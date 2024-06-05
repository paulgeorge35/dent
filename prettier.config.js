/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  plugins: [
    "prettier-plugin-tailwindcss",
    "@trivago/prettier-plugin-sort-imports",
  ],
  importOrder: ['^@/server/(.*)$', '^@/contexts/(.*)$', '^@/components/ui/(.*)$', '^@/components/(.*)$', '^@/lib/(.*)$', '^[./]'],
  importOrderParserPlugins: ['typescript', 'jsx'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};

export default config;
