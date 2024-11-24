// import parser from 'ua-parser-js';
// import { useNetwork, watchOnce } from '@vueuse/core';
// import { MemoryCache } from './socketCache/MemoryCache.class.js';
// import { delay } from '@/utils';

/**
 * A list of requests that will not be cached
 */
const excludedRequests = [
    'NewChat.joinRoom',
    'NewChat.leaveRoom',
    'lootboxes.spin',
    'tokenauction.bet',

    'games.dice.bet',
    'games.spacedice.bet',
    'games.limbo.bet',
    'games.coinflip.bet',
    'games.keno.bet',
    'games.plinko.bet',
    'games.crash.bet',
    'games.litecrash.bet',
    'games.mines.bet',
    'games.ring.bet',
    'games.cryptos.bet',
    'games.tower.bet',
    'games.furypharaoh.bet',
    'games.hiLo.bet',
    'games.stairs.bet',
    'games.furywild.bet',
    'games.circle.bet',
    'games.triple.bet',
    'games.roulette.bet',
    'games.blackjack.bet',

    'games.dice.join',
    'games.spacedice.join',
    'games.limbo.join',
    'games.coinflip.join',
    'games.keno.join',
    'games.plinko.join',
    'games.crash.join',
    'games.mines.join',
    'games.ring.join',
    'games.cryptos.join',
    'games.tower.join',
    'games.furypharaoh.join',
    'games.hiLo.join',
    'games.stairs.join',
    'games.furywild.join',
    'games.circle.join',
    'games.triple.join',
    'games.roulette.join',
    'games.blackjack.join',

    'games.dice.exit',
    'games.spacedice.exit',
    'games.limbo.exit',
    'games.coinflip.exit',
    'games.keno.exit',
    'games.plinko.exit',
    'games.crash.exit',
    'games.mines.exit',
    'games.ring.exit',
    'games.cryptos.exit',
    'games.tower.exit',
    'games.furypharaoh.exit',
    'games.hiLo.exit',
    'games.stairs.exit',
    'games.furywild.exit',
    'games.circle.exit',
    'games.triple.exit',
    'games.roulette.exit',
    'games.blackjack.exit',
];

class SocketMediator {
    #queue = [];
    #timeout = undefined;
    #lastIntervalStart = 0;
    #numRequestsPerInterval = 0;
    #reconnecting = false;
    #getProfileAfterReconnect = false;
    #debug = !/betfury./.test(window.location.hostname);

    // Settings
    #maxRequestsPerInterval = 10;
    #interval = 1000; // ms
    #reconnectDelay = 10 * 1000; // 10 sec

    /**
     * Time to live.
     * How long (in ms) responses remain cached before being automatically ejected.
     * If undefined, responses are never automatically ejected from the cache.
     */
    #ttl = 2000;

