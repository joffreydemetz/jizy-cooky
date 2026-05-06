import { describe, it, expect, beforeEach, vi } from 'vitest';

// CookyCookie holds a module-level store, so isolate per test.
let CookyCookie;
let COOKY_NAME;

beforeEach(async () => {
    vi.resetModules();
    CookyCookie = (await import('../lib/js/CookyCookie.js')).default;
    COOKY_NAME = (await import('../lib/js/Constants.js')).COOKY_NAME;
});

describe('CookyCookie.read', () => {
    it('returns an empty string when the cooky cookie is absent', () => {
        expect(CookyCookie.read()).toBe('');
    });

    it('returns the raw value when the cooky cookie is present', () => {
        document.cookie = `${COOKY_NAME}=matomo=true!ga=false; path=/`;
        expect(CookyCookie.read()).toBe('matomo=true!ga=false');
    });
});

describe('CookyCookie.load + get', () => {
    it('returns null for a key that has not been seen', () => {
        expect(CookyCookie.get('matomo')).toBeNull();
    });

    it('parses the persisted cookie into typed states', () => {
        document.cookie = `${COOKY_NAME}=matomo=true!ga=false!yt=wait!core=force; path=/`;
        CookyCookie.load();
        expect(CookyCookie.get('matomo')).toBe(true);
        expect(CookyCookie.get('ga')).toBe(false);
        expect(CookyCookie.get('yt')).toBe('wait');
        expect(CookyCookie.get('core')).toBe('force');
    });

    it('returns null for unknown serialized values', () => {
        document.cookie = `${COOKY_NAME}=weird=banana; path=/`;
        CookyCookie.load();
        expect(CookyCookie.get('weird')).toBeNull();
    });
});

describe('CookyCookie.set', () => {
    it('persists boolean true', () => {
        CookyCookie.set('matomo', true);
        expect(CookyCookie.get('matomo')).toBe(true);
        expect(document.cookie).toContain(`${COOKY_NAME}=matomo=true`);
    });

    it('persists boolean false', () => {
        CookyCookie.set('matomo', false);
        expect(CookyCookie.get('matomo')).toBe(false);
    });

    it('persists "wait" and "force" string states', () => {
        CookyCookie.set('matomo', 'wait');
        expect(CookyCookie.get('matomo')).toBe('wait');
        CookyCookie.set('matomo', 'force');
        expect(CookyCookie.get('matomo')).toBe('force');
    });

    it('throws when given an unsupported status', () => {
        expect(() => CookyCookie.set('matomo', 'maybe')).toThrow();
    });

    it('serializes multiple services with the "!" separator', () => {
        CookyCookie.set('a', true);
        CookyCookie.set('b', false);
        const written = document.cookie;
        expect(written).toContain(`${COOKY_NAME}=`);
        expect(written).toMatch(/a=true!b=false|b=false!a=true/);
    });
});

describe('CookyCookie.delete', () => {
    it('removes a key from the store', () => {
        CookyCookie.set('matomo', true);
        CookyCookie.delete('matomo');
        expect(CookyCookie.get('matomo')).toBeNull();
    });

    it('is a no-op for an absent key', () => {
        expect(() => CookyCookie.delete('absent')).not.toThrow();
    });
});
