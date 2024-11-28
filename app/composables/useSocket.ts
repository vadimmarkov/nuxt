import { io } from 'socket.io-client';

// console.log('use socket out');

const { serverUri } = useRuntimeConfig().public;

const socket = io(serverUri);

// const socket = ref();

const emit = (eventName: string, args = {}) => {
    return new Promise((resolve): void => {
        socket.emit(eventName, args, (response: any) => {
            resolve(response);
        });
    });
};

export function useSocket() {
    // console.log('use socket in');

    // async function initSocket() {
    //     console.log('initSocket');
    //
    //     const { default: Socket } = await import(
    //         '~/libs/socketMediator.class.ts'
    //     );

    // const { default: Person } = await import(
    //     '~/libs/Person.ts'
    // );

    // const Socket = new Socket();

    // console.log('person', person);

    // console.log(person.greet());

    // socket.value = new Socket();
    // }

    // const getSocket = computed(() => {
    //     return socket;
    // });

    return {
        socket,

        emit,
    };
}
