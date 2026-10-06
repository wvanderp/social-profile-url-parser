import {
    describe, expect, it, vi,
} from 'vitest';
import { formatUrl, parse } from '../../src/index';

vi.mock('../../data/properties.compiled.json', () => ({
    default: [
        {
            property: 'withFormatter',
            propertyLabel: 'With formatter',
            urlPatterns: [{ pattern: String.raw`https://example\.com/user/([a-z$]+)` }],
            urlFormatter: 'https://example.org/$1/profile/$1',
        },
        {
            property: 'withoutFormatter',
            propertyLabel: 'Without formatter',
            urlPatterns: [{ pattern: String.raw`https://example\.net/([a-z]+)` }],
        },
    ],
}));

describe('formatUrl', () => {
    it('replaces every $1 in the formatter with the identifier', () => {
        expect(formatUrl('withFormatter', 'jack')).toBe('https://example.org/jack/profile/jack');
    });

    it('inserts identifiers containing dollar signs literally', () => {
        expect(formatUrl('withFormatter', '$&$1')).toBe('https://example.org/$&$1/profile/$&$1');
    });

    it('returns undefined for properties without a formatter', () => {
        expect(formatUrl('withoutFormatter', 'jack')).toBeUndefined();
    });

    it('returns undefined for unknown properties', () => {
        expect(formatUrl('unknown', 'jack')).toBeUndefined();
    });
});

describe('parse formatter fields', () => {
    it('adds urlFormatter and formattedUrl only when a formatter exists', () => {
        expect(parse('https://example.com/user/jack https://example.net/jill')).toEqual([
            {
                propertyId: 'withFormatter',
                name: 'With formatter',
                url: 'https://example.com/user/jack',
                identifier: 'jack',
                groups: ['jack'],
                urlFormatter: 'https://example.org/$1/profile/$1',
                formattedUrl: 'https://example.org/jack/profile/jack',
            },
            {
                propertyId: 'withoutFormatter',
                name: 'Without formatter',
                url: 'https://example.net/jill',
                identifier: 'jill',
                groups: ['jill'],
            },
        ]);
    });
});
