export declare const regexes: {
    type: string;
    name: string;
    regex: RegExp;
}[];
/**
 * return format for the parser.
 */
export interface ParseResult {
    /** which social media site was selected */
    type: string;
    /** the formatted name of the site */
    name: string;
    /** the username found in the url */
    username: string;
    /** the url in which the username was found */
    url: string;
}
/**
 * @param {string} inputText the input text that will be parsed.
 * @returns {Array<ParseResult>} an array with all the found social links
 * @example
 * ```js
 * import parser from 'social-profile-url-parser';
 *
 * const result = parser(`
 *    slack   facebook    https://www.facebook.com/slackhq/
 *    SlackHQ twitter     https://twitter.com/SlackHQ
 * `)
 *
 * result === [
 *     {
 *         type: 'facebook',
 *         name: 'Facebook',
 *         username: 'slack',
 *         url: 'https://www.facebook.com/slackhq/'
 *     },
 *     {
 *        type: 'twitter',
 *        name: 'Twitter',
 *        username: 'SlackHQ',
 *        url: 'https://twitter.com/SlackHQ'
 *    }
 * ];
 * ```
 */
export default function parser(inputText: string): ParseResult[];
