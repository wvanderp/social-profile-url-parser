import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { parser, regexes } from '../src/index.ts';

describe('regex loading', () => {
    it('loads regexes from JSON data', () => {
        expect(regexes.length).toBeGreaterThan(0);
    });

    it('creates valid regex metadata', () => {
        for (const regex of regexes) {
            expect(regex.type).toEqual(expect.any(String));
            expect(regex.type).not.toHaveLength(0);
            expect(regex.name).toEqual(expect.any(String));
            expect(regex.name).not.toHaveLength(0);
            expect(regex.regex).toBeInstanceOf(RegExp);
        }
    });
});

describe('parser', () => {
    const casesDirectoryPath = path.resolve(__dirname, './cases');
    const caseFiles = fs
        .readdirSync(casesDirectoryPath)
        .filter((fileName) => fileName.endsWith('.json'))
        .sort((left, right) => left.localeCompare(right));

    for (const caseFileName of caseFiles) {
        const caseFilePath = path.join(casesDirectoryPath, caseFileName);
        const rawCaseData = fs.readFileSync(caseFilePath, 'utf8');
        const parsedCases = JSON.parse(rawCaseData) as Array<{
            text: string;
            expected: Array<{
                type: string;
                name: string;
                url: string;
                username: string;
            }>;
        }>;

        for (const [index, testCase] of parsedCases.entries()) {
            it(`matches ${caseFileName} case ${index + 1}`, () => {
                const results = parser(testCase.text);
                expect(results).toEqual(testCase.expected);
            });
        }
    }
});
