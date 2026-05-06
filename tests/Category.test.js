import { describe, it, expect, beforeEach } from 'vitest';
import Category from '../lib/js/Category.js';

const makeService = (id, type = 'other') => ({
    id,
    type,
    order: 0,
    category: null,
    render: () => `<service id="${id}"></service>`
});

describe('Category constructor', () => {
    it('builds i18n keys from the id', () => {
        const c = new Category('analytic');
        expect(c.id).toBe('analytic');
        expect(c.title).toBe('analytic.title');
        expect(c.details).toBe('analytic.details');
        expect(c.order).toBe(0);
        expect(c.services).toEqual({});
    });
});

describe('Category.addService', () => {
    let category;
    beforeEach(() => { category = new Category('analytic'); });

    it('stores the service under its id', () => {
        const s = makeService('matomo');
        category.addService(s);
        expect(category.services.matomo).toBe(s);
    });

    it('back-references the category on the service', () => {
        const s = makeService('matomo');
        category.addService(s);
        expect(s.category).toBe(category);
    });

    it('does not overwrite a service that already exists', () => {
        const a = makeService('matomo');
        const b = makeService('matomo');
        category.addService(a);
        category.addService(b);
        expect(category.services.matomo).toBe(a);
    });
});

describe('Category.isUsed', () => {
    it('is false until a service is added', () => {
        const c = new Category('analytic');
        expect(c.isUsed()).toBe(false);
        c.addService(makeService('matomo'));
        expect(c.isUsed()).toBe(true);
    });
});

describe('Category.sortServices', () => {
    it('forces "core" to order 0 and ranks the rest from 1', () => {
        const c = new Category('technical');
        c.addService(makeService('a'));
        c.addService(makeService('core'));
        c.addService(makeService('b'));
        c.sortServices();

        expect(c.services.core.order).toBe(0);
        expect(Object.keys(c.services)[0]).toBe('core');
        expect(c.services.a.order).toBeGreaterThan(0);
        expect(c.services.b.order).toBeGreaterThan(0);
    });

    it('does nothing for an empty category', () => {
        const c = new Category('empty');
        expect(() => c.sortServices()).not.toThrow();
        expect(c.services).toEqual({});
    });
});

describe('Category.render', () => {
    it('returns an empty string for an unused category', () => {
        expect(new Category('empty').render()).toBe('');
    });

    it('renders title, details and child services', () => {
        const c = new Category('analytic');
        c.addService(makeService('matomo'));
        const html = c.render();
        expect(html).toContain('data-cooky-i18n="analytic.title"');
        expect(html).toContain('data-cooky-i18n="analytic.details"');
        expect(html).toContain('<service id="matomo">');
    });
});
