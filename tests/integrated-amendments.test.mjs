import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createIntegratedDemo} from '../dist/shared/integrated-demo-state.js';
import {AMENDMENT_COPY} from '../dist/shared/amendment-copy.js';
import {amendmentPanel} from '../dist/integrated-amendments.js';
import {showcaseViews} from '../dist/showcase.js';
import {LANGS} from '../dist/shared/locale.js';
const step=d=>d.phase===3?d.confirm():d.advance();
const at=(scenario,phase,lang='vi')=>{const d=createIntegratedDemo(scenario);while(d.phase<6)assert(step(d));d.selectLanguage(lang);while(d.phase<phase)assert(step(d));return d;};
const record=d=>d.snapshot().order||d.snapshot().booking;
const resolve=(d,by='floor',decision='approved')=>d.resolveAmendment(d.amendment.id,decision,by,d.runId,d.revision,decision==='rejected'?'verificationRequired':undefined);
const render=(d,role)=>showcaseViews(d.serviceState(),'ko',{lounge:false,blockActions:d.blocked,afterContent:kind=>amendmentPanel(d,kind)}).appPane(role,d.snapshot());

test('cancellation requires review at every order stage, with owner-only approval once cooking starts',()=>{
 for(const scenario of ['dineIn','delivery'])for(const phase of [11,12,13,14])for(const by of ['floor','owner']){
  const d=at(scenario,phase),before=structuredClone(record(d)),run=d.runId;
  assert(d.requestCancel());assert(d.blocked);assert(!d.snapshot().ready);assert.deepEqual(record(d),before);assert.equal(d.advance(),false);assert.equal(d.back(),false);assert.equal(d.requestCancel(),false);assert.equal(d.beginChange(),false);
  assert.equal(d.amendment.requiredRole,phase>=13?'owner':'floor');assert.equal(resolve(d,'kitchen'),false);assert.equal(resolve(d,'guest'),false);
  if(phase>=13&&by==='floor'){assert.equal(resolve(d,'floor'),false);assert.deepEqual(record(d),before);assert(resolve(d,'owner'));}else assert(resolve(d,by));
  assert.equal(record(d).id,before.id);assert.equal(d.runId,run);assert.equal(record(d).status,'cancelled');assert(d.cancelled);assert(d.complete);assert.equal(d.advance(),false);assert.equal(resolve(d,'owner'),false);
  for(const role of ['guest','floor','kitchen','owner']){const markup=render(d,role);assert(markup.includes('data-order-status="cancelled"'));assert(!markup.includes('data-show-action="advance"'));assert(markup.includes(AMENDMENT_COPY[role==='guest'?'vi':'ko'].cancelled));}
 }
});
test('changes remain proposals until reviewed; approval keeps the order identity and synchronizes revised quantities',()=>{
 for(const scenario of ['dineIn','delivery'])for(const phase of [11,12,13,14]){
  const d=at(scenario,phase),before=structuredClone(record(d));assert(d.edit());assert(d.editing);assert.equal(d.phase,phase);assert.deepEqual(record(d),before);assert.equal(d.advance(),false);
  d.setField('quantity-m01','0');d.setField('quantity-m04','3');assert(d.submitChange());assert(!d.editing);assert.equal(d.submitChange(),false);assert.deepEqual(record(d),before);
  const views=d.amendmentViews();assert.equal(views.before.total,before.total);assert.equal(views.after.total,249000*3);
  assert(resolve(d,phase>=13?'owner':'floor'));const after=record(d);assert.equal(after.id,before.id);assert.equal(after.total,747000);assert.deepEqual(after.lines.map(x=>[x.itemId,x.quantity]),[['m04',3]]);
  assert.equal(d.phase,phase>=13?12:phase);assert.equal(after.status,phase===11?'pending':'accepted');
  for(const role of ['guest','floor','kitchen','owner']){assert(render(d,role).includes('× 3'));assert(render(d,role).includes(AMENDMENT_COPY[role==='guest'?'vi':'ko'].changed));}
  assert(!render(d,'kitchen').includes('747,000'));assert(!render(d,'kitchen').includes('show-original'));
 }
});
test('reservation changes and cancellations can be reviewed by floor or owner, with no kitchen record',()=>{
 for(const phase of [11,12,13])for(const by of ['floor','owner']){
  const d=at('booking',phase),before=structuredClone(record(d));assert(d.beginChange());d.setField('partySize','6');d.setField('time','20:45');assert(d.submitChange());assert.equal(record(d).partySize,2);assert.equal(d.amendment.requiredRole,'floor');assert(resolve(d,by));
  assert.equal(record(d).partySize,6);assert.equal(record(d).time,'20:45');assert.equal(record(d).id,before.id);assert.equal(record(d).status,before.status);assert.equal(d.phase,phase);
  for(const role of ['guest','floor','owner'])assert(render(d,role).includes(AMENDMENT_COPY[role==='guest'?'vi':'ko'].changed));
  assert(!render(d,'kitchen').includes('data-order-id'));assert(!render(d,'kitchen').includes('20:45'));
  assert(d.requestCancel());assert(resolve(d,by));assert.equal(record(d).status,'cancelled');assert(!render(d,'kitchen').includes('amendment-card'));assert.equal(d.history.length,2);
 }
});
test('declining change or cancellation preserves original details and preparation state and allows a new request',()=>{
 for(const scenario of ['dineIn','booking','delivery'])for(const kind of ['change','cancel']){
  const d=at(scenario,13),before=structuredClone(record(d));
  if(kind==='change'){d.beginChange();d.setField(scenario==='booking'?'partySize':'quantity-m01','4');d.submitChange();}else d.requestCancel();
  assert(resolve(d,'owner','rejected'));assert.deepEqual(record(d),before);assert(!d.blocked);assert.equal(d.canBack,false);assert.equal(d.back(),false);assert(d.canManage);assert(render(d,'guest').includes(AMENDMENT_COPY.vi.rejected));
  assert(d.requestCancel());assert.equal(d.history.length,2);assert(resolve(d,'owner'));assert.equal(record(d).status,'cancelled');
 }
});
test('editing or approving delivery details does not expose originals or proposals to kitchen',()=>{
 const d=at('delivery',13),before=structuredClone(record(d));d.beginChange();d.setField('address','DEMO · 88 <script>example</script> road');d.setField('phone','+84 000 123 456');d.submitChange();
 assert.deepEqual(record(d),before);assert(!render(d,'kitchen').includes('123 456'));assert(!render(d,'kitchen').includes('example'));assert(!render(d,'kitchen').includes('Đường Mẫu'));
 for(const role of ['guest','floor','owner']){const markup=render(d,role);assert(markup.includes('&lt;script&gt;'));assert(!markup.includes('<script>'));assert(markup.includes('+84 000 123 456'));}
 assert(!render(d,'floor').includes('data-amendment="approve"'));assert(render(d,'owner').includes('data-amendment="approve"'));assert(resolve(d,'owner'));assert.equal(d.phase,13);assert.equal(record(d).status,'preparing');assert.equal(record(d).fulfillment.phone,'+84 000 123 456');
 assert(!render(d,'kitchen').includes('123 456'));assert(!render(d,'kitchen').includes('example'));
});
test('invalid or unchanged revisions do not submit; discarded drafts preserve approved values',()=>{
 const d=at('delivery',11),before=structuredClone(record(d));d.beginChange();assert.equal(d.submitChange(),false);assert.equal(d.errors.request,'noChanges');
 d.setField('phone','bad');assert.equal(d.submitChange(),false);assert.equal(d.errors.phone,'phoneError');assert(d.editing);assert.equal(d.amendment,null);assert.deepEqual(record(d),before);
 d.setField('quantity-m01','8');assert(d.discardChange());assert(!d.editing);assert(!d.blocked);assert.deepEqual(record(d),before);assert.equal(d.draft().quantities.m01,'1');assert.equal(d.discardChange(),false);
 assert.equal(at('dineIn',10).beginChange(),false);assert.equal(at('booking',10).requestCancel(),false);
});
test('stale and duplicate approvals, prior revisions and old runs cannot alter newer requests',()=>{
 const d=at('dineIn',13),run=d.runId,oldRevision=d.revision;d.requestCancel();const first=d.amendment.id,reviewRevision=d.revision;
 assert.equal(d.advance(13,'kitchen',run,oldRevision),false);assert.equal(d.resolveAmendment(first,'approved','owner',run,oldRevision),false);assert.equal(d.resolveAmendment('unknown','approved','owner'),false);assert.equal(d.resolveAmendment(first,'anything','owner'),false);
 assert(resolve(d,'owner','rejected'));assert.equal(d.advance(13,'kitchen',run,oldRevision),false);d.requestCancel();assert.equal(d.resolveAmendment(first,'approved','owner',run,reviewRevision),false);assert.equal(record(d).status,'preparing');
 const second=d.amendment.id;d.restart();assert.equal(d.resolveAmendment(second,'approved','owner',run),false);assert.equal(d.phase,0);assert.equal(d.history.length,0);assert.equal(d.amendment,null);assert(!d.cancelled);assert(!d.editing);
});
test('nine localized review flows render cleanly and the demo performs no external writes',()=>{
 for(const lang of Object.keys(LANGS)){
  assert.deepEqual(Object.keys(AMENDMENT_COPY[lang]),Object.keys(AMENDMENT_COPY.ko));assert(Object.values(AMENDMENT_COPY[lang]).every(x=>typeof x==='string'&&x.trim()));
  for(const scenario of ['dineIn','booking','delivery']){
   const d=at(scenario,11,lang);d.beginChange();d.setField(scenario==='booking'?'partySize':'quantity-m01','3');d.submitChange();
   for(const role of ['guest','floor','kitchen','owner'])assert(!render(d,role).includes('undefined'));
   assert(render(d,'guest').includes(AMENDMENT_COPY[lang].pending));resolve(d);assert(render(d,'guest').includes(AMENDMENT_COPY[lang].changed));
   d.requestCancel();resolve(d);assert(render(d,'guest').includes(AMENDMENT_COPY[lang].cancelled));
  }
 }
 for(const file of ['dist/integrated-amendments.js','dist/shared/amendment-copy.js','dist/shared/integrated-demo-state.js'])assert.doesNotMatch(fs.readFileSync(new URL('../'+file,import.meta.url),'utf8'),/fetch\s*\(|XMLHttpRequest|WebSocket|localStorage|sessionStorage|supabase/);
});
