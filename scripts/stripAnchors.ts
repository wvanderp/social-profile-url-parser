/**
 * Removes the leading `^` and an unescaped trailing `$` so the pattern can match inside text.
 * @param pattern - The Wikidata URL match pattern.
 * @returns The pattern without its start and end anchors.
 */
function stripAnchors(pattern: string): string {
    let result = pattern.startsWith('^') ? pattern.slice(1) : pattern;

    if (result.endsWith('$')) {
        let backslashes = 0;
        for (let index = result.length - 2; index >= 0 && result[index] === '\\'; index -= 1) {
            backslashes += 1;
        }

        // an odd number of backslashes means the `$` is escaped and must be kept
        if (backslashes % 2 === 0) {
            result = result.slice(0, -1);
        }
    }

    return result;
}

export default stripAnchors;
