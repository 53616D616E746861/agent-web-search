# Architecture: shell and next stages

## Implemented

A single ES module Worker imports a tiny synthetic corpus. Its search function returns section-backed results, its API serves manifests and bounded sections, and its HTML renderer uses the same search results. Tests invoke the standard Request/Response handler. A Node adapter supports credential-free local work; Wrangler supplies the actual local Worker runtime and dry-run packaging.

This intentionally uses an in-memory scan, not a scalable database index. The interface is the first experiment. JSON Schemas describe the exchanged records and validate fixtures and responses in tests.

## Proposed, not provisioned

Source registries -> bounded crawl frontier -> fetch/extract -> normalized documents -> index -> query API.

- Workers: query API and human interface.
- D1: source/document metadata, crawl state, initial FTS5 index.
- R2: fetched objects and extracted content, subject to retention and reuse policy.
- Queues: bounded fetch/extraction jobs with idempotency and retry limits.
- Optional later semantic retrieval: evaluate before selecting embeddings or Vectorize.

The scheduler must coordinate request rates per host across concurrent consumers. Respect robots rules, explicit exclusions, redirects, response sizes, timeouts, and retry budgets. Protect against private-network destinations and unbounded URL spaces. Discovery can record off-site links for review without immediately crawling them. Scheduled work needs an operator pause switch and hard budgets before being enabled.

Query handling must not initiate live crawls. Swap the search implementation behind the API when adding persistence. Evaluate index quality before broadening corpus scope.

## Integration with Kit

Import a versioned copy of registry records with original publisher, evidence, and observation time. Do not silently treat a site listing as verified authorship for every document. Registry imports should be reproducible and independently reviewable. The shell does not yet fetch Kit's registry.

## Decisions still open

Document-level authorship eligibility, mixed/unknown filters, content reuse and removal, multilingual tokenization, archive policy, section extraction, production pagination snapshots, and query logging policy. Changes to these are product decisions, not incidental extractor details.

## References

- https://developers.cloudflare.com/workers/wrangler/configuration/
- https://developers.cloudflare.com/d1/sql-api/sql-statements/
- https://developers.cloudflare.com/queues/
- https://developers.cloudflare.com/r2/
