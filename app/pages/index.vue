<template>
    <p :class="$style.red">index page</p>

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
const dapps = useState('connectionData');
</script>

<style module>
.red {
    color: red;
}
</style>
