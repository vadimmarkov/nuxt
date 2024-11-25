<template>
    <p :class="$style.red">index page</p>
    <img src="images/public-logo.png" alt="" />
</template>

<script setup lang="ts">
import { useSocket } from '~/composables/useSocket.ts';

const { initSocket } = useSocket();

onMounted(async () => {
    await initSocket();
});
</script>

<style module>
.red {
    color: red;
}
</style>
