import type { CompiledProperty, RawProperty, UrlPattern } from '../src/types';

export type DuplicatePattern = {
    property: string;
    pattern: string;
    replacement: string;
    count: number;
};

const DEFAULT_REPLACEMENT = String.raw`\1`;

function patternKey({ pattern, replacement }: UrlPattern): string {
    return `${pattern}\u0000${replacement ?? DEFAULT_REPLACEMENT}`;
}

type PatternCount = { pattern: UrlPattern; count: number };

// Group equal patterns, keeping the first occurrence of each in the original order.
function countPatterns(patterns: UrlPattern[]): PatternCount[] {
    const counts: PatternCount[] = [];
    const countsByKey = new Map<string, PatternCount>();
    for (const pattern of patterns) {
        const key = patternKey(pattern);
        const entry = countsByKey.get(key);
        if (entry) {
            entry.count += 1;
        } else {
            const newEntry = { pattern, count: 1 };
            countsByKey.set(key, newEntry);
            counts.push(newEntry);
        }
    }

    return counts;
}

/**
 * Reduce the raw Wikidata properties to the fields the runtime uses and drop repeated patterns.
 * A missing replacement is treated the same as `\1`, because that is the runtime default.
 * @param rawProperties - The properties as stored in `data/properties.raw.json`.
 * @returns The properties to store in `data/properties.compiled.json`.
 */
export default function compileProperties(rawProperties: RawProperty[]): CompiledProperty[] {
    return rawProperties.map((property) => {
        const urlPatterns = property.urlPatterns && countPatterns(property.urlPatterns)
            .map(({ pattern }) => ({
                pattern: pattern.pattern,
                ...(pattern.replacement !== undefined && { replacement: pattern.replacement }),
            }));

        return {
            property: property.property,
            ...(property.propertyLabel !== undefined && { propertyLabel: property.propertyLabel }),
            ...(property.urlFormatter !== undefined && { urlFormatter: property.urlFormatter }),
            ...(urlPatterns !== undefined && { urlPatterns }),
        };
    });
}

/**
 * Find URL patterns that occur more than once in the same property.
 * @param properties - The properties to check.
 * @returns One entry per repeated pattern, with the number of times it occurs.
 */
export function findDuplicatePatterns(properties: CompiledProperty[]): DuplicatePattern[] {
    const exceptions = new Set([
        'P8424',
        'P11994',
    ]);

    return properties.flatMap(({ property, urlPatterns = [] }) => countPatterns(urlPatterns)
        .filter(() => !exceptions.has(property))
        .filter(({ count }) => count > 1)
        .map(({ pattern, count }) => ({
            property,
            pattern: pattern.pattern,
            replacement: pattern.replacement ?? DEFAULT_REPLACEMENT,
            count,
        })));
}
