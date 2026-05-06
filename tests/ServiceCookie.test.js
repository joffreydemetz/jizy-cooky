import { describe, it, expect } from 'vitest';
import ServiceCookie from '../lib/js/ServiceCookie.js';

describe('ServiceCookie constructor', () => {
    it('accepts a plain string and treats it as the cookie name', () => {
        const c = new ServiceCookie('PHPSESSID');
        expect(c.name).toBe('PHPSESSID');
        expect(c.details).toBe('');
        expect(c.secure).toBe(false);
        expect(c.duration).toBeNull();
    });

    it('accepts a descriptor object', () => {
        const c = new ServiceCookie({
            name: 'mc_a',
            details: 'foo',
            secure: true,
            duration: 3600
        });
        expect(c.name).toBe('mc_a');
        expect(c.details).toBe('foo');
        expect(c.secure).toBe(true);
        expect(c.duration).toBe(3600);
    });

    it('falls back to defaults for missing optional fields', () => {
        const c = new ServiceCookie({ name: 'x' });
        expect(c.details).toBe('');
        expect(c.secure).toBe(false);
        expect(c.duration).toBeNull();
    });
});

describe('ServiceCookie.toString', () => {
    it('renders a deletion-style cookie when no duration is set', () => {
        const c = new ServiceCookie({ name: 'x' });
        expect(c.toString()).toBe('x=;');
    });

    it('includes Max-Age when duration is set', () => {
        const c = new ServiceCookie({ name: 'x', duration: 60 });
        expect(c.toString()).toContain('Max-Age=60;');
    });

    it('appends Secure when secure is true', () => {
        const c = new ServiceCookie({ name: 'x', secure: true });
        expect(c.toString()).toContain('Secure;');
    });
});

describe('ServiceCookie.update', () => {
    it('updates editable fields', () => {
        const c = new ServiceCookie({ name: 'x' });
        c.update('details', 'new details');
        expect(c.details).toBe('new details');
    });

    it('refuses to rename via update()', () => {
        const c = new ServiceCookie({ name: 'x' });
        c.update('name', 'y');
        expect(c.name).toBe('x');
    });
});

describe('ServiceCookie.has', () => {
    it('returns true when the cookie is present in document.cookie', () => {
        document.cookie = 'present=1; path=/';
        const c = new ServiceCookie({ name: 'present' });
        expect(c.has()).toBe(true);
    });

    it('returns false when the cookie is absent', () => {
        const c = new ServiceCookie({ name: 'absent_xyz' });
        expect(c.has()).toBe(false);
    });
});

describe('ServiceCookie.formatDuration', () => {
    const fmt = (duration) => new ServiceCookie({ name: 'x', duration }).formatDuration();

    it('says N/A when no duration is set', () => {
        expect(fmt(null)).toContain('cookie.duration.na');
    });

    it('special-cases the "browser" duration', () => {
        expect(fmt('browser')).toContain('cookie.duration.browser');
    });

    it('renders seconds for sub-minute durations', () => {
        const out = fmt(30);
        expect(out).toContain('30');
        expect(out).toContain('cookie.duration.seconds');
    });

    it('renders minute (singular) and minutes (plural)', () => {
        expect(fmt(60)).toContain('cookie.duration.minute"');
        expect(fmt(60 * 5)).toContain('cookie.duration.minutes');
    });

    it('renders hour (singular) and hours (plural)', () => {
        expect(fmt(60 * 60)).toContain('cookie.duration.hour"');
        expect(fmt(60 * 60 * 3)).toContain('cookie.duration.hours');
    });

    it('renders day (singular) and days (plural)', () => {
        expect(fmt(24 * 60 * 60)).toContain('cookie.duration.day"');
        expect(fmt(24 * 60 * 60 * 7)).toContain('cookie.duration.days');
    });

    it('renders years for very long durations', () => {
        const out = fmt(365 * 24 * 60 * 60);
        expect(out).toContain('cookie.duration.year');
    });
});

describe('ServiceCookie.render', () => {
    it('includes the cookie name in bold', () => {
        const c = new ServiceCookie({ name: 'mc_a' });
        expect(c.render()).toContain('<strong>mc_a</strong>');
    });

    it('shows a lock icon when secure', () => {
        const c = new ServiceCookie({ name: 'x', secure: true });
        expect(c.render()).toContain('cooky-icon-lock');
    });

    it('omits the details block when no details are set', () => {
        const c = new ServiceCookie({ name: 'x' });
        expect(c.render()).not.toContain('c-item-details');
    });

    it('includes the details block when details are set', () => {
        const c = new ServiceCookie({ name: 'x', details: 'mc.details' });
        expect(c.render()).toContain('data-cooky-i18n="mc.details"');
    });
});
