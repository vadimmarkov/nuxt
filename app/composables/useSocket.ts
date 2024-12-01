import type { Socket } from 'socket.io-client';
import delay from '@/app/utils';

let socket: Socket;
const reconnecting = ref<boolean>(false);

export function useSocket() {
    async function initSocket(): Promise<void> {
        const { io } = await import('socket.io-client');
        const { serverUri } = useRuntimeConfig().public;

        socket = io(serverUri, {
            query: { mobile: false },
            reconnectionDelayMax: 10000,
        });

        socket.on('connect', (): void => {
            reconnecting.value = false;

            console.warn('Socket connected!');
        });
        socket.on('disconnect', (): void => {
            reconnecting.value = false;

            console.warn('Socket disconnected!');
        });
        socket.io.on('error', async (error): Promise<void> => {
            console.warn('Socket connection error:', error.message);
        });
    }

    // Надсилання повідомлення
    async function emit(eventName: string, args?: any): Promise<any> {
        while (!socket) {
            await delay(100);
        }

        return new Promise((resolve): void => {
            socket.emit(eventName, args || {}, (response: any) => {
                resolve(response);
            });
        });
    }

    // Прослуховування події
    async function on(eventName: string, ack: (data: any) => void) {
        while (!socket) {
            await delay(100);
        }

        socket.on(eventName, ack);
    }

    return {
        initSocket,

        emit,
        on,

        reconnecting,
    };
}
