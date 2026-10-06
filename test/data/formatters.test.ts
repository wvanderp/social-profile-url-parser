import { describe, expect, it } from 'vitest';
import rawProperties from '../../data/properties.raw.json';
import compileDefinitions from '../../src/compile';
import { applyUrlFormatter } from '../../src/formatter';
import { createParser } from '../../src/parse';
import type { RawProperty } from '../../src/types';

const raw = rawProperties as RawProperty[];
const parse = createParser(compileDefinitions(raw));

function formatUrl(propertyId: string, identifier: string): string | undefined {
    const urlFormatter = raw.find(({ property }) => property === propertyId)?.urlFormatter;
    return urlFormatter ? applyUrlFormatter(urlFormatter, identifier) : undefined;
}

describe('Wikidata URL formatters', () => {
    it('uses the collected preferred formatter for X', () => {
        expect(formatUrl('P2002', 'jack')).toBe('https://x.com/jack');
        expect(parse('https://twitter.com/jack')).toEqual([{
            propertyId: 'P2002',
            name: 'X (Twitter) username',
            url: 'https://twitter.com/jack',
            identifier: 'jack',
            groups: ['jack'],
            urlFormatter: 'https://x.com/$1',
            formattedUrl: 'https://x.com/jack',
        }]);
    });

    it('formats GitHub identifiers', () => {
        expect(formatUrl('P2037', 'octocat')).toBe('https://github.com/octocat');
    });
});

describe('Wikidata URL match replacements', () => {
    it('applies the collected uppercase replacement for WWF ecoregion codes', () => {
        expect(parse('https://www.worldwildlife.org/ecoregions/aa1234')).toEqual([{
            propertyId: 'P1294',
            name: 'WWF ecoregion code',
            url: 'https://www.worldwildlife.org/ecoregions/aa1234',
            identifier: 'AA1234',
            groups: ['aa1234'],
            urlFormatter: 'https://www.worldwildlife.org/ecoregions/$1',
            formattedUrl: 'https://www.worldwildlife.org/ecoregions/AA1234',
        }]);
    });

    it('applies the collected uppercase replacement for PBS drug codes', () => {
        expect(parse('https://www.pbs.gov.au/medicine/item/123a')).toEqual([{
            propertyId: 'P7048',
            name: 'PBS Drug Code',
            url: 'https://www.pbs.gov.au/medicine/item/123a',
            identifier: '123A',
            groups: ['123a'],
            urlFormatter: 'https://www.pbs.gov.au/medicine/item/$1',
            formattedUrl: 'https://www.pbs.gov.au/medicine/item/123A',
        }]);
    });

    it('unescapes the slash in the collected Crossref DOI replacement', () => {
        expect(parse('https://chooser.crossref.org/?doi=10.1038%2Fs41586-020-2649-2')).toEqual([{
            propertyId: 'P356',
            name: 'DOI',
            url: 'https://chooser.crossref.org/?doi=10.1038%2Fs41586-020-2649-2',
            identifier: '10.1038/s41586-020-2649-2',
            groups: ['10.1038', 's41586-020-2649-2'],
            urlFormatter: 'https://doi.org/$1',
            formattedUrl: 'https://doi.org/10.1038/s41586-020-2649-2',
        }]);
    });
});
