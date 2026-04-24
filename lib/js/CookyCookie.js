import { COOKY_NAME } from './Constants.js';

let cookyStore = {};

const CookyCookie = {
    name: COOKY_NAME,

    /**
     * Load the cookie data into the `cookyStore` object.
     */
    load: () => {
        const cookies = CookyCookie.read().split('!');
        const cookieData = {};

        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie) {
                const [key, value] = cookie.split('=');
                if (key && value) {
                    cookieData[key] = value;
                }
            }
        }

        cookyStore = { ...cookyStore, ...cookieData };
    },

    /**
     * Get the current state of a service.
     * @param {string} key - The service key.
     * @returns {boolean|string|null} - Returns `true`, `false`, `'wait'`, or `null` if undefined.
     */
    get: (key) => {
        if (cookyStore[key] === undefined) {
            return null;
        }
        if (cookyStore[key] === 'true') return true;
        if (cookyStore[key] === 'false') return false;
        if (cookyStore[key] === 'wait') return 'wait';
        if (cookyStore[key] === 'force') return 'force';
        return null;
    },

    /**
     * Set the state for a service and update the cookie.
     * @param {string} key - The service key.
     * @param {string|boolean} status - The state (`true`, `false`, `'wait'`, `'force'`).
     */
    set: (key, status) => {
        // if (status !== true && status !== false && status !== 'wait' && status !== 'force') {
        //     throw new Error('Invalid status. Use true, false, "wait" or "force".');
        // }

        if (status === true) {
            cookyStore[key] = 'true';
        }
        else if (status === false) {
            cookyStore[key] = 'false';
        }
        else if (status === 'wait') {
            cookyStore[key] = 'wait';
        }
        else if (status === 'force') {
            cookyStore[key] = 'force';
        }
        else {
            throw new Error('Invalid status. Use true, false, "wait" or "force".');
            // console.warn('Invalid status. Use true, false, "wait" or "force".');
            // cookyStore[key] = '';
        }

        CookyCookie.updateCookie();
    },

    /**
     * Delete a service from the store and update the cookie.
     * @param {string} key - The service key to delete.
     */
    delete: (key) => {
        if (cookyStore[key] !== undefined) {
            delete cookyStore[key];
            CookyCookie.updateCookie();
        }
    },

    /**
     * Read the raw cookie value for `COOKY_NAME`.
     * @returns {string} - The raw cookie value.
     */
    read: () => {
        const nameEQ = `${CookyCookie.name}=`;
        const cookies = document.cookie.split(';');

        for (let i = 0; i < cookies.length; i++) {
            let c = cookies[i].trim();
            if (c.indexOf(nameEQ) === 0) {
                return c.substring(nameEQ.length);
            }
        }
        return '';
    },

    /**
     * Update the cookie value based on the current `cookyStore`.
     */
    updateCookie: () => {
        const d = new Date();
        const time = d.getTime();
        const expireTime = time + 31536000000; // 365 days in milliseconds
        d.setTime(expireTime);

        const cookieValue = Object.entries(cookyStore)
            .map(([key, value]) => `${key}=${value}`)
            .join('!');

        const secureAttr = location.protocol === 'https:' ? ' Secure;' : '';
        document.cookie = `${CookyCookie.name}=${cookieValue}; expires=${d.toGMTString()}; path=/;${secureAttr} SameSite=strict`;
    },
};

export default CookyCookie;