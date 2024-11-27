<template>
    <p :class="$style.red">index page</p>
    <img src="images/public-logo.png" alt="" />

    <ul>
        <li>
            <NuxtLink :to="'game/zalupa'">Zalupa</NuxtLink>
        </li>
        <li v-for="game in dapps" :key="game._id">
            <NuxtLink :to="'game/' + game.name.toLowerCase()">{{
                game.name
            }}</NuxtLink>
        </li>
    </ul>
</template>

<script setup lang="ts">
// import { useSocket } from '~/composables/useSocket.ts';

const dapps = useState('connectionData');

// const { initSocket } = useSocket();

// onMounted(async () => {
//     await initSocket();
// });
</script>

<style module>
.red {
    color: red;
}
</style>
