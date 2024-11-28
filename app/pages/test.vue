<template>
    <h3>test page</h3>

    <button @click="login">login</button>

    <button @click="getUserProfile">getProfile</button>

    <ul>
        <li v-for="game in connectionData.dapps" :key="game._id">
            {{ game.name }}
        </li>
    </ul>
</template>

<script setup lang="ts">
import { useWallets } from '~/composables/useWallets.ts';
// import { useUser } from '~/composables/useUser.ts';
import { useSocket } from '@/app/composables/useSocket';

const connectionData = useState('connectionData');

const { socket } = useSocket();

// console.log('socket', socket);

// const { user, getProfile } = useUser();

// const { socket } = useSocket();
const { tryLoginByWallet } = useWallets();

const token = ref<string>('');

async function login(): Promise<void> {
    // console.log('start');

    // let t = localStorage.getItem('token');
    let t = null;

    if (!t) {
        t = await tryLoginByWallet('TronLink');

        token.value = t;
        // localStorage.setItem('token', t);

        // console.log('token', t);
    }

    // console.log('token', localStorage.getItem('token'));
}

async function getUserProfile(): Promise<void> {
    // getProfile(token.value);

    const options = {
        currency: 'usdt',
        fingerprint: 'bd53ff47d216cc549045adc3f8eb480e',
        token: token.value,
        tz: -120,
    };

    // currency : "usdt",
    // fingerprint : "bd53ff47d216cc549045adc3f8eb475e",
    // token : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZGZlMTMxMjYzODdjYzcwNDhmMWE4ZGUiLCJpYXQiOjE3MzI3NDAxNDIsImV4cCI6MTc2NDI3NjE0Mn0.rb2aq_28kZKQxpngQL1F85NI7Pw9iwYRANx0WBoq2sQ"
    // tz : -120

    // console.log('options', options);

    const profile = await socket.emit('profile.token', options);

    console.warn({ profile });
    //
    // console.log('profile', profile);
}
</script>

<style scoped></style>
