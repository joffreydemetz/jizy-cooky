import { describe, it, expect, beforeEach, vi } from 'vitest';

let Service;
let ServiceCookie;
let CookyCookie;
let COOKY_NAME;

beforeEach(async () => {
    vi.resetModules();
    Service = (await import('../lib/js/Service.js')).default;
    ServiceCookie = (await import('../lib/js/ServiceCookie.js')).default;
    CookyCookie = (await import('../lib/js/CookyCookie.js')).default;
    COOKY_NAME = (await import('../lib/js/Constants.js')).COOKY_NAME;
});

describe('Service constructor', () => {
    it('initialises with documented defaults', () => {
        const s = new Service('matomo', 'Matomo');
        expect(s.id).toBe('matomo');
        expect(s.name).toBe('Matomo');
        expect(s.type).toBe('other');
        expect(s.cookies).toEqual([]);
        expect(s.classes).toEqual([]);
        expect(s.mandatory).toEqual([]);
        expect(s.required).toBe(false);
        expect(s.fallback).toBe(true);
        expect(s.js).toBeNull();
        expect(s.allowed).toBe(false);
        expect(s.denied).toBe(false);
        expect(s.waiting).toBe(false);
        expect(s.force).toBe(false);
        expect(s.loaded).toBe(false);
        expect(s.selector).toBe('');
        expect(s.order).toBe(0);
        expect(s.category).toBeNull();
    });
});

describe('Service.getType', () => {
    it('falls back to "other" when type is empty', () => {
        const s = new Service('x', 'X');
        s.type = '';
        expect(s.getType()).toBe('other');
    });
});

describe('Service state setters', () => {
    let s;
    beforeEach(() => { s = new Service('matomo', 'Matomo'); });

    it('setAllowed flips only the allowed flag', () => {
        s.setAllowed();
        expect(s.allowed).toBe(true);
        expect(s.denied).toBe(false);
        expect(s.waiting).toBe(false);
        expect(s.force).toBe(false);
    });

    it('setDenied flips only the denied flag', () => {
        s.setDenied();
        expect(s.denied).toBe(true);
        expect(s.allowed).toBe(false);
        expect(s.waiting).toBe(false);
        expect(s.force).toBe(false);
    });

    it('setWaiting flips only the waiting flag', () => {
        s.setWaiting();
        expect(s.waiting).toBe(true);
        expect(s.allowed).toBe(false);
        expect(s.denied).toBe(false);
        expect(s.force).toBe(false);
    });

    it('setForce sets allowed AND force', () => {
        s.setForce();
        expect(s.force).toBe(true);
        expect(s.allowed).toBe(true);
        expect(s.denied).toBe(false);
        expect(s.waiting).toBe(false);
    });

    it('persists to CookyCookie when called with update=true', () => {
        s.setAllowed(true);
        expect(CookyCookie.get('matomo')).toBe(true);
        s.setDenied(true);
        expect(CookyCookie.get('matomo')).toBe(false);
        s.setWaiting(true);
        expect(CookyCookie.get('matomo')).toBe('wait');
        s.setForce(true);
        expect(CookyCookie.get('matomo')).toBe('force');
    });

    it('does not persist to CookyCookie when update is omitted', () => {
        s.setAllowed();
        expect(CookyCookie.get('matomo')).toBeNull();
    });
});

describe('Service.changeStatus', () => {
    it('approves and runs js() when status is true', () => {
        const s = new Service('matomo', 'Matomo');
        const js = vi.fn();
        s.js = js;
        s.changeStatus(true);
        expect(s.allowed).toBe(true);
        expect(s.loaded).toBe(true);
        expect(js).toHaveBeenCalledOnce();
    });

    it('does nothing when already approved', () => {
        const s = new Service('matomo', 'Matomo');
        s.setAllowed();
        const js = vi.fn();
        s.js = js;
        s.changeStatus(true);
        expect(js).not.toHaveBeenCalled();
    });

    it('denies and resets loaded when status is false', () => {
        const s = new Service('matomo', 'Matomo');
        s.loaded = true;
        s.changeStatus(false);
        expect(s.denied).toBe(true);
        expect(s.loaded).toBe(false);
    });
});

