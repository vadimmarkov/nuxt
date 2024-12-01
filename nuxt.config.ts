// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    app: {
        head: {
            title: 'Cool Site',
            titleTemplate: '%s',
            charset: 'utf-8',
            viewport: 'width=device-width, initial-scale=1',
            link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],

            script: [
                {
                    src: '/_nuxt/entry.js',
                    body: true, // Додає скрипт у кінець <body>
                    type: 'module',
                },
            ],
        },
    },

    /**
     * Disable auto-importing composables and utilities
     */
    // imports: {
    //     autoImport: false
    // },

    dir: {
        layouts: './app/layouts',
        pages: './app/pages',
        plugins: './app/plugins',
        middleware: './app/middleware',
    },

    alias: {
        '~': '@/app',
        images: '@/public/images',
    },

    // future: {
    // compatibilityVersion: 4,
    // },

    runtimeConfig: {
        public: {
            serverUri: '',
        },
    },

    /**
     * ESLint Module - https://eslint.nuxt.com/packages/module
     */
    modules: ['@nuxt/eslint', '@pinia/nuxt'],

    /**
     * Disable Nuxt component auto-registration
     * https://nuxt.com/docs/api/nuxt-config#components
     */
    components: false,

    // components: {
    //     dirs: [],
    // },

    devtools: {
        enabled: true,

        timeline: {
            enabled: true,
        },
    },

    /**
     * Global Styles Imports
     * https://nuxt.com/docs/getting-started/assets#global-styles-imports
     */
    css: [
        '@/node_modules/sanitize.css',
        '@/node_modules/sanitize.css/forms.css',
        '@/node_modules/sanitize.css/reduce-motion.css',
        '@/node_modules/sanitize.css/assets.css',
        '@/app/assets/styles/style.scss',
    ],

    compatibilityDate: '2024-11-01',

    nitro: {
        // preset: 'node-server',

        compressPublicAssets: {
            /**
             * If enabled, Nitro will generate a pre-compressed (gzip and/or brotli) version of supported types of public assets
             * https://nitro.build/config#compresspublicassets
             */
            brotli: true,
            gzip: false,
        },

        /**
         * Disable source map generation
         * https://nitro.build/config#sourcemap
         */
        sourceMap: false,
    },

    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    api: 'modern-compiler', // or "modern", "legacy"
                },
            },
        },
        build: {
            /**
             * Disable gzip-compressed size reporting
             * https://vite.dev/config/build-options#build-reportcompressedsize
             */
            reportCompressedSize: false, // TODO: doesn't seem to be working
        },
    },
});
