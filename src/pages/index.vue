<template>
  <p :class="$style.red">index page</p>
  <img src="images/public-logo.png" alt="" />
</template>

<script setup lang="ts">
// import { useSocket } from '/src/composables/useSocket.ts';

// const { initSocket } = useSocket();
</script>

<style module>
.red {
  color: red;
}
</style>
