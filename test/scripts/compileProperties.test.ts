import { describe, expect, it } from 'vitest';
import compileProperties, { findDuplicatePatterns } from '../../scripts/compileProperties';

describe('compileProperties', () => {
    it('returns an empty list for no properties', () => {
        expect(compileProperties([])).toEqual([]);
    });

    it('keeps only the fields used at runtime', () => {
        expect(compileProperties([{
            property: 'P2002',
            urlPatterns: [{ pattern: String.raw`https?:\/\/twitter\.com\/(\w+)` }],
            propertyLabel: 'X (Twitter) username',
            propertyDescription: 'this item\'s username on X',
            propertyAltLabel: 'Twitter username, X username',
            urlFormatter: 'https://x.com/$1',
        }])).toStrictEqual([{
            property: 'P2002',
            propertyLabel: 'X (Twitter) username',
            urlFormatter: 'https://x.com/$1',
            urlPatterns: [{ pattern: String.raw`https?:\/\/twitter\.com\/(\w+)` }],
        }]);
    });

    it('omits missing optional fields instead of writing undefined', () => {
        expect(compileProperties([{
            property: 'P1',
            urlPatterns: [{ pattern: 'a(b)', replacement: undefined }],
            propertyLabel: undefined,
            urlFormatter: undefined,
        }])).toStrictEqual([{
            property: 'P1',
            urlPatterns: [{ pattern: 'a(b)' }],
        }]);
    });

    it('removes duplicate patterns and keeps the first occurrence in order', () => {
        expect(compileProperties([{
            property: 'P8424',
            propertyLabel: 'OpenHistoricalMap relation ID',
            urlPatterns: [
                { pattern: 'a(b)' },
                { pattern: 'c(d)' },
                { pattern: 'a(b)' },
                { pattern: 'a(b)' },
                { pattern: 'c(d)', replacement: String.raw`\1@fosstodon.org` },
                { pattern: 'c(d)', replacement: String.raw`\1@fosstodon.org` },
            ],
        }])).toStrictEqual([{
            property: 'P8424',
            propertyLabel: 'OpenHistoricalMap relation ID',
            urlPatterns: [
                { pattern: 'a(b)' },
                { pattern: 'c(d)' },
                { pattern: 'c(d)', replacement: String.raw`\1@fosstodon.org` },
            ],
        }]);
    });

    it(String.raw`treats a missing replacement and an explicit \1 replacement as the same pattern`, () => {
        expect(compileProperties([{
            property: 'P1',
            urlPatterns: [
                { pattern: 'a(b)' },
                { pattern: 'a(b)', replacement: String.raw`\1` },
            ],
        }])).toStrictEqual([{
            property: 'P1',
            urlPatterns: [{ pattern: 'a(b)' }],
        }]);
    });

    it('keeps the same pattern in different properties', () => {
        expect(compileProperties([
            { property: 'P1', urlPatterns: [{ pattern: 'a(b)' }] },
            { property: 'P2', urlPatterns: [{ pattern: 'a(b)' }] },
        ])).toStrictEqual([
            { property: 'P1', urlPatterns: [{ pattern: 'a(b)' }] },
            { property: 'P2', urlPatterns: [{ pattern: 'a(b)' }] },
        ]);
    });

    it('does not modify its input', () => {
        const raw = [{
            property: 'P1',
            propertyDescription: 'description',
            urlPatterns: [{ pattern: 'a(b)' }, { pattern: 'a(b)' }],
        }];
        compileProperties(raw);
        expect(raw).toStrictEqual([{
            property: 'P1',
            propertyDescription: 'description',
            urlPatterns: [{ pattern: 'a(b)' }, { pattern: 'a(b)' }],
        }]);
    });
});

describe('findDuplicatePatterns', () => {
    it('returns an empty list when no property repeats a pattern', () => {
        expect(findDuplicatePatterns([
            { property: 'P1', urlPatterns: [{ pattern: 'a(b)' }, { pattern: 'a(b)', replacement: String.raw`\1-x` }] },
            { property: 'P2', urlPatterns: [{ pattern: 'a(b)' }] },
            { property: 'P3' },
        ])).toEqual([]);
    });

    it('lists every repeated pattern with how often it occurs', () => {
        expect(findDuplicatePatterns([
            {
                property: 'P8424',
                urlPatterns: [{ pattern: 'a(b)' }, { pattern: 'a(b)' }, { pattern: 'a(b)', replacement: String.raw`\1` }],
            },
            {
                property: 'P4033',
                urlPatterns: [
                    { pattern: 'c(d)', replacement: String.raw`\1@fosstodon.org` },
                    { pattern: 'c(d)', replacement: String.raw`\1@fosstodon.org` },
                ],
            },
        ])).toEqual([
            {
                property: 'P8424', pattern: 'a(b)', replacement: String.raw`\1`, count: 3,
            },
            {
                property: 'P4033', pattern: 'c(d)', replacement: String.raw`\1@fosstodon.org`, count: 2,
            },
        ]);
    });
});
