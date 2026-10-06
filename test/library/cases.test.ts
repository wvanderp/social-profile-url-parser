import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { parse } from '../../src/index';

describe('parse fixtures', () => {
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
                propertyId: string;
                name: string;
                url: string;
                identifier: string;
            }>;
        }>;

        let caseNumber = 0;

        for (const testCase of parsedCases) {
            caseNumber += 1;

            it(`matches ${caseFileName} case ${caseNumber}`, () => {
                const results = parse(testCase.text);
                expect(results.map(({
                    propertyId, name, url, identifier, groups,
                }) => ({
                    propertyId, name, url, identifier, groups,
                }))).toEqual(testCase.expected.map((result) => ({
                    ...result,
                    groups: [result.identifier],
                })));
            });
        }
    }
});
