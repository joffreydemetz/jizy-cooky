import { describe, it, expect } from 'vitest';
import { COOKY_NAME, COOKY_VERSION, COOKY_CATEGORIES } from '../lib/js/Constants.js';

describe('Constants', () => {
    it('exposes the cookie name', () => {
        expect(COOKY_NAME).toBe('jizy_cooky');
    });

    it('exposes a semver-shaped version string', () => {
        expect(COOKY_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
    });

    it('lists the canonical category ids in display order', () => {
        expect(COOKY_CATEGORIES).toEqual([
            'technical',
            'api',
            'analytic',
            'social',
            'video',
            'ads',
            'comment',
            'support',
            'other'
        ]);
    });

    it('places "technical" first and "other" last', () => {
        expect(COOKY_CATEGORIES[0]).toBe('technical');
        expect(COOKY_CATEGORIES[COOKY_CATEGORIES.length - 1]).toBe('other');
    });
});
