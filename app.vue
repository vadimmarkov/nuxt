<template>
    <h1>app</h1>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/test">test</RouterLink>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>

<script setup lang="ts">
const connectionData = useState('connectionData');
const { serverUri } = useRuntimeConfig().public;

const url = `${serverUri}/api/front-gateway/getConnectionData`;

await callOnce(async () => {
    const { data } = await useFetch(url, {
        pick: ['dapps'],
    });

    connectionData.value = data.value.dapps;
});
</script>
