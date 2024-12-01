import type { Preview } from '@storybook/vue3';
import { themes } from '@storybook/theming';

// import { createI18n } from 'vue-i18n';
// import en from '../../langs/en';
// import { setup } from '@storybook/vue3';
// import store from './store';

// import '../../assets/scss/css-colors.scss';
// import '../../assets/scss/css-variables.scss';
// import '../../node_modules/sanitize.css/sanitize.css';
// import '../../node_modules/sanitize.css/forms.css';
// import '../../node_modules/sanitize.css/reduce-motion.css';
// import '../../node_modules/sanitize.css/assets.css';
// import '../../assets/scss/style.scss';

import '../../node_modules/sanitize.css';
import '../../node_modules/sanitize.css/forms.css';
import '../../node_modules/sanitize.css/reduce-motion.css';
import '../../node_modules/sanitize.css/assets.css';
import '../../app/assets/styles/style.scss';

// https://fontsource.org/fonts/montserrat/install
// Font Montserrat, variable version
import '@fontsource-variable/montserrat';

// import BfIcon from '@/UIKit/BF-Icon/BF-Icon.vue';
// import Coin from '@/UIKit/Icons/Coin/Coin.vue';

// const i18n = createI18n({
//     locale: 'en',
//     fallbackLocale: 'en',
//     messages: {
//         en,
//     },
// });

// setup((app) => {
// app.use(i18n);
// app.use(store);

// Global components
// app.component('BfIcon', BfIcon);
// app.component('Coin', Coin);
// });

const preview: Preview = {
    parameters: {
        layout: 'centered',
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        docs: {
            theme: themes.dark,
        },
        // options: {
        //     storySort: {
        //         order: ['Figma components', 'Own components', 'Old'],
        //     },
        // },
    },
};

export default preview;
