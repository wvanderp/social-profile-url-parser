import fs from 'fs';
import { regexes } from './src/index';

for (const regex of regexes) {
    const path = `./test/cases/${regex.type}.json`;
    if (fs.existsSync(path)) {
        continue;
    }

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
