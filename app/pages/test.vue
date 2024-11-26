<template>
    <h3>test page</h3>

    <button @click="login">login</button>

    <ul>
        <li v-for="game in connectionData.dapps" :key="game._id">
            {{ game.name }}
        </li>
    </ul>
</template>

<script setup lang="ts">
import { useSocket } from '~/composables/useSocket.ts';
import { useWallets } from '~/composables/useWallets';

const connectionData = useState('connectionData');

const { socket } = useSocket();
const { tryLoginByWallet } = useWallets();

async function login() {
    console.log('start');

    let t = localStorage.getItem('token');

    if (!t) {
        t = await tryLoginByWallet('TronLink');

        console.log({t});

        localStorage.setItem('token', t);
    }

    console.log('token', localStorage.getItem('token'));
}
</script>

<style scoped></style>