    constructor(context, store) {
        this.context = context;
        this.$store = store;
        const ua = parser(navigator.userAgent);
        const { type } = ua.device;

        this.$store.commit('ui/setDeviceType', type);
        this.$store.commit('ui/setDeviceOS', ua.os.name);
        this.$store.commit('ui/setDeviceUA', ua.ua);
        this.$store.commit('ui/setDeviceBrowser', ua.browser);

        this.socket = this.context.$nuxtSocket({
            query: {
                mobile: type === 'mobile',
            },
            reconnection: false,
        });

        this.cache = new MemoryCache({
            ttl: this.#ttl,
        });

        this.socket.on('connect', this.#onConnect.bind(this));
        this.socket.on('disconnect', this.#onDisconnect.bind(this));
        this.socket.io.on('error', this.#onError.bind(this));
    }

    /**
     * A unique identifier for the socket session
     * Set after the connect event is triggered, and updated after the reconnect event
     * @returns {String}
     */
    get id() {
        return this.socket.id;
    }

    /**
     * Whether or not the socket is connected to the server
     * @returns {Boolean}
     */
    get connected() {
        return this.socket.connected && !this.#reconnecting;
    }

    /**
     * Register a new handler for the given event
     * @param eventName
     * @param listener
     */
    on(eventName, listener) {
        this.socket.on(eventName, listener);
    }

    /**
     * Removes the specified listener from the listener array for the event named eventName
     * @param eventName
     * @param listener
     */
    off(eventName, listener) {
        this.socket.off(eventName, listener);
    }

    /**
     * Emits an event to the socket identified by the string name
     * @param eventName
     * @param args
     * @param ack
     */
    emit(eventName, args = {}, ack) {
        // Skip all emits on socket reconnect except "profile.token"
        if (eventName !== 'profile.token' && this.#reconnecting) {
            this.#debug && console.error('✕', eventName);

            return;
        }

        // TODO: make the method return a promise
        const callback = () => {
            const cachedValue = this.cache.get(eventName, args);

            if (cachedValue) {
                this.#debug &&
                    console.error(
                        `Request "${eventName}" is repeated more than once every ${
                            this.#ttl / 1000
                        } second(s). Response is returned from the cache`
                    );

                ack(cachedValue);
            } else {
                this.socket.emit(eventName, args, (response) => {
                    if (!excludedRequests.includes(eventName) && response) {
                        this.cache.set(eventName, args, response);
                    }

                    if (typeof ack === 'function') {
                        ack(response);
                    }
                });
            }
        };

        // const callback = () => this.socket.emit(eventName, args, (response) => ack(response));
        const now = Date.now();

        if (this.#timeout === undefined && now - this.#lastIntervalStart > this.#interval) {
            this.#lastIntervalStart = now;
            this.#numRequestsPerInterval = 0;
        }

        if (this.#numRequestsPerInterval++ < this.#maxRequestsPerInterval) {
            callback();
        } else {
            this.#queue.push(callback);

            if (this.#queue.length > 100) {
                this.#queue.length = 0;

                console.warn('Socket buffer cleared');
            }

            if (this.#timeout === undefined) {
                this.#timeout = setTimeout(
                    this.#dequeue.bind(this),
                    this.#lastIntervalStart + this.#interval - now
                );
            }
        }
    }

    /**
     * Watch wrapper for loggedEmit and preLoginEmit
     * @param {String} [module] of store
     * @param {String} [key] of state
     * @param args
     */

    /**
     * Gets called at a set interval to remove items from the queue
     */
    #dequeue() {
        const intervalEnd = this.#lastIntervalStart + this.#interval;
        const now = Date.now();

        /**
         * Adjust the timer if it was called too early
         */
        if (now < intervalEnd) {
            this.#timeout !== undefined && clearTimeout(this.#timeout);
            this.#timeout = setTimeout(this.#dequeue, intervalEnd - now);

            return;
        }

        this.#lastIntervalStart = now;
        this.#numRequestsPerInterval = 0;

        for (const callback of this.#queue.splice(0, this.#maxRequestsPerInterval)) {
            this.#numRequestsPerInterval++;

            callback();
        }

        if (this.#queue.length) {
            this.#timeout = setTimeout(this.#dequeue.bind(this), this.#interval);
        } else {
            this.#timeout = undefined;
        }
    }

    /**
     * Fired upon connection to the Namespace (including a successful reconnection)
     */
    async #onConnect() {
        const { commit, dispatch, getters } = this.$store;

        /**
         * Moved the code from App.vue
         * It is necessary that the subscription to this event takes place before receiving the initial data
         */
        this.socket.on('cryptoStakingData', (data) => {
            commit('ui/setCryptoStakingHighestApr', data.cryptoStakingHighestApr);
        });
        this.socket.on('configurationsData', (data) => {
            dispatch('configs/parseConfigs', data);
        });
        this.socket.on('forbiddenProviders', (data) => {
            commit('games/setForbiddenProviders', Array.isArray(data) ? data : []);
        });

        if (this.#getProfileAfterReconnect) {
            const token = getters['user/getToken'];

            if (token) {
                const response = await dispatch('user/getProfile', token);

                if (response) {
                    commit('ui/canJoin', true);
                }
            }
        }

        commit('ui/setIsSocketConnected', true);

        // Reset reconnectDelay to default value 10 seconds
        this.#reconnectDelay = 10 * 1000;
        this.#reconnecting = false;

        console.warn('Socket connected!');
    }

