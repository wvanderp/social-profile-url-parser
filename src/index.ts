import properties from '../data/properties.json';

type RawProperty = {
    property: string;
    urlPatterns?: string[];
    propertyLabel?: string;
};

export type ParseResult = {
    type: string;
    name: string;
    url: string;
    username: string;
};

export type RegexDefinition = {
    type: string;
    name: string;
    regex: RegExp;
};

function getMatchValue(match: RegExpExecArray): string {
    const captures = match.slice(1).filter(Boolean);
    if (captures.length === 0) {
        return match[0];
    }

    return captures.join('');
}

function compileRegexes(): RegexDefinition[] {
    const rawProperties = properties as RawProperty[];

    return rawProperties.flatMap((property) => {
        const patterns = property.urlPatterns ?? [];

        return patterns.reduce((compiledPatterns, pattern) => {
            try {
                compiledPatterns.push({
                    type: property.property,
                    name: property.propertyLabel ?? property.property,
                    regex: new RegExp(pattern, 'gi'),
                });
            } catch {
                return compiledPatterns;
            }

            return compiledPatterns;
        }, [] as RegexDefinition[]);
    });
}

export const regexes = compileRegexes();

/**
 * @param {string} inputText the input text that will be parsed.
 * @returns {Array<ParseResult>} an array with all the found matches
 * @example
 * ```js
 * import { parser } from 'social-profile-url-parser';
 *
 * const result = parser('See https://twitter.com/jack for details');
 * ```
 */
export function parser(inputText: string): ParseResult[] {
    const results: ParseResult[] = [];
    const seen = new Set<string>();

    for (const regex of regexes) {
        regex.regex.lastIndex = 0;

        let match: RegExpExecArray | null = regex.regex.exec(inputText);
        while (match !== null) {
            const parsedResult: ParseResult = {
                type: regex.type,
                name: regex.name,
                url: match[0],
                username: getMatchValue(match),
            };

            const dedupeKey = `${parsedResult.type}\u0000${parsedResult.username.toLowerCase()}`;
            if (!seen.has(dedupeKey)) {
                seen.add(dedupeKey);
                results.push(parsedResult);
            }

            match = regex.regex.exec(inputText);
        }
    }

    return results;
}
