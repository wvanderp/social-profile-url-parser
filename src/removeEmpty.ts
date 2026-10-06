/**
 * Remove properties with undefined values in place, including in nested objects.
 * @see https://stackoverflow.com/a/38340374
 * @param object - The object to clean.
 * @returns The same object after removing undefined properties.
 */
export default function removeEmpty<T>(object: T): T {
    const mutableObject = object as Record<string, unknown>;

    for (const key of Object.keys(mutableObject)) {
        const value = mutableObject[key];

        if (value && typeof value === 'object') {
            removeEmpty(value as Record<string, unknown>);
        } else if (value === undefined) {
            delete mutableObject[key];
        }
    }

    return object;
}
