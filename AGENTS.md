Tests should have absolute comparison so compare against a actual value instead of seeing if its not empty. This makes it easier to understand what the expected value is and also makes it easier to debug if the test fails.

---

This lib should work in the browser and in node.

---

This library does not need any dependencies, so it should be possible to use it in a browser without any bundler. It should also work in node without any issues.

---

Any fixes to the regex should be made on Wikidata, it CANT and SHOULD NOT be fixed in the code.
The code just pulls the regex from Wikidata and uses it, if the regex is wrong, then it should be fixed on Wikidata, not in the code.
The agent should give suggestions on how to fix the regex on Wikidata, but it should not fix it in the code, because that would be a temporary fix and would not solve the problem in the long run. The regex should be fixed on Wikidata so that it is correct for everyone who uses it, not just for this specific codebase.

---

Never delete tests, even if they are failing, because they provide valuable information about what is currently not working and what needs to be fixed. If you really want to remove a test, you instruct the human to delete it for you.
