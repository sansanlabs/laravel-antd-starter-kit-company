export default {
  plugins: ["@prettier/plugin-php", "@shufo/prettier-plugin-blade", "@trivago/prettier-plugin-sort-imports"],
  phpVersion: "8.3",
  trailingComma: "es5",
  tabWidth: 2,
  semi: true,
  singleQuote: false,
  braceStyle: "1tbs",
  trailingCommaPHP: true,
  printWidth: 120,
  importOrder: ["^@core/(.*)$", "<THIRD_PARTY_MODULES>", "^@server/(.*)$", "^@ui/(.*)$", "^[./]"],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderGroupNamespaceSpecifiers: true,
  importOrderCaseInsensitive: true,
  overrides: [
    {
      files: ["*.php"],
      options: {
        printWidth: 150,
      },
    },
    {
      files: ["*.blade.php"],
      options: {
        parser: "blade",
        tabWidth: 2,
      },
    },
  ],
};
