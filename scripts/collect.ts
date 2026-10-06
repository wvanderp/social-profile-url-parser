/* eslint-disable no-console */
// this file queries Wikidata query service and updates the json files

import { version } from '../package.json';
import type { RawProperty } from '../src/types';
import { writeCompiledProperties, writeRawProperties } from './dataFiles';
import stripAnchors from './stripAnchors';

interface WikidataResponse {
    head: {
        vars: string[];
    };
    results: {
        bindings: {
            property: {
                type: 'uri';
                value: string;
            };

            urlPattern?: {
                type: 'literal';
                value: string;
            };

            urlPatternReplacement?: {
                type: 'literal';
                value: string;
            };

            urlFormatter?: {
                type: 'literal';
                value: string;
            };

            propertyLabel: {
                'xml:lang': string;
                type: 'literal';
                value: string;
            };

            propertyDescription?: {
                'xml:lang': string;
                type: 'literal';
                value: string;
            };

            propertyAltLabel?: {
                'xml:lang': string;
                type: 'literal';
                value: string;
            };
        }[]
    };
}

const query = `
#External ID properties with URL match patterns, replacements, formatters, labels, descriptions and aliases
SELECT ?property ?urlPattern ?urlPatternReplacement ?urlFormatter ?propertyLabel ?propertyDescription ?propertyAltLabel WHERE {
  ?property wikibase:propertyType wikibase:ExternalId.
  OPTIONAL {
    ?property p:P8966 ?urlPatternStatement.
    ?urlPatternStatement a wikibase:BestRank;
                         ps:P8966 ?urlPattern.
    OPTIONAL { ?urlPatternStatement pq:P8967 ?urlPatternReplacement. }
  }
  OPTIONAL {
    SELECT ?property (MIN(?formatter) AS ?urlFormatter) WHERE {
      ?property p:P1630 ?formatterStatement.
      ?formatterStatement a wikibase:BestRank;
                          ps:P1630 ?formatter.
    }
    GROUP BY ?property
  }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
}
ORDER BY (xsd:integer(STRAFTER(STR(?property), "P")))
`;

const url = `https://query.wikidata.org/sparql?format=json&query=${encodeURIComponent(query)}`;
const DEFAULT_USER_AGENT = `social-profile-url-parser/${version} (https://github.com/wvanderp/social-profile-url-parser)`;
const userAgent = process.env.WIKIMEDIA_USER_AGENT ?? DEFAULT_USER_AGENT;
const requestTimeoutMs = 60_000;

const fetchWikidata = async (): Promise<WikidataResponse> => {
    // this script only runs in Node, which has fetch built in
    // eslint-disable-next-line compat/compat
    const response = await fetch(url, {
        signal: AbortSignal.timeout(requestTimeoutMs),
        headers: {
            'User-Agent': userAgent,
            Accept: 'application/sparql-results+json',
        },
    });

    if (!response.ok) {
        throw new Error(`Wikidata request failed with status ${response.status} ${response.statusText}`);
    }

    return await response.json() as WikidataResponse;
};

const run = async () => {
    console.log('Updating properties.raw.json and properties.compiled.json...');
    console.log(`url: ${url}`);
    console.log(`Using User-Agent: ${userAgent}`);

    const data = await fetchWikidata();
    console.log('Got results, writing to file...');

    // pull out the data from the response
    const properties = data.results.bindings.map((binding) => {
        const property = binding.property.value.split('/').pop();

        if (!property) {
            throw new Error('property is undefined');
        }

        if (!binding.propertyLabel || !binding.propertyLabel.value) {
            throw new Error(`propertyLabel is undefined for property ${property}`);
        }

        if (!binding.urlPattern || !(binding.urlPattern.value)) {
            return;
        }

        const label = binding.propertyLabel.value;
        const description = binding.propertyDescription?.value;
        const altLabel = binding.propertyAltLabel?.value;

        const urlPattern = {
            pattern: stripAnchors(binding.urlPattern.value),
            replacement: binding.urlPatternReplacement?.value,
        };

        // eslint-disable-next-line consistent-return
        return {
            property,
            urlFormatter: binding.urlFormatter?.value,
            urlPatterns: [urlPattern],
            propertyLabel: label,
            propertyDescription: description,
            propertyAltLabel: altLabel,
        };
    })
        .filter((property): property is NonNullable<typeof property> => property !== undefined);

    // group the properties by the property
    const groupedProperties = properties.reduce((accumulator, property) => {
        const { property: propertyId } = property;

        if (accumulator[propertyId]) {
            accumulator[propertyId].urlPatterns.push(...property.urlPatterns);
        } else {
            accumulator[propertyId] = property;
        }

        return accumulator;
    }, {} as Record<string, typeof properties[0]>);

    const sortedProperties: RawProperty[] = Object.values(groupedProperties)
        .map((property) => ({
            ...property,
            urlPatterns: property.urlPatterns.toSorted(
                (a, b) => a.pattern.localeCompare(b.pattern),
            ),
        }));

    // the raw file keeps everything Wikidata returned, including duplicates,
    // so the data tests can report them
    writeRawProperties(sortedProperties);
    writeCompiledProperties(sortedProperties);
};

// eslint-disable-next-line unicorn/prefer-top-level-await
run().catch((error) => {
    console.error('Failed to update the property files:', error);
    process.exitCode = 1;
});
