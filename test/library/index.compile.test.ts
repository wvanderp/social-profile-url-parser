import {
    afterEach, describe, expect, it, vi,
} from 'vitest';

afterEach(() => {
    vi.resetModules();
    vi.doUnmock('../../data/properties.compiled.json');
});

describe('regex compilation', () => {
    it('ignores missing and empty patterns instead of compiling empty regexes', async () => {
        vi.doMock('../../data/properties.compiled.json', () => ({
            default: [{
                property: 'custom',
                urlPatterns: [{}, { pattern: '' }, { pattern: String.raw`https://example\.com/([a-z]+)` }],
            }],
        }));
        const { parse: mockedParse, regexes: mockedRegexes } = await import('../../src/index');

        expect(mockedRegexes.map(({ regex }) => regex.source)).toEqual([
            String.raw`https:\/\/example\.com\/([a-z]+)`,
        ]);
        expect(mockedParse('https://example.com/test')).toEqual([{
            propertyId: 'custom',
            name: 'custom',
            url: 'https://example.com/test',
            identifier: 'test',
            groups: ['test'],
        }]);
    });

    it('skips invalid regex patterns and uses Wikidata fallbacks correctly', async () => {
        vi.doMock('../../data/properties.compiled.json', () => ({
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

        const { parse: mockedParse, regexes: mockedRegexes } = await import('../../src/index');

        expect(mockedRegexes).toHaveLength(1);
        expect(mockedRegexes[0].propertyId).toBe('valid');
        expect(mockedRegexes[0].name).toBe('valid');
        expect(mockedRegexes[0].regex.source).toBe(String.raw`https:\/\/example\.com\/([a-z]+)`);
        expect(mockedRegexes[0].regex.flags).toBe('gi');
        expect(mockedParse('Profile: https://example.com/test')).toEqual([
            {
                propertyId: 'valid',
                name: 'valid',
                url: 'https://example.com/test',
                identifier: 'test',
                groups: ['test'],
            },
        ]);
    });
});
