# Social Profile URL Parser

`social-profile-url-parser` extracts social profile URLs and identifiers (usernames, IDs, codes) from plain text.

It works in both Node.js and browser environments, has no runtime dependencies, and ships with regex patterns sourced from Wikidata.

## Install

```bash
pnpm add social-profile-url-parser
```

## Usage (Node.js)

```js
import { parse } from "social-profile-url-parser";

const text =
  "Find me at https://twitter.com/jack and https://github.com/octocat";
const results = parse(text);

console.log(results);
// [
//   {
//     propertyId: 'P2002',
//     name: 'X (Twitter) username',
//     url: 'https://twitter.com/jack',
//     identifier: 'jack',
//     groups: ['jack'],
//     urlFormatter: 'https://x.com/$1',
//     formattedUrl: 'https://x.com/jack'
//   },
//   ...
// ]
```

## Usage (Browser, no bundler)

You can use an ESM CDN to run this package directly in the browser.

```html
<script type="module">
  import { parse } from "https://esm.sh/social-profile-url-parser";

  const text = "https://www.instagram.com/zuck/";
  console.log(parse(text));
</script>
```

## Data source: Wikidata regex patterns

The URL regex patterns are collected from Wikidata property `P8966` (URL match pattern). `pnpm collect` writes two files:

- `data/properties.raw.json` — everything collected from Wikidata, including labels, descriptions, aliases, and repeated statements. The data tests in `test/data` run against this file.
- `data/properties.compiled.json` — only the fields the runtime uses (`property`, `propertyLabel`, `urlFormatter`, `urlPatterns`), with repeated patterns removed. This file is bundled into `lib`.

Run `pnpm compile-data` to rebuild the compiled file from the raw file without querying Wikidata.

Each pattern's `P8967` (URL match replacement value) qualifier controls how capture groups form the identifier. Values are stored alongside each pattern in `urlPatterns[].replacement`; omitted values default to `\1`.

URL formatter templates come from [Wikidata P1630](https://www.wikidata.org/wiki/Property:P1630). Collection selects the preferred-rank formatter, or a normal-rank formatter if none is preferred, and excludes deprecated statements. If several share the best rank, the first in alphabetical URL order is used. The selected template is stored in `urlFormatter`.

This library intentionally does **not** maintain custom regex fixes in code. If a pattern is wrong, the long-term fix should happen on Wikidata.

## Missing URL or incorrect match

If a URL is not detected or is detected incorrectly:

1. Open an issue in this repository with an example URL.
2. Optionally (and preferred), fix the pattern on Wikidata first.
3. Then open/update the GitHub issue so we can refresh the data files and publish the update.

This keeps fixes upstream so everyone using Wikidata-backed tooling benefits.

## Exports

- `parse(inputText: string): ParseResult[]` — parse social profile URLs from text.
- `regexes: RegexDefinition[]` — compiled regex definitions loaded from `data/properties.compiled.json`.
- `formatUrl(propertyId: string, identifier: string): string | undefined` — build a profile URL using the property's selected Wikidata formatter.

## Support the project

For development, use pnpm 11.7.0 (pinned in `package.json`) with Node.js 22.13 or newer. ESLint 10 uses `eslint.config.mjs`; the lint plugins require Node.js 22 or newer. CI uses standalone pnpm to test multiple Node.js versions and runs lint on Node.js 24.

```bash
pnpm install --frozen-lockfile
pnpm build
pnpm lint
pnpm test
```

Tests in `test/library` check the functions in `src`, including the `parse` fixtures in `test/library/cases`. Tests in `test/data` validate the collected Wikidata patterns and formatters in `data/properties.raw.json`, and check that `data/properties.compiled.json` is up to date. Run `pnpm test` to run all tests.

Use `pnpm collect` to refresh the Wikidata patterns. Commit `pnpm-lock.yaml` when changing dependencies; `pnpm-workspace.yaml` allows the required dependency build scripts.

Issues and pull requests are welcome. For URL matching problems, please include concrete examples and preferably a Wikidata reference/update link.

## API

### `parse(inputText: string): ParseResult[]`

Parses a string and returns all recognized social profile matches.

- Matches are deduplicated by `propertyId + identifier`.
- `identifier` is assembled using the pattern's P8967 replacement, defaulting to the first capture group (`\1`). For example, `\1:\3` joins groups 1 and 3 with a colon.
- `groups` contains every capture group in order (group 1 at index 0), with `undefined` for unmatched optional groups. Unmatched groups contribute an empty string to the identifier.
- If a pattern has no capture groups, the full matched URL is returned as `identifier`.
- When a formatter is available, `urlFormatter` contains its template and `formattedUrl` contains the template with every `$1` replaced by the assembled identifier. `url` still contains the original matched text. Both optional fields are omitted when there is no formatter.

```ts
type ParseResult = {
  propertyId: string; // Wikidata property ID, e.g. 'P2002'
  name: string;
  url: string;
  identifier: string;
  groups: Array<string | undefined>;
  urlFormatter?: string;
  formattedUrl?: string;
};
```

Example:

```js
import { parse } from "social-profile-url-parser";

const result = parse("See https://twitter.com/jack for details");
// [{ propertyId: 'P2002', name: 'X (Twitter) username', url: 'https://twitter.com/jack', identifier: 'jack', groups: ['jack'], urlFormatter: 'https://x.com/$1', formattedUrl: 'https://x.com/jack' }]
```

### `formatUrl(propertyId: string, identifier: string): string | undefined`

Builds a URL from a Wikidata property ID and identifier, using the collected P1630 template. Returns `undefined` for an unknown property or one without a formatter. Identifiers are substituted literally without additional URL encoding, so existing encoded identifiers and identifiers containing path separators are preserved.

```js
import { formatUrl } from "social-profile-url-parser";

formatUrl("P2002", "jack"); // 'https://x.com/jack'
formatUrl("P2037", "octocat"); // 'https://github.com/octocat'
```

### `regexes: RegexDefinition[]`

Compiled regex definitions loaded from `data/properties.compiled.json`.

```ts
type RegexDefinition = {
  propertyId: string;
  name: string;
  regex: RegExp;
  replacement?: string;
  urlFormatter?: string;
};
```
