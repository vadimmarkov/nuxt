import { useSocket } from '@/app/composables/useSocket';

const { socket } = useSocket();

export const useUser = () => {
    const user = useState('user', () => {
        return {};
    });

    async function getProfile(token: string) {
        // console.log('getProfile', token);

        // token,
        //     currency: currentCurrency,
        //     fingerprint,
        //     telegramApp: route.query?.telegramApp,
        //     tz: new Date().getTimezoneOffset(),

        const options = {
            token,
        };

        const profile = await socket.emit('profile.token', options);

        // console.log('profile', profile);

        user.value = profile;
    }

    return {
        user,

        getProfile,
    };
};
