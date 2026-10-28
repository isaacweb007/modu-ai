import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createIntegratedDemo} from '../dist/shared/integrated-demo-state.js';
import {LANGS} from '../dist/shared/locale.js';
import {REJECTION_COPY,rejectionReasons,reasonMessage,DEMO_REVIEWERS,auditTime} from '../dist/shared/rejection-copy.js';
import {AMENDMENT_COPY} from '../dist/shared/amendment-copy.js';
import {amendmentPanel} from '../dist/integrated-amendments.js';
const at=(scenario='dineIn',phase=11,lang='vi')=>{const d=createIntegratedDemo(scenario);while(d.phase<phase){if(d.phase===3)d.confirm();else{if(d.phase===6)d.selectLanguage(lang);d.advance();}}return d;};
const change=d=>{assert(d.beginChange());d.setField(d.scenario==='booking'?'partySize':'quantity-m01','4');assert(d.submitChange());};
const reject=(d,role='floor',reason='verificationRequired')=>d.resolveAmendment(d.amendment.id,'rejected',role,d.runId,d.revision,reason);

test('decline requires an allowed contextual reason without mutating the active order or recording a decision',()=>{
 for(const scenario of ['dineIn','booking','delivery'])for(const kind of ['change','cancel'])for(const phase of [11,13]){
  const d=at(scenario,phase);kind==='change'?change(d):d.requestCancel();const before=d.snapshot(),revision=d.revision,role=d.amendment.requiredRole;
  for(const invalid of ['',undefined,'<script>custom</script>']){assert.equal(d.resolveAmendment(d.amendment.id,'rejected',role,d.runId,d.revision,invalid),false);assert.equal(d.amendment.status,'pending');assert.equal(d.revision,revision);assert.deepEqual(d.snapshot(),before);assert(!d.amendment.processedAt);}
  assert.deepEqual(d.reviewDraft(role),{reason:'',error:true});
  const reasons=rejectionReasons(d.amendment);assert.equal(reasons.includes('preparationStarted'),scenario!=='booking'&&phase>=13);assert.equal(reasons.includes('menuUnavailable'),scenario!=='booking'&&kind==='change');assert.equal(reasons.includes('slotUnavailable'),scenario==='booking'&&kind==='change');
  assert(reject(d,role,reasons[0]));assert.equal(d.amendment.reason,reasons[0]);
 }
});
test('each of nine guest languages receives the exact frozen message shown in the owner bilingual audit',()=>{
 for(const lang of Object.keys(LANGS))for(const scenario of ['dineIn','booking','delivery']){
  assert.deepEqual(Object.keys(REJECTION_COPY[lang]),Object.keys(REJECTION_COPY.ko));assert(Object.values(REJECTION_COPY[lang]).every(x=>x?.trim()));
  const d=at(scenario,13,lang);change(d);const role=d.amendment.requiredRole;
  for(const reason of rejectionReasons(d.amendment))assert(reasonMessage(reason,lang).trim());
  const reason=scenario==='booking'?'slotUnavailable':'preparationStarted';assert(reject(d,role,reason));const entry=d.amendment;
  assert.equal(entry.guestLang,lang);assert.equal(entry.messages[lang],AMENDMENT_COPY[lang].rejected+' '+reasonMessage(reason,lang));
  assert(amendmentPanel(d,'guest').includes(entry.messages[lang]));const owner=amendmentPanel(d,'owner');assert(owner.includes(entry.messages.ko));assert(owner.includes(entry.messages[lang]));assert(owner.includes(entry.processedBy.name));assert(owner.includes('datetime="'+entry.processedAt+'"'));assert(owner.includes('UTC+7'));assert(owner.includes(entry.requests[lang]));
  assert.equal(entry.processedBy.id,DEMO_REVIEWERS[role].id);assert(!Number.isNaN(Date.parse(entry.processedAt)));assert(auditTime(entry.processedAt).includes('UTC+7'));
 }
});
test('selected reasons stay with their reviewer and invalid or stale staff actions cannot bypass permissions',()=>{
 const d=at('delivery');d.requestCancel();const id=d.amendment.id,run=d.runId,revision=d.revision;
 assert.equal(d.selectReason('guest','verificationRequired',id),false);assert.equal(d.selectReason('kitchen','verificationRequired',id),false);assert.equal(d.selectReason('floor','preparationStarted',id),false);
 assert(d.selectReason('floor','verificationRequired',id));assert.equal(d.reviewDraft('owner').reason,'');assert.equal(d.resolveAmendment(id,'rejected','owner'),false);assert.equal(d.reviewDraft('floor').reason,'verificationRequired');
 assert.equal(d.selectReason('floor','verificationRequired','old'),false);assert.equal(d.selectReason('floor','verificationRequired',id,run,revision-1),false);
 assert(d.resolveAmendment(id,'rejected','floor'));const recorded=d.amendment;assert.equal(reject(d,'owner'),false);assert.deepEqual(d.amendment,recorded);
 d.requestCancel();assert.equal(d.reviewDraft('floor').reason,'');assert.equal(d.selectReason('floor','verificationRequired',id,run,revision),false);assert.equal(d.resolveAmendment(id,'rejected','owner',run,revision,'verificationRequired'),false);
 const preparing=at('delivery',13);preparing.requestCancel();assert.equal(reject(preparing,'floor','preparationStarted'),false);assert.equal(preparing.selectReason('floor','preparationStarted',preparing.amendment.id),false);assert(reject(preparing,'owner','preparationStarted'));
});
test('audit is immutable to callers, records repeated requests separately and resets only when the run restarts',()=>{
 const d=at('booking');change(d);assert(reject(d,'floor','slotUnavailable'));const first=d.amendment;assert.deepEqual(d.reviewDraft('floor'),{reason:'',error:false});
 const external=d.history;external[0].processedBy.name='changed';external[0].messages.vi='changed';external[0].requests.ko='changed';assert.deepEqual(d.amendment,first);
 change(d);assert(reject(d,'owner','capacityUnavailable'));assert.equal(d.history.length,2);assert.deepEqual(d.history[0],first);assert.notEqual(d.history[1].id,first.id);assert.equal(d.history[1].processedBy.role,'owner');assert(amendmentPanel(d,'owner').includes(first.messages.vi));
 d.requestCancel();assert(d.resolveAmendment(d.amendment.id,'approved','floor'));assert.equal(d.amendment.reason,null);assert(d.amendment.processedBy);assert(d.amendment.processedAt);assert.equal(d.history.length,3);
 d.restart();assert.equal(d.history.length,0);assert.equal(d.amendment,null);
});
test('delivery audit escapes request data and keeps contact details and staff identity out of kitchen and guest audit',()=>{
 const d=at('delivery');d.beginChange();d.setField('address','DEMO · <script>alert(1)</script> 888 test street');d.setField('phone','+84 000 987 654');d.submitChange();assert(reject(d));
 const owner=amendmentPanel(d,'owner'),kitchen=amendmentPanel(d,'kitchen'),guest=amendmentPanel(d,'guest');assert(owner.includes('&lt;script&gt;'));assert(!owner.includes('<script>'));assert(owner.includes('+84 000 987 654'));assert(!kitchen.includes('987 654'));assert(!kitchen.includes('test street'));assert(!kitchen.includes('demo-floor'));assert(!kitchen.includes('김하늘'));assert(!guest.includes('김하늘'));assert(!guest.includes('amendment-audit-messages'));
});
test('review UI provides labels, required reason feedback, translation preview and role-specific controls',()=>{
 const d=at('booking');change(d);let floor=amendmentPanel(d,'floor');assert(floor.includes('for="rejection-reason-floor"'));assert(floor.includes('value=""'));assert(!floor.includes('value="preparationStarted"'));assert(!amendmentPanel(d,'kitchen').includes('data-rejection-reason'));
 assert.equal(reject(d,'floor',''),false);floor=amendmentPanel(d,'floor');assert(floor.includes('aria-invalid="true"'));assert(floor.includes(REJECTION_COPY.ko.required));
 d.selectReason('floor','slotUnavailable',d.amendment.id);floor=amendmentPanel(d,'floor');assert(floor.includes('value="slotUnavailable" selected'));assert(floor.includes(AMENDMENT_COPY.vi.rejected+' '+reasonMessage('slotUnavailable','vi')));
});
test('rejection scenario remains local without real AI, payment, email or database writes',()=>{
 for(const file of ['dist/shared/rejection-copy.js','dist/integrated-amendments.js','dist/shared/integrated-demo-state.js','dist/integrated-demo.js'])assert.doesNotMatch(fs.readFileSync(new URL('../'+file,import.meta.url),'utf8'),/fetch\s*\(|XMLHttpRequest|WebSocket|localStorage|sessionStorage|supabase/);
});
