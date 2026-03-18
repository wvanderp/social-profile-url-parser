import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { parser, regexes, type RegexDefinition } from '../src/index';

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

        let caseNumber = 0;

        for (const testCase of parsedCases) {
            caseNumber += 1;

            it(`matches ${caseFileName} case ${caseNumber}`, () => {
                const results = parser(testCase.text);
                expect(results).toEqual(testCase.expected);
            });
        }
    }

    it('uses the full match as username when a regex has no capture groups', () => {
        const customRegex: RegexDefinition = {
            type: 'custom',
            name: 'Custom',
            regex: /https:\/\/example\.com\/full-match/gi,
        };

        regexes.push(customRegex);

        try {
            expect(parser('See https://example.com/full-match for details')).toContainEqual({
                type: 'custom',
                name: 'Custom',
                url: 'https://example.com/full-match',
                username: 'https://example.com/full-match',
            });
        } finally {
            regexes.pop();
        }
    });
});
