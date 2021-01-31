# social-profile-url-parser

Node library to parse social profile urls out of text.

# Documentation
<a name="parser"></a>

## parser(inputText) ⇒ <code>Array.&lt;ParseResult&gt;</code>
**Kind**: global function  
**Returns**: <code>Array.&lt;ParseResult&gt;</code> - an array with all the found social links  

| Param | Type | Description |
| --- | --- | --- |
| inputText | <code>string</code> | the input text that will be parsed. |

**Example**  
```jsimport parser from 'social-profile-url-parser';const result = parser(`   slack   facebook    https://www.facebook.com/slackhq/   SlackHQ twitter     https://twitter.com/SlackHQ`)result === [    {        type: 'facebook',        name: 'Facebook',        username: 'slack',        url: 'https://www.facebook.com/slackhq/'    },    {       type: 'twitter',       name: 'Twitter',       username: 'SlackHQ',       url: 'https://twitter.com/SlackHQ'   }];```
