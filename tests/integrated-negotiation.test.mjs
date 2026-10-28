import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createIntegratedDemo} from '../dist/shared/integrated-demo-state.js';
import {LANGS} from '../dist/shared/locale.js';
import {NEGOTIATION_COPY} from '../dist/shared/negotiation-copy.js';
import {amendmentPanel} from '../dist/integrated-amendments.js';
import {requestForm} from '../dist/integrated-request-form.js';
import {showcaseViews} from '../dist/showcase.js';
const at=(scenario='dineIn',phase=11,lang='vi')=>{const d=createIntegratedDemo(scenario);while(d.phase<phase){if(d.phase===3)d.confirm();else{if(d.phase===6)d.selectLanguage(lang);assert(d.advance());}}return d;};
const record=d=>structuredClone(d.snapshot().order||d.snapshot().booking);
const propose=(d,value='2',role=d.amendment.requiredRole)=>{const id=d.amendment.id;assert(d.beginProposal(role,id));if(d.scenario==='booking')d.setProposalField(role,'time',value,id);else for(const m of d.menu())d.setProposalField(role,'quantity-'+m.id,m.id==='m04'?value:'0',id);assert(d.resolveAmendment(id,'rejected',role,d.runId,d.revision,d.scenario==='booking'?'slotUnavailable':'menuUnavailable'));};
const offer=(d)=>{assert(d.beginChange());d.setField(d.scenario==='booking'?'time':'quantity-m01',d.scenario==='booking'?'20:00':'3');assert(d.submitChange());propose(d,d.scenario==='booking'?'21:00':'2');};
const counter=(d,value)=>{assert(d.beginCounterProposal(d.proposal.id,'guest'));assert(d.setField(d.scenario==='booking'?'time':'quantity-m04',value));assert(d.submitChange());};
const render=(d,role)=>showcaseViews(d.serviceState(),'ko',{lounge:false,blockActions:d.blocked,afterContent:k=>amendmentPanel(d,k)}).appPane(role,d.snapshot());

test('guest counterrequests across all scenarios and languages apply only after staff agreement and retain identity',()=>{
 for(const scenario of ['dineIn','booking','delivery'])for(const lang of Object.keys(LANGS))for(const reviewer of ['floor','owner']){
  const d=at(scenario,11,lang),before=record(d),run=d.runId;offer(d);const first=d.proposal;assert(render(d,'guest').includes(NEGOTIATION_COPY[lang].edit));counter(d,scenario==='booking'?'21:30':'3');
  assert.deepEqual(record(d),before);assert(d.blocked);assert(!d.complete);assert.equal(d.actor,'floor');assert(!d.advance());assert(!d.beginChange());assert(!d.requestCancel());assert.equal(d.history.length,2);assert.equal(d.history[0].proposal.status,'countered');assert.equal(d.amendment.sourceProposalId,first.id);assert.equal(d.history[0].proposal.counterRequestId,d.amendment.id);
  assert(render(d,'guest').includes(NEGOTIATION_COPY[lang].waiting));assert(render(d,'floor').includes('재요청 확인 · 최종 합의'));assert(!render(d,'kitchen').includes('data-amendment="approve"'));
  assert(d.resolveAmendment(d.amendment.id,'approved',reviewer));assert(!d.blocked);assert.equal(d.runId,run);assert.equal(record(d).id,before.id);assert.equal(record(d).status,before.status);
  if(scenario==='booking'){assert.equal(record(d).time,'21:30');assert.equal(record(d).partySize,before.partySize);}else{assert.deepEqual(record(d).lines.map(x=>[x.itemId,x.quantity]),[['m04',3]]);assert.equal(record(d).total,747000);if(scenario==='delivery')assert.deepEqual(record(d).fulfillment,before.fulfillment);}
  for(const role of ['guest','floor','kitchen','owner'])assert(render(d,role).includes(NEGOTIATION_COPY[role==='guest'?lang:'ko'].agreed));
 }
});

