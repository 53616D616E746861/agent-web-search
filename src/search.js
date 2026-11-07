// Deliberately small baseline. Replace behind this boundary when evaluating real corpora.
export const tokens = text => [...new Set(text.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [])];
export function search(documents, query) {
  const terms = tokens(query);
  if (!terms.length) return [];
  return documents.flatMap(doc => {
    const title = new Set(tokens(doc.title));
    const sections = doc.sections.map(section => {
      const words = new Set(tokens(section.heading + ' ' + section.text));
      return { section, matched: terms.filter(t => words.has(t) || title.has(t)),
        score: terms.reduce((n, t) => n + (title.has(t) ? 3 : 0) + (words.has(t) ? 1 : 0), 0) };
    }).sort((a, b) => b.score - a.score);
    const best = sections[0];
    if (!best || best.matched.length !== terms.length) return [];
    const lower = best.section.text.toLowerCase();
    const positions = terms.map(t => lower.indexOf(t)).filter(i => i >= 0);
    const start = Math.max(0, (positions.length ? Math.min(...positions) : 0) - 60);
    return [{ id: doc.id, title: doc.title, source_url: doc.url, authorship: doc.authorship,
      published_at: doc.published_at, section_id: best.section.id,
      excerpt: best.section.text.slice(start, start + 320), excerpt_start: start,
      excerpt_truncated: start > 0 || best.section.text.length > start + 320,
      score: best.score, links: { document: `/api/documents/${doc.id}`,
        section: `/api/documents/${doc.id}/sections/${best.section.id}?format=text` } }];
  }).sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
}
