/**
 * Refreshed Nuxt ESLint Integrations - https://nuxt.com/blog/eslint-module
 * ESLint Module - https://eslint.nuxt.com/packages/module
 *
 * Run "npx @eslint/config-inspector" to inspect the resolved ESLint config
 */

import { createConfigForNuxt } from '@nuxt/eslint-config/flat';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default createConfigForNuxt({
    features: {
        stylistic: false,
        tooling: false,
        formatters: false,
    },
})
    .override('nuxt/typescript/rules', {
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
        },
    })
    .override('nuxt/vue/single-root', {
        rules: {
            'vue/no-multiple-template-root': 'off',
        },
    })
    .override('nuxt/vue/rules', {
        rules: {
            'vue/no-multiple-template-root': 'off',
            'vue/no-v-html': 'off',
            'vue/multi-word-component-names': 'off',
            'vue/require-default-prop': 'off',
        },
    })
    .append(
        {
            ignores: ['**/.husky'],
        },
        {
            files: ['**/*.js', '**/*.mjs', '**/*.ts', '**/*.vue'],
            rules: {
                'no-console': [
                    'error',
                    {
                        allow: ['warn', 'error'],
                    },
                ],
            },
            plugins: {
                ...eslintPluginPrettierRecommended.plugins,
            },
        }
    );
