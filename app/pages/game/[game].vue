<template>
    <p>{{ route.params.game }}</p>
</template>

<script setup lang="ts">
const route = useRoute();

definePageMeta({
    validate: (route) => {
        console.warn('route ->', route);

        // const { game } = route.params;

        // const dapps = useState('connectionData');

        // const dapps = connectionData;

        // console.log('dapps', dapps.value);
        // console.log('connectionData', connectionData);

        // data.dapps

        // const g = dapps.value.some((dapp) => dapp.name.toLowerCase() === game);

        // console.log({ g });

        return true;
    },
});

onMounted(() => {
    // console.log('route', route.params.game);
});
</script>

<style scoped></style>
