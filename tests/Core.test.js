import { describe, it, expect, beforeEach, vi } from 'vitest';

let Core;
let Service;
let Category;
let Language;
let Plugin;
let Config;
let COOKY_CATEGORIES;

beforeEach(async () => {
    vi.resetModules();
    Core = (await import('../lib/js/Core.js')).default;
    Service = (await import('../lib/js/Service.js')).default;
    Category = (await import('../lib/js/Category.js')).default;
    Language = (await import('../lib/js/Language.js')).default;
    Plugin = (await import('../lib/js/Plugin.js')).default;
    Config = (await import('../lib/js/Config.js')).default;
    COOKY_CATEGORIES = (await import('../lib/js/Constants.js')).COOKY_CATEGORIES;
});

const makeService = (id, type = 'other', extras = {}) => {
    const s = new Service(id, id);
    s.type = type;
    Object.assign(s, extras);
    return s;
};

describe('Core.addLanguage', () => {
    it('stores a language under its code', () => {
        const lang = new Language('en', 'English', 'en_GB');
        Core.addLanguage(lang);
        expect(Core.languageStore.en).toBe(lang);
    });

    it('does not overwrite an existing language', () => {
        const a = new Language('en', 'English', 'en_GB');
        const b = new Language('en', 'Other', 'en_US');
        Core.addLanguage(a);
        Core.addLanguage(b);
        expect(Core.languageStore.en).toBe(a);
    });

    it('ignores falsy arguments', () => {
        expect(() => Core.addLanguage(null)).not.toThrow();
    });
});

describe('Core.addService', () => {
    it('stores a service and merges its translations', () => {
        Core.addLanguage(new Language('en', 'English', 'en_GB'));

        class S extends Service {
            getTranslations() {
                return { en: { 'svc.label': 'Hi' } };
            }
        }
        const s = new S('matomo', 'Matomo');

        Core.addService(s);

        expect(Core.serviceStore.matomo).toBe(s);
        expect(Core.languageStore.en.get('svc.label')).toBe('Hi');
    });

    it('does not overwrite an existing service', () => {
        const a = makeService('matomo');
        const b = makeService('matomo');
        Core.addService(a);
        Core.addService(b);
        expect(Core.serviceStore.matomo).toBe(a);
    });
});

describe('Core.addPlugin', () => {
    it('logs an error when the target service is unknown', () => {
        const err = vi.spyOn(console, 'error').mockImplementation(() => {});
        Core.addPlugin('missing', new Plugin());
        expect(err).toHaveBeenCalled();
        err.mockRestore();
    });

    it('forwards plugin data and translations to the service / language stores', () => {
        Core.addLanguage(new Language('en', 'English', 'en_GB'));
        Core.addService(makeService('core', 'technical'));

        class P extends Plugin {
            getData() {
                return { cookies: [{ name: 'PHPSESSID', duration: 'browser' }] };
            }
            getTranslations() {
                return { en: { 'phpsessid.details': 'Session cookie.' } };
            }
        }

        Core.addPlugin('core', new P());

        expect(Core.serviceStore.core.cookies).toHaveLength(1);
        expect(Core.serviceStore.core.cookies[0].getName()).toBe('PHPSESSID');
        expect(Core.languageStore.en.get('phpsessid.details')).toBe('Session cookie.');
    });
});

describe('Core.appendServiceData', () => {
    it('warns and bails if the service is unknown', () => {
        const err = vi.spyOn(console, 'error').mockImplementation(() => {});
        Core.appendServiceData('missing', { uri: 'x' });
        expect(err).toHaveBeenCalled();
        err.mockRestore();
    });

    it('mutates the target service', () => {
        Core.addService(makeService('matomo'));
        Core.appendServiceData('matomo', { uri: 'https://example.test' });
        expect(Core.serviceStore.matomo.uri).toBe('https://example.test');
    });
});

describe('Core.addCategory + ordering', () => {
    it('forces "technical" to order 0', () => {
        Core.addCategory(new Category('technical'));
        expect(Core.categoryStore.technical.order).toBe(0);
    });

    it('forces "other" past every standard category', () => {
        Core.addCategory(new Category('other'));
        expect(Core.categoryStore.other.order).toBeGreaterThan(COOKY_CATEGORIES.length);
    });

    it('assigns sequential orders to other categories', () => {
        Core.addCategory(new Category('analytic'));
        Core.addCategory(new Category('social'));
        expect(Core.categoryStore.analytic.order).toBeGreaterThan(0);
        expect(Core.categoryStore.social.order).toBeGreaterThan(
            Core.categoryStore.analytic.order
        );
    });

    it('does not overwrite an existing category', () => {
        const a = new Category('analytic');
        const b = new Category('analytic');
        Core.addCategory(a);
        Core.addCategory(b);
        expect(Core.categoryStore.analytic).toBe(a);
    });
});

describe('Core.updateConfig', () => {
    it('applies provided keys via Config.set', () => {
        Core.updateConfig({ language: 'fr' });
        expect(Config.get('language')).toBe('fr');
    });

    it('ignores empty config inputs', () => {
        Core.updateConfig({});
        Core.updateConfig(null);
        // no throw, no observable side effect
        expect(Config.get('language')).toBe('en');
    });
});

