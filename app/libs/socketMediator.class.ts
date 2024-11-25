import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';

const { serverUri } = useRuntimeConfig().public;

type EventHandler = (...args: []) => void; // TODO: wtf?

class SocketMediator {
    private socket: Socket;
    private name: string;

    constructor() {
        console.log('constructor');

        this.socket = io(serverUri);

        this.name = 'pizda';
    }

    /**
     * Register a new handler for the given event
     */
    on(eventName: string, listener: EventHandler): void {
        this.socket.on(eventName, listener);
    }

    /**
     * Removes the specified listener from the listener array for the event named eventName
     */
    off(eventName: string, listener: EventHandler): void {
        this.socket.off(eventName, listener);
    }

    /**
     * Emits an event to the socket identified by the string name
     */
    emit(eventName: string, args = {}) {
        return new Promise((resolve): void => {
            this.socket.emit(eventName, args, (response) => {
                resolve(response);
            });
        });
    }

    greet(): string {
        return `Hello, my name is Pedro and I am 100 years old.`;
    }
}

export default SocketMediator;
