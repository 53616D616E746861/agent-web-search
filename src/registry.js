// Kit's registry (agentweb.directory/known-sites.json) -> source records. A pure mapping over a saved snapshot: it never
// fetches. The registry's evidence vouches for a site as a whole, never for each document on it, so a source says so
// (scope: 'site') and carries no document authorship.
export const AGENTWEB = { name: 'agentweb.directory', url: 'https://agentweb.directory/known-sites.json' };

const text = v => typeof v === 'string' && v.trim() !== '';

// Only what new URL() already makes equal is one address: host case, a default port, an empty root path. A path keeps
// its trailing slash: without fetching there is no evidence that /blog and /blog/ are one resource.
export function urlKey(raw) {
  let u;
  try { u = new URL(raw); } catch { return null; }
  if (u.protocol !== 'https:' && u.protocol !== 'http:') return null;
  return `${u.protocol}//${u.host}${u.pathname}${u.search}`;
}

function problem(entry) {
  if (!entry || typeof entry !== 'object' || Array.isArray(entry)) return 'not an object';
  for (const field of ['id', 'url', 'name']) if (!text(entry[field])) return `missing ${field}`;
  if (!urlKey(entry.url)) return 'url is not an http(s) address';
  if (!text(entry.evidence?.words) || !text(entry.evidence?.where)) return 'missing evidence';
  return null;
}

// snapshot: the parsed registry file. observed_at: when it was saved, which only the importer knows.
// Returns every entry as a source or as a skipped record with its reason; nothing is dropped silently.
export function sourcesFromAgentweb(snapshot, { observed_at = null } = {}) {
  if (!Array.isArray(snapshot?.sites)) throw new TypeError('not a known-sites.json snapshot: no sites array');
  const sources = [], skipped = [], ids = new Map(), urls = new Map();
  snapshot.sites.forEach((entry, index) => {
    const why = problem(entry);
    if (why) return skipped.push({ index, id: text(entry?.id) ? entry.id : null, reason: why });
    const key = urlKey(entry.url);
    if (ids.has(entry.id)) return skipped.push({ index, id: entry.id, reason: `duplicate id, first at index ${ids.get(entry.id)}` });
    if (urls.has(key)) return skipped.push({ index, id: entry.id, reason: `duplicate url, first listed as ${urls.get(key)}` });
    ids.set(entry.id, index); urls.set(key, entry.id);
    sources.push({
      id: `agentweb:${entry.id}`,
      url: entry.url,
      name: entry.name,
      evidence: `"${entry.evidence.words}" (${entry.evidence.where})`,
      scope: 'site',
      registry: { name: AGENTWEB.name, url: AGENTWEB.url, observed_at, record: structuredClone(entry) },
    });
  });
  return { sources, skipped };
}