describe('Service.setCookies', () => {
    it('adds new ServiceCookie instances', () => {
        const s = new Service('matomo', 'Matomo');
        s.setCookies([{ name: 'a', duration: 60 }, { name: 'b' }]);
        expect(s.cookies).toHaveLength(2);
        expect(s.cookies[0]).toBeInstanceOf(ServiceCookie);
        expect(s.cookies[0].getName()).toBe('a');
    });

    it('updates fields on a cookie that already exists by name', () => {
        const s = new Service('matomo', 'Matomo');
        s.setCookies([{ name: 'a', details: 'first' }]);
        s.setCookies([{ name: 'a', details: 'second', duration: 99 }]);
        expect(s.cookies).toHaveLength(1);
        expect(s.cookies[0].details).toBe('second');
        expect(s.cookies[0].duration).toBe(99);
    });

    it('reset=true clears existing cookies first', () => {
        const s = new Service('matomo', 'Matomo');
        s.setCookies([{ name: 'a' }]);
        s.setCookies([{ name: 'b' }], true);
        expect(s.cookies).toHaveLength(1);
        expect(s.cookies[0].getName()).toBe('b');
    });
});

describe('Service.setClasses', () => {
    it('builds a CSS selector from classnames arrays', () => {
        const s = new Service('matomo', 'Matomo');
        s.setClasses([{ classnames: ['jizy-player'], type: 'box' }]);
        expect(s.selector).toBe('.jizy-player');
    });

    it('joins multiple selectors with a comma', () => {
        const s = new Service('matomo', 'Matomo');
        s.setClasses([
            { classnames: ['a'], type: 'box' },
            { classnames: ['b', 'c'], type: 'button' }
        ]);
        expect(s.selector).toBe('.a, .b.c');
    });

    it('deduplicates identical selectors', () => {
        const s = new Service('matomo', 'Matomo');
        s.setClasses([
            { classnames: ['a'], type: 'box' },
            { classnames: ['a'], type: 'box' }
        ]);
        expect(s.selector).toBe('.a');
    });

    it('reset=true wipes prior class entries', () => {
        const s = new Service('matomo', 'Matomo');
        s.setClasses([{ classnames: ['a'], type: 'box' }]);
        s.setClasses([{ classnames: ['b'], type: 'box' }], true);
        expect(s.selector).toBe('.b');
    });
});

describe('Service.setData', () => {
    it('routes "cookies" through setCookies', () => {
        const s = new Service('matomo', 'Matomo');
        s.setData({ cookies: [{ name: 'x' }] });
        expect(s.cookies).toHaveLength(1);
    });

    it('routes "classes" through setClasses', () => {
        const s = new Service('matomo', 'Matomo');
        s.setData({ classes: [{ classnames: ['a'], type: 'box' }] });
        expect(s.selector).toBe('.a');
    });

    it('merges "mandatory" arrays', () => {
        const s = new Service('matomo', 'Matomo');
        s.setData({ mandatory: ['url'] });
        s.setData({ mandatory: ['siteId'] });
        expect(s.mandatory).toEqual(['url', 'siteId']);
    });

    it('sets whitelisted scalar fields', () => {
        const s = new Service('matomo', 'Matomo');
        const fn = () => {};
        s.setData({ name: 'M2', uri: 'https://x', fallback: false, js: fn, required: true });
        expect(s.name).toBe('M2');
        expect(s.uri).toBe('https://x');
        expect(s.fallback).toBe(false);
        expect(s.js).toBe(fn);
        expect(s.required).toBe(true);
    });

    it('warns about non-whitelisted keys', () => {
        const s = new Service('matomo', 'Matomo');
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
        s.setData({ icon: 'oops' });
        expect(warn).toHaveBeenCalled();
        warn.mockRestore();
    });
});

