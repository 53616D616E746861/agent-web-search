import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import Ajv from 'ajv';
import { sourcesFromAgentweb, urlKey, AGENTWEB } from '../src/registry.js';
import saved from '../fixtures/registry/agentweb-known-sites-2026-11-07.json' with {type:'json'};
const validate = new Ajv().compile(JSON.parse(readFileSync(new URL('../schemas/source.schema.json', import.meta.url))));
const valid = sources => sources.forEach(s => assert.ok(validate(s), JSON.stringify(validate.errors)));
// A made-up entry in the registry's shape; fields given in `over` replace or remove (undefined) its own.
const entry = (id, over = {}) => {
  const e = { id, name: `Name ${id}`, url: `https://${id}.example/`, agent: `Agent ${id}`, line: `Line for ${id}.`,
    evidence: { words: `I am ${id}, an AI`, where: `https://${id}.example/about` },
    newest: { what: 'post', date: '2026-11-01', read: 'read from its feed' }, on_page: true, answering: true, checked: '2026-11-07' };
  for (const [k, v] of Object.entries(over)) v === undefined ? delete e[k] : (e[k] = v);
  return e;
};
const map = sites => sourcesFromAgentweb({ sites }, { observed_at: '2026-11-07T15:45:00Z' });

test('the saved registry maps every site, each source valid and its record unchanged', () => {
 const fresh = JSON.parse(readFileSync(new URL('../fixtures/registry/agentweb-known-sites-2026-11-07.json', import.meta.url)));
 const { sources, skipped } = sourcesFromAgentweb(saved, { observed_at: '2026-11-07T15:45:00-08:00' });
 assert.equal(sources.length, fresh.sites.length); assert.deepEqual(skipped, []);
 valid(sources);
 sources.forEach((s, i) => {
  const e = fresh.sites[i];
  assert.equal(s.id, `agentweb:${e.id}`); assert.equal(s.url, e.url); assert.equal(s.name, e.name);
  assert.ok(s.evidence.includes(e.evidence.words) && s.evidence.includes(e.evidence.where));
  assert.equal(s.scope, 'site'); assert.deepEqual(s.registry.record, e); assert.notEqual(s.registry.record, saved.sites[i]);
  assert.equal(s.registry.url, AGENTWEB.url); assert.equal(s.registry.observed_at, '2026-11-07T15:45:00-08:00');
 });
 assert.deepEqual(saved, fresh);
});
test('a quiet site stays a source', () => {
 const { sources } = map([entry('quiet', { newest: { what: 'essay', date: '2025-03-01', read: 'seen by eye' }, on_page: false })]);
 assert.equal(sources.length, 1); valid(sources);
 assert.equal(sources[0].registry.record.newest.date, '2025-03-01');
});
test('an unavailable site stays a source, its archive copy kept', () => {
 const archive = 'https://web.archive.org/web/2026/https://gone.example/';
 const { sources } = map([entry('gone', { answering: false, archive })]);
 assert.equal(sources.length, 1); valid(sources);
 assert.equal(sources[0].registry.record.answering, false); assert.equal(sources[0].registry.record.archive, archive);
});
test('a site with a shared byline stays a site-level claim, with no document authorship', () => {
 const words = 'Written by an agent and a human, together';
 const { sources } = map([entry('shared', { evidence: { words, where: 'https://shared.example/' } })]);
 valid(sources);
 assert.equal(sources[0].scope, 'site'); assert.ok(sources[0].evidence.includes(words));
 assert.ok(!('authorship' in sources[0]) && !JSON.stringify(sources[0]).includes('"kind"'));
});
test('duplicate urls and ids are reported, the first kept', () => {
 const { sources, skipped } = map([entry('a'), entry('b', { url: 'https://A.example:443' }), entry('a', { url: 'https://other.example/' }),
  entry('c', { url: 'https://c.example/blog/' }), entry('d', { url: 'https://c.example/blog' })]);
 assert.deepEqual(sources.map(s => s.id), ['agentweb:a', 'agentweb:c']);
 assert.deepEqual(skipped.map(s => [s.index, s.reason]), [[1, 'duplicate url, first listed as a'], [2, 'duplicate id, first at index 0'],
  [4, 'duplicate url, first listed as c']]);
 assert.equal(urlKey('HTTPS://C.example/blog/'), urlKey('https://c.example/blog'));
 assert.notEqual(urlKey('https://c.example/blog'), urlKey('https://c.example/blog/post'));
});
test('entries missing a field are reported with their reason, never guessed', () => {
 const { sources, skipped } = map([entry('noid', { id: undefined }), entry('nourl', { url: undefined }), entry('noname', { name: ' ' }),
  entry('noev', { evidence: undefined }), entry('nowhere', { evidence: { words: 'I am an AI' } }), entry('ftp', { url: 'ftp://ftp.example/' }),
  null, 'a string', entry('fine')]);
 assert.deepEqual(sources.map(s => s.id), ['agentweb:fine']);
 assert.deepEqual(skipped.map(s => s.reason), ['missing id', 'missing url', 'missing name', 'missing evidence', 'missing evidence',
  'url is not an http(s) address', 'not an object', 'not an object']);
 assert.equal(skipped[0].id, null); assert.equal(skipped[1].id, 'nourl');
});
test('the mapping never fetches', () => {
 const real = globalThis.fetch; let calls = 0;
 globalThis.fetch = () => { calls++; throw new Error('the registry adapter must not fetch'); };
 try { sourcesFromAgentweb(saved); map([entry('a'), entry('gone', { answering: false })]); } finally { globalThis.fetch = real; }
 assert.equal(calls, 0);
});
test('a file that is not a registry snapshot is refused', () => {
 // the refusal's own message: any of these would also throw a TypeError by accident, which would prove nothing
 for (const bad of [null, {}, { sites: 'no' }, []]) assert.throws(() => sourcesFromAgentweb(bad), /not a known-sites.json snapshot/);
});
