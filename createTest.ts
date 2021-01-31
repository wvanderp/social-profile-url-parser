import fs from 'fs';
import {regexes} from './src';

regexes.forEach((regex) => {
    const path = `./test/cases/${regex.type}.json`;
    if (fs.existsSync(path)) {
        return;
    }

    fs.writeFileSync(path, JSON.stringify([
        {
            text: '',
            expected: [{
                type: regex.type,
                name: regex.name,
                url: '',
                username: ''
            }]
        }
    ]));
});
