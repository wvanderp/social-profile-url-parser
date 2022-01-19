"use strict";
exports.__esModule = true;
exports.regexes = void 0;
exports.regexes = [
    { type: 'aboutme', name: 'About.me', regex: /https?:\/\/(www\.)?about\.me\/([^\n /]+)/gi },
    { type: 'angellist', name: 'AngelList', regex: /https?:\/\/(www\.)?angel\.co\/([^\n /]+)/gi },
    { type: 'behance', name: 'Behance', regex: /https?:\/\/(www\.)?behance\.(com|net)\/([^\n /]+)/gi },
    { type: 'blogger', name: 'Blogger', regex: /https?:\/\/(www\.)?blogger\.com\/profile\/([^\n /]+)/gi },
    { type: 'crunchbase', name: 'CrunchBase', regex: /https?:\/\/(www\.)?crunchbase\.com\/(person|company|organization)\/([^\n /]+)/gi },
    { type: 'digg', name: 'Digg', regex: /https?:\/\/(www\.)?digg\.com\/users\/([^\n /]+)/gi },
    { type: 'dribbble', name: 'Dribbble', regex: /https?:\/\/(www\.)?dribbble\.com\/([^\n /]+)/gi },
    { type: 'facebook', name: 'Facebook', regex: /https?:\/\/([_a-z]{0,3}\.|[_a-z]{2}-[_a-z]{2}\.)?(facebook|fb)\.com\/(groups\/)?([^\n /]+)/gi },
    { type: 'flickr', name: 'Flickr', regex: /https?:\/\/(www\.)?flickr\.com\/(people|photos|groups)\/([^\n /]+)/gi },
    { type: 'foursquare', name: 'Foursquare', regex: /https?:\/\/(www\.)?foursquare\.com\/(?!user)([^\n /]+)/gi },
    { type: 'github', name: 'GitHub', regex: /https?:\/\/(www\.)?github\.com\/([^\n /]+)/gi },
    { type: 'googleplus', name: 'GooglePlus', regex: /https?:\/\/plus\.google\.com\/\+?([^\n /]+)/gi },
    { type: 'gravatar', name: 'Gravatar', regex: /https?:\/\/([_a-z]{0,3}\.)?gravatar\.com\/([^\n /]+)/gi },
    { type: 'instagram', name: 'Instagram', regex: /https?:\/\/(www\.)?instagram\.com\/([^\n /]+)/gi },
    { type: 'keybase', name: 'Keybase', regex: /https?:\/\/(www\.)?keybase\.io\/([^\n /]+)/gi },
    { type: 'klout', name: 'Klout', regex: /https?:\/\/(www\.)?klout\.com\/([^\n /]+)/gi },
    { type: 'lastfm', name: 'Last.FM', regex: /https?:\/\/(www\.)?(last\.fm|lastfm\.com)\/user\/([^\n /]+)/gi },
    { type: 'linkedin', name: 'LinkedIn', regex: /https?:\/\/([_a-z]{0,3}\.)?linkedin\.com\/(((sales\/)?(in|pub|people|company|companies|organization|edu|school|groups)\/)|(profile\/view\?id=[a-z]))([^\n ]+)/gi },
    { type: 'medium', name: 'Medium', regex: /https?:\/\/(www\.)?medium\.com\/@?([^\n /]+)/gi },
    { type: 'myspace', name: 'MySpace', regex: /https?:\/\/(www\.)?myspace\.com\/([^\n /]+)/gi },
    { type: 'ok', name: 'Odnoklassniki', regex: /https?:\/\/(www\.)?ok\.ru\/(profile\/)?([^\n /]+)/gi },
    { type: 'pandora', name: 'Pandora', regex: /https?:\/\/(www\.)?pandora\.com\/people\/([^\n /]+)/gi },
    { type: 'pinterest', name: 'Pinterest', regex: /https?:\/\/([_a-z]{0,3}\.)?pinterest\.[.a-z]+\/([^\n +/]+)/gi },
    { type: 'quora', name: 'Quora', regex: /https?:\/\/(www\.)?quora\.com\/(profile\/)?([^\n /]+)/gi },
    { type: 'reddit', name: 'Reddit', regex: /https?:\/\/(www\.)?reddit\.com\/(user)?(u)?\/([^\n /]+)/gi },
    { type: 'slideshare', name: 'Slideshare', regex: /https?:\/\/(www\.)?slideshare\.net\/([^\n /]+)/gi },
    { type: 'tiktok', name: 'Tiktok', regex: /https?:\/\/(www\.)?tiktok.com\/@([^\n /]+)/gi },
    { type: 'tumblr', name: 'Tumblr', regex: /https?:\/\/([\da-z]+)\.tumblr\.com/gi },
    { type: 'twitter', name: 'Twitter', regex: /https?:\/\/((www|mobile)\.)?twitter\.com\/([^\n /]+)/gi },
    { type: 'vimeo', name: 'Vimeo', regex: /https?:\/\/(www\.)?vimeo\.com\/([^\n /]+)/gi },
    { type: 'vk', name: 'VK', regex: /https?:\/\/(www\.)?vk\.com\/([^\n /]+)/gi },
    { type: 'wordpress', name: 'Wordpress', regex: /https?:\/\/(?!subscribe)([\da-z]+)\.wordpress\.com/gi },
    { type: 'xing', name: 'Xing', regex: /https?:\/\/(www\.)?xing\.com\/(profile\/)([^\n /]+)/gi },
    { type: 'yahoo', name: 'Yahoo', regex: /https?:\/\/((profile|me|local)\.)?yahoo\.com\/([^\n /]+)/gi },
    { type: 'youtube', name: 'YouTube', regex: /https?:\/\/([_a-z]{0,3}\.)?youtube\.com\/(user\/|channel\/|c\/)?([^\n /]+)/gi }
];
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
function parser(inputText) {
    var resultsMap = [];
    exports.regexes.forEach(function (regex) {
        var result;
        // eslint-disable-next-line no-cond-assign
        while ((result = regex.regex.exec(inputText)) !== null) {
            var username = result[result.length - 1];
            resultsMap.push({
                type: regex.type,
                name: regex.name,
                url: result[0],
                username: username
            });
        }
    });
    return resultsMap;
}
exports["default"] = parser;
//# sourceMappingURL=index.js.map