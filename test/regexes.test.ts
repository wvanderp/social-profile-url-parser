import { describe, it, expect } from 'vitest';
import properties from '../data/properties.json';
import { regexes } from '../src/index';

type RawProperty = {
    property: string;
    propertyLabel?: string;
    urlPatterns?: string[];
};

const rawProperties = properties as RawProperty[];
const rawPatterns = rawProperties.flatMap(
    ({ property, propertyLabel, urlPatterns = [] }) => urlPatterns.map((pattern, patternIndex) => ({
        property,
        propertyLabel: propertyLabel ?? property,
        pattern,
        patternIndex,
    })),
);

describe('regex loading', () => {
    it(`loads exactly ${rawPatterns.length} regexes from JSON data`, () => {
        expect(regexes).toHaveLength(rawPatterns.length);
    });

    for (const {
        property, propertyLabel, pattern, patternIndex,
    } of rawPatterns) {
        it(`compiles ${property} ${propertyLabel} pattern ${patternIndex + 1}`, () => {
            expect(() => new RegExp(pattern, 'gi')).not.toThrow();
        });
    }

    it('creates valid regex metadata for every compiled regex', () => {
        for (const regex of regexes) {
            expect(regex.type).toEqual(expect.any(String));
            expect(regex.type.length).toBeGreaterThan(0);
            expect(regex.name).toEqual(expect.any(String));
            expect(regex.name.length).toBeGreaterThan(0);
            expect(regex.regex).toBeInstanceOf(RegExp);
        }
    });
});
