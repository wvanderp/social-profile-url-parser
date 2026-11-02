/* eslint-disable no-console */
import { describe, it, expect } from 'vitest';
import rawProperties from '../../data/properties.raw.json';
import compileDefinitions from '../../src/compile';
import type { RawProperty } from '../../src/types';

const regexes = compileDefinitions(rawProperties as RawProperty[]);

function expectValidReplacement(replacement: string): void {
    expect(replacement).not.toContain('$');
}

describe('replacement validation diagnostics', () => {
    it('reports the illegal character and the replacement value', () => {
        expect(() => expectValidReplacement('$1')).toThrowError("expected '$1' not to contain '$'");
    });
});

describe('regex format', () => {
    for (const {
        name, propertyId, regex, replacement = String.raw`\1`,
    } of regexes) {
        describe(`Wikidata ${propertyId}`, () => {
            it(`compiles ${name} `, () => {
                expect(() => new RegExp(regex, 'gi')).not.toThrow();
            });

            const referencedGroups = (replacement.match(/\\\d+/g) ?? []).map(
                (reference) => Number(reference.slice(1)),
            );
            const minimumGroupCount = Math.max(0, ...referencedGroups);

            it(`has at least ${minimumGroupCount} capture groups in ${propertyId} ${name}`, () => {
                // The empty alternative matches and includes a slot for every capturing group.
                const captureCount = new RegExp(`(?:${regex.source})|`, 'gi').exec('')?.slice(1).length ?? 0;
                if (captureCount < minimumGroupCount) {
                    console.log(
                        `${propertyId} ${name} : replacement ${replacement} needs at least ${minimumGroupCount} capture groups on Wikidata, found ${captureCount}:`,
                        regex.source,
                    );
                }
                expect(captureCount).toBeGreaterThanOrEqual(minimumGroupCount);
            });

            it('the replacements dont contain illegal characters', () => {
                expectValidReplacement(replacement);
            });
        });
    }
});
