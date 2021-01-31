import {describe, it} from 'mocha';
import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import parser from '../src';

/**
 * https://stackoverflow.com/a/12646864
 *
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

describe('url parser', () => {
    const casesPath = path.join(__dirname, './cases');
    const testFiles = fs.readdirSync(casesPath);

    const fullTests: {text: string, expected: Record<string, string>[]}[] = [];

    for (const testFile of testFiles) {
        describe(testFile, () => {
            const tests = JSON.parse(
                fs.readFileSync(`${casesPath}/${testFile}`).toString()
            ) as {text: string, expected: Record<string, string>[]}[];

            let index = 0;
            for (const test of tests) {
                it(`${testFile} #${index}`, () => {
                    expect(parser(test.text)).to.deep.equal(test.expected);
                });

                fullTests.push({text: test.text, expected: test.expected});

                index++;
            }
        });
    }

    it('should work if we paste all together', () => {
        const expected = fullTests.map((test) => test.expected).flat();
        shuffleArray(fullTests);
        // console.log(fullTests);
        const text = fullTests.map((test) => test.text).join(' ');

        // @ts-expect-error
        expect(parser(text).sort(compare)).to.deep.equal(expected.sort(compare));
    });
});
