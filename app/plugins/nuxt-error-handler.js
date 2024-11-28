import { defineNuxtPlugin } from 'nuxt/app';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.hook('vue:error', (..._args) => {
        console.warn(
            `\x1B[33m (vue:error): errors propagate up to the top level.`
        );
        console.error('\x1B[31m', ..._args);
    });

    nuxtApp.hook('app:error', (..._args) => {
        console.warn(
            '\x1B[33m (app:error): errors in starting Nuxt application'
        );
        console.error('\x1B[31m', ..._args);
    });

    nuxtApp.vueApp.config.errorHandler = (..._args) => {
        console.warn('\x1B[33m, Global error');
        console.error('\x1B[31m', ..._args);
    };
});
