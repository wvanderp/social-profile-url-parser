# releasing this package

To release a new version of the package, follow these steps:

1. Update the version number in `package.json` according to semantic versioning (e.g., from `1.0.0` to `1.1.0` for a minor update, or to `2.0.0` for a major update).
2. Create a new entry in `CHANGELOG.md` for the new version, describing the changes made since the last release. Be sure to include any breaking changes if applicable.
3. Commit the changes to the repository with a message like "Release version X.Y.Z".
4. Push the changes to the remote repository.
5. Create a new tag for the new version using GitHub
6. This will trigger the GitHub Actions workflow to publish the new version to npm.
