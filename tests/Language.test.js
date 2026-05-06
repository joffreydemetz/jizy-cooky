import { describe, it, expect } from 'vitest';
import Language from '../lib/js/Language.js';
import En from '../lib/js/languages/en.js';
import Fr from '../lib/js/languages/fr.js';

describe('Language base class', () => {
    it('stores code, name and locale', () => {
        const lang = new Language('xx', 'Xx', 'xx_XX');
        expect(lang.getCode()).toBe('xx');
        expect(lang.getName()).toBe('Xx');
        expect(lang.getLocale()).toBe('xx_XX');
    });

    it('seeds default English fallback translations', () => {
        const lang = new Language('xx', 'Xx', 'xx_XX');
        expect(lang.get('alert.acceptall')).toBe('Accept all');
        expect(lang.get('cookie.duration.na')).toBe('N/A');
    });

    it('returns the key itself when a translation is missing', () => {
        const lang = new Language('xx', 'Xx', 'xx_XX');
        expect(lang.get('not.a.real.key')).toBe('not.a.real.key');
    });

    it('setTranslations() merges into existing keys without dropping defaults', () => {
        const lang = new Language('xx', 'Xx', 'xx_XX');
        lang.setTranslations({ 'alert.acceptall': 'OK', 'custom.key': 'hi' });
        expect(lang.get('alert.acceptall')).toBe('OK');
        expect(lang.get('custom.key')).toBe('hi');
        expect(lang.get('alert.refuseall')).toBe('Refuse all'); // default kept
    });

    it('setTranslations() with no argument is a no-op', () => {
        const lang = new Language('xx', 'Xx', 'xx_XX');
        const before = lang.get('alert.acceptall');
        lang.setTranslations();
        expect(lang.get('alert.acceptall')).toBe(before);
    });

    it('clear() empties the translation map', () => {
        const lang = new Language('xx', 'Xx', 'xx_XX');
        lang.clear();
        expect(lang.getTranslations()).toEqual({});
        expect(lang.get('alert.acceptall')).toBe('alert.acceptall');
    });

    it('render() emits a language switcher button', () => {
        const lang = new Language('en', 'English', 'en_GB');
        expect(lang.render()).toContain('data-cooky-language="en"');
        expect(lang.render()).toContain('aria-label="English"');
    });
});

describe('Built-in language packs', () => {
    it('English uses the en/en_GB locale', () => {
        const en = new En();
        expect(en.getCode()).toBe('en');
        expect(en.getLocale()).toBe('en_GB');
        expect(en.get('alert.acceptall')).toBe('Accept all');
    });

    it('French uses the fr/fr_FR locale', () => {
        const fr = new Fr();
        expect(fr.getCode()).toBe('fr');
        expect(fr.getLocale()).toBe('fr_FR');
        expect(fr.get('alert.personalize')).toBe('Personnaliser');
    });
});
