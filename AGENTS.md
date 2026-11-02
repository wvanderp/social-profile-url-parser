In this project we value tests. For changes to executable code or collected data, first add a test that reproduces the incorrect behavior or data rule violation, then fix the problem so that the test passes.

Tests must verify observable behavior or data correctness, not mirror implementation details. Do not add tests that read pipeline definitions, configuration files, or source code merely to assert specific text, step names, ordering, or command strings. Such assertions do not prove that the intended behavior works.

For pipeline, configuration, and documentation changes, adding a regression test is not mandatory. Use appropriate validation, such as syntax checks, existing tooling, or an actual workflow run when available. A behavior test is useful only if it exercises execution and checks the resulting outcome. If meaningful execution-based validation is unavailable, review the change and state that limitation rather than inventing a test of file contents.

we work with a lot of data that should also be tested, so make sure that you understand the rules of the data and that rules find instances that do not follow the rules, so that we can fix the data and make sure that it is correct.

Tests should have absolute comparison so compare against a actual value instead of seeing if its not empty. This makes it easier to understand what the expected value is and also makes it easier to debug if the test fails.

Maintain meaningful test coverage when changing or removing tests. Tests may be updated, replaced, consolidated, or deleted when they are redundant, obsolete, or test implementation details rather than behavior. Preserve coverage of supported behavior and data rules, and explain any meaningful coverage removed. Do not delete, skip, or weaken a test merely to hide a failure; investigate whether the failure reveals a bug, incorrect data, or an outdated expectation.

---

This lib should work in the browser and in node.

---

This library does not need any dependencies, so it should be possible to use it in a browser without any bundler. It should also work in node without any issues.

---

Any fixes to the regex or formatters should be made on Wikidata, it CANT and SHOULD NOT be fixed in the code.
The code just pulls the regex and formatters from Wikidata and uses them, if they are wrong, then it should be fixed on Wikidata, not in the code.
The agent should give suggestions on how to fix the regex on Wikidata, but it should not fix it in the code, because that would be a temporary fix and would not solve the problem in the long run. The regex should be fixed on Wikidata so that it is correct for everyone who uses it, not just for this specific codebase.
