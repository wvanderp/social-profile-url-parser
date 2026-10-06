import properties from '../data/properties.compiled.json';
import compileDefinitions from './compile';
import { getFormattedUrlFields } from './formatter';
import applyReplacement from './replacement';
import type { CompiledProperty, ParseResult, RegexDefinition } from './types';

function addMatchResult(
    results: ParseResult[],
    seen: Set<string>,
    definition: RegexDefinition,
    match: RegExpExecArray,
): void {
    const identifier = applyReplacement(match, definition.replacement);
    if (identifier.length === 0) {
        return;
    }

    const parsedResult: ParseResult = {
        propertyId: definition.propertyId,
        name: definition.name,
        url: match[0],
        identifier,
        groups: match.slice(1),
        ...getFormattedUrlFields(definition.urlFormatter, identifier),
    };

    const dedupeKey = `${parsedResult.propertyId}\u0000${parsedResult.identifier.toLowerCase()}`;
    if (seen.has(dedupeKey)) {
        return;
    }

    seen.add(dedupeKey);
    results.push(parsedResult);
}

/**
 * Create a parse function that matches text against the given regex definitions.
 * @param definitions - The compiled regex definitions to match against.
 * @returns A function returning matches, deduplicated by property and identifier.
 */
export function createParser(definitions: RegexDefinition[]): (inputText: string) => ParseResult[] {
    return (inputText) => {
        const results: ParseResult[] = [];
        const seen = new Set<string>();

        for (const definition of definitions) {
            const { regex } = definition;
            regex.lastIndex = 0;

            let match: RegExpExecArray | null = regex.exec(inputText);
            while (match !== null) {
                // exec() does not advance after an empty match. Skip it and keep scanning.
                if (match[0].length === 0) {
                    const codePoint = inputText.codePointAt(regex.lastIndex);
                    const isSurrogatePair = codePoint !== undefined && codePoint > 65_535;
                    regex.lastIndex += isSurrogatePair && regex.unicode ? 2 : 1;
                    match = regex.exec(inputText);
                    continue;
                }

                addMatchResult(results, seen, definition, match);
                match = regex.exec(inputText);
            }
        }

        return results;
    };
}

export const regexes = compileDefinitions(properties as CompiledProperty[]);

const parseWithDefaultDefinitions = createParser(regexes);

/**
 * Extract social profile URLs and identifiers using Wikidata URL patterns.
 * @param inputText - The input text to parse.
 * @returns The matches, deduplicated by property and identifier.
 * @example
 * ```js
 * import { parse } from 'social-profile-url-parser';
 *
 * const result = parse('See https://twitter.com/jack for details');
 * ```
 */
export function parse(inputText: string): ParseResult[] {
    return parseWithDefaultDefinitions(inputText);
}
