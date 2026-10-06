export type UrlPattern = {
    pattern: string;
    replacement?: string;
};

/**
 * A property entry in `data/properties.compiled.json`, holding only the fields used at runtime.
 */
export type CompiledProperty = {
    property: string;
    propertyLabel?: string;
    urlFormatter?: string;
    urlPatterns?: UrlPattern[];
};

/**
 * A property entry in `data/properties.raw.json`, as collected from Wikidata.
 */
export type RawProperty = CompiledProperty & {
    propertyDescription?: string;
    propertyAltLabel?: string;
};

export type ParseResult = {
    propertyId: string;
    name: string;
    url: string;
    identifier: string;
    groups: Array<string | undefined>;
    urlFormatter?: string;
    formattedUrl?: string;
};

export type RegexDefinition = {
    propertyId: string;
    name: string;
    regex: RegExp;
    replacement?: string;
    urlFormatter?: string;
};
