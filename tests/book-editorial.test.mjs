import test from 'node:test';
import assert from 'node:assert/strict';
import {appChapter} from '../dist/shared/book-apps.js';
import {BOOK} from '../dist/book-content.js';
import {BOOK_PARTS,EDITORIAL_COPY,orderedChapters,capabilityTable} from '../dist/shared/book-editorial.js';
import {ramiChapters,ramiSection} from '../dist/rami-book.js';
import {LANGS} from '../dist/shared/locale.js';

test('every existing chapter remains reachable exactly once in every language, with product before brand',()=>{
 const ids=BOOK_PARTS.flatMap(p=>p.ids);
 assert.equal(ids.length,24);assert.equal(new Set(ids).size,24);
 for(const lang of Object.keys(LANGS)){
  const source=[...BOOK[lang].sections,...ramiChapters(lang),appChapter(lang)],ordered=orderedChapters(BOOK[lang],ramiChapters(lang),[appChapter(lang)]);
  assert.deepEqual(ordered.map(c=>c.id),ids);
  assert.deepEqual(source.map(c=>c.id).sort(),[...ids].sort());
  assert(ids.indexOf('experience')<ids.indexOf('rami'));assert.equal(ids.at(-1),'faq');
  for(const c of BOOK[lang].sections){assert(c.title&&c.lead);assert(c.paragraphs.every(p=>p.trim()));}
 }
});
test('nine languages retain complete navigation, disclosure labels and the three distinct capability boundaries',()=>{
 assert.deepEqual(Object.keys(EDITORIAL_COPY).sort(),Object.keys(LANGS).sort());
 const filled=v=>Array.isArray(v)?v.every(filled):typeof v==='string'&&v.trim().length>0;
 for(const c of Object.values(EDITORIAL_COPY)){
  assert.deepEqual(Object.keys(c),Object.keys(EDITORIAL_COPY.ko));assert(Object.values(c).every(filled));
  assert.equal(c.groups.length,BOOK_PARTS.length);assert.equal(c.details.length,3);assert.equal(c.mapHead.length,3);
  assert.equal(c.mapRows.length,3);assert(c.mapRows.every(r=>r.length===3));
 }
});
test('launch decisions keep their editorial purpose instead of repeated login copy',()=>{
 for(const lang of Object.keys(LANGS)){
  const ids=['onboarding','roadmap','workshop','faq'];
  const paragraphs=ids.flatMap(id=>BOOK[lang].sections.find(s=>s.id===id).paragraphs);
  assert.equal(new Set(paragraphs).size,paragraphs.length);
 }
});
test('scope table exposes column and row headers, and all brand chapters share sequential numbering',()=>{
 for(const lang of Object.keys(LANGS)){
  const table=capabilityTable(lang);assert(table.includes('<caption>'));assert.equal((table.match(/scope="col"/g)||[]).length,3);assert.equal((table.match(/scope="row"/g)||[]).length,3);
  orderedChapters(BOOK[lang],ramiChapters(lang),[appChapter(lang)]).forEach((chapter,i)=>{if(chapter.rami){const html=ramiSection(chapter,lang,{number:i+1,partLabel:chapter.id==='rami'?EDITORIAL_COPY[lang].groups[4]:''});assert(html.includes(`<span class="chapter-number">${String(i+1).padStart(2,'0')}</span>`));assert(html.includes(`aria-labelledby="heading-${chapter.id}"`));}});
 }
});
