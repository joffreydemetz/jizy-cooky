import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Utils from '../lib/js/Utils.js';

describe('Utils.extend', () => {
    it('returns a new object when no sources provided', () => {
        expect(Utils.extend()).toEqual({});
    });

    it('shallow-copies primitives onto the target', () => {
        const result = Utils.extend({}, { a: 1, b: 'two' });
        expect(result).toEqual({ a: 1, b: 'two' });
    });

    it('deep-merges nested objects', () => {
        const result = Utils.extend(
            { a: { x: 1, y: 2 } },
            { a: { y: 20, z: 30 } }
        );
        expect(result).toEqual({ a: { x: 1, y: 20, z: 30 } });
    });

    it('replaces arrays rather than merging them', () => {
        const result = Utils.extend({ list: [1, 2, 3] }, { list: [9] });
        expect(result.list).toEqual([9]);
    });

    it('lets later sources win on key collisions', () => {
        const result = Utils.extend({}, { a: 1 }, { a: 2 }, { a: 3 });
        expect(result.a).toBe(3);
    });

    it('ignores null/undefined sources without throwing', () => {
        expect(() => Utils.extend({ a: 1 }, null, undefined)).not.toThrow();
        expect(Utils.extend({ a: 1 }, null, undefined)).toEqual({ a: 1 });
    });
});

describe('Utils.arrayUnique', () => {
    it('removes duplicate primitives', () => {
        expect(Utils.arrayUnique([1, 1, 2, 3, 3])).toEqual([1, 2, 3]);
    });

    it('returns an empty array when given one', () => {
        expect(Utils.arrayUnique([])).toEqual([]);
    });

    it('preserves first-seen order', () => {
        expect(Utils.arrayUnique(['b', 'a', 'b', 'c', 'a'])).toEqual(['b', 'a', 'c']);
    });
});

describe('Utils.arrayMerge', () => {
    it('flattens multiple arrays into one', () => {
        expect(Utils.arrayMerge([1, 2], [3], [4, 5])).toEqual([1, 2, 3, 4, 5]);
    });

    it('returns an empty array when called with none', () => {
        expect(Utils.arrayMerge()).toEqual([]);
    });
});

describe('Utils.hasAllClasses', () => {
    it('returns true when the element has every class', () => {
        const el = document.createElement('div');
        el.classList.add('a', 'b', 'c');
        expect(Utils.hasAllClasses(el, ['a', 'b'])).toBe(true);
    });

    it('returns false when any class is missing', () => {
        const el = document.createElement('div');
        el.classList.add('a');
        expect(Utils.hasAllClasses(el, ['a', 'missing'])).toBe(false);
    });

    it('returns true for an empty class list', () => {
        const el = document.createElement('div');
        expect(Utils.hasAllClasses(el, [])).toBe(true);
    });
});

describe('Utils.thrown / debug logging', () => {
    let warnSpy;
    let errorSpy;
    let logSpy;
    let dirSpy;

    beforeEach(() => {
        warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
        dirSpy = vi.spyOn(console, 'dir').mockImplementation(() => {});
    });

    afterEach(() => {
        warnSpy.mockRestore();
        errorSpy.mockRestore();
        logSpy.mockRestore();
        dirSpy.mockRestore();
        window.Cooky.debugMode = false;
    });

    it('thrown() is a no-op when debug mode is off', () => {
        window.Cooky.debugMode = false;
        Utils.thrown('boom');
        expect(warnSpy).not.toHaveBeenCalled();
    });

    it('thrown() warns on string errors when debug mode is on', () => {
        window.Cooky.debugMode = true;
        Utils.thrown('boom');
        expect(warnSpy).toHaveBeenCalledWith('Cooky ERROR:', 'boom');
    });

    it('thrown() forwards Error instances to console.error', () => {
        window.Cooky.debugMode = true;
        Utils.thrown(new Error('kaboom'));
        expect(errorSpy).toHaveBeenCalledWith('Cooky ERROR:', 'kaboom');
    });

    it('debug() is silent when debug mode is off', () => {
        window.Cooky.debugMode = false;
        Utils.debug('hello');
        expect(logSpy).not.toHaveBeenCalled();
    });

    it('debug() logs strings when debug mode is on', () => {
        window.Cooky.debugMode = true;
        Utils.debug('hello');
        expect(logSpy).toHaveBeenCalledWith('Cooky: hello');
    });

    it('warn() promotes the message to console.warn', () => {
        window.Cooky.debugMode = true;
        Utils.warn('careful');
        expect(warnSpy).toHaveBeenCalledWith('Cooky WARN: careful');
    });

    it('error() promotes the message to console.error', () => {
        window.Cooky.debugMode = true;
        Utils.error('bad');
        expect(errorSpy).toHaveBeenCalledWith('Cooky ERROR: bad');
    });
});
