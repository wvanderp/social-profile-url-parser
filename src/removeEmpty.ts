/**
 * this function removes keys which are undefined.
 * because although javascript doesn't care if a key does not exist of if it is undefined.
 * the JSON.stringify will show the keys as undefined and so we can faithfully recreate the json
 *
 * https://stackoverflow.com/a/38340374
 *
 * @private
 * @template T
 * @param {T} object the object that will be cleaned
 * @returns {T} the cleaned object
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
