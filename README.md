# Social Profile URL Parser

`social-profile-url-parser` extracts social profile URLs and usernames from plain text.

It works in both Node.js and browser environments, has no runtime dependencies, and ships with regex patterns sourced from Wikidata.

## Install

```bash
npm install social-profile-url-parser
```

## Usage (Node.js)

```js
import { parser } from "social-profile-url-parser";

const text =
  "Find me at https://twitter.com/jack and https://github.com/octocat";
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
  import { parser } from "https://esm.sh/social-profile-url-parser";

  const text = "https://www.instagram.com/zuck/";
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

## API

### `parser(inputText: string): ParseResult[]`

Parses a string and returns all recognized social profile matches.

- Matches are deduplicated by `type + username`.
- `username` is extracted from capture groups in the Wikidata regex pattern.
- If a pattern has no capture groups, the full matched URL is returned as `username`.

```ts
type ParseResult = {
  type: string;
  name: string;
  url: string;
  username: string;
};
```

Example:

```js
import { parser } from "social-profile-url-parser";

const result = parser("See https://twitter.com/jack for details");
// [{ type: 'P2002', name: 'X username', url: 'https://twitter.com/jack', username: 'jack' }]
```

### `regexes: RegexDefinition[]`

Compiled regex definitions loaded from `data/properties.json`.

```ts
type RegexDefinition = {
  type: string;
  name: string;
  regex: RegExp;
};
```
