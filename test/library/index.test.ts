import {
    describe, it, expect, vi,
} from 'vitest';
import { parser, regexes, type RegexDefinition } from '../../src/index';

vi.mock('../../data/properties.json', () => ({ default: [] }));

describe('parser', () => {
    it('uses the full match as username when a regex has no capture groups', () => {
        const customRegex: RegexDefinition = {
            type: 'custom',
            name: 'Custom',
            regex: /https:\/\/example\.com\/full-match/gi,
        };

        regexes.push(customRegex);

        try {
            expect(parser('See https://example.com/full-match for details')).toEqual([{
                type: 'custom',
                name: 'Custom',
                url: 'https://example.com/full-match',
                username: 'https://example.com/full-match',
                groups: [],
            }]);
        } finally {
            regexes.pop();
        }
    });
});
