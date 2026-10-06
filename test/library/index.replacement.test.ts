import {
    afterEach, describe, expect, it, vi,
} from 'vitest';

afterEach(() => {
    vi.resetModules();
    vi.doUnmock('../../data/properties.compiled.json');
});

describe('replacement interpretation', () => {
    it('supports literal replacements and multi-digit capture references', async () => {
        const literalPattern = String.raw`https://example\.com/literal`;
        const numberedPattern = String.raw`https://example\.com/(a)(b)(c)(d)(e)(f)(g)(h)(i)(j)`;
        vi.doMock('../../data/properties.compiled.json', () => ({
            default: [{
                property: 'custom',
                urlPatterns: [
                    { pattern: literalPattern, replacement: 'fixed' },
                    { pattern: numberedPattern, replacement: String.raw`\10:\1` },
                ],
            }],
        }));
        const { parse: mockedParse } = await import('../../src/index');
        expect(mockedParse('https://example.com/literal https://example.com/abcdefghij'))
            .toEqual([
                {
                    propertyId: 'custom',
                    name: 'custom',
                    url: 'https://example.com/literal',
                    identifier: 'fixed',
                    groups: [],
                },
                {
                    propertyId: 'custom',
                    name: 'custom',
                    url: 'https://example.com/abcdefghij',
                    identifier: 'j:a',
                    groups: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'],
                },
            ]);
    });

    it('interprets escaped characters and case conversion in replacements', async () => {
        vi.doMock('../../data/properties.compiled.json', () => ({
            default: [{
                property: 'custom',
                urlPatterns: [
                    {
                        pattern: String.raw`https://example\.com/upper/([a-zß]+)`,
                        replacement: String.raw`\Ucode-\1\E`,
                    },
                    {
                        pattern: String.raw`https://example\.com/lower/([a-z]+)`,
                        replacement: String.raw`\L\1\E`,
                    },
                    {
                        pattern: String.raw`https://example\.com/title/([a-z]+)`,
                        replacement: String.raw`\u\L\1\E`,
                    },
                    {
                        pattern: String.raw`https://example\.com/escaped/([a-z]+)`,
                        replacement: String.raw`prefix\/\1\\suffix`,
                    },
                ],
            }],
        }));
        const { parse: mockedParse } = await import('../../src/index');

        expect(mockedParse([
            'https://example.com/upper/straße',
            'https://example.com/lower/MIXED',
            'https://example.com/title/hELLO',
            'https://example.com/escaped/value',
        ].join(' '))).toEqual([
            {
                propertyId: 'custom',
                name: 'custom',
                url: 'https://example.com/upper/straße',
                identifier: 'CODE-STRASSE',
                groups: ['straße'],
            },
            {
                propertyId: 'custom',
                name: 'custom',
                url: 'https://example.com/lower/MIXED',
                identifier: 'mixed',
                groups: ['MIXED'],
            },
            {
                propertyId: 'custom',
                name: 'custom',
                url: 'https://example.com/title/hELLO',
                identifier: 'Hello',
                groups: ['hELLO'],
            },
            {
                propertyId: 'custom',
                name: 'custom',
                url: 'https://example.com/escaped/value',
                identifier: String.raw`prefix/value\suffix`,
                groups: ['value'],
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
        vi.doMock('../../data/properties.compiled.json', () => ({
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
        const { parse: mockedParse, regexes: mockedRegexes } = await import('../../src/index');
        expect(mockedRegexes.map(({ replacement }) => replacement)).toEqual([
            String.raw`\1:\3`, String.raw`prefix:\1:\1`, String.raw`\2:\1`, String.raw`\1`,
        ]);
        expect(mockedParse([
            'https://example.com/zelda.wiki/link',
            'https://example.com/fixed/link',
            'https://example.com/optional/link',
            'https://example.com/default/link/ignored',
        ].join(' '))).toEqual([
            {
                propertyId: 'custom', name: 'Custom', url: 'https://example.com/zelda.wiki/link', identifier: 'zelda:link', groups: ['zelda', 'wiki', 'link'],
            },
            {
                propertyId: 'custom', name: 'Custom', url: 'https://example.com/fixed/link', identifier: 'prefix:link:link', groups: ['link'],
            },
            {
                propertyId: 'custom', name: 'Custom', url: 'https://example.com/optional/link', identifier: ':link', groups: ['link', undefined],
            },
            {
                propertyId: 'custom', name: 'Custom', url: 'https://example.com/default/link/ignored', identifier: 'link', groups: ['link', 'ignored'],
            },
        ]);
    });
});
