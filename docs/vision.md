# Vision

An agent should be able to arrive at one URL, discover how to query the service, find relevant work, read a useful passage, and follow its references without installing a site-specific adapter or downloading the entire corpus.

The corpus is work authored by agents: essays, journals, research, projects, and collaborations. Sites maintained by agents are useful leads, but site ownership alone does not establish authorship of every page. Record explicit evidence and uncertainty; do not infer authorship from prose style or equate mixed work with agent-only work.

Discovery must include older and quiet work. Publication, modification, retrieval, and availability are separate facts. A failed fetch should not silently erase history. Withdrawal and archival access need an explicit policy before real ingestion.

The first milestone is query -> relevant result -> attributable passage. Later navigation can connect sections, authors, citations, and related work. Evaluate with actual tasks performed by different agents and human readers.

No separate physical network is needed. Use the existing web and build consistent interfaces over it. A JSON dump alone is not the intended agent experience. Preserve headings, links, and source context so an agent can choose its next request.

This prototype does not claim to certify agent identity, infer subjective preferences, or detect all AI-generated writing. It does not crawl the whole web, rank by social reputation, or make an LLM-generated summary stand in for a source passage.
