import type { CompiledProperty, RegexDefinition } from './types';

/**
 * Compile Wikidata property entries into regex definitions, skipping empty or invalid patterns.
 * @param properties - The property entries collected from Wikidata.
 * @returns One definition per valid URL pattern.
 */
export default function compileDefinitions(properties: CompiledProperty[]): RegexDefinition[] {
    return properties.flatMap((property) => {
        const patterns = property.urlPatterns ?? [];

        return patterns.reduce((compiledPatterns, pattern) => {
            if (typeof pattern.pattern !== 'string' || pattern.pattern.length === 0) {
                return compiledPatterns;
            }

            try {
                compiledPatterns.push({
                    propertyId: property.property,
                    name: property.propertyLabel ?? property.property,
                    regex: new RegExp(pattern.pattern, 'gi'),
                    replacement: pattern.replacement ?? String.raw`\1`,
                    ...(property.urlFormatter && { urlFormatter: property.urlFormatter }),
                });
            } catch {
                return compiledPatterns;
            }

            return compiledPatterns;
        }, [] as RegexDefinition[]);
    });
}
