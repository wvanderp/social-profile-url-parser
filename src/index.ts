import properties from '../data/properties.json';

type RawProperty = {
    property: string;
    urlPatterns?: {
        pattern: string;
        replacement?: string;
    }[];
    propertyLabel?: string;
};

export type ParseResult = {
    type: string;
    name: string;
    url: string;
    username: string;
    groups: Array<string | undefined>;
};

export type RegexDefinition = {
    type: string;
    name: string;
    regex: RegExp;
    replacement?: string;
};

function getMatchValue(match: RegExpExecArray, replacement = String.raw`\1`): string {
    if (match.length === 1 && replacement === String.raw`\1`) {
        return match[0];
    }

    // Keep replacement compatible with the ES2019 browser target.
    // eslint-disable-next-line unicorn/prefer-string-replace-all
    return replacement.replace(/\\(\d+)/g, (_, group: string) => match[Number(group)] ?? '');
}

function compileRegexes(): RegexDefinition[] {
    const rawProperties = properties as RawProperty[];

    return rawProperties.flatMap((property) => {
        const patterns = property.urlPatterns ?? [];

        return patterns.reduce((compiledPatterns, pattern) => {
            if (typeof pattern.pattern !== 'string' || pattern.pattern.length === 0) {
                return compiledPatterns;
            }

            try {
                compiledPatterns.push({
                    type: property.property,
                    name: property.propertyLabel ?? property.property,
                    regex: new RegExp(pattern.pattern, 'gi'),
                    replacement: pattern.replacement ?? String.raw`\1`,
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
            // exec() does not advance after an empty match. Skip it and keep scanning.
            if (match[0].length === 0) {
                const codePoint = inputText.codePointAt(regex.regex.lastIndex);
                const isSurrogatePair = codePoint !== undefined && codePoint > 65_535;
                regex.regex.lastIndex += isSurrogatePair && regex.regex.unicode ? 2 : 1;
                match = regex.regex.exec(inputText);
                continue;
            }

            const parsedResult: ParseResult = {
                type: regex.type,
                name: regex.name,
                url: match[0],
                username: getMatchValue(match, regex.replacement),
                groups: match.slice(1),
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
