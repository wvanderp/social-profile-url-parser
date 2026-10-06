type CaseConversion = 'lower' | 'upper';

const escapedReplacementCharacters: Record<string, string> = {
    a: '\u{7}',
    e: '\u{1B}',
    f: '\f',
    n: '\n',
    r: '\r',
    t: '\t',
    v: '\v',
};

function convertCase(value: string, conversion: CaseConversion | undefined): string {
    if (conversion === 'lower') {
        return value.toLowerCase();
    }

    if (conversion === 'upper') {
        return value.toUpperCase();
    }

    return value;
}

function convertReplacementPart(
    value: string,
    conversion: CaseConversion | undefined,
    nextConversion: CaseConversion | undefined,
): [string, CaseConversion | undefined] {
    const convertedValue = convertCase(value, conversion);
    if (nextConversion === undefined || convertedValue.length === 0) {
        return [convertedValue, nextConversion];
    }

    const firstCodePoint = convertedValue.codePointAt(0) as number;
    const firstCharacter = String.fromCodePoint(firstCodePoint);
    const convertedFirstCharacter = convertCase(firstCharacter, nextConversion);
    return [convertedFirstCharacter + convertedValue.slice(firstCharacter.length), undefined];
}

function getCaptureReplacement(
    replacement: string,
    startIndex: number,
    match: RegExpExecArray,
): [string, number] {
    let endIndex = startIndex;
    while (endIndex < replacement.length && /\d/.test(replacement[endIndex])) {
        endIndex += 1;
    }

    return [match[Number(replacement.slice(startIndex, endIndex))] ?? '', endIndex];
}

function getCaseConversions(
    escape: string,
    conversion: CaseConversion | undefined,
    nextConversion: CaseConversion | undefined,
): [CaseConversion | undefined, CaseConversion | undefined] | undefined {
    switch (escape) {
        case 'L': {
            return ['lower', nextConversion];
        }
        case 'U': {
            return ['upper', nextConversion];
        }
        case 'E': {
            return [undefined, nextConversion];
        }
        case 'l': {
            return [conversion, 'lower'];
        }
        case 'u': {
            return [conversion, 'upper'];
        }
        default: {
            return undefined;
        }
    }
}

/**
 * Build an identifier from a match using a Wikidata P8967 replacement value.
 * @param match - The regex match to read capture groups from.
 * @param replacement - The replacement string, such as `\1` or `\1:\3`.
 * @returns The identifier assembled from the replacement.
 */
export default function applyReplacement(match: RegExpExecArray, replacement = String.raw`\1`): string {
    if (match.length === 1 && replacement === String.raw`\1`) {
        return match[0];
    }

    let result = '';
    let conversion: CaseConversion | undefined;
    let nextConversion: CaseConversion | undefined;
    let index = 0;

    const append = (value: string) => {
        const [convertedValue, remainingNextConversion] = convertReplacementPart(
            value,
            conversion,
            nextConversion,
        );
        result += convertedValue;
        nextConversion = remainingNextConversion;
    };

    while (index < replacement.length) {
        if (replacement[index] !== '\\') {
            const codePoint = replacement.codePointAt(index) as number;
            const character = String.fromCodePoint(codePoint);
            append(character);
            index += character.length;
            continue;
        }

        if (index === replacement.length - 1) {
            append('\\');
            break;
        }

        const escape = replacement[index + 1];
        if (/\d/.test(escape)) {
            const [groupValue, groupEnd] = getCaptureReplacement(replacement, index + 1, match);
            append(groupValue);
            index = groupEnd;
            continue;
        }

        const caseConversions = getCaseConversions(escape, conversion, nextConversion);
        if (caseConversions === undefined) {
            append(escapedReplacementCharacters[escape] ?? escape);
        } else {
            [conversion, nextConversion] = caseConversions;
        }

        index += 2;
    }

    return result;
}
