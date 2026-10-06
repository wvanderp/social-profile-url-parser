import {
    afterEach, describe, expect, it, vi,
} from 'vitest';

afterEach(() => {
    vi.resetModules();
    vi.doUnmock('../../data/properties.json');
});

describe('regex compilation', () => {
    it('ignores missing and empty patterns instead of compiling empty regexes', async () => {
        vi.doMock('../../data/properties.json', () => ({
            default: [{
                property: 'custom',
                urlPatterns: [{}, { pattern: '' }, { pattern: String.raw`https://example\.com/([a-z]+)` }],
            }],
        }));
        const { parser: mockedParser, regexes: mockedRegexes } = await import('../../src/index');

        expect(mockedRegexes.map(({ regex }) => regex.source)).toEqual([
            String.raw`https:\/\/example\.com\/([a-z]+)`,
        ]);
        expect(mockedParser('https://example.com/test')).toEqual([{
            type: 'custom',
            name: 'custom',
            url: 'https://example.com/test',
            username: 'test',
            groups: ['test'],
        }]);
    });

    it.each(['gi', 'giu'])('advances past empty matches with %s flags', async (flags) => {
        vi.doMock('../../data/properties.json', () => ({ default: [] }));
        const { parser: mockedParser, regexes: mockedRegexes } = await import('../../src/index');
        mockedRegexes.push({
            type: 'custom',
            name: 'Custom',
            regex: new RegExp(String.raw`https://example\.com/([a-z]+)|`, flags),
        });

        const expected = [{
            type: 'custom',
            name: 'Custom',
            url: 'https://example.com/test',
            username: 'test',
            groups: ['test'],
        }];
        expect(mockedParser('😀 https://example.com/test')).toEqual(expected);
        expect(mockedParser('😀 https://example.com/test')).toEqual(expected);
        expect(mockedParser('')).toEqual([]);
        expect(mockedParser('😀')).toEqual([]);
    });

    it('supports literal replacements and multi-digit capture references', async () => {
        const literalPattern = String.raw`https://example\.com/literal`;
        const numberedPattern = String.raw`https://example\.com/(a)(b)(c)(d)(e)(f)(g)(h)(i)(j)`;
        vi.doMock('../../data/properties.json', () => ({
            default: [{
                property: 'custom',
                urlPatterns: [
                    { pattern: literalPattern, replacement: 'fixed' },
                    { pattern: numberedPattern, replacement: String.raw`\10:\1` },
                ],
            }],
        }));
        const { parser: mockedParser } = await import('../../src/index');
        expect(mockedParser('https://example.com/literal https://example.com/abcdefghij'))
            .toEqual([
                {
                    type: 'custom',
                    name: 'custom',
                    url: 'https://example.com/literal',
                    username: 'fixed',
                    groups: [],
                },
                {
                    type: 'custom',
                    name: 'custom',
                    url: 'https://example.com/abcdefghij',
                    username: 'j:a',
                    groups: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'],
                },
            ]);
    });

    it('assembles replacements per pattern and preserves all capture positions', async () => {
        const patterns = [
            String.raw`https://example\.com/([a-z]+)\.(wiki|fandom)/([a-z]+)`,
            String.raw`https://example\.com/fixed/([a-z]+)`,
            String.raw`https://example\.com/optional/([a-z]+)(?:/([a-z]+))?`,
            String.raw`https://example\.com/default/([a-z]+)/([a-z]+)`,
        ];
        vi.doMock('../../data/properties.json', () => ({
            default: [{
                property: 'custom',
                propertyLabel: 'Custom',
                urlPatterns: [
                    { pattern: patterns[0], replacement: String.raw`\1:\3` },
                    { pattern: patterns[1], replacement: String.raw`prefix:\1:\1` },
                    { pattern: patterns[2], replacement: String.raw`\2:\1` },
                    { pattern: patterns[3] },
                ],
            }],
        }));
        const { parser: mockedParser, regexes: mockedRegexes } = await import('../../src/index');
        expect(mockedRegexes.map(({ replacement }) => replacement)).toEqual([
            String.raw`\1:\3`, String.raw`prefix:\1:\1`, String.raw`\2:\1`, String.raw`\1`,
        ]);
        expect(mockedParser([
            'https://example.com/zelda.wiki/link',
            'https://example.com/fixed/link',
            'https://example.com/optional/link',
            'https://example.com/default/link/ignored',
        ].join(' '))).toEqual([
            {
                type: 'custom', name: 'Custom', url: 'https://example.com/zelda.wiki/link', username: 'zelda:link', groups: ['zelda', 'wiki', 'link'],
            },
            {
                type: 'custom', name: 'Custom', url: 'https://example.com/fixed/link', username: 'prefix:link:link', groups: ['link'],
            },
            {
                type: 'custom', name: 'Custom', url: 'https://example.com/optional/link', username: ':link', groups: ['link', undefined],
            },
            {
                type: 'custom', name: 'Custom', url: 'https://example.com/default/link/ignored', username: 'link', groups: ['link', 'ignored'],
            },
        ]);
    });

    it('skips invalid regex patterns and uses Wikidata fallbacks correctly', async () => {
        vi.doMock('../../data/properties.json', () => ({
            default: [
                {
                    property: 'valid',
                    urlPatterns: [{ pattern: String.raw`https://example\.com/([a-z]+)` }],
                },
                {
                    property: 'invalid',
                    propertyLabel: 'Invalid',
                    urlPatterns: [{ pattern: '(' }],
                },
                {
                    property: 'noPatterns',
                },
            ],
        }));

        const { parser: mockedParser, regexes: mockedRegexes } = await import('../../src/index');

        expect(mockedRegexes).toHaveLength(1);
        expect(mockedRegexes[0].type).toBe('valid');
        expect(mockedRegexes[0].name).toBe('valid');
        expect(mockedRegexes[0].regex.source).toBe(String.raw`https:\/\/example\.com\/([a-z]+)`);
        expect(mockedRegexes[0].regex.flags).toBe('gi');
        expect(mockedParser('Profile: https://example.com/test')).toEqual([
            {
                type: 'valid',
                name: 'valid',
                url: 'https://example.com/test',
                username: 'test',
                groups: ['test'],
            },
        ]);
    });
});
