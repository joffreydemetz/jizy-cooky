import { describe, it, expect } from 'vitest';
import Plugin from '../lib/js/Plugin.js';
import CorePhpSessionPlugin from '../lib/js/plugins/core.phpsession.js';

describe('Plugin base class', () => {
    it('returns null translations and data by default', () => {
        const p = new Plugin();
        expect(p.getTranslations()).toBeNull();
        expect(p.getData()).toBeNull();
    });
});

describe('CorePhpSessionPlugin', () => {
    it('returns the PHPSESSID cookie descriptor', () => {
        const data = new CorePhpSessionPlugin().getData();
        expect(data).toEqual({
            cookies: [
                expect.objectContaining({
                    name: 'PHPSESSID',
                    duration: 'browser',
                    secure: true,
                    details: 'phpsessid.details'
                })
            ]
        });
    });

    it('ships translations for the four supported locales', () => {
        const t = new CorePhpSessionPlugin().getTranslations();
        expect(Object.keys(t).sort()).toEqual(['en', 'es', 'fr', 'it']);
        for (const code of Object.keys(t)) {
            expect(t[code]['phpsessid.details']).toMatch(/.+/);
        }
    });
});
