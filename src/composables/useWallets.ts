import { delay } from 'utils';

type iWalletName = 'TronLink' | 'MetaMask' | 'Binance' | 'Coin98';

const ATTEMPTS = 25;

export function useWallets() {
    async function loginByWallet(wallet: iWalletName) {
        console.log('login by', wallet);

        const walletIsReady: boolean = await checkIfWalletIsReady(wallet);

        if (walletIsReady) {
            // const s = checkIfWalletIsReady([wallet])
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

        let walletIsReady = false;

        const checkWallet = async (wallet: iWalletName) => {
            // const resultObject = {};
            let attempts = ATTEMPTS;


            while (--attempts > 0) {
                if (check[wallet]()) {
                    walletIsReady = true;

                    return;
                }

                await delay(100);
            }
        };

        await checkWallet(wallet);

        // await Promise.all(wallets.map((wallet) => checkWallet(wallet)));

        return walletIsReady;
    }

    return {
        loginByWallet,
    };
}
