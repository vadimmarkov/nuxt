<template>
  <h3>test page</h3>

  <button @click="login">login</button>
</template>

<script setup lang="ts">
import { useSocket } from 'composables/useSocket.ts';
import { useWallets } from 'composables/useWallets';

const { initSocket, socket } = useSocket();
const { loginByWallet } = useWallets();

async function login() {
  console.log('start');

  await loginByWallet('TronLink');

  console.log('stop');
}

onMounted(async () => {
  console.log('app mounted');

  await initSocket();

  console.log('socket', socket);
});
</script>

<style scoped></style>
