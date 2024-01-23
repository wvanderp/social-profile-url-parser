import removeEmpty from './removeEmpty';

interface RegexObject {
    type: string; // a all lowercase no space name of the social media site
    name: string; // the formatted official name of the social media site
    regex: RegExp; // the regex that will be used to find the username
    deprecated?: boolean; // if the social media site is deprecated (like shutdown or rebranded)
}

export const regexes: RegexObject[] = [
    { type: 'aboutme', name: 'About.me', regex: /https?:\/\/(?:www\.)?about\.me\/([^\n "/]+)/gi },
    { type: 'angellist', name: 'AngelList', regex: /https?:\/\/(?:www\.)?angel\.co\/([^\n "/]+)/gi },
    { type: 'behance', name: 'Behance', regex: /https?:\/\/(?:www\.)?behance\.(com|net)\/([^\n "/]+)/gi },
    { type: 'blogger', name: 'Blogger', regex: /https?:\/\/(?:www\.)?blogger\.com\/profile\/([^\n "/]+)/gi },
    { type: 'crunchbase', name: 'CrunchBase', regex: /https?:\/\/(?:www\.)?crunchbase\.com\/(person|company|organization)\/([^\n "/]+)/gi },
    { type: 'digg', name: 'Digg', regex: /https?:\/\/(?:www\.)?digg\.com\/users\/([^\n "/]+)/gi },
    { type: 'dribbble', name: 'Dribbble', regex: /https?:\/\/(?:www\.)?dribbble\.com\/([^\n "/]+)/gi },
    { type: 'flickr', name: 'Flickr', regex: /https?:\/\/(?:www\.)?flickr\.com\/(people|photos|groups)\/([^\n "/]+)/gi },
    { type: 'foursquare', name: 'Foursquare', regex: /https?:\/\/(?:www\.)?foursquare\.com\/(?!user)([^\n "/]+)/gi },

    // github
    { type: 'github', name: 'GitHub', regex: /https?:\/\/(?:www\.)?github\.com\/([^\n "/]+)/gi },
    // todo gist

    // google
    {
        type: 'googleplus', name: 'Google Plus', regex: /https?:\/\/plus\.google\.com\/\+?([^\n "/]+)/gi, deprecated: true,
    },
    { type: 'youtube', name: 'YouTube', regex: /https?:\/\/([_a-z]{0,3}\.)?youtube\.com\/(user\/|channel\/|c\/)?([^\n "/]+)/gi },

    // facebook
    { type: 'instagram', name: 'Instagram', regex: /https?:\/\/(?:www\.)?instagram\.com\/([^\n "/]+)/gi },
    { type: 'facebook', name: 'Facebook', regex: /https?:\/\/([_a-z]{0,3}\.|[_a-z]{2}-[_a-z]{2}\.)?(facebook|fb)\.com\/(groups\/)?([^\n "/]+)/gi },
    // whatsapp
    // https://faq.whatsapp.com/5913398998672934/?locale=nl_NL
    { type: 'whatsapp', name: 'WhatsApp', regex: /(?:https?:\/\/)?(?:www\.)?wa\.me\/(\d+)/gi },

    { type: 'gravatar', name: 'Gravatar', regex: /https?:\/\/([_a-z]{0,3}\.)?gravatar\.com\/([^\n "/]+)/gi },
    { type: 'keybase', name: 'Keybase', regex: /https?:\/\/(?:www\.)?keybase\.io\/([^\n "/]+)/gi },
    { type: 'klout', name: 'Klout', regex: /https?:\/\/(?:www\.)?klout\.com\/([^\n "/]+)/gi },
    { type: 'lastfm', name: 'Last.FM', regex: /https?:\/\/(?:www\.)?(last\.fm|lastfm\.com)\/user\/([^\n "/]+)/gi },
    { type: 'linkedin', name: 'LinkedIn', regex: /https?:\/\/([_a-z]{0,3}\.)?linkedin\.com\/(((sales\/)?(in|pub|people|company|companies|organization|edu|school|groups)\/)|(profile\/view\?id=[a-z]))([^\n ]+)/gi },
    { type: 'medium', name: 'Medium', regex: /https?:\/\/(?:www\.)?medium\.com\/@?([^\n "/]+)/gi },
    { type: 'myspace', name: 'MySpace', regex: /https?:\/\/(?:www\.)?myspace\.com\/([^\n "/]+)/gi },
    { type: 'ok', name: 'Odnoklassniki', regex: /https?:\/\/(?:www\.)?ok\.ru\/(profile\/)?([^\n "/]+)/gi },

    // TODO: Find real life example
    { type: 'pandora', name: 'Pandora', regex: /https?:\/\/(?:www\.)?pandora\.com\/people\/([^\n "/]+)/gi },

    { type: 'pinterest', name: 'Pinterest', regex: /https?:\/\/([_a-z]{0,3}\.)?pinterest\.[.a-z]+\/([^\n +/]+)/gi },
    { type: 'quora', name: 'Quora', regex: /https?:\/\/(?:www\.)?quora\.com\/(profile\/)?([^\n "/]+)/gi },

    // reddit
    { type: 'reddit', name: 'Reddit', regex: /https?:\/\/(?:www\.)?reddit\.com\/(user)?(u)?\/([^\n "/]+)/gi },
    { type: 'subreddit', name: 'subreddit', regex: /https?:\/\/www\.?reddit\.com\/r\/?([a-z]+)\/?/gi },

    { type: 'slideshare', name: 'Slideshare', regex: /https?:\/\/(?:www\.)?slideshare\.net\/([^\n "/]+)/gi },
    { type: 'tiktok', name: 'Tiktok', regex: /https?:\/\/(?:www\.)?tiktok.com\/@([^\n "/]+)/gi },
    { type: 'tumblr', name: 'Tumblr', regex: /https?:\/\/([\da-z]+)\.tumblr\.com/gi },
    { type: 'twitter', name: 'Twitter', regex: /https?:\/\/((www|mobile)\.)?(twitter|x)\.com\/([^\n "/]+)/gi },
    { type: 'vimeo', name: 'Vimeo', regex: /https?:\/\/(?:www\.)?vimeo\.com\/([^\n "/]+)/gi },
    { type: 'vk', name: 'VK', regex: /https?:\/\/(?:www\.)?vk\.com\/([^\n "/]+)/gi },
    { type: 'wordpress', name: 'Wordpress', regex: /https?:\/\/(?!subscribe)([\da-z]+)\.wordpress\.com/gi },
    { type: 'xing', name: 'Xing', regex: /https?:\/\/(?:www\.)?xing\.com\/(profile\/)([^\n "/]+)/gi },
    { type: 'yahoo', name: 'Yahoo', regex: /https?:\/\/((profile|me|local)\.)?yahoo\.com\/([^\n "/]+)/gi },

    // yelp
    { type: 'yelpUser', name: 'Yelp User', regex: /https?:\/\/(www\.)?yelp\.[a-z]+\/user_details\?userid=([\da-z-]+)/gi },
    { type: 'yelpBusiness', name: 'Yelp Business', regex: /https?:\/\/www\.?yelp\.[a-z]+\/biz\/([\da-z-]+)/gi },

    // amazon (not a social media site, but it's a profile)
    { type: 'amazonWishlist', name: 'Amazon wishlist', regex: /https?:\/\/www\.?amazon\.[a-z]+\/gp\/?registry\/?wishlist\/?([^\n "/]+)/gi },

    // weibo
    { type: 'weibo', name: 'Weibo', regex: /https?:\/\/(?:www\.)?weibo\.com\/(u\/)?([^\n "/]+)/gi },

    // Steam
    { type: 'steam', name: 'Steam', regex: /https?:\/\/(?:www\.)?steamcommunity\.com\/(id|profiles)\/([^\n "/]+)/gi },

    // WeChat
    { type: 'wechat', name: 'WeChat', regex: /https?:\/\/(?:www\.)?open\.weixin\.qq\.com\/qr\/code\?username=([^\n "/]+)|weixin:\/\/dl\/chat\?([^\n "/]+)/gi },

    // Telegram
    { type: 'telegram', name: 'Telegram', regex: /https?:\/\/(?:www\.)?(?:(?:t|telegram)\.me\/|telegram\.dog\/|web\.telegram\.org\/[ak]\/#@?)([^\n "/]+)/gi },

    // Snapchat
    { type: 'snapchat', name: 'Snapchat', regex: /https?:\/\/(?:www\.)?snapchat\.com\/add\/([^\n "/]+)/gi },

    // Douyin
    { type: 'douyin', name: 'Douyin', regex: /https?:\/\/(?:www\.)?douyin\.com\/user\/([^\n "/]+)/gi },

    // Kuaishou
    { type: 'kuaishou', name: 'Kuaishou', regex: /https?:\/\/(?:www\.)?kuaishou\.com\/profile\/([^\n "/]+)/gi },

    // Tencent qq
    { type: 'qq', name: 'QQ', regex: /https?:\/\/user\.qzone\.qq\.com\/([1-9]\d*)/gi },

    // Spotify
    { type: 'spotifyUser', name: 'Spotify User', regex: /https?:\/\/(?:www\.)?open\.spotify\.com\/user\/([^\n "/]+)/gi },
    { type: 'spotifyArtist', name: 'Spotify Artist', regex: /https?:\/\/(?:open|play)\.spotify\.com\/artist\/([0-7][\da-z]{21})|spotify:artist:([0-7][\da-z]{21})|https?:\/\/shop.spotify.com\/[a-z]{2}\/artist\/([0-7][\da-z]{21})\/(?:store)?/gi },

    // coinbase
    // 'coinbase': /https?:\/\/(www\.)?coinbase\.com\/([^\n "/]+)/ig,

    // delicious (deprecated)
    // 'delicious': /https?:\/\/(www\.)?delicious\.com\/([^\n "/]+)/ig,

    // plancast
    // Trakt
    // Twitch
    // Shopify
    // Ebay
    // Slack
    // Basecamp
    // ProductHunt
    // SoundCloud
    // BitBucket
    // CashMe
    // DailyMotion
    // Disqus
    // Photobucket
    // Fanpop
    // deviantART
    // Instructables
    // Kongregate
    // LiveJournal
    // Mix
    // Tripit
    // PayPal
    // Flipboard
    // icq
    // Kik
    // Codecademy
    // Roblox
    // Pastebin
    // Ello
    // IFTTT
    // Fiverr
    // Hackernews
    // Houzz
    // Contently
    // BuzzFeed
    // HubPages
    // Venmo
    // Bandcamp
    // Wikia
    // ReverbNation
    // Wattpad
    // Designspiration
    // EyeEm
    // Kano World
    // Ask FM
    // Newgrounds
    // Younow
    // Patreon
    // Minecraft
    // GitLab
    // Bitbucket
];

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
    /** deprecation warning of the site */
    deprecated?: boolean;
}

/**
 * @param {string} inputText the input text that will be parsed.
 * @returns {ParseResult[]} an array with all the found social links
 * @example
 * ```js
 * import { parser } from 'social-profile-url-parser';
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
export function parser(inputText: string): ParseResult[] {
    const resultsMap: Array<ParseResult> = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const regex of regexes) {
        let result;
        // eslint-disable-next-line no-cond-assign
        while ((result = regex.regex.exec(inputText)) !== null) {
            // filter out empty results
            const filteredResult = result.filter((item) => item !== undefined);

            const username = filteredResult.at(-1);

            if (!username) {
                continue;
            }

            resultsMap.push(removeEmpty({
                type: regex.type,
                name: regex.name,
                url: result[0],
                username,
                deprecated: regex.deprecated,
            }));
        }
    }

    return resultsMap;
}
