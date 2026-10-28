import test from 'node:test';
import assert from 'node:assert/strict';
import {APP_COPY,appSection} from '../dist/shared/book-apps.js';
import {LANGS} from '../dist/shared/locale.js';
import {CONNECTED_COPY} from '../dist/shared/connected-demo-copy.js';
test('the nine-language directory keeps integrated demos and gates role links until a shared shop exists',()=>{
 assert.deepEqual(Object.keys(APP_COPY).sort(),Object.keys(LANGS).sort());
 for(const lang of Object.keys(LANGS)){
  const html=appSection(lang,5);
  assert(html.includes('href="#integrated-demo"'));
  assert.equal((html.match(/data-connected-role=/g)||[]).length,4);
  assert.equal((html.match(/aria-disabled="true"/g)||[]).length,4);
  assert.equal((html.match(/data-demo-copy=/g)||[]).length,4);
  assert(!html.includes('role=floor')&&!html.includes('role=kitchen'));
  assert(html.includes(CONNECTED_COPY[lang].staffAccess));
  assert(Object.values(CONNECTED_COPY[lang]).every(x=>typeof x==='string'&&x.length>0));
 }
});
