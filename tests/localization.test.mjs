import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {LANGS,resolveLang,getLang,formatMoney,formatBooking,tableLabel,partyLabel,countryName} from '../dist/shared/locale.js';
import {createOwnerSample,SAMPLE_COPY} from '../dist/shared/owner-sample.js';
import {SAMPLE_ORIGINALS} from '../dist/shared/sample-originals.js';
import {sampleStateForDisplay,sampleInventory,sampleTask,sampleMediaName} from '../dist/shared/sample-display.js';
import {MENU} from '../dist/shared/menu.js';
import {RAMI_COPY,EXPRESSION_IDS,ROLE_IDS} from '../dist/shared/rami-copy.js';
import {ENTRY_COPY} from '../dist/shared/demo-entry.js';
import {BOOK} from '../dist/book-content.js';
import {answerText} from '../dist/shared/chat.js';

test('Korean is the entry default; explicit supported language wins over stale preferences',()=>{
 globalThis.localStorage={getItem:()=> 'en'};globalThis.location={search:''};
 assert.equal(getLang(),'ko');assert.equal(resolveLang('?lang=fr'),'ko');assert.equal(resolveLang('?lang='),'ko');
 for(const lang of Object.keys(LANGS))assert.equal(resolveLang('?lang='+lang),lang);
 delete globalThis.location;delete globalThis.localStorage;
});
test('locale changes presentation without converting VND or shifting reservation wall time',()=>{
 assert.equal(formatMoney(129000,'vi'),'129.000 ₫');assert.equal(formatMoney(129000,'hi'),'₫1,29,000');
 assert.equal(tableLabel(7,'ko'),'7번 테이블');assert.equal(tableLabel(7,'ja'),'7番テーブル');assert.equal(partyLabel(1,'en'),'1 guest');assert.equal(partyLabel(2,'en'),'2 guests');
 assert.match(formatBooking('2026-12-20','19:30','ko'),/2026.*12.*20.*7:30/);assert.match(formatBooking('2026-12-20','19:30','en'),/Dec 20, 2026.*7:30/);
 assert.equal(countryName('VN','ko'),'베트남');assert.equal(countryName('Custom country','ko'),'Custom country');
 const item=MENU[0];assert.ok(answerText({key:'menuItem',answerData:{...item,price:129000}},'vi').includes(formatMoney(129000,'vi')));
});
test('old demo labels follow the chosen language while edited shop and customer data remain intact',()=>{
 const s=createOwnerSample('ko'),snapshot=structuredClone(s);s.store.address=SAMPLE_ORIGINALS.address[0];
 s.items[0].name.en=SAMPLE_ORIGINALS.items[s.items[0].id][1];
 s.items[1].name.en='Owner’s special';s.inventory[0].name=SAMPLE_ORIGINALS.items[s.items[0].id][0];
 s.staffTasks[0].title=SAMPLE_ORIGINALS.tasks[0][0];s.staffTasks[1].title='Custom task';s.staffTasks[1].assignee='Mina';
 const before=structuredClone(s);
 for(const lang of Object.keys(LANGS)){
  const view=sampleStateForDisplay(s,lang);assert.equal(view.store.address,SAMPLE_COPY[lang].sampleAddress);
  assert.equal(view.items[0].name.en,MENU[0].name.en);assert.equal(view.items[1].name.en,'Owner’s special');
  assert.equal(sampleInventory(s.inventory[0],s,lang).name,MENU[0].name[lang]);
  assert.equal(sampleTask(s.staffTasks[0],s,lang).title,SAMPLE_COPY[lang].sampleTask1);
  assert.equal(sampleTask(s.staffTasks[1],s,lang).title,'Custom task');assert.equal(sampleTask(s.staffTasks[1],s,lang).assignee,'Mina');
  assert.equal(view.orders[1].total,snapshot.orders[1].total);assert.deepEqual(view.orders[1].fulfillment,snapshot.orders[1].fulfillment);
  assert.deepEqual(view.sessions,snapshot.sessions);
 }
 assert.deepEqual(s,before);
 s.store.address='Owner entered address';assert.equal(sampleStateForDisplay(s,'en').store.address,'Owner entered address');
 assert.equal(sampleMediaName({id:'custom-image',name:'My photo'},'ja'),'My photo');
 delete s.sampleVersion;assert.equal(sampleStateForDisplay(s,'ja'),s);
});
test('Rami, sign-in, book and downloadable vouchers cover all nine languages',()=>{
 for(const lang of Object.keys(LANGS)){
  for(const catalog of [RAMI_COPY,ENTRY_COPY,SAMPLE_COPY])assert.deepEqual(Object.keys(catalog[lang]).sort(),Object.keys(catalog.ko).sort());
  assert.equal(RAMI_COPY[lang].expressions.length,EXPRESSION_IDS.length);assert.equal(RAMI_COPY[lang].roles.length,ROLE_IDS.length);assert.equal(RAMI_COPY[lang].colorNames.length,5);
  for(const section of BOOK[lang].sections){assert.ok(section.title.trim());for(const p of section.paragraphs)assert.ok(p.trim());}
  const svg=readFileSync(`dist/assets/one-shop/rami/bi/rami-gift-voucher-${lang}.svg`,'utf8');assert.ok(svg.includes(`lang="${lang}"`));assert.doesNotMatch(svg,/undefined|\[object Object\]/);
 }
});
