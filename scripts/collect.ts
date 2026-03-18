/* eslint-disable unicorn/no-array-reduce */
/* eslint-disable unicorn/consistent-destructuring */
/* eslint-disable no-console */
// this file queries Wikidata query service and updates the json files

// eslint-disable-next-line import/no-extraneous-dependencies
import axios from 'axios';
import fs from 'fs';
import path from 'path';

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
#All properties with descriptions and aliases and types
SELECT ?property ?urlPattern ?propertyType ?propertyLabel ?propertyDescription ?propertyAltLabel WHERE {
  ?property wikibase:propertyType wikibase:ExternalId.
  OPTIONAL { ?property wdt:P8966 ?urlPattern. }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
}
ORDER BY (xsd:integer(STRAFTER(STR(?property), "P")))
`;

const url = `https://query.wikidata.org/sparql?format=json&query=${encodeURIComponent(query)}`;
const DEFAULT_USER_AGENT = 'social-profile-url-parser/2.0.0 (https://github.com/wvanderp/social-profile-url-parser; https://github.com/wvanderp/social-profile-url-parser/issues)';
const userAgent = process.env.WIKIMEDIA_USER_AGENT ?? DEFAULT_USER_AGENT;
const requestTimeoutMs = 30_000;

console.log('Updating properties.json...');
console.log(`url: ${url}`);
console.log(`Using User-Agent: ${userAgent}`);

const propertiesPath = path.join(__dirname, '../data/properties.json');

const fetchWikidata = async () => {
    const response = await axios.get<WikidataResponse>(url, {
        timeout: requestTimeoutMs,
        headers: {
            'User-Agent': userAgent,
            Accept: 'application/sparql-results+json',
        },
    });

    return response.data;
};

const run = async () => {
    const data = await fetchWikidata();
    console.log('Got results, writing to file...');

    // pull out the data from the response
    const properties = data.results.bindings.map((binding) => {
        const property = binding.property.value.split('/').pop();

        if (!property) {
            throw new Error('property is undefined');
        }

        // remove the ^ from the start of the urlPattern and remove the trailing $

        const urlPattern = binding.urlPattern?.value.replace(/^\^/, '').replace(/\$$/, '');
        const label = binding.propertyLabel.value;
        const description = binding.propertyDescription?.value;
        const altLabel = binding.propertyAltLabel?.value;

        return {
            property,
            urlPatterns: urlPattern ? [urlPattern] : [],
            propertyLabel: label,
            propertyDescription: description,
            propertyAltLabel: altLabel,
        };
    });

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

    // create the folder if it doesn't exist
    if (!fs.existsSync(path.dirname(propertiesPath))) {
        fs.mkdirSync(path.dirname(propertiesPath));
    }

    const filteredProperties = Object.values(groupedProperties)
        .filter((property) => property.urlPatterns.length > 0);

    // eslint-disable-next-line unicorn/no-null
    fs.writeFileSync(propertiesPath, JSON.stringify(filteredProperties, null, 2));
};

// eslint-disable-next-line unicorn/prefer-top-level-await
run().catch((error) => {
    console.error('Failed to update properties.json:', error);
    process.exitCode = 1;
});
