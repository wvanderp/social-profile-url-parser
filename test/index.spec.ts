import fs from 'fs';
import path from 'path';
import { parser, ParseResult, regexes } from '../src';

// create custom matchers that check if a object is not in a set
expect.extend({
    toNotBeInSet(received, set) {
        const inSet = set.has(received);
        if (inSet) {
            return {
                message: () => `expected ${received} to not be in set, but it was`,
                pass: false,
            };
        }

        return {
            message: () => `expected ${received} not to be in set, but and it isn't`,
            pass: true,
        };
    }
});

/**
 * https://stackoverflow.com/a/12646864
 * @private
 * @param array
 */
function shuffleArray<T>(array: T[]): void {
    for (let index = array.length - 1; index > 0; index--) {
        const index_ = Math.floor(Math.random() * (index + 1));
        // eslint-disable-next-line no-param-reassign
        [array[index], array[index_]] = [array[index_], array[index]];
    }
}

/**
 * https://stackoverflow.com/a/1129270
 * 
 * @private
 * @param a
 * @param b
 * @returns
 */
function compare<T extends Record<string, string>>(a: T, b: T): number {
    if (a.username < b.username) {
        return -1;
    }
    if (a.username > b.username) {
        return 1;
    }
    return 0;
}

type TestCase = { text: string, expected: ParseResult[] }

describe('url parser', () => {
    const casesPath = path.join(__dirname, './cases');
    const testFiles = fs.readdirSync(casesPath);

    const fullTests: TestCase[] = [];

    for (const testFile of testFiles) {
        describe(testFile, () => {
            const tests = JSON.parse(
                fs.readFileSync(`${casesPath}/${testFile}`).toString()
            ) as TestCase[];

            let index = 0;
            for (const test of tests) {
                it(`${testFile} #${index}`, () => {
                    expect(parser(test.text)).toEqual(test.expected);
                });

                fullTests.push({ text: test.text, expected: test.expected });

                index++;
            }
        });
    }

    it('should work if we paste all together', () => {
        const expected = fullTests.flatMap((test) => test.expected);
        shuffleArray(fullTests);
        // console.log(fullTests);
        const text = fullTests.map((test) => test.text).join(' ');

        // @ts-expect-error
        expect(parser(text).sort(compare)).toEqual(expected.sort(compare));
    });
});

describe('regexes', () => {
    it('should not capture www', () => {
        for (const regex of regexes) {
            const regexString = regex.regex.toString();
            expect(regexString).not.toContain('(www\.)');    
            expect(regexString).not.toContain('(www.)');    

            // test the actual regex
            expect(regex.regex.test('www')).toEqual(false);
        }
    });
});

describe('no duplicates', () => {
    it('should not have duplicates names', () => {
        const names = new Set();
        for (const regex of regexes) {
            // @ts-expect-error -- it was custom matcher created above
            expect(regex.name).toNotBeInSet(names);
            names.add(regex.name);
        }
    });

    it('should not have duplicates types', () => {
        const types = new Set();
        for (const regex of regexes) {
            // @ts-expect-error -- it was custom matcher created above
            expect(regex.type).toNotBeInSet(types);
            types.add(regex.type);
        }
    });

    it('should not have duplicates regexes', () => {
        const regexes_ = new Set();
        for (const regex of regexes) {
            // @ts-expect-error -- it was custom matcher created above
            expect(regex.regex).toNotBeInSet(regexes_);
            regexes_.add(regex.regex);
        }
    });
});

describe('coverage', () => {
    it('should cover all regexes', () => {
        const casesPath = path.join(__dirname, './cases');
        const testFiles = fs.readdirSync(casesPath);

        const testSet = new Set();

        for (const testFile of testFiles) {
            const tests = JSON.parse(
                fs.readFileSync(path.join(casesPath, testFile)).toString()
            ) as TestCase[];

            for (const test of tests) {
                for (const result of test.expected) {
                    testSet.add(result.type);
                }
            }
        }

        const regexSet = new Set(regexes.map((regex) => regex.type));

        regexSet.forEach((type) => {
            if (!testSet.has(type)) {
                console.log(`Missing test for ${type}`);
            }
        });

        expect(testSet.size).toEqual(regexSet.size);
    });
});
