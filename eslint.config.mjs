/**
 * Refreshed Nuxt ESLint Integrations - https://nuxt.com/blog/eslint-module
 * ESLint Module - https://eslint.nuxt.com/packages/module
 *
 * Run "npx @eslint/config-inspector" to inspect the resolved ESLint config
 */

import { createConfigForNuxt } from '@nuxt/eslint-config/flat';
// import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

/**
 * Config example - https://github.dev/nuxt/eslint/blob/main/packages/eslint-config/src/flat/configs/nuxt.ts
 */

// for pretter - https://www.npmjs.com/package/eslint-plugin-format
export default createConfigForNuxt({
  features: {
    stylistic: false,
    tooling: false,
    formatters: false,
  },
}).append(
  {
    // ignores: [""],
  },
  {
    files: ['**/*.js', '**/*.mjs', '**/*.ts', '**/*.vue'],
    rules: {
      'vue/no-v-html': 'off',
      'vue/multi-word-component-names': 'off',
      'no-console': [
        'error',
        {
          allow: ['warn', 'error'],
        },
      ],
    },
  }
);
