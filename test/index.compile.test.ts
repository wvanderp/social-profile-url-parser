import {
    afterEach, describe, expect, it, vi,
} from 'vitest';

afterEach(() => {
    vi.resetModules();
    vi.doUnmock('../data/properties.json');
});

describe('regex compilation', () => {
    it('skips invalid regex patterns and uses Wikidata fallbacks correctly', async () => {
        vi.doMock('../data/properties.json', () => ({
            default: [
                {
                    property: 'valid',
                    urlPatterns: [String.raw`https://example\.com/([a-z]+)`],
                },
                {
                    property: 'invalid',
                    propertyLabel: 'Invalid',
                    urlPatterns: ['('],
                },
                {
                    property: 'noPatterns',
                },
            ],
        }));

        const { parser: mockedParser, regexes: mockedRegexes } = await import('../src/index');

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
            },
        ]);
    });
});
