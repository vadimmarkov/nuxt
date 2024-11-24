import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';

const { serverUri } = useRuntimeConfig().public;

type EventHandler = (...args: []) => void; // TODO: wtf?

class SocketMediator {
  socket: Socket;

  constructor() {
    this.socket = io(serverUri);
  }

  /**
   * Register a new handler for the given event
   */
  on(eventName: string, listener: EventHandler) {
    this.socket.on(eventName, listener);
  }

  /**
   * Removes the specified listener from the listener array for the event named eventName
   */
  off(eventName: string, listener: EventHandler) {
    this.socket.off(eventName, listener);
  }

  /**
   * Emits an event to the socket identified by the string name
   */
  emit(eventName: string, args = {}) {
    return new Promise((resolve) => {
      this.socket.emit(eventName, args, (response) => {
        resolve(response)
      })
    })
  }
}

export default SocketMediator;
