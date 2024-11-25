import { delay, getCookie } from '@/utils';
import useTONConnect from '~/composables/wallet/useTONConnect';

const state = () => ({
    attempts: 25,
    nonceObject: {
        address: null,
        nonce: null,
    },
    metaMaskType: 1,
    binanceType: 1,
    coin98Type: 1,
    isNoWallet: false,
    isAdressBook: false,
    authTonPayload: null,
});

const mutations = {
    setNonceObject: (context, nonceObject) => {
        context.nonceObject = nonceObject;
    },
    setMetaMaskType: (context, type) => {
        context.metaMaskType = type;
    },
    setBinanceType: (context, type) => {
        context.binanceType = type;
    },
    setCoin98Type: (context, type) => {
        context.coin98Type = type;
    },
    setIsNoWallet: (context, data) => {
        context.isNoWallet = data;
    },
    setIsAdressBook: (context, data) => {
        context.isAdressBook = data;
    },
    setAuthTonPayload: (context, data) => {
        context.authTonPayload = data;
    },
};

const actions = {
    async tryLoginByWallet({ commit, dispatch }, { walletType, isAcceptedTerms }) {
        commit('setMetaMaskType', 2);
        commit('setBinanceType', 2);
        commit('setCoin98Type', 2);

        const activeWallet = await dispatch('checkWalletsReady', {
            wallets: [walletType],
        });

        if (!activeWallet) {
            commit('setIsNoWallet', true);
            this.$showModal({
                name: 'LoginRegistration',
                data: { wallet: walletType },
            });
        } else {
            await dispatch('loginByWallet', { walletType, isAcceptedTerms });
        }
    },

    // Start login with wallet
    async loginByWallet({ dispatch }, { walletType, isAcceptedTerms, addListener = true }) {
        localStorage.removeItem('ignoreWallets');
        const { $i18n } = useNuxtApp();

        try {
            const address = await dispatch('getWalletAddress', walletType);
            let utms = JSON.parse(localStorage.getItem('utms'));

            const campaignId = localStorage.getItem('campaign_id');
            const promoCode = localStorage.getItem('promoCode');
            const affCampaign = localStorage.getItem('affCampaign');

            if (campaignId) {
                if (!utms) utms = {};
                utms.binom_campaign_id = campaignId;
            }

            const noncePayload = {
                address,
                walletType,
                isAcceptedTerms,
                ...utms,
                ...(promoCode && { promoCode }),
                ...(affCampaign && { affCampaign }),
            };

            const nonce = await dispatch('getNonce', noncePayload);

            const signature = await dispatch('getSignature', {
                walletType,
                nonce,
                address,
            });

            const token = await dispatch('getToken', { address, signature });

            dispatch('app/loadProfile', { token, address, walletType }, { root: true });

            if (addListener) {
                dispatch('addListenerAddressChange', { walletType });
            }
        } catch (error) {
            const text = typeof error === 'object' ? error.message || error.error : error;
            console.error(error);
            if (error.code && error.code !== 4001) {
                // 4001 - USER REJECTED THE REQUEST
                this.$notify({
                    type: 'error',
                    title: $i18n.t('common.Error'),
                    text,
                });
            }
        }
    },

    // Check if a web3 or tronWeb are present in the window object
    async checkWalletsReady({ state }, { wallets = [] }) {
        const { attempts } = state;
        const resultObject = {};
        let activeWallet = null;

        wallets.forEach((wallet) => {
            resultObject[wallet] = false;
        });

        if (wallets.includes('ton-connect')) {
            const { getTonConnectActiveWallet } = useTONConnect();
            const { name } = await getTonConnectActiveWallet();
            return name;
        }

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

        const checkWallet = async (wallet) => {
            let attempts_ = attempts;

            while (--attempts_ > 0) {
                // @todo long time load page with this while <=== need to fix it
                const walletIndex = wallets.indexOf(wallet);

                if (walletIndex) {
                    const prevWallets = [...wallets];
                    prevWallets.length = walletIndex;

                    const isFoundPrevious = prevWallets.some((wallet) => resultObject[wallet]);

                    if (isFoundPrevious) {
                        return;
                    }
                }

                if (check[wallet]()) {
                    resultObject[wallet] = true;

                    activeWallet = wallet;
                    return;
                }

                await delay(100);
            }
        };

        await Promise.all(wallets.map((wallet) => checkWallet(wallet)));

        return activeWallet;
    },

    async getWalletAddress({ state }, walletType) {
        const { metaMaskType, binanceType, coin98Type } = state;
        let address;

        const getAddress = async () => {
            if (walletType === 'MetaMask') {
                const accounts = await window?.ethereum?.request({
                    method: metaMaskType === 1 ? 'eth_accounts' : 'eth_requestAccounts',
                });

                address = accounts[0];
            }

            if (walletType === 'TronLink') {
                address = window?.tronWeb?.defaultAddress?.base58;
            }

            if (walletType === 'Binance') {
                const accounts = await window?.BinanceChain.request({
                    method: binanceType === 1 ? 'eth_accounts' : 'eth_requestAccounts',
                });

                address = accounts[0];
            }

            if (walletType === 'Coin98') {
                const accounts = await window?.ethereum?.request({
                    method: coin98Type === 1 ? 'eth_accounts' : 'eth_requestAccounts',
                });
                address = accounts[0];
            }

            if (walletType === 'ton-connect') {
                const { getTonConnectActiveWallet } = useTONConnect();
                const {
                    account: { address: _address },
                } = await getTonConnectActiveWallet();
                address = _address;
            }
        };

        await Promise.race([delay(7000), getAddress()]);

        return address;
    },

    // Get a nonce from the server
    getNonce({ state, commit }, payload) {
        const { $i18n } = useNuxtApp();
        const getNonceResponse = async () => {
            const fingerprint = await this.$fingerPrint.getHash();

            return new Promise((resolve, reject) => {
                const affCampaign = localStorage.getItem('affCampaign');
                const refCampaign = getCookie('referralId');
                const campaignId = localStorage.getItem('campaign_id');
                const country = localStorage.getItem('countryId');
                const tag = getCookie('stag');
                const userPseudoId = getCookie('_ga');

                const options = {
                    country,
                    fingerprint,
                    address: payload.address,
                    wallet_name: payload.walletType,
                    user_pseudo_id: userPseudoId,
                    isAcceptedTerms: payload.isAcceptedTerms,
                    ...(refCampaign && { refCampaign }),
                    ...(affCampaign && { affCampaign }),
                    ...(tag && { tag }),
                    ...(campaignId && { binom_campaign_id: campaignId }),
                    ...(payload.promoCode && { promoCode: payload.promoCode }),
                    ...(payload.utm_source && { utm_source: payload.utm_source }),
                    ...(payload.utm_medium && { utm_medium: payload.utm_medium }),
                    ...(payload.utm_campaign && { utm_campaign: payload.utm_campaign }),
                    ...(payload.utm_content && { utm_content: payload.utm_content }),
                    ...(payload.utm_term && { utm_term: payload.utm_term }),
                };

                this.$socketMediator.emit('auth.nonce', options, (response) => {
                    const { error, nonce, code } = response;
                    if (error) {
                        this.$notify({
                            type: 'error',
                            title: $i18n.t('common.Error'),
                            text: error,
                        });
                        if (code === 7023) {
                            // change tab on same modal
                            this.$hideModal({ name: 'LoginRegistration', data: { tab: 2 } });
                        }
                        reject(response);
                    }

                    if (nonce) {
                        commit('setNonceObject', {
                            address: payload.address,
                            nonce,
                        });

                        resolve(nonce);
                    }
                });
            });
        };

        const {
            nonceObject: { nonce, address: nonceAddress },
        } = state;

        return nonceAddress === payload.address && nonce ? nonce : getNonceResponse();
    },

    // Sign the nonce
    getSignature(_context, { walletType, nonce, address }) {
        const msg = `0x${nonce
            .split('')
            .reduce((h, c) => (h += c.charCodeAt(0).toString(16).padStart(2, '0')), '')}`;

        if (walletType === 'MetaMask') {
            return window.ethereum.request({
                method: 'personal_sign',
                params: [msg, address],
            });
        }

        if (walletType === 'TronLink') {
            try {
                return window.tronWeb.trx.sign(window.tronWeb.toHex(nonce));
            } catch (error) {
                return error;
            }
        }

        if (walletType === 'Binance') {
            return window.BinanceChain.request({
                method: 'personal_sign',
                params: [msg, address],
            });
        }

        if (walletType === 'Coin98') {
            return window.ethereum.request({
                method: 'personal_sign',
                params: [msg, address],
            });
        }
    },

    // { address, signature }
    async getToken(_context, payload) {
        const fingerprint = await this.$fingerPrint.getHash();

        const options = {
            // address,
            // signature,
            ...payload,
            fingerprint,
        };

        const { $i18n } = useNuxtApp();

        return new Promise((resolve, reject) => {
            this.$socketMediator.emit('auth.sign', options, ({ token, error, code }) => {
                if (token) {
                    resolve(token);

                    return;
                }

                if (error) {
                    this.$notify({
                        type: 'error',
                        title: $i18n.t('common.Login is blocked'),
                        text: error,
                    });

                    reject(error);

                    return;
                }

                if (code && code === 7017) {
                    this.$notify({
                        type: 'error',
                        timeout: false,
                        title: this.$t('common.Error'),
                        text: $i18n.t(
                            'wallets.Login is temporarily denied due to sports betting result decision changes. Please contact support for details.'
                        ),
                    });

                    reject(error);

                    return;
                }

                if (code && code === 2805) {
                    this.$notify({
                        type: 'error',
                        timeout: false,
                        title: $i18n.t('common.Login is blocked'),
                        text: $i18n.t('common.Contact support for details'),
                    });

                    reject(error);

                    return;
                }

                if (error) {
                    reject(error);
                }
            });
        });
    },

    // Detecting account change
    addListenerAddressChange({ commit, dispatch }, { walletType }) {
        const onAccountChanged = (walletType, newAddress) => {
            const oldAddress = localStorage.getItem(walletType);

            if (oldAddress && newAddress !== oldAddress) {
                localStorage.removeItem('token');

                commit('user/isLogged', false, { root: true });
                commit('user/token', null, { root: true });

                dispatch('loginByWallet', { walletType, addListener: false });
            }
        };
        if (walletType === 'MetaMask') {
            window.ethereum.on('accountsChanged', ([newAddress]) => {
                onAccountChanged('MetaMask', newAddress);
            });
        }
        if (walletType === 'TronLink') {
            window.tronWeb.on('addressChanged', ({ base58: newAddress }) => {
                onAccountChanged('TronLink', newAddress);
            });
        }
        if (walletType === 'Binance') {
            window.BinanceChain.on('accountsChanged', ([newAddress]) => {
                onAccountChanged('Binance', newAddress);
            });
        }
        if (walletType === 'Coin98') {
            window.ethereum.on('accountsChanged', ([newAddress]) => {
                onAccountChanged('Coin98', newAddress);
            });
        }
    },

    checkIfAddressRegistered(_context, address) {
        return new Promise((resolve) => {
            this.$socketMediator.emit('profile.isLoginAddress', { address }, (response) => {
                if (response === false || response.error != null) {
                    resolve(false);
                }

                resolve(true);
            });
        });
    },
    actionAuthTonPayload({ commit }) {
        return new Promise((resolve, reject) => {
            const { $i18n } = useNuxtApp();
            this.$socketMediator.emit('auth.tonPayload', {}, (response) => {
                if (response?.error) {
                    this.$notify({
                        type: 'error',
                        title: $i18n.t('common.Error'),
                        text: response.error,
                    });
                    reject(response.error);
                } else {
                    commit('setAuthTonPayload', response.payload);
                    resolve(response.payload);
                }
            });
        });
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
};
