import {
    afterEach, describe, expect, it, vi,
} from 'vitest';

afterEach(() => {
    vi.resetModules();
    vi.doUnmock('../../data/properties.compiled.json');
});

describe('empty match scanning', () => {
    it.each(['gi', 'giu'])('advances past empty matches with %s flags', async (flags) => {
        vi.doMock('../../data/properties.compiled.json', () => ({ default: [] }));
        const { parse: mockedParse, regexes: mockedRegexes } = await import('../../src/index');
        mockedRegexes.push({
            propertyId: 'custom',
            name: 'Custom',
            regex: new RegExp(String.raw`https://example\.com/([a-z]+)|`, flags),
        });

        const expected = [{
            propertyId: 'custom',
            name: 'Custom',
            url: 'https://example.com/test',
            identifier: 'test',
            groups: ['test'],
        }];
        expect(mockedParse('😀 https://example.com/test')).toEqual(expected);
        expect(mockedParse('😀 https://example.com/test')).toEqual(expected);
        expect(mockedParse('')).toEqual([]);
        expect(mockedParse('😀')).toEqual([]);
    });
});
