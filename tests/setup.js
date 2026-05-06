import { beforeEach } from 'vitest';

beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    document.body.className = '';

    document.cookie.split(';').forEach((c) => {
        const eq = c.indexOf('=');
        const name = (eq > -1 ? c.substring(0, eq) : c).trim();
        if (name) {
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
        }
    });

    if (!window.Cooky) {
        window.Cooky = { debugMode: false };
    } else {
        window.Cooky.debugMode = false;
    }
});
