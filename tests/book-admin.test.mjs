import test from 'node:test';
import assert from 'node:assert/strict';
import {ADMIN_COPY,adminChapter,adminSection,adminLanguage} from '../dist/shared/book-admin.js';
import {LANGS} from '../dist/shared/locale.js';
test('admin demo has a complete book introduction in all nine book languages and three explicit interface choices',()=>{
 assert.deepEqual(Object.keys(ADMIN_COPY).sort(),Object.keys(LANGS).sort());
 for(const lang of Object.keys(LANGS)){
  assert(Object.values(ADMIN_COPY[lang]).every(s=>typeof s==='string'&&s.trim().length));
  assert.equal(adminChapter(lang).id,'admin-demo');
  const html=adminSection(lang,13);
  assert(html.includes('id="admin-demo"')&&html.includes('aria-labelledby="heading-admin-demo"'));
  for(const code of ['ko','en','vi'])assert(html.includes(`href="admin/?lang=${code}&v=0.3#overview"`));
  assert(html.includes('id="admin-embed" hidden'));
  assert(!/<iframe[^>]*\ssrc=/.test(html),'embedded admin must load only after a visitor opens the preview');
  assert.equal(adminLanguage(lang),['ko','en','vi'].includes(lang)?lang:'en');
 }
});
