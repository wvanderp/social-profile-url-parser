/* eslint-disable no-restricted-syntax */
import fs from 'fs';
import { regexes } from './src/index';

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
            }],
        },
    ]));
}
