# Social Profile URL Parser

`social-profile-url-parser` extracts social profile URLs and usernames from plain text.

It works in both Node.js and browser environments, has no runtime dependencies, and ships with regex patterns sourced from Wikidata.

## Install

```bash
pnpm add social-profile-url-parser
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
//     username: 'jack',
//     groups: ['jack']
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

Each pattern's `P8967` (URL match replacement value) qualifier controls how capture groups form the username. Non-default values are stored in `urlPatternReplacements`, keyed by the pattern; omitted values default to `\1`.

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

For development, use pnpm 11.7.0 (pinned in `package.json`) with Node.js 22.13 or newer. ESLint 10 uses `eslint.config.mjs`; the lint plugins require Node.js 22 or newer. CI uses standalone pnpm to test multiple Node.js versions and runs lint on Node.js 24.

```bash
pnpm install --frozen-lockfile
pnpm build
pnpm lint
pnpm test
```

Use `pnpm collect` to refresh the Wikidata patterns. Commit `pnpm-lock.yaml` when changing dependencies; `pnpm-workspace.yaml` allows the required dependency build scripts.

Issues and pull requests are welcome. For URL matching problems, please include concrete examples and preferably a Wikidata reference/update link.

## API

### `parser(inputText: string): ParseResult[]`

Parses a string and returns all recognized social profile matches.

- Matches are deduplicated by `type + username`.
- `username` is assembled using the pattern's P8967 replacement, defaulting to the first capture group (`\1`). For example, `\1:\3` joins groups 1 and 3 with a colon.
- `groups` contains every capture group in order (group 1 at index 0), with `undefined` for unmatched optional groups. Unmatched groups contribute an empty string to the username.
- If a pattern has no capture groups, the full matched URL is returned as `username`.

```ts
type ParseResult = {
  type: string;
  name: string;
  url: string;
  username: string;
  groups: Array<string | undefined>;
};
```

Example:

```js
import { parser } from "social-profile-url-parser";

const result = parser("See https://twitter.com/jack for details");
// [{ type: 'P2002', name: 'X username', url: 'https://twitter.com/jack', username: 'jack', groups: ['jack'] }]
```

### `regexes: RegexDefinition[]`

Compiled regex definitions loaded from `data/properties.json`.

```ts
type RegexDefinition = {
  type: string;
  name: string;
  regex: RegExp;
  replacement?: string;
};
```
