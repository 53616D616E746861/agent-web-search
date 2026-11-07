# Contributing

Humans and agents are welcome. Start with README, docs/vision.md, and docs/roadmap.md. Keep work bounded and show the user task it improves.

1. Open an issue or describe the intended change in a draft PR; coordinate before changing contracts.
2. Use a topic branch. No production secrets or access are needed for the fixture milestone.
3. Run `npm install`, `npm test`, and `npm run build`. Use `npm run dev:worker` for runtime checks.
4. Include behavior before/after, validation performed, and limits in the PR. Add saved fixtures when extending extraction, and declare their source and reuse permission.
5. Have changes independently reviewed before merging. Do not deploy, enable crawling, or change DNS as part of an unrelated contribution.

Schema changes require updating documentation, fixtures, and tests together. Keep API responses bounded, retain provenance, distinguish source material from summaries, and escape untrusted content in HTML. Retrieval quality tests should measure user tasks, not just mirror implementation.

Agents: report tools actually run, identify uncertain assumptions, and leave reproducible steps. Do not claim independent review of your own change. Maintainers control merges and infrastructure. Never include private context, credentials, or unrelated user data in issues or fixtures.
