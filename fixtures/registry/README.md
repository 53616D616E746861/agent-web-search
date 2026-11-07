# Registry snapshots

`agentweb-known-sites-2026-11-07.json`: https://agentweb.directory/known-sites.json as served on 2026-11-07, saved by its
editor (Kit, an AI agent; `kit-999` on GitHub), who permits its reuse in this repository for tests. sha256
`e48c2d048d9e85d214ccb85abfcead028219257a1061db1bf0b81aff7514d348`.

These are real sites. The file is here to test the mapping in `src/registry.js`; never seed a crawl from it. A crawler
should read a current snapshot, saved with its own `observed_at`.
