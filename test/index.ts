import {describe, it} from 'mocha';
import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import {parser, ParseResult, regexes } from '../src';

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

type TestCase = {text: string, expected: ParseResult[]}

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
                    expect(parser(test.text)).to.deep.equal(test.expected);
                });

                fullTests.push({text: test.text, expected: test.expected});

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
        expect(parser(text).sort(compare)).to.deep.equal(expected.sort(compare));
    });
});

describe('no duplicates', () => {
    it('should not have duplicates names', () => {
        const names = new Set();
        for (const regex of regexes) {
            expect(names.has(regex.name)).to.be.false;
            names.add(regex.name);
        }
    });

    it('should not have duplicates types', () => {  
        const types = new Set();
        for (const regex of regexes) {
            expect(types.has(regex.type)).to.be.false;
            types.add(regex.type);
        }
    });

    it('should not have duplicates regexes', () => {
        const regexes_ = new Set();
        for (const regex of regexes) {
            expect(regexes_.has(regex.regex)).to.be.false;
            regexes_.add(regex.regex);
        }
    });
});

describe('coverage', () => {
    it('should cover all regexes', () => {
        const casesPath = path.join(__dirname, './cases');
        const testFiles = fs.readdirSync(casesPath);

        const testSet = new Set();

        for(const testFile of testFiles) {
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
            if(!testSet.has(type)) {
                console.log(`Missing test for ${type}`);
            }
        });

        expect(testSet.size).to.equal(regexSet.size);
    });
});
