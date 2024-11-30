import type { Socket } from 'socket.io-client';
import delay from '@/app/utils';

// const socket = ref();

let socket: Socket;

// console.log('in head socket', socket);

export function useSocket() {
    // console.log('in body', socket);

    async function initSocket() {
        // console.log('initSocket');

        const { io } = await import('socket.io-client');

        // console.log('io', io);

        const { serverUri } = useRuntimeConfig().public;

        // Ініціалізація WebSocket підключення

        const options = {};

        // if (!socket) {
        socket = io(serverUri, options);

        // console.log('create socket', socket);

        socket.on('connect', () => {
            // isConnected.value = true
            // console.log('Connected to WebSocket server');
        });

        socket.on('disconnect', () => {
            // isConnected.value = false
            // console.log('Disconnected from WebSocket server');
        });

        // Обробка помилок
        socket.on('connect_error', (error) => {
            console.error('Connection error:', error);
        });
    }

    // Надсилання повідомлення
    async function emit(event: string, message: any): Promise<any> {
        while (!socket) {
            await delay(100);
        }

        return new Promise((resolve): void => {
            socket.emit(event, message, (response: any) => {
                resolve(response);
            });
        });
    }

    // Прослуховування події
    async function on(event: string, callback: (data: any) => void) {
        while (!socket) {
            await delay(100);
        }

        socket.on(event, callback);
    }

    // Від'єднання та очищення
    // onUnmounted(() => {
    //     if (socket) {
    //         socket.disconnect();
    //     }
    // });

    return {
        initSocket,
        // isConnected,
        emit,
        on,
        // lastMessage,
    };
}
