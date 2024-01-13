import fs from 'fs';
import {ParseResult, regexes} from './src';

regexes.forEach((regex) => {
    const path = `./test/cases/${regex.type}.json`;
    if (fs.existsSync(path)) {
        return;
    }

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
            }] as ParseResult[]
        } 
    ]));
});
