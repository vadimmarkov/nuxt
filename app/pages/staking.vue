<template>
    <h1>Page staking</h1>

    <template v-if="stakingStore">
        <p>count {{ stakingStore.count }}</p>

        <button @click="stakingStore.loadHistory">loadHistory</button>

        <ul>
            <li v-for="item in stakingStore.history.all" :key="item._id">
                {{ item._id }}
            </li>
        </ul>
    </template>
</template>

<script setup lang="ts">
import { useStakingStore } from '~/stores/staking';

// import { useSocket } from '@/app/composables/useSocket';

// const { emit } = useSocket();

const stakingStore = useStakingStore();

onMounted(() => {
    // console.log('mounted');

    stakingStore.loadHistory();
});
</script>

<style lang="scss" scoped></style>
