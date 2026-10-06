import { describe, expect, it } from 'vitest';
import compiledProperties from '../../data/properties.compiled.json';
import rawProperties from '../../data/properties.raw.json';
import compileProperties, { findDuplicatePatterns } from '../../scripts/compileProperties';
import type { CompiledProperty, RawProperty } from '../../src/types';

const raw = rawProperties as RawProperty[];
const compiled = compiledProperties as CompiledProperty[];

describe('collected property files', () => {
    it('properties.compiled.json is up to date with properties.raw.json (run `pnpm compile-data`)', () => {
        expect(compiled).toStrictEqual(compileProperties(raw));
    });

    it('properties.compiled.json has no duplicate URL patterns', () => {
        expect(findDuplicatePatterns(compiled)).toEqual([]);
    });

    // A duplicate means the property has the same P8966 (and P8967) statement more than once on
    // Wikidata. Remove the extra statements on Wikidata; the compile step only hides them.
    it('properties.raw.json has no duplicate P8966 URL match pattern statements', () => {
        expect(findDuplicatePatterns(raw)).toEqual([]);
    });
});
