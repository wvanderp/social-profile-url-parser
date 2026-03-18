# Changelog

## V2.1.0

- Changed to tsdown for building the package
- updated the regexes from Wikidata
- Added tests to validate the regexes, fixed non-compliant regexes

## V2.0.0

Moved over to getting the regexes from Wikidata, which allows us to support many more platforms and also makes it easier to maintain the dataset in the future. This is a breaking change since some regexes have been updated to be more accurate, which may cause some previously supported URLs to no longer match.
