/* eslint-disable no-console */
// this file rebuilds data/properties.compiled.json from data/properties.raw.json
// without querying Wikidata

import { compiledPropertiesPath, readRawProperties, writeCompiledProperties } from './dataFiles';

writeCompiledProperties(readRawProperties());
console.log(`Wrote ${compiledPropertiesPath}`);
