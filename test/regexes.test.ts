/* eslint-disable no-console */
import { describe, it, expect } from 'vitest';
import { regexes } from '../src/index';

describe('regex format', () => {
    for (const {
        name, type, regex, replacement = String.raw`\1`,
    } of regexes) {
        describe(`Wikidata ${type}`, () => {
            it(`compiles ${name} `, () => {
                expect(() => new RegExp(regex, 'gi')).not.toThrow();
            });

            const referencedGroups = (replacement.match(/\\\d+/g) ?? []).map(
                (reference) => Number(reference.slice(1)),
            );
            const minimumGroupCount = Math.max(0, ...referencedGroups);

            it(`has at least ${minimumGroupCount} capture groups in ${type} ${name}`, () => {
                // The empty alternative matches and includes a slot for every capturing group.
                const captureCount = new RegExp(`(?:${regex.source})|`, 'gi').exec('')?.slice(1).length ?? 0;
                if (captureCount < minimumGroupCount) {
                    console.log(
                        `${type} ${name} : replacement ${replacement} needs at least ${minimumGroupCount} capture groups on Wikidata, found ${captureCount}:`,
                        regex.source,
                    );
                }
                expect(captureCount).toBeGreaterThanOrEqual(minimumGroupCount);
            });

            it('the replacements dont contain illegal characters', () => {
                expect(replacement.includes('$')).toBe(false);
            });
        });
    }
});
