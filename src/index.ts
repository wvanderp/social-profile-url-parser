import properties from '../data/properties.json';

type RawProperty = {
    property: string;
    urlPatterns?: {
        pattern: string;
        replacement?: string;
    }[];
    propertyLabel?: string;
    urlFormatter?: string;
};

export type ParseResult = {
    type: string;
    name: string;
    url: string;
    username: string;
    groups: Array<string | undefined>;
    urlFormatter?: string;
    formattedUrl?: string;
};

export type RegexDefinition = {
    type: string;
    name: string;
    regex: RegExp;
    replacement?: string;
    urlFormatter?: string;
};

function applyUrlFormatter(urlFormatter: string, username: string): string {
    // A callback preserves literal dollar signs in identifiers.
    // eslint-disable-next-line unicorn/prefer-string-replace-all
    return urlFormatter.replace(/\$1/g, () => username);
}

function getFormattedUrlFields(urlFormatter: string | undefined, username: string) {
    return urlFormatter ? {
        urlFormatter,
        formattedUrl: applyUrlFormatter(urlFormatter, username),
    } : {};
}

/**
 * Build a URL using the property's Wikidata P1630 template, if available.
 * @param type - The Wikidata property ID, such as P2002 for Twitter.
 * @param username - The identifier to insert into the URL template.
 * @returns The formatted URL, or undefined if the property has no template.
 */
export function formatUrl(type: string, username: string): string | undefined {
    const property = (properties as RawProperty[]).find((entry) => entry.property === type);
    return property?.urlFormatter
        ? applyUrlFormatter(property.urlFormatter, username)
        : undefined;
}

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
                    ...(property.urlFormatter && { urlFormatter: property.urlFormatter }),
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
 * Extract social profile URLs and identifiers using Wikidata URL patterns.
 * @param inputText - The input text to parse.
 * @returns The matches, deduplicated by property and identifier.
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

            const username = getMatchValue(match, regex.replacement);
            const parsedResult: ParseResult = {
                type: regex.type,
                name: regex.name,
                url: match[0],
                username,
                groups: match.slice(1),
                ...getFormattedUrlFields(regex.urlFormatter, username),
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
