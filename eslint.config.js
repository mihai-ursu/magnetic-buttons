import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginAstro from 'eslint-plugin-astro';

export default [
  {languageOptions: { globals: globals.browser }},
  {
    rules: {
        "no-unused-vars": "warn",
        "no-undef": "error",
        "@typescript-eslint/no-explicit-any": "error",
        "semi": "warn",
    }
  },
  pluginJs.configs.recommended,
  ...eslintPluginAstro.configs['flat/recommended'],
  ...tseslint.configs.recommended,
];