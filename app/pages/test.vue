<template>
    <h3>test page</h3>

    <button @click="login">login</button>
</template>

<script setup lang="ts">
import { useSocket } from '~/composables/useSocket.ts';
import { useWallets } from '~/composables/useWallets';

const { socket } = useSocket();
const { tryLoginByWallet } = useWallets();

async function login() {
    console.log('start');

    const token = await tryLoginByWallet('TronLink');

    console.log('finish', token);
}
</script>

<style scoped></style>
