/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  plugins: [
    "prettier-plugin-tailwindcss",
    require.resolve("@trivago/prettier-plugin-sort-imports"),
  ],
  importOrder: [
    "^@/server/(.*)$",
    "^@/contexts/(.*)$",
    "^@/_components/(.*)$",
    "^@/components/ui/(.*)$",
    "^@/components/(.*)$",
    "^@/lib/(.*)$",
    "^[./]",
  ],
  importOrderParserPlugins: ["typescript", "jsx"],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};

export default config;
