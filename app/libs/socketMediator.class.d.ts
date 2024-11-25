declare class SocketMediator {
  constructor();

  on(eventName: string, listener: EventHandler): void;
  off(eventName: string, listener: EventHandler): void;
  emit(eventName: string, args?: object): Promise<any>;
}
export default SocketMediator;
