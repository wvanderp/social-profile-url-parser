import properties from '../data/properties.compiled.json';
import type { CompiledProperty } from './types';

const urlFormatters = new Map<string, string>();
for (const property of properties as CompiledProperty[]) {
    if (property.urlFormatter && !urlFormatters.has(property.property)) {
        urlFormatters.set(property.property, property.urlFormatter);
    }
}

/**
 * Insert an identifier into a Wikidata P1630 URL template.
 * @param urlFormatter - The URL template, using `$1` as the placeholder.
 * @param identifier - The identifier to insert into the URL template.
 * @returns The formatted URL.
 */
export function applyUrlFormatter(urlFormatter: string, identifier: string): string {
    // A callback preserves literal dollar signs in identifiers.
    // eslint-disable-next-line unicorn/prefer-string-replace-all
    return urlFormatter.replace(/\$1/g, () => identifier);
}

/**
 * Build the optional URL formatter fields for a parse result.
 * @param urlFormatter - The URL template, if the property has one.
 * @param identifier - The identifier to insert into the URL template.
 * @returns The `urlFormatter` and `formattedUrl` fields, or an empty object.
 */
export function getFormattedUrlFields(urlFormatter: string | undefined, identifier: string) {
    return urlFormatter ? {
        urlFormatter,
        formattedUrl: applyUrlFormatter(urlFormatter, identifier),
    } : {};
}

/**
 * Build a URL using the property's Wikidata P1630 template, if available.
 * @param propertyId - The Wikidata property ID, such as P2002 for Twitter.
 * @param identifier - The identifier to insert into the URL template.
 * @returns The formatted URL, or undefined if the property has no template.
 */
export function formatUrl(propertyId: string, identifier: string): string | undefined {
    const urlFormatter = urlFormatters.get(propertyId);
    return urlFormatter ? applyUrlFormatter(urlFormatter, identifier) : undefined;
}
