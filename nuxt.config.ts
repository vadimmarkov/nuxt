// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  /**
   * Disable Nuxt component auto-registration
   * https://nuxt.com/docs/api/nuxt-config#components
   */
  components: false,
  devtools: {
    enabled: true,
  },
  css: [
    '@/node_modules/sanitize.css',
    '@/node_modules/sanitize.css/forms.css',
    '@/node_modules/sanitize.css/reduce-motion.css',
    '@/node_modules/sanitize.css/assets.css',
    '@/src/assets/styles/style.scss',
  ],
  nitro: {
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
    }
  }
})
