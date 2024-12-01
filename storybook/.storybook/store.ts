import { createStore } from 'vuex';

import user from '@/store/user';
import settings from '@/store/settings';
import ui from '@/store/ui';

// Create a new store instance.
const store = createStore({
    modules: {
        user,
        settings,
        ui,
    },
});

// Set demo data for Input component
store.state.user.balance.rate = {
    bfgusdt: 0.0156247,
};

store.state.ui.isFocus = true;

export default store;
