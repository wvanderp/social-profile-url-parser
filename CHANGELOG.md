# Changelog

## V3.0.0

This is a big upgrade we now use wikidatas own formatting rules to format the urls, so now if a identifier is in two parts or you just need the url this liberary will now help you with that. This is a breaking change since some regexes have been updated to be more accurate, which may cause some previously supported URLs to no longer match.

- Added support for Wikidata P8967 replacement values, including identifiers assembled from multiple regex capture groups
- Added URL formatter templates from Wikidata P1630
- Added the `formatUrl` function for creating profile URLs from a property ID and identifier
- Added `groups`, `urlFormatter`, and `formattedUrl` fields to parser results
- Updated Wikidata collection to use best-ranked patterns and formatters with deterministic ordering
- Split the collected data into `data/properties.raw.json` (everything from Wikidata, used by the data tests) and `data/properties.compiled.json` (only runtime fields, duplicate patterns removed, bundled into `lib`)
- Stopped publishing the data file separately, since it is already bundled into `lib`
- Improved parser handling for patterns without capture groups and zero-length matches
- Migrated development tooling and lockfiles from npm to pnpm
- Reorganized and expanded the library and Wikidata data test suites
- Updated the documentation, CI workflows, lint configuration, and release instructions

### Breaking API renames

- `parser()` is now `parse()`
- `ParseResult.type` and `RegexDefinition.type` are now `propertyId`, since they hold the Wikidata property ID (for example `P2002`)
- `ParseResult.username` is now `identifier`, since many properties match identifiers that are not usernames (ISBNs, DOIs, drug codes)
- `formatUrl(type, username)` parameters are now named `formatUrl(propertyId, identifier)`

## V2.1.0

- Changed to tsdown for building the package
- updated the regexes from Wikidata
- Added tests to validate the regexes, fixed non-compliant regexes

## V2.0.0

Moved over to getting the regexes from Wikidata, which allows us to support many more platforms and also makes it easier to maintain the dataset in the future. This is a breaking change since some regexes have been updated to be more accurate, which may cause some previously supported URLs to no longer match.