describe('Core.check + loadCategories + reorderServices', () => {
    it('places services into their declared category', () => {
        Core.addService(makeService('matomo', 'analytic'));
        Core.addService(makeService('core', 'technical'));
        Core.check();

        expect(Core.categoryStore.technical.services.core).toBeDefined();
        expect(Core.categoryStore.analytic.services.matomo).toBeDefined();
    });

    it('puts technical / "core" service first after reorder', () => {
        Core.addService(makeService('matomo', 'analytic'));
        Core.addService(makeService('core', 'technical'));
        Core.check();

        const ids = Object.keys(Core.serviceStore);
        expect(ids[0]).toBe('core');
    });

    it('creates an ad-hoc category for unknown service types', () => {
        Core.addService(makeService('weird', 'made-up'));
        Core.check();
        expect(Core.categoryStore['made-up']).toBeDefined();
        expect(Core.categoryStore['made-up'].services.weird).toBeDefined();
    });

    it('orders services by category order then service order', () => {
        Core.addService(makeService('a-analytic', 'analytic'));
        Core.addService(makeService('z-social', 'social'));
        Core.addService(makeService('core', 'technical'));
        Core.check();

        const ids = Object.keys(Core.serviceStore);
        expect(ids.indexOf('core')).toBeLessThan(ids.indexOf('a-analytic'));
        expect(ids.indexOf('a-analytic')).toBeLessThan(ids.indexOf('z-social'));
    });
});

describe('Core.updateState / resetState', () => {
    it('counts allowed / denied / pending across non-technical services', () => {
        Core.addService(makeService('a', 'analytic', { allowed: true }));
        Core.addService(makeService('b', 'analytic', { denied: true }));
        Core.addService(makeService('c', 'analytic'));
        Core.addService(makeService('core', 'technical'));

        Core.resetState();
        Core.updateState();

        expect(Core.total).toBe(3);
        expect(Core.allowed).toBe(1);
        expect(Core.denied).toBe(1);
        expect(Core.pending).toBe(1);
    });

    it('resetState zeroes the counters', () => {
        Core.total = 5;
        Core.allowed = 2;
        Core.denied = 2;
        Core.pending = 1;
        Core.resetState();
        expect(Core.total).toBe(0);
        expect(Core.allowed).toBe(0);
        expect(Core.denied).toBe(0);
        expect(Core.pending).toBe(0);
    });
});

describe('Core.reset', () => {
    it('clears stores and counters', () => {
        Core.addLanguage(new Language('en', 'English', 'en_GB'));
        Core.addService(makeService('matomo'));
        Core.addCategory(new Category('analytic'));
        Core.total = 9;
        Core.reset();
        expect(Core.languageStore).toEqual({});
        expect(Core.serviceStore).toEqual({});
        expect(Core.categoryStore).toEqual({});
        expect(Core.total).toBe(0);
    });
});

describe('Core.checkNavigatorLanguage', () => {
    it('switches defaultLanguage when navigator language is recognised', () => {
        Core.addLanguage(new Language('fr', 'Français', 'fr_FR'));
        Object.defineProperty(navigator, 'language', {
            value: 'fr-FR',
            configurable: true
        });
        Core.checkNavigatorLanguage();
        expect(Config.get('defaultLanguage')).toBe('fr');
    });

    it('does not change defaultLanguage when navigator language is unknown', () => {
        Object.defineProperty(navigator, 'language', {
            value: 'xx-XX',
            configurable: true
        });
        Core.checkNavigatorLanguage();
        expect(Config.get('defaultLanguage')).toBe('en');
    });

    it('does nothing when navigatorLanguage feature is disabled', () => {
        Config.set('navigatorLanguage', false);
        Core.addLanguage(new Language('fr', 'Français', 'fr_FR'));
        Object.defineProperty(navigator, 'language', {
            value: 'fr-FR',
            configurable: true
        });
        Core.checkNavigatorLanguage();
        expect(Config.get('defaultLanguage')).toBe('en');
    });
});

describe('Core.loadDefaultLanguage', () => {
    it('writes language + locale from the resolved language', () => {
        Core.addLanguage(new Language('fr', 'Français', 'fr_FR'));
        Config.set('defaultLanguage', 'fr');
        Core.loadDefaultLanguage();
        expect(Config.get('language')).toBe('fr');
        expect(Config.get('locale')).toBe('fr_FR');
    });

    it('logs an error when the default language is missing', () => {
        Config.set('defaultLanguage', 'zz');
        const err = vi.spyOn(console, 'error').mockImplementation(() => {});
        Core.loadDefaultLanguage();
        expect(err).toHaveBeenCalled();
        err.mockRestore();
    });
});

describe('Core.appendTranslations / addTranslations', () => {
    it('appends translations into existing languages', () => {
        const en = new Language('en', 'English', 'en_GB');
        const fr = new Language('fr', 'Français', 'fr_FR');
        Core.addLanguage(en);
        Core.addLanguage(fr);
        Core.appendTranslations({
            en: { 'k': 'v_en' },
            fr: { 'k': 'v_fr' }
        });
        expect(en.get('k')).toBe('v_en');
        expect(fr.get('k')).toBe('v_fr');
    });

    it('ignores unknown language codes', () => {
        Core.addLanguage(new Language('en', 'English', 'en_GB'));
        expect(() =>
            Core.appendTranslations({ zz: { x: 'y' } })
        ).not.toThrow();
    });

    it('addTranslations errors out for missing language', () => {
        const err = vi.spyOn(console, 'error').mockImplementation(() => {});
        Core.addTranslations('zz', { k: 'v' });
        expect(err).toHaveBeenCalled();
        err.mockRestore();
    });
});