test('multiple negotiations preserve every offer and counterrequest with bilingual actors and timestamps',()=>{
 const d=at('booking');offer(d);counter(d,'21:30');const old=structuredClone(d.history[0]);propose(d,'22:00','owner');counter(d,'22:30');const second=structuredClone(d.history[1]);
 assert.equal(d.history.length,3);assert.equal(d.amendment.negotiationRound,2);assert.equal(d.history[1].proposal.round,2);assert.equal(d.amendment.parentAmendmentId,d.history[1].id);assert(d.resolveAmendment(d.amendment.id,'approved','floor'));assert.equal(record(d).time,'22:30');assert.deepEqual(d.history[0],old);assert.deepEqual(d.history[1],second);
 const owner=render(d,'owner');for(const h of d.history){assert(owner.includes(h.requests.ko));assert(owner.includes(h.requests.vi));assert(owner.includes(h.requestedAt));assert(owner.includes(h.processedAt));assert(h.requestedBy.name);if(h.agreementSummaries){assert(owner.includes(h.agreementSummaries.ko));assert(owner.includes(h.agreementSummaries.vi));}if(h.proposal){for(const text of [h.proposal.messages.ko,h.proposal.messages.vi,h.proposal.responses.ko,h.proposal.responses.vi])assert(owner.includes(text));assert.equal(h.proposal.respondedAt,d.history.find(x=>x.sourceProposalId===h.proposal.id).requestedAt);}}
 assert(owner.includes('김하늘'));assert(owner.includes('이주모'));assert(owner.includes('Minh (DEMO)'));const clone=d.history;clone[0].proposal.responses.vi='bad';clone[2].after.time='00:00';assert.equal(record(d).time,'22:30');assert.deepEqual(d.history[0],old);
});

test('counter editing blocks old responses, validates role/id/run/revision, and discarding restores the offer',()=>{
 const d=at();offer(d);const before=record(d),p=d.proposal,id=p.id,run=d.runId,rev=d.revision;
 for(const role of ['floor','kitchen','owner'])assert.equal(d.beginCounterProposal(id,role),false);
 assert.equal(d.beginCounterProposal('old','guest'),false);assert.equal(d.beginCounterProposal(id,'guest','old'),false);assert.equal(d.beginCounterProposal(id,'guest',run,rev-1),false);assert(d.beginCounterProposal(id,'guest'));
 assert.equal(d.beginCounterProposal(id,'guest'),false);assert.equal(d.respondProposal(id,'accepted','guest',run,rev),false);assert.equal(d.respondProposal(id,'accepted','guest'),false);assert.equal(d.respondProposal(id,'declined','guest'),false);d.setField('quantity-m04','4');assert(d.discardChange());assert(!d.countering);assert(!d.editing);assert.deepEqual(d.proposal,p);assert.deepEqual(record(d),before);assert(d.blocked);assert(d.respondProposal(id,'accepted','guest'));assert.equal(record(d).total,498000);
 assert.equal(d.beginCounterProposal(id,'guest'),false);d.restart();assert.equal(d.beginCounterProposal(id,'guest',run,rev),false);assert(!d.countering);
});

test('counterrequests preserve invalid edits for recovery and require changes from the offered contents',()=>{
 for(const scenario of ['dineIn','booking','delivery']){
  const d=at(scenario);offer(d);const original=structuredClone(d.history);assert(d.beginCounterProposal(d.proposal.id,'guest'));assert(!d.submitChange());assert.equal(d.errors.request,'sameOffer');assert(requestForm(d).includes(NEGOTIATION_COPY.vi.sameOffer));assert.deepEqual(d.history,original);
  const field=scenario==='booking'?'time':'quantity-m04',value=scenario==='booking'?'99:99':'21';assert(d.setField(field,value));assert(!d.submitChange());assert(d.errors[field]);assert.equal(d.draft()[scenario==='booking'?'time':'quantities'] instanceof Object?d.draft().quantities.m04:d.draft().time,value);assert(d.editing);assert.deepEqual(d.history,original);assert(requestForm(d).includes('role="alert"'));
  assert(d.setField(field,scenario==='booking'?'21:30':'3'));assert(d.submitChange());assert(!d.countering);assert.equal(d.history.length,2);assert(!d.submitChange());
 }
});

test('cooking counterrequests remain owner-only, and new agreed menu requires kitchen preparation again',()=>{
 for(const scenario of ['dineIn','delivery'])for(const phase of [13,14]){
  const d=at(scenario,phase),before=record(d);offer(d);counter(d,'4');assert.equal(d.amendment.requiredRole,'owner');assert(!d.canReview('floor'));assert(!d.resolveAmendment(d.amendment.id,'approved','floor'));assert(!d.beginProposal('floor',d.amendment.id));assert.deepEqual(record(d),before);assert(d.resolveAmendment(d.amendment.id,'approved','owner'));assert.equal(d.phase,12);assert.equal(d.actor,'kitchen');assert.equal(record(d).status,'accepted');assert(d.advance());assert(d.advance());assert.equal(record(d).status,'ready');
 }
});

