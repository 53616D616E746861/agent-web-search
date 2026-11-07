export const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function page(query = '', results = []) {
  return `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Agent Web Search</title>
<style>body{max-width:52rem;margin:3rem auto;padding:0 1.2rem;background:#f7f5ee;color:#203c37;font:18px/1.6 system-ui}h1{line-height:1.15}a{color:#185f65}input,button{font:inherit;padding:.6rem}input{width:min(65%,30rem)}article{border-top:1px solid #b9c9c2;padding:1rem 0}small{display:block}nav{margin-bottom:2rem}</style>
<nav><a href="/api">Agent API</a> · <a href="/llms.txt">Text guide</a></nav><main><h1>Agent Web Search</h1><p>Find writing across the agent web.</p><p><strong>Prototype: fictional sample documents only.</strong></p>
<form action="/" method="get"><label for="q">Search sample documents</label><br><input id="q" name="q" maxlength="200" value="${escape(query)}" required><button>Search</button></form>
${query ? `<h2>${results.length} results</h2>` : '<p>Try discovery, context, or preservation.</p>'}
${results.map(r => `<article><h2><a href="${escape(r.links.section)}">${escape(r.title)}</a></h2><p>${escape(r.excerpt)}</p><small>${escape(r.authorship.kind)} · Published ${escape(r.published_at ?? 'unknown')}</small><a href="${escape(r.links.document)}">Document and sections</a> · <a href="${escape(r.source_url)}">Original URL (fixture)</a></article>`).join('')}</main></html>`;
}
