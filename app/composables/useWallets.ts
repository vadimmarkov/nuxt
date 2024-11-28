import { useSocket } from '@/app/composables/useSocket';
import delay from '~/utils/delay';

const { emit } = useSocket();

type iWalletName = 'TronLink' | 'MetaMask' | 'Binance' | 'Coin98';

const ATTEMPTS = 25;

export function useWallets() {
    async function tryLoginByWallet(wallet: iWalletName) {
        const walletIsReady: boolean = await checkIfWalletIsReady(wallet);

        if (walletIsReady) {
            // const s = checkIfWalletIsReady([wallet])

            const token = await loginByWallet(wallet);

            return token;
        }
    }

    async function checkIfWalletIsReady(wallet: iWalletName) {
        const check = {
            MetaMask: () => {
                return typeof window.ethereum !== 'undefined';
            },
            TronLink: () => {
                return (
                    typeof window.tronWeb !== 'undefined' &&
                    window.tronWeb.ready &&
                    window.tronWeb.defaultAddress.base58 !== undefined
                );
            },
            Binance: () => {
                return typeof window.BinanceChain !== 'undefined';
            },
            Coin98: () => {
                if (window.ethereum) {
                    return (
                        typeof window.ethereum.isCoin98 !== 'undefined' ||
                        typeof window.coin98 !== 'undefined'
                    );
                }
            },
        };

        const checkWallet = async (wallet: iWalletName) => {
            let attempts = ATTEMPTS;

            while (--attempts > 0) {
                if (check[wallet]()) {
                    return true;
                }

                await delay(100);
            }

            return false;
        };

        return checkWallet(wallet);
    }

    async function loginByWallet(wallet: iWalletName) {
        // console.log('loginByWallet');

        const address = await getWalletAddress(wallet);

        const noncePayload = {
            // walletType: wallet,
            address,
            country: 'DE',
            fingerprint: 'bd53ff47d216cc549045adc3f8eb480e',
            wallet_name: 'TronLink',
        };

        // console.log({ address });

        // const { nonce } = await socket.emit('auth.nonce', noncePayload);
        const { nonce } = await emit('auth.nonce', noncePayload);

        // console.log({ nonce });

        const signature = await getSignature(wallet, nonce, address);

        // console.log({ signature });

        const token = await getToken({
            address,
            signature,
            fingerprint: 'bd53ff47d216cc549045adc3f8eb480e',
        });

        // console.log({ token });

        return token;
    }

    async function getWalletAddress(wallet: iWalletName): Promise<string> {
        const metaMaskType = 2;

        const getAddress = async () => {
            if (wallet === 'MetaMask') {
                const accounts = await window?.ethereum?.request({
                    method:
                        metaMaskType === 1
                            ? 'eth_accounts'
                            : 'eth_requestAccounts',
                });

                return accounts[0];
            }

            if (wallet === 'TronLink') {
                return window?.tronWeb?.defaultAddress?.base58;
            }

            if (wallet === 'Binance') {
                const accounts = await window?.BinanceChain.request({
                    method:
                        binanceType === 1
                            ? 'eth_accounts'
                            : 'eth_requestAccounts',
                });

                return accounts[0];
            }

            if (wallet === 'Coin98') {
                const accounts = await window?.ethereum?.request({
                    method:
                        coin98Type === 1
                            ? 'eth_accounts'
                            : 'eth_requestAccounts',
                });
                return accounts[0];
            }
        };

        return getAddress();
    }

    async function getSignature(
        wallet: iWalletName,
        nonce: string,
        address: string
    ) {
        const msg = `0x${nonce
            .split('')
            .reduce(
                (h, c) => (h += c.charCodeAt(0).toString(16).padStart(2, '0')),
                ''
            )}`;

        if (wallet === 'MetaMask') {
            return window.ethereum.request({
                method: 'personal_sign',
                params: [msg, address],
            });
        }

        if (wallet === 'TronLink') {
            try {
                return window.tronWeb.trx.sign(window.tronWeb.toHex(nonce));
            } catch (error) {
                return error;
            }
        }

        if (wallet === 'Binance') {
            return window.BinanceChain.request({
                method: 'personal_sign',
                params: [msg, address],
            });
        }

        if (wallet === 'Coin98') {
            return window.ethereum.request({
                method: 'personal_sign',
                params: [msg, address],
            });
        }
    }

    async function getToken(payload: object) {
        const options = {
            ...payload,
        };

        // const { token, error, code } = await socket.emit('auth.sign', options);
        const { token } = await emit('auth.sign', options);

        // console.log(token, error, code);

        return token;
    }

    // async function getNonce(noncePayload) {
    //     console.log('socket', socket);
    //
    //     const nonce = await socket.emit('auth.nonce', noncePayload)
    //
    //     console.log('nonce', nonce);
    //
    //     // const a = socket.greet();
    //
    //     console.log(a);
    //
    //     return  nonce
    // }

    return {
        tryLoginByWallet,
    };
}
