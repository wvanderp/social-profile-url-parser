/* eslint-disable no-restricted-syntax */
import fs from 'fs';
import { ParseResult, regexes } from './src';

for (const regex of regexes) {
    const path = `./test/cases/${regex.type}.json`;
    if (fs.existsSync(path)) {
        continue;
    }

    // eslint-disable-next-line no-console
    console.log(`Creating ${path}`);

    fs.writeFileSync(path, JSON.stringify([
        {
            text: '',
            expected: [{
                type: regex.type,
                name: regex.name,
                url: '',
                username: '',
                deprecated: regex.deprecated,
            }] as ParseResult[],
        },
    ]));
}
