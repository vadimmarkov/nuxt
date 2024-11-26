console.log('use socket out');

let socket;

export function useSocket() {
    console.log('use socket in');

    async function initSocket() {
        console.log('initSocket');

        const { default: Socket } = await import(
            '~/libs/socketMediator.class.ts'
        );

        // const { default: Person } = await import(
        //     '~/libs/Person.ts'
        // );

        const person = new Socket();

        // console.log('person', person);

        // console.log(person.greet());

        socket = person;
    }

    const getSocket = computed(() => {
        return socket;
    });

    return {
        initSocket,
        socket: getSocket.value,
    };
}
