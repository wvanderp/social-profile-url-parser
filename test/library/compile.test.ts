import { describe, expect, it } from 'vitest';
import compileDefinitions from '../../src/compile';
import { createParser } from '../../src/parse';

describe('compileDefinitions', () => {
    it('returns no definitions for no properties', () => {
        expect(compileDefinitions([])).toEqual([]);
    });

    it('compiles each valid pattern with label, replacement and formatter fallbacks', () => {
        expect(compileDefinitions([
            {
                property: 'P1',
                propertyLabel: 'One',
                urlFormatter: 'https://one.example/$1',
                urlPatterns: [
                    { pattern: String.raw`one\.example/([a-z]+)`, replacement: String.raw`\1!` },
                    { pattern: String.raw`one\.example/u/([a-z]+)` },
                ],
            },
            {
                property: 'P2',
                urlPatterns: [{ pattern: String.raw`two\.example/([a-z]+)` }],
            },
        ])).toEqual([
            {
                propertyId: 'P1',
                name: 'One',
                regex: /one\.example\/([a-z]+)/gi,
                replacement: String.raw`\1!`,
                urlFormatter: 'https://one.example/$1',
            },
            {
                propertyId: 'P1',
                name: 'One',
                regex: /one\.example\/u\/([a-z]+)/gi,
                replacement: String.raw`\1`,
                urlFormatter: 'https://one.example/$1',
            },
            {
                propertyId: 'P2',
                name: 'P2',
                regex: /two\.example\/([a-z]+)/gi,
                replacement: String.raw`\1`,
            },
        ]);
    });

    it('skips empty, missing and invalid patterns', () => {
        expect(compileDefinitions([
            {
                property: 'P1',
                urlPatterns: [
                    {} as { pattern: string },
                    { pattern: '' },
                    { pattern: '(' },
                    { pattern: 'ok' },
                ],
            },
            { property: 'P2' },
        ])).toEqual([
            {
                propertyId: 'P1',
                name: 'P1',
                regex: /ok/gi,
                replacement: String.raw`\1`,
            },
        ]);
    });
});

describe('createParser', () => {
    it('parses text using only the given definitions', () => {
        const parse = createParser(compileDefinitions([{
            property: 'P1',
            propertyLabel: 'One',
            urlFormatter: 'https://one.example/$1',
            urlPatterns: [{ pattern: String.raw`https://one\.example/([a-z]+)` }],
        }]));

        expect(parse('https://one.example/jack https://one.example/JACK https://twitter.com/jack')).toEqual([
            {
                propertyId: 'P1',
                name: 'One',
                url: 'https://one.example/jack',
                identifier: 'jack',
                groups: ['jack'],
                urlFormatter: 'https://one.example/$1',
                formattedUrl: 'https://one.example/jack',
            },
        ]);
    });

    it('skips matches whose identifier is empty', () => {
        const parse = createParser(compileDefinitions([{
            property: 'P1',
            urlPatterns: [{ pattern: String.raw`one\.example(?:/([a-z]+))?` }],
        }]));

        expect(parse('one.example one.example/jack')).toEqual([
            {
                propertyId: 'P1',
                name: 'P1',
                url: 'one.example/jack',
                identifier: 'jack',
                groups: ['jack'],
            },
        ]);
    });

    it('returns no results without definitions', () => {
        expect(createParser([])('https://twitter.com/jack')).toEqual([]);
    });
});
