// @ts-nocheck

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
    for (const key of Object.keys(object)) {
        if (object[key] && typeof object[key] === 'object') {
            removeEmpty(object[key]);
        } else if (object[key] === undefined) delete object[key];
    }
    return object;
}