describe('Service.exec (driven by CookyCookie state)', () => {
    it('moves to "force" when the cookie says force', () => {
        const s = new Service('matomo', 'Matomo');
        CookyCookie.set('matomo', 'force');
        s.exec();
        expect(s.force).toBe(true);
        expect(s.allowed).toBe(true);
    });

    it('runs js() when previously allowed', () => {
        const s = new Service('matomo', 'Matomo');
        const js = vi.fn();
        s.js = js;
        CookyCookie.set('matomo', true);
        s.exec();
        expect(s.allowed).toBe(true);
        expect(js).toHaveBeenCalled();
    });

    it('runs fallback when previously denied', () => {
        const s = new Service('matomo', 'Matomo');
        const fallback = vi.fn();
        s.fallback = fallback;
        CookyCookie.set('matomo', false);
        s.exec();
        expect(s.denied).toBe(true);
        expect(fallback).toHaveBeenCalled();
    });

    it('treats no prior decision as waiting and runs fallback', () => {
        const s = new Service('matomo', 'Matomo');
        const fallback = vi.fn();
        s.fallback = fallback;
        s.exec();
        expect(s.waiting).toBe(true);
        expect(fallback).toHaveBeenCalled();
    });

    it('forces required services even when no decision was stored', () => {
        const s = new Service('core', 'Core');
        s.required = true;
        s.exec();
        expect(s.force).toBe(true);
        expect(s.allowed).toBe(true);
    });
});

describe('Service.purgeCookies', () => {
    it('does nothing when there are no cookies to purge', () => {
        const s = new Service('matomo', 'Matomo');
        const before = document.cookie;
        s.purgeCookies();
        expect(document.cookie).toBe(before);
    });

    it('writes a Max-Age=0 entry per registered cookie', () => {
        const s = new Service('matomo', 'Matomo');
        s.setCookies([{ name: '_pk_id' }]);
        document.cookie = '_pk_id=value; path=/';
        s.purgeCookies();
        // jsdom does not set Max-Age, but the cookie should be removed from document.cookie.
        expect(document.cookie).not.toContain('_pk_id=value');
    });

    it('refuses to purge the consent cookie itself', () => {
        const s = new Service('matomo', 'Matomo');
        s.setCookies([{ name: COOKY_NAME }]);
        document.cookie = `${COOKY_NAME}=keep-me; path=/`;
        s.purgeCookies();
        expect(document.cookie).toContain(`${COOKY_NAME}=keep-me`);
    });
});

describe('Service.execFallback', () => {
    it('does nothing when fallback is explicitly disabled', () => {
        document.body.innerHTML = '<div class="cooky-x">existing</div>';
        const s = new Service('matomo', 'Matomo');
        s.setClasses([{ classnames: ['cooky-x'], type: 'box' }]);
        s.fallback = false;
        s.execFallback();
        expect(document.querySelector('.cooky-x').innerHTML).toBe('existing');
    });

    it('calls a function fallback if provided', () => {
        const s = new Service('matomo', 'Matomo');
        const fb = vi.fn();
        s.fallback = fb;
        s.execFallback();
        expect(fb).toHaveBeenCalled();
    });

    it('replaces matched DOM with the box fallback markup', () => {
        document.body.innerHTML = '<div class="cooky-box"></div>';
        const s = new Service('matomo', 'Matomo');
        s.setClasses([{ classnames: ['cooky-box'], type: 'box' }]);
        s.execFallback();
        const el = document.querySelector('.cooky-box');
        expect(el.innerHTML).toContain('cooky-allow');
        expect(el.innerHTML).toContain('data-cooky-service="matomo"');
    });

    it('replaces matched DOM with the button fallback markup', () => {
        document.body.innerHTML = '<div class="cooky-btn"></div>';
        const s = new Service('matomo', 'Matomo');
        s.setClasses([{ classnames: ['cooky-btn'], type: 'button' }]);
        s.execFallback();
        const el = document.querySelector('.cooky-btn');
        expect(el.innerHTML).toContain('cooky-icon-exclamation-triangle');
    });
});

describe('Service.execJs', () => {
    it('flags loaded and runs the js callback when no mandatory deps', () => {
        const s = new Service('matomo', 'Matomo');
        const js = vi.fn();
        s.js = js;
        s.execJs();
        expect(js).toHaveBeenCalled();
        expect(s.loaded).toBe(true);
    });

    it('aborts and logs when a mandatory config key is missing', async () => {
        const s = new Service('matomo', 'Matomo');
        s.mandatory = ['matomo.url'];
        const err = vi.spyOn(console, 'error').mockImplementation(() => {});
        const result = s.execJs();
        expect(result).toBe(false);
        expect(err).toHaveBeenCalled();
        err.mockRestore();
    });
});

