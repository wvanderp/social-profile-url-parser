import { describe, expect, it } from 'vitest';
import { formatUrl, parser } from '../../src/index';

describe('Wikidata URL formatters', () => {
    it('uses the collected preferred formatter for X', () => {
        expect(formatUrl('P2002', 'jack')).toBe('https://x.com/jack');
        expect(parser('https://twitter.com/jack')).toEqual([{
            type: 'P2002',
            name: 'X (Twitter) username',
            url: 'https://twitter.com/jack',
            username: 'jack',
            groups: ['jack'],
            urlFormatter: 'https://x.com/$1',
            formattedUrl: 'https://x.com/jack',
        }]);
    });

    it('formats GitHub identifiers', () => {
        expect(formatUrl('P2037', 'octocat')).toBe('https://github.com/octocat');
    });
});
