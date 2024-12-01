import { defineStore } from 'pinia';
import { useSocket } from '~/composables/useSocket';

export const useStakingStore = defineStore('staking', {
    state: () => ({
        count: 100500,
        history: {
            all: [],
            my: [],
        },
    }),
    actions: {
        async loadHistory() {
            const { emit } = useSocket();

            const { all, my } = await emit('dividends.getHistory');

            this.history.all = all;
            this.history.my = my;
        },
    },
});
