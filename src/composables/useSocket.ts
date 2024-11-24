console.log('use socket out');

let socket = {};

export function useSocket() {
  console.log('use socket in');

  async function initSocket() {
    const { default: Socket } = await import('libs/socketMediator.class.ts');

    socket = new Socket();
  }

  return {
    initSocket,
    socket,
  };
}
