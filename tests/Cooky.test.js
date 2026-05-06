import { describe, it, expect, beforeEach, vi } from 'vitest';

let Cooky;
let Core;
let Service;
let Language;
let Plugin;
let Config;
let COOKY_NAME;
let COOKY_VERSION;

beforeEach(async () => {
    vi.resetModules();
    // jizy-cooky imports DOM-heavy elements eagerly via Cooky.js — keep the
    // body minimal so they don't try to bootstrap until a test asks for it.
    document.body.innerHTML = '';
    Cooky = (await import('../lib/js/Cooky.js')).default;
    Core = (await import('../lib/js/Core.js')).default;
    Service = (await import('../lib/js/Service.js')).default;
    Language = (await import('../lib/js/Language.js')).default;
    Plugin = (await import('../lib/js/Plugin.js')).default;
    Config = (await import('../lib/js/Config.js')).default;
    const C = await import('../lib/js/Constants.js');
    COOKY_NAME = C.COOKY_NAME;
    COOKY_VERSION = C.COOKY_VERSION;
});

describe('Cooky public surface', () => {
    it('exposes name and version', () => {
        expect(Cooky.getName()).toBe(COOKY_NAME);
        expect(Cooky.getVersion()).toBe(COOKY_VERSION);
    });

    it('reports loaded state from Core', () => {
        expect(Cooky.isLoaded()).toBe(false);
        Core.loaded = true;
        expect(Cooky.isLoaded()).toBe(true);
    });
});

describe('Cooky add* helpers delegate to Core', () => {
    it('addLanguage', () => {
        const lang = new Language('en', 'English', 'en_GB');
        Cooky.addLanguage(lang);
        expect(Core.languageStore.en).toBe(lang);
    });

    it('addService', () => {
        const s = new Service('matomo', 'Matomo');
        Cooky.addService(s);
        expect(Core.serviceStore.matomo).toBe(s);
    });

    it('addPlugin', () => {
        const s = new Service('core', 'Core');
        Core.addService(s);
        class P extends Plugin {
            getData() {
                return { uri: 'https://example.test' };
            }
        }
        Cooky.addPlugin('core', new P());
        expect(Core.serviceStore.core.uri).toBe('https://example.test');
    });
});

describe('Cooky.config / check', () => {
    it('config() forwards to Core.updateConfig', () => {
        Cooky.config({ language: 'fr' });
        expect(Config.get('language')).toBe('fr');
    });

    it('config() is a no-op once loaded', () => {
        Core.loaded = true;
        Cooky.config({ language: 'fr' });
        expect(Config.get('language')).toBe('en');
    });

    it('check() lets Core build categories', () => {
        Cooky.addService(Object.assign(new Service('matomo', 'Matomo'), { type: 'analytic' }));
        Cooky.check();
        expect(Core.categoryStore.analytic).toBeDefined();
    });

    it('check() is a no-op once loaded', () => {
        Core.loaded = true;
        Cooky.addService(Object.assign(new Service('matomo', 'Matomo'), { type: 'analytic' }));
        Cooky.check();
        expect(Core.categoryStore.analytic).toBeUndefined();
    });
});

describe('Cooky.appendServiceCookies / updateServiceCookie', () => {
    it('appends cookies onto an existing service', () => {
        const s = new Service('matomo', 'Matomo');
        Cooky.addService(s);
        Cooky.appendServiceCookies('matomo', [{ name: '_pk_id' }]);
        expect(s.cookies).toHaveLength(1);
        expect(s.cookies[0].getName()).toBe('_pk_id');
    });

    it('appendServiceCookies is silent for unknown services', () => {
        expect(() =>
            Cooky.appendServiceCookies('missing', [{ name: 'x' }])
        ).not.toThrow();
    });

    it('updateServiceCookie patches a single field on a known service cookie', () => {
        const s = new Service('matomo', 'Matomo');
        s.setCookies([{ name: '_pk_id' }]);
        Cooky.addService(s);
        Cooky.updateServiceCookie('matomo', '_pk_id', 'details', 'updated');
        expect(s.cookies[0].details).toBe('updated');
    });
});

describe('Cooky.respond / respondAll', () => {
    // Cooky.onResponse() calls back into $modal — give it a stub so we can drive
    // the response flow without the full DOM wiring.
    beforeEach(() => {
        Cooky.$modal = {
            displayMessage: vi.fn(),
            updateServicesState: vi.fn()
        };
    });

    it('respond() flips a known non-technical service to allowed', () => {
        const s = new Service('matomo', 'Matomo');
        s.type = 'analytic';
        const js = vi.fn();
        s.js = js;
        Cooky.addService(s);

        Cooky.respond('matomo', true);

        expect(s.allowed).toBe(true);
        expect(js).toHaveBeenCalled();
        expect(Cooky.$modal.displayMessage).toHaveBeenCalled();
    });

    it('respond() ignores technical services', () => {
        const s = new Service('core', 'Core');
        s.type = 'technical';
        Cooky.addService(s);
        Cooky.respond('core', false);
        expect(s.denied).toBe(false);
    });

    it('respond() ignores required services', () => {
        const s = new Service('foo', 'Foo');
        s.required = true;
        Cooky.addService(s);
        Cooky.respond('foo', false);
        expect(s.denied).toBe(false);
    });

    it('respond() bails when service is unknown', () => {
        expect(() => Cooky.respond('missing', true)).not.toThrow();
    });

    it('respondAll() flips every non-technical service', () => {
        const a = new Service('a', 'A');
        a.type = 'analytic';
        const b = new Service('b', 'B');
        b.type = 'social';
        const core = new Service('core', 'Core');
        core.type = 'technical';

        Cooky.addService(a);
        Cooky.addService(b);
        Cooky.addService(core);

        Cooky.respondAll(true);

        expect(a.allowed).toBe(true);
        expect(b.allowed).toBe(true);
        // technical service untouched
        expect(core.allowed).toBe(false);
    });
});