describe('Service.addScript', () => {
    it('injects a <script> tag with src, id and async=true', () => {
        // Stub head.appendChild to capture the tag without triggering happy-dom's
        // remote-load enforcement (which throws regardless of disableJavaScriptFileLoading).
        const head = document.getElementsByTagName('head')[0];
        let captured = null;
        const orig = head.appendChild.bind(head);
        head.appendChild = (node) => { captured = node; return node; };

        const s = new Service('matomo', 'Matomo');
        const cb = vi.fn();
        s.addScript('https://example.test/x.js', 'mt-script', cb, true);

        head.appendChild = orig;

        expect(captured).not.toBeNull();
        expect(captured.tagName).toBe('SCRIPT');
        expect(captured.id).toBe('mt-script');
        expect(captured.src).toBe('https://example.test/x.js');
        expect(captured.async).toBe(true);
        expect(captured.type).toBe('text/javascript');
    });

    it('skips injection and just calls the callback when execute=false', () => {
        const s = new Service('matomo', 'Matomo');
        const cb = vi.fn();
        s.addScript('https://example.test/skip.js', 'skip', cb, false);
        expect(cb).toHaveBeenCalled();
        expect(document.querySelector('script#skip')).toBeNull();
    });
});

describe('Service.render', () => {
    it('emits Allow / Deny buttons for non-technical services', () => {
        const s = new Service('matomo', 'Matomo');
        const html = s.render();
        expect(html).toContain('cooky-allow');
        expect(html).toContain('cooky-deny');
        expect(html).toContain('data-cooky-service="matomo"');
    });

    it('omits Allow / Deny buttons for technical services', () => {
        const s = new Service('core', 'Core');
        s.type = 'technical';
        const html = s.render();
        expect(html).not.toContain('cooky-allow');
        expect(html).not.toContain('cooky-deny');
    });

    it('mentions "no cookies" copy when none are configured', () => {
        const s = new Service('matomo', 'Matomo');
        expect(s.render()).toContain('cookie.doesnt');
    });

    it('includes per-cookie markup when cookies are present', () => {
        const s = new Service('matomo', 'Matomo');
        s.setCookies([{ name: '_pk_id' }]);
        expect(s.render()).toContain('<strong>_pk_id</strong>');
    });
});

describe('Service.iframe / responsiveHtml / frameHtml', () => {
    it('iframe() returns empty when frameUrl is missing', () => {
        const s = new Service('vid', 'Video');
        const el = document.createElement('div');
        expect(s.iframe(el)).toBe('');
    });

    it('iframe() includes the source url', () => {
        const s = new Service('vid', 'Video');
        const el = document.createElement('div');
        el.dataset.frameUrl = 'https://example.test/embed';
        const html = s.iframe(el);
        expect(html).toContain('src="https://example.test/embed"');
        expect(html).toContain('frameborder="0"');
    });

    it('iframe() opts in to fullscreen and transparency from data attributes', () => {
        const s = new Service('vid', 'Video');
        const el = document.createElement('div');
        el.dataset.frameUrl = 'https://example.test/embed';
        el.dataset.fullscreen = 'true';
        el.dataset.transparency = 'true';
        const html = s.iframe(el);
        expect(html).toContain('allowtransparency');
        expect(html).toContain('allowfullscreen');
    });

    it('responsiveHtml() defaults to 16by9 when size is unset', () => {
        const s = new Service('vid', 'Video');
        const el = document.createElement('div');
        el.dataset.frameUrl = 'https://example.test/embed';
        expect(s.responsiveHtml(el)).toContain('embed-responsive-16by9');
    });

    it('responsiveHtml() honours an explicit 4by3 size', () => {
        const s = new Service('vid', 'Video');
        const el = document.createElement('div');
        el.dataset.frameUrl = 'https://example.test/embed';
        el.dataset.size = '4by3';
        expect(s.responsiveHtml(el)).toContain('embed-responsive-4by3');
    });

    it('frameHtml() returns empty when frameUrl is missing', () => {
        const s = new Service('vid', 'Video');
        const el = document.createElement('div');
        expect(s.frameHtml(el)).toBe('');
    });
});
