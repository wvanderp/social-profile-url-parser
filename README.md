# Social Profile URL Parser

`social-profile-url-parser` extracts social profile URLs and usernames from plain text.

It works in both Node.js and browser environments, has no runtime dependencies, and ships with regex patterns sourced from Wikidata.

## Install

```bash
npm install social-profile-url-parser
```

## Usage (Node.js)

```js
import { parser } from 'social-profile-url-parser';

const text = 'Find me at https://twitter.com/jack and https://github.com/octocat';
const results = parser(text);

console.log(results);
// [
//   {
//     type: 'P2002',
//     name: 'X username',
//     url: 'https://twitter.com/jack',
//     username: 'jack'
//   },
//   ...
// ]
```

## Usage (Browser, no bundler)

You can use an ESM CDN to run this package directly in the browser.

```html
<script type="module">
	import { parser } from 'https://esm.sh/social-profile-url-parser';

	const text = 'https://www.instagram.com/zuck/';
	console.log(parser(text));
</script>
```

## Data source: Wikidata regex patterns

The URL regex patterns are collected from Wikidata property `P8966` (URL match pattern) and stored in `data/properties.json`.

This library intentionally does **not** maintain custom regex fixes in code. If a pattern is wrong, the long-term fix should happen on Wikidata.

## Missing URL or incorrect match

If a URL is not detected or is detected incorrectly:

1. Open an issue in this repository with an example URL.
2. Optionally (and preferred), fix the pattern on Wikidata first.
3. Then open/update the GitHub issue so we can refresh `data/properties.json` and publish the update.

This keeps fixes upstream so everyone using Wikidata-backed tooling benefits.

## Exports

- `parser(inputText: string): ParseResult[]` — parse social profile URLs from text.
- `regexes: RegexDefinition[]` — compiled regex definitions loaded from `data/properties.json`.

## Support the project

Issues and pull requests are welcome. For URL matching problems, please include concrete examples and preferably a Wikidata reference/update link.

## Documentation

<a name="parser"></a>

## parser(inputText) ⇒ <code>Array.&lt;ParseResult&gt;</code>
**Kind**: global function  
**Returns**: <code>Array.&lt;ParseResult&gt;</code> - an array with all the found matches  

| Param | Type | Description |
| --- | --- | --- |
| inputText | <code>string</code> | the input text that will be parsed. |

**Example**  
```js
import { parser } from 'social-profile-url-parser';

const result = parser('See https://twitter.com/jack for details');
```
