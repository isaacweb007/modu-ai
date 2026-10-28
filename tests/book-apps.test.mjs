import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {APP_COPY,appLinks,appSection} from '../dist/shared/book-apps.js';
import {LANGS} from '../dist/shared/locale.js';

test('each language opens the existing apps under both hosting prefixes without issuing staff credentials',()=>{
 assert.deepEqual(Object.keys(APP_COPY).sort(),Object.keys(LANGS).sort());
 for(const lang of Object.keys(LANGS))for(const base of ['https://example.test/','https://example.test/modu-ai/']){
  const links=appLinks(lang);
  for(const [role,href] of Object.entries(links)){
   const url=new URL(href,base);
   assert.equal(url.origin,new URL(base).origin);
   assert(url.pathname.startsWith(new URL(base).pathname+'jumo/'));
   assert.equal(url.searchParams.get('lang'),lang);
   assert.equal(url.searchParams.has('token'),false);
   assert.equal(url.searchParams.has('preview'),false);
   assert.equal(url.searchParams.has('store'),false);
   assert.equal(url.searchParams.get('role'),['floor','kitchen'].includes(role)?role:null);
   assert(existsSync(new URL('../dist/'+href.split('?')[0]+(role==='guest'?'index.html':''),import.meta.url)));
  }
 }
});
test('the app directory keeps the integrated demo reachable and explains new-tab and role-preview behavior in every language',()=>{
 const filled=value=>Array.isArray(value)?value.every(filled):typeof value==='string'&&value.trim().length>0;
 for(const [lang,copy] of Object.entries(APP_COPY)){
  assert(Object.values(copy).every(filled));
  assert.equal(copy.staff.length,6);
  const html=appSection(lang,5);
  assert.equal((html.match(/target="_blank" rel="noopener"/g)||[]).length,4);
  assert.equal((html.match(/aria-describedby="app-opening-note"/g)||[]).length,4);
  assert(html.includes('href="#integrated-demo"'));
  assert(html.includes('id="apps"'));
  assert(html.includes(copy.staff[5]));
  for(const [,src] of html.matchAll(/src="([^"]+)"/g))assert(existsSync(new URL('../dist/'+src,import.meta.url)));
 }
});
