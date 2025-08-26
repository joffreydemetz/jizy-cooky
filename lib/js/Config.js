import Utils from './Utils.js';

const configStore = {
    defaultLanguage: 'en', // default language
    navigatorLanguage: true, // look for navigator language
    language: 'en', // user language
    locale: 'en_US', // user locale

    position: 'bottom', // position of the banner (center, bottom, top)

    adBlocker: false, // adBlocker has been detected
    noAdBlocker: false, // adBlocker cannot be active

    refuseAll: false, // refuse all button
    dontcare: false, // ignore all button

    service: {}, // services config
    user: {} // user config (fonts, colors, etc.)
};

const checkType = (key, type1, type2) => {
    if (typeof type1 === 'undefined' || type1 === null) {
        return true;
    }

    if (typeof type1 === typeof type2) {
        return true;
    }

    Utils.thrown(`Config.set() - ${key} expects a ${typeof type1} value`);
};

const Config = {
    all: () => {
        return configStore;
    },

    /**
     * Initialize the configuration with default values.
     * @param {object} data - The configuration data to initialize with.
     */
    sets: (data) => {
        if (typeof data !== 'object') {
            Utils.thrown('Config.sets() expects an object as argument');
            return;
        }

        Object.keys(data).forEach((key) => {
            try {
                Config.set(key, data[key]);
            } catch (e) {
                // Ignore errors for invalid keys
                // Utils.thrown(e.message);
            }
        });
    },

    /**
     * Check if a configuration key exists.
     * @param {string} key - The configuration key to check.
     * @return {boolean} True if the key exists, false otherwise.
     */
    has: (key) => {
        if (key.includes('.')) {
            const nodes = key.split('.');
            let node = configStore;

            for (let i = 0, n = nodes.length; i < n; i++) {
                if (typeof node[nodes[i]] === 'undefined' || node[nodes[i]] === null) {
                    return false;
                }
                node = node[nodes[i]];
            }

            return true;
        }

        return typeof configStore[key] !== 'undefined' && configStore[key] !== null;
    },

    /**
     * Set a configuration value.
     * @param {string} key - The configuration key to set.
     * @param {*} value - The value to set for the configuration key.
     */
    set: (key, value) => {
        if (typeof key !== 'string') {
            Utils.thrown('Config.set() expects a string as the first argument');
            return;
        }

        if (typeof value === 'undefined') {
            Utils.thrown('Config.set() expects a value as the second argument');
            return;
        }

        if (key.includes('.')) {
            const nodes = key.split('.');
            let node = configStore;

            for (let i = 0, n = nodes.length - 1; i < n; i++) {
                if (typeof node[nodes[i]] === 'undefined') {
                    if (0 === i) {
                        Utils.thrown(`Config.set() - ${key} is not a valid key`);
                        return;
                    }

                    // create the node if it doesn't exist
                    // example for service[serviceId] = {}
                    node[nodes[i]] = {};
                }

                node = node[nodes[i]];
            }

            if (!checkType(key, node[nodes[nodes.length - 1]], value)) {
                return;
            }

            node[nodes[nodes.length - 1]] = value;
            return;
        }

        if (typeof configStore[key] === 'undefined') {
            Utils.thrown(`Config.set() - ${key} is not a valid key`);
            return;
        }

        if (!checkType(key, configStore[key], value)) {
            return;
        }

        configStore[key] = value;
    },

    /**
     * Get a configuration value.
     * @param {string} key - The configuration key to retrieve.
     * @param {*} [def=null] - The default value to return if the key is not found.
     * @return {*} The configuration value or the default value if not found.
     */
    get: (key, def = null) => {
        let result = null;
        let node = configStore;

        if (key.includes('.')) {
            const nodes = key.split('.');
            for (let i = 0, n = nodes.length - 1; i < n; i++) {
                if (typeof node[nodes[i]] === 'undefined') {
                    return def;
                }
                node = node[nodes[i]];
            }

            result = node[nodes[nodes.length - 1]];
        } else {
            result = node[key];
        }

        return result === undefined ? def : result;
    },

    /**
     * Remove a configuration value.
     * @param {string} key - The configuration key to remove.
     */
    remove: (key) => {
        if (key.includes('.')) {
            const nodes = key.split('.');
            let node = configStore;

            for (let i = 0, n = nodes.length - 1; i < n; i++) {
                if (typeof node[nodes[i]] === 'undefined') {
                    return;
                }
                node = node[nodes[i]];
            }

            if (node && typeof node[nodes[nodes.length - 1]] !== 'undefined') {
                delete node[nodes[nodes.length - 1]];
            }

            return;
        }

        if (typeof configStore[key] !== 'undefined') {
            delete configStore[key];
        }
    },

    /**
     * Define a configuration value if it is not already set.
     * @param {string} key - The configuration key.
     * @param {*} value - The default value to set if the key is not already defined.
     */
    def: (key, value) => {
        if (!Config.has(key)) {
            Config.set(key, value);
        }
    }
};

export default Config;