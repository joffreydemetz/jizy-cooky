const Utils = {
    D: false,

    /**
     * Extends an object with properties from one or more source objects.
     * @param {Object} [out={}] The target object to extend.
     * @param {...Object} sources The source objects to copy properties from.
     * @returns {Object} The extended object.
     */
    extend: (out = {}, ...sources) => {
        sources.forEach((source) => {
            if (source && typeof source === 'object') {
                Object.keys(source).forEach((key) => {
                    if (typeof source[key] === 'object' && !Array.isArray(source[key])) {
                        out[key] = Utils.extend(out[key] || {}, source[key]);
                    } else {
                        out[key] = source[key];
                    }
                });
            }
        });
        return out;
    },

    thrown: (error) => {
        const DEBUG_MODE = window.Cooky && window.Cooky.debugMode;
        if (!DEBUG_MODE) return;

        if (typeof error === 'string') {
            console.warn('Cooky ERROR:', error);
        } else if (error instanceof Error) {
            console.error('Cooky ERROR:', error.message);
        } else if (typeof error === 'object') {
            console.dir('Cooky ERROR:', error);
        } else {
            console.warn('Cooky ERROR:', error);
        }
    },
    
    /** 
     * Logs debug information to the console if debug mode is enabled.
     * Supports multiple arguments and automatically uses `console.dir` for objects or arrays.
     * @param {...any} args The data to log. The last argument can specify the console method (e.g., 'log', 'warn').
     */
    debug: (...args) => {
        const DEBUG_MODE = window.Cooky && window.Cooky.debugMode;
        if (!DEBUG_MODE) return;

        // Extract the last argument as the console method, defaulting to 'log'
        let method = typeof args[args.length - 1] === 'string' && console[args[args.length - 1]] ? args.pop() : 'log';

        // Check if the method is valid
        if (method !== 'warn' && method !== 'error') {
            method = 'log';
        }

        let prefix = 'Cooky';
        if (method === 'warn' || method === 'error') {
            prefix += ' ' + method.toUpperCase();
        }
        prefix += ':';

        args.forEach((arg) => {
            // Check if the first argument is an object or array, and use `console.dir` if so
            if (typeof arg === 'object' || Array.isArray(arg)) {
                console.dir(prefix, arg);
            } else {
                console[method](prefix + ' ' + arg);
            }
        });
    },

    /**
     * Logs a warning message to the console if debug mode is enabled.
     * @param {...any} args The data to log as a warning.
     */
    warn: (...args) => {
        Utils.debug(...args, 'warn');
    },

    /**
     * Logs an error message to the console if debug mode is enabled.
     * @param {...any} args The data to log as an error.
     */
    error: (...args) => {
        Utils.debug(...args, 'error');
    },

    arrayUnique: (inputArr) => {
        return [...new Set(inputArr)];
    },

    arrayMerge: (...arrays) => {
        return [].concat(...arrays);
    },

    hasAllClasses: (element, classNames) => {
        return classNames.every((className) => element.classList.contains(className));
    },

};

export default Utils;