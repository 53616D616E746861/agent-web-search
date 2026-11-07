import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import Ajv from 'ajv';
import worker from '../src/worker.js';
import {search} from '../src/search.js';
import documents from '../fixtures/documents.json' with {type:'json'};
import sources from '../fixtures/sources.json' with {type:'json'};
const get = path => worker.fetch(new Request('http://localhost'+path));
test('contracts validate fixtures and returned search results',async()=>{
 const ajv=new Ajv();
 for(const [name,records] of [['source',sources],['document',documents],['search-result',search(documents,'discovery')]]) {
  const validate=ajv.compile(JSON.parse(readFileSync(new URL(`../schemas/${name}.schema.json`,import.meta.url))));
  for(const record of records) assert.ok(validate(record),JSON.stringify(validate.errors));
 }
});
test('homepage -> guide -> query -> manifest -> passage without a client adapter',async()=>{
 assert.match(await (await get('/')).text(),/href="\/llms.txt"/);
 assert.match(await (await get('/llms.txt')).text(),/\/api\/search/);
 const result=await (await get('/api/search?q=context')).json();
 assert.equal(result.results[0].id,'fixture-context');
 const manifest=await (await get(result.results[0].links.document)).json();
 assert.ok(manifest.sections.every(s=>!('text' in s)));
 const response=await get(manifest.sections[0].url);
 assert.match(response.headers.get('Content-Type'),/text\/plain/);
 assert.match(await response.text(),/Context is limited/);
});
test('pagination neither repeats nor skips and keeps the query',async()=>{
 const first=await (await get('/api/search?q=discovery&limit=1')).json();
 assert.equal(first.total,2); assert.ok(first.next);
 const second=await (await get(first.next)).json();
 assert.equal(second.next,null); assert.notEqual(first.results[0].id,second.results[0].id);
});
test('older work remains searchable, unmatched queries stay empty',async()=>{
 assert.equal(search(documents,'preservation')[0].published_at,'2020-01-01');
 assert.deepEqual(search(documents,'unfindable'),[]);
 assert.deepEqual(search(documents,'!!!'),[]);
 assert.equal(search(documents,'CONTEXT budget')[0].id,'fixture-context');
});
test('invalid parameters and missing resources produce actionable errors',async()=>{
 for(const path of ['/api/search','/api/search?q=x&limit=0','/api/search?q=x&offset=-1','/api/search?q=x&limit=2.5','/api/search?q='+ 'a'.repeat(201),'/api/documents/fixture-context/sections/budget?format=xml']) {
  const r=await get(path); assert.equal(r.status,400,path); assert.equal((await r.json()).help,'/api');
 }
 assert.equal((await get('/api/documents/missing')).status,404);
 assert.equal((await worker.fetch(new Request('http://localhost/',{method:'POST'}))).status,405);
});
test('HTML escapes user-controlled query input',async()=>{
 const html=await (await get('/?q='+encodeURIComponent('"><script>alert(1)</script>'))).text();
 assert.ok(!html.includes('<script>')); assert.match(html,/&lt;script&gt;/);
});
test('section pagination reconstructs long source text exactly',async()=>{
 const section=documents[0].sections[0], original=section.text;
 section.text='a'.repeat(8500);
 try {
  let next='/api/documents/fixture-discovery/sections/discovery', combined='';
  while(next){ const body=await (await get(next)).json(); assert.ok(body.text.length<=4000); combined+=body.text; next=body.next; }
  assert.equal(combined,section.text);
  assert.equal((await get('/api/documents/fixture-discovery/sections/discovery?offset=9000')).status,400);
 } finally { section.text=original; }
});
