import type { StorybookConfig } from '@storybook/vue3-vite';
import { mergeConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';

const config: StorybookConfig = {
    stories: ['../../UIKit/**/*.stories.@(js|ts)'],
    addons: ['@storybook/addon-essentials'],
    framework: {
        name: '@storybook/vue3-vite',
        options: {},
    },

    async viteFinal(config) {
        return mergeConfig(config, {
            css: {
                postcss: null,
                preprocessorOptions: {
                    scss: {
                        additionalData: ``,
                    },
                },
            },
            resolve: {
                alias: [
                    {
                        find: '@',
                        replacement: fileURLToPath(
                            new URL('../../', import.meta.url)
                        ),
                    },
                ],
            },
            server: {
                fs: {
                    allow: ['../'],
                },
            },
        });
    },
};

export default config;
