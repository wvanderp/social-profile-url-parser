import {
    describe, it, expect, vi,
} from 'vitest';
import { parse, regexes, type RegexDefinition } from '../../src/index';

vi.mock('../../data/properties.compiled.json', () => ({ default: [] }));

describe('parse', () => {
    it('uses the full match as identifier when a regex has no capture groups', () => {
        const customRegex: RegexDefinition = {
            propertyId: 'custom',
            name: 'Custom',
            regex: /https:\/\/example\.com\/full-match/gi,
        };

        regexes.push(customRegex);

        try {
            expect(parse('See https://example.com/full-match for details')).toEqual([{
                propertyId: 'custom',
                name: 'Custom',
                url: 'https://example.com/full-match',
                identifier: 'https://example.com/full-match',
                groups: [],
            }]);
        } finally {
            regexes.pop();
        }
    });
});
