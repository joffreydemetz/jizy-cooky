import { describe, it, expect, beforeEach, vi } from 'vitest';

// Config holds module-level state, so re-import a fresh copy per test.
let Config;

beforeEach(async () => {
    vi.resetModules();
    Config = (await import('../lib/js/Config.js')).default;
});

describe('Config defaults', () => {
    it('exposes the documented defaults', () => {
        const all = Config.all();
        expect(all.defaultLanguage).toBe('en');
        expect(all.navigatorLanguage).toBe(true);
        expect(all.language).toBe('en');
        expect(all.locale).toBe('en_US');
        expect(all.position).toBe('bottom');
        expect(all.adBlocker).toBe(false);
        expect(all.refuseAll).toBe(false);
        expect(all.dontcare).toBe(false);
        expect(all.service).toEqual({});
        expect(all.user).toEqual({});
    });
});

describe('Config.has', () => {
    it('returns true for a known top-level key', () => {
        expect(Config.has('defaultLanguage')).toBe(true);
    });

    it('returns false for an unknown top-level key', () => {
        expect(Config.has('nope')).toBe(false);
    });

    it('returns true for nested dot-notation keys that exist', () => {
        Config.set('service.foo', { name: 'Foo' });
        expect(Config.has('service.foo')).toBe(true);
        expect(Config.has('service.foo.name')).toBe(true);
    });

    it('returns false for nested keys that do not exist', () => {
        expect(Config.has('service.missing')).toBe(false);
        expect(Config.has('user.theme.color')).toBe(false);
    });
});

describe('Config.set', () => {
    it('updates an existing top-level value', () => {
        Config.set('language', 'fr');
        expect(Config.get('language')).toBe('fr');
    });

    it('rejects unknown top-level keys silently', () => {
        Config.set('nonsense', 'value');
        expect(Config.get('nonsense')).toBeNull();
    });

    it('enforces type compatibility for top-level keys', () => {
        Config.set('navigatorLanguage', 'not a boolean');
        // type mismatch was rejected — original value retained
        expect(Config.get('navigatorLanguage')).toBe(true);
    });

    it('creates nested nodes under a known root', () => {
        Config.set('service.matomo', { url: 'https://example.com' });
        expect(Config.get('service.matomo')).toEqual({ url: 'https://example.com' });
    });

    it('refuses to create a brand new top-level branch via dot notation', () => {
        Config.set('madeup.deep.path', 1);
        expect(Config.has('madeup')).toBe(false);
    });

    it('ignores calls with non-string keys', () => {
        Config.set(123, 'x');
        // nothing to assert beyond "did not throw and did not pollute"
        expect(Config.get('123')).toBeNull();
    });

    it('ignores calls with undefined value', () => {
        Config.set('language', undefined);
        expect(Config.get('language')).toBe('en');
    });
});

describe('Config.get', () => {
    it('returns the default when the key is missing', () => {
        expect(Config.get('nope', 'fallback')).toBe('fallback');
    });

    it('returns null by default for missing keys', () => {
        expect(Config.get('nope')).toBeNull();
    });

    it('reads through dot notation', () => {
        Config.set('service.x', { id: 1 });
        expect(Config.get('service.x.id')).toBe(1);
    });

    it('returns the default when a nested intermediate is missing', () => {
        expect(Config.get('service.absent.deep', 'fb')).toBe('fb');
    });
});

describe('Config.remove', () => {
    it('removes a top-level key', () => {
        Config.remove('language');
        expect(Config.has('language')).toBe(false);
    });

    it('removes a nested key while leaving siblings intact', () => {
        Config.set('service.a', { x: 1 });
        Config.set('service.b', { y: 2 });
        Config.remove('service.a');
        expect(Config.has('service.a')).toBe(false);
        expect(Config.get('service.b')).toEqual({ y: 2 });
    });

    it('is a no-op for missing nested keys', () => {
        expect(() => Config.remove('service.does.not.exist')).not.toThrow();
    });
});

describe('Config.def', () => {
    it('sets a nested value when the key is missing', () => {
        Config.def('service.matomo', { url: 'https://example.test' });
        expect(Config.get('service.matomo')).toEqual({ url: 'https://example.test' });
    });

    it('does not overwrite an existing nested value', () => {
        Config.set('service.matomo', { url: 'first' });
        Config.def('service.matomo', { url: 'second' });
        expect(Config.get('service.matomo')).toEqual({ url: 'first' });
    });

    it('does not overwrite an existing top-level value', () => {
        Config.set('language', 'fr');
        Config.def('language', 'es');
        expect(Config.get('language')).toBe('fr');
    });
});

describe('Config.sets', () => {
    it('applies multiple settings at once', () => {
        Config.sets({ language: 'fr', position: 'top' });
        expect(Config.get('language')).toBe('fr');
        expect(Config.get('position')).toBe('top');
    });

    it('skips invalid keys without throwing', () => {
        expect(() => Config.sets({ language: 'fr', bogus: 'no' })).not.toThrow();
        expect(Config.get('language')).toBe('fr');
        expect(Config.get('bogus')).toBeNull();
    });
});
