# Social Profile URL Parser

The `Social Profile URL Parser` is a Node.js library that allows you to extract social media profile URLs from a block of text. It is useful for situations where you have a large amount of text that contains multiple social media profile links and you want to extract and organize them in a structured way.

To use the library, you can simply pass in a string of text and the library will return an array of objects containing the social media platform name, profile URL, and username for each link found. You can also specify which platforms you want to extract links for by passing in an array of platform names.

The library supports a wide range of popular social media platforms, including Facebook, Twitter, Instagram, LinkedIn, and more. It is easy to use and can save you a lot of time and effort when working with large amounts of text containing social media profile links.

## Support the project

There are many ways you can contribute to the development and improvement of the Social Profile URL Parser library. One way is by submitting code changes and bug fixes through pull requests.
Your pull request will be reviewed by the project maintainers and, if accepted, will be merged into the main codebase.

Another way you can support the project is by providing feedback and suggestions. You can do this by opening an issue in the repository and describing your suggestion or problem. This allows the maintainers to track and address your feedback in a structured way.

## Documentation

<a name="parser"></a>

## parser(inputText) ⇒ <code>Array.&lt;ParseResult&gt;</code>
**Kind**: global function  
**Returns**: <code>Array.&lt;ParseResult&gt;</code> - an array with all the found social links  

| Param | Type | Description |
| --- | --- | --- |
| inputText | <code>string</code> | the input text that will be parsed. |

**Example**  
```jsimport parser from 'social-profile-url-parser';const result = parser(`   slack   facebook    https://www.facebook.com/slackhq/   SlackHQ twitter     https://twitter.com/SlackHQ`)result === [    {        type: 'facebook',        name: 'Facebook',        username: 'slack',        url: 'https://www.facebook.com/slackhq/'    },    {       type: 'twitter',       name: 'Twitter',       username: 'SlackHQ',       url: 'https://twitter.com/SlackHQ'   }];```