    /**
     * Fired upon disconnection
     * @param reason
     */
    #onDisconnect(reason) {
        const { commit } = this.$store;

        commit('ui/canJoin', false);
        commit('ui/setIsSocketConnected', false);

        this.#getProfileAfterReconnect = true;
        this.#reconnecting = true;

        console.warn('Socket disconnected!');

        if (reason !== 'io server disconnect') {
            this.#tryToReconnect();
        }
    }

    /**
     * Fired upon a connection error
     * @param error
     */
    #onError(error) {
        console.warn('Socket connection error:', error.message);
        console.warn(`Reconnect after ${this.#reconnectDelay / 1000}s`);

        if (window.preloader && window.preloader.active) {
            window.preloader.showError(
                'Request blocked. Reconnect after',
                this.#reconnectDelay / 1000 - 2
            );
        }

        this.#tryToReconnect();
    }

    async #tryToReconnect() {
        await delay(this.#reconnectDelay);

        console.warn('Try to reconnect...');
        this.socket.connect();

        // increase #reconnectDelay by 2 seconds after each attempt
        this.#reconnectDelay += 2 * 1000;
    }

    #emitWatcher(module, key, ...args) {
        const { $store } = useNuxtApp();
        const state = computed(() => $store.state[module][key]);
        if (state.value) {
            this.emit(...args);
        } else {
            watchOnce(
                () => state.value,
                (newValue) => {
                    if (newValue) {
                        this.emit(...args);
                    }
                }
            );
        }
    }

    /**
     * Call emit when user will be logged
     * @param args
     */
    loggedEmit(...args) {
        this.#emitWatcher('user', 'isLogged', ...args);
    }

    /**
     * Call emit after pre-login finished (when we know => logged or not)
     * @param args
     */
    preLoginEmit(...args) {
        this.#emitWatcher('app', 'isPreLoginFinished', ...args);
    }

    /**
     * @description Method for force socket reconnection
     * @param {Boolean} withCheckConnection Reconnect only if socket disconnected
     * @return {Promise}
     */

    forceReconnect(withCheckConnection = true) {
        const { effectiveType } = useNetwork();
        const networkSpeedTypes = {
            '4g': { pingTimeout: 1000, delayAfterReconnect: 800 },
            '3g': { pingTimeout: 2000, delayAfterReconnect: 1000 },
            '2g': { pingTimeout: 4000, delayAfterReconnect: 3000 },
            'slow-2g': { pingTimeout: 5000, delayAfterReconnect: 4000 },
        };
        const { pingTimeout, delayAfterReconnect } = networkSpeedTypes[effectiveType.value] || {
            pingTimeout: 1000,
            delayAfterReconnect: 800,
        };
        return new Promise((resolve) => {
            const reconnect = () => {
                this.socket.disconnect();
                this.socket.connect();
                setTimeout(() => {
                    resolve();
                }, delayAfterReconnect);
            };
            if (withCheckConnection) {
                this.ping(pingTimeout).then((isConnectedSocket) => {
                    if (isConnectedSocket) {
                        resolve();
                    } else {
                        reconnect();
                    }
                });
            } else {
                reconnect();
            }
        });
    }

    /**
     * @description Method for check socket connection
     * @param {number} timeout Time for wait response
     * @return {Promise<Boolean>}
     */

    ping(timeout = 1000) {
        return new Promise((resolve) => {
            const timeoutId = setTimeout(() => {
                resolve(false);
            }, timeout);
            this.socket.emit('profile.ping', {}, () => {
                clearTimeout(timeoutId);
                resolve(true);
            });
        });
    }
}

export default SocketMediator;
