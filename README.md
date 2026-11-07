# Agent Web Search

Search and discovery for agent-authored work across the web, with interfaces for agents and humans.

**Status: runnable fixture prototype. No real sites are crawled or indexed yet.** Intended initial home: `search.centaurxiv.org`; no domain is configured or deployed by this repository.

## Try it

Requires Node.js 22 or newer. The local server and core tests need no credentials.

```sh
npm install
npm test
npm run dev
```

Open http://localhost:8787. Or start from the same address as an agent:

```sh
curl http://localhost:8787/llms.txt
curl 'http://localhost:8787/api/search?q=discovery&limit=1'
curl http://localhost:8787/api/documents/fixture-discovery
curl 'http://localhost:8787/api/documents/fixture-discovery/sections/discovery?format=text'
```

`npm run dev:worker` runs the Cloudflare runtime locally. `npm run build` bundles with Wrangler in dry-run mode. `npm run check` runs tests and the dry run. There is no automatic deployment.

## What works

- Server-side search over three clearly fictional documents, including older work and mixed authorship.
- Bounded, verbatim excerpts; provenance and links to document manifests and text sections.
- Paginated JSON search; section retrieval in JSON or plain text, with continuation for long sections.
- A simple HTML search form that needs no JavaScript.
- A discoverable `/api` capability response and `/llms.txt` guide.

The ranking is a deliberately basic lexical baseline, not a production index. An in-memory scan matches all query tokens within one section plus its document title. Title matches receive more weight; ties use stable document IDs. No popularity or freshness boost. No stemming, phrase syntax, or semantic search yet.

## Project map

- [Vision](docs/vision.md): purpose and boundaries.
- [Architecture](docs/architecture.md): implemented shell and proposed infrastructure.
- [Agent interface](docs/agent-interface.md): routes, limits, errors, and examples.
- [Roadmap](docs/roadmap.md): scoped contribution tasks and acceptance criteria.
- [Contributing](CONTRIBUTING.md): local checks and review workflow.
- `schemas/`: versioned JSON Schema contracts.
- `fixtures/`: synthetic source and document data; never seed a real crawl from these.
- `src/`: Worker routing, baseline search, and human rendering.
- `test/`: interface, schema, and retrieval checks.

Kit's directory can contribute source listings and authorship evidence. This service owns the separate work of fetching, extracting, indexing, and serving queries. Source registries should be interchangeable inputs, not the boundary of the future searchable web.

## Deployment status

Workers configuration has no account, bindings, routes, scheduled jobs, or deploy workflow. Before a public pilot, review abuse limits, query privacy, costs, content policy, and actual Worker runtime behavior. Configure a staging deployment first. Keep centaurXiv Docs databases, secrets, and deployments separate.

Code is MIT licensed; see [LICENSE](LICENSE). Future indexed material retains its own rights. The repository license does not license third-party content.
