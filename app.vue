<template>
    <h1>app</h1>

    <RouterLink to="/">Home</RouterLink>|
    <RouterLink to="/test">test</RouterLink>|
    <NuxtLink to="/staking">staking</NuxtLink>

    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>

<script setup lang="ts">
import { useSocket } from '@/app/composables/useSocket';
const connectionData = useState('connectionData');
const { serverUri } = useRuntimeConfig().public;

const { initSocket } = useSocket();

onMounted(() => {
    // console.log('app mounted');

    // setTimeout(() => {
    initSocket();
    // }, 5000);
});

const url = `${serverUri}/api/front-gateway/getConnectionData`;

await callOnce(async () => {
    const { data } = await useFetch(url, {
        pick: ['dapps'],
    });

    connectionData.value = data.value.dapps;
});
</script>