test('counter field restrictions and four role projections retain delivery privacy and booking party size',()=>{
 for(const scenario of ['delivery','booking']){
  const d=at(scenario);offer(d);const offerValues=d.proposal.values;assert(d.beginCounterProposal(d.proposal.id,'guest'));for(const field of ['phone','address','partySize','quantity-unknown'])assert.equal(d.setField(field,'9'),false);
  assert.equal(d.setField(scenario==='booking'?'quantity-m01':'time','9'),false);assert.deepEqual(d.draft(),offerValues);const form=requestForm(d);assert(form.includes('readonly'));assert(form.includes(NEGOTIATION_COPY.vi.fixed));d.setField(scenario==='booking'?'time':'quantity-m04',scenario==='booking'?'21:30':'3');assert(d.submitChange());
  for(const state of ['pending','approved']){if(state==='approved')assert(d.resolveAmendment(d.amendment.id,'approved','owner'));const kitchen=render(d,'kitchen');for(const value of [offerValues.address,offerValues.phone,'Minh (DEMO)','747,000','21:30'])if(value)assert(!kitchen.includes(value));assert(render(d,'owner').includes('Minh (DEMO)'));}
 }
});

test('counterrequest rejection leaves confirmed data unchanged and a subsequent offer can still be accepted',()=>{
 for(const offerAgain of [false,true]){const d=at(),before=record(d);offer(d);counter(d,'3');if(offerAgain){propose(d,'4');assert(d.respondProposal(d.proposal.id,'accepted','guest'));assert.equal(record(d).total,996000);}else{assert(d.resolveAmendment(d.amendment.id,'rejected','floor',d.runId,d.revision,'menuUnavailable'));assert.deepEqual(record(d),before);assert(d.canManage);}assert.equal(d.history[0].proposal.status,'countered');}
});

test('old approvals and guest acceptance cannot overwrite a newer negotiation round',()=>{
 const d=at();offer(d);const oldOffer=d.proposal.id;counter(d,'3');const request=d.amendment.id,rev=d.revision,run=d.runId;propose(d,'4');counter(d,'5');assert(!d.resolveAmendment(request,'approved','owner',run,rev));assert(!d.respondProposal(oldOffer,'accepted','guest'));assert(d.resolveAmendment(d.amendment.id,'approved','owner'));const final=d.history;assert(!d.resolveAmendment(d.amendment.id,'approved','floor'));assert.deepEqual(d.history,final);assert.equal(record(d).total,1245000);
});

test('an expired counterrequest cannot be approved and staff can respond with a new future time',t=>{
 const d=at('booking');offer(d);counter(d,'21:30');const before=record(d);t.mock.timers.enable({apis:['Date'],now:Date.parse(d.amendment.after.date+'T21:45:00+07:00')});assert(!d.resolveAmendment(d.amendment.id,'approved','floor'));assert(d.reviewDraft('floor').approvalError);assert.equal(d.amendment.status,'pending');assert.deepEqual(record(d),before);assert(render(d,'floor').includes('예약 시간이 지났습니다'));propose(d,'22:00');assert(d.respondProposal(d.proposal.id,'accepted','guest'));assert.equal(record(d).time,'22:00');
});

test('negotiation copy covers nine locales and the demo makes no external calls or persistent writes',()=>{
 for(const lang of Object.keys(LANGS)){assert.deepEqual(Object.keys(NEGOTIATION_COPY[lang]),Object.keys(NEGOTIATION_COPY.ko));assert(Object.values(NEGOTIATION_COPY[lang]).every(value=>typeof value==='string'&&value.trim()));}
 for(const file of ['dist/shared/negotiation-copy.js','dist/shared/integrated-demo-state.js','dist/integrated-proposals.js','dist/integrated-amendments.js'])assert.doesNotMatch(fs.readFileSync(new URL('../'+file,import.meta.url),'utf8'),/fetch\s*\(|XMLHttpRequest|WebSocket|localStorage|sessionStorage|supabase/);
});

test('a guest can substitute another menu item as well as quantities in a counterrequest',()=>{
 const d=at('delivery'),before=record(d);offer(d);assert(d.beginCounterProposal(d.proposal.id,'guest'));assert(d.setField('quantity-m04','0'));assert(d.setField('quantity-m05','2'));assert(d.setField('quantity-m12','1'));assert(d.submitChange());assert.deepEqual(record(d),before);assert(d.resolveAmendment(d.amendment.id,'approved','floor'));assert.deepEqual(record(d).lines.map(x=>[x.itemId,x.quantity]),[['m05',2],['m12',1]]);assert.equal(record(d).total,697000);assert.deepEqual(record(d).fulfillment,before.fulfillment);
});
