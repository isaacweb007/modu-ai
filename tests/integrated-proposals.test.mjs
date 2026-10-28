import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createIntegratedDemo} from '../dist/shared/integrated-demo-state.js';
import {LANGS} from '../dist/shared/locale.js';
import {PROPOSAL_COPY} from '../dist/shared/proposal-copy.js';
import {amendmentPanel} from '../dist/integrated-amendments.js';
import {proposalEditor} from '../dist/integrated-proposals.js';
import {showcaseViews} from '../dist/showcase.js';
const at=(scenario='dineIn',phase=11,lang='vi')=>{const d=createIntegratedDemo(scenario);while(d.phase<phase){if(d.phase===3)d.confirm();else{if(d.phase===6)d.selectLanguage(lang);d.advance();}}return d;};
const record=d=>d.snapshot().order||d.snapshot().booking;
const change=d=>{assert(d.beginChange());d.setField(d.scenario==='booking'?'time':'quantity-m01',d.scenario==='booking'?'20:00':'3');assert(d.submitChange());};
const editOffer=(d,role=d.amendment.requiredRole)=>{assert(d.beginProposal(role,d.amendment.id));if(d.scenario==='booking')assert(d.setProposalField(role,'time','21:00',d.amendment.id));else {for(const item of d.menu())assert(d.setProposalField(role,'quantity-'+item.id,item.id==='m04'?'2':'0',d.amendment.id));}return role;};
const send=(d,role=d.amendment.requiredRole)=>d.resolveAmendment(d.amendment.id,'rejected',role,d.runId,d.revision,d.scenario==='booking'?'slotUnavailable':'menuUnavailable');
const respond=(d,decision='accepted',role='guest')=>d.respondProposal(d.proposal.id,decision,role);
const render=(d,role)=>showcaseViews(d.serviceState(),'ko',{lounge:false,blockActions:d.blocked,afterContent:k=>amendmentPanel(d,k)}).appPane(role,d.snapshot());

test('alternatives change no confirmed data until the guest accepts; all roles see the updated result in nine languages',()=>{
 for(const scenario of ['dineIn','delivery','booking'])for(const lang of Object.keys(LANGS)){
  const d=at(scenario,11,lang),before=structuredClone(record(d)),run=d.runId;change(d);editOffer(d);assert(send(d));
  assert.equal(d.amendment.status,'rejected');assert.equal(d.proposal.status,'pending');assert(d.blocked);assert(!d.complete);assert.equal(d.actor,'guest');assert.deepEqual(record(d),before);assert.equal(d.advance(),false);assert.equal(d.beginChange(),false);assert.equal(d.requestCancel(),false);assert.equal(d.back(),false);
  assert(render(d,'guest').includes(PROPOSAL_COPY[lang].accept));assert(render(d,'guest').includes(d.proposal.summaries[lang]));for(const role of ['floor','owner','kitchen'])assert(!render(d,role).includes('data-proposal="accept"'));
  assert(respond(d));assert.equal(d.proposal.status,'accepted');assert(render(d,'guest').includes(PROPOSAL_COPY[lang].applied));assert(render(d,'guest').includes(PROPOSAL_COPY[lang].before));assert(!d.blocked);assert.equal(d.runId,run);assert.equal(record(d).id,before.id);assert.equal(record(d).status,before.status);
  if(scenario==='booking'){assert.equal(record(d).time,'21:00');assert(!render(d,'kitchen').includes('21:00'));assert(render(d,'kitchen').includes(PROPOSAL_COPY.ko.kitchenBooking));}
  else{assert.equal(record(d).total,498000);assert.deepEqual(record(d).lines.map(x=>[x.itemId,x.quantity]),[['m04',2]]);if(scenario==='delivery')assert.deepEqual(record(d).fulfillment,before.fulfillment);}
  for(const role of ['guest','floor','kitchen','owner'])assert(render(d,role).includes(PROPOSAL_COPY[role==='guest'?lang:'ko'].accepted));
  assert.deepEqual(Object.keys(PROPOSAL_COPY[lang]),Object.keys(PROPOSAL_COPY.ko));assert(Object.values(PROPOSAL_COPY[lang]).every(x=>x?.trim()));
 }
});
test('offers after cooking require owner authority and accepted menu changes restart kitchen preparation',()=>{
 for(const scenario of ['dineIn','delivery'])for(const phase of [13,14]){
  const d=at(scenario,phase),before=structuredClone(record(d));change(d);assert.equal(d.beginProposal('floor',d.amendment.id),false);assert(!proposalEditor(d,'floor'));editOffer(d,'owner');assert.equal(send(d,'floor'),false);assert(send(d,'owner'));assert.deepEqual(record(d),before);assert(!d.complete);
  assert(respond(d));assert.equal(d.phase,12);assert.equal(record(d).status,'accepted');assert.equal(d.actor,'kitchen');assert(!d.complete);assert(d.advance());assert.equal(record(d).status,'preparing');assert(d.advance());assert.equal(record(d).status,'ready');
 }
});
test('guest can decline an alternative without changing the original order or reservation and can request another change',()=>{
 for(const scenario of ['dineIn','booking','delivery']){const d=at(scenario,13),before=structuredClone(record(d));change(d);editOffer(d);send(d);assert(respond(d,'declined'));assert.deepEqual(record(d),before);assert(!d.blocked);assert(d.canManage);assert.equal(d.proposal.respondedBy.role,'guest');assert(d.proposal.responses.vi.includes(PROPOSAL_COPY.vi.declined));const old=d.amendment;change(d);assert.deepEqual(d.history[0],old);}
});
test('proposal validation retains draft, requires a real alternative and rejects invalid dates and quantities',()=>{
 for(const scenario of ['dineIn','booking']){
  const d=at(scenario);change(d);const role='floor',id=d.amendment.id;assert(d.beginProposal(role,id));assert.equal(send(d),false);assert.equal(d.proposalDraft(role).errors.proposal,'differentProposal');assert(!d.proposal);assert.equal(d.amendment.status,'pending');
  d.setProposalField(role,scenario==='booking'?'time':'quantity-m01',scenario==='booking'?'99:99':'21',id);assert.equal(send(d),false);assert(d.proposalDraft(role).errors[scenario==='booking'?'time':'quantity-m01']);assert(!d.proposalDraftView(role));assert(proposalEditor(d,role).includes('role="alert"'));
  assert.equal(d.setProposalField(role,'phone','+84 111 111 111',id),false);assert.equal(d.setProposalField(role,'address','new address',id),false);assert.equal(d.setProposalField(role,'partySize','9',id),false);
  assert(d.discardProposal(role,id));assert.equal(d.proposalDraft(role),null);assert(d.beginProposal(role,id));assert(d.discardProposal(role,id));assert(send(d));assert.equal(d.proposal,null);assert(d.canManage);
 }
});
test('reason is still mandatory and approval never silently applies an unsent alternative',()=>{
 const d=at();change(d);editOffer(d);assert.equal(d.resolveAmendment(d.amendment.id,'rejected','floor'),false);assert(d.reviewDraft('floor').error);assert(d.proposalDraft('floor'));assert(!d.proposal);
 assert(d.resolveAmendment(d.amendment.id,'approved','owner'));assert.equal(record(d).lines[0].quantity,3);assert.equal(d.proposal,null);assert.equal(d.proposalDraft('floor'),null);
 const cancel=at();cancel.requestCancel();assert.equal(cancel.beginProposal('floor',cancel.amendment.id),false);assert(!proposalEditor(cancel,'floor'));
});
test('proposal edits and guest responses validate actor, run, revision and offer identity and resist duplicate acceptance',()=>{
 const d=at();change(d);const entry=d.amendment.id,run=d.runId,oldRev=d.revision;assert.equal(d.beginProposal('guest',entry),false);assert.equal(d.beginProposal('kitchen',entry),false);assert.equal(d.beginProposal('floor','old'),false);editOffer(d);assert.equal(d.setProposalField('owner','quantity-m04','4',entry),false);send(d);const id=d.proposal.id,rev=d.revision;
 for(const role of ['floor','owner','kitchen'])assert.equal(d.respondProposal(id,'accepted',role),false);
 assert.equal(d.respondProposal(id,'accepted','guest',run,oldRev),false);assert.equal(d.respondProposal('old','accepted','guest'),false);assert.equal(d.respondProposal(id,'invalid','guest'),false);
 assert(respond(d));const after=structuredClone(d.amendment);assert.equal(d.respondProposal(id,'accepted','guest',run,rev),false);assert.deepEqual(d.amendment,after);
 change(d);editOffer(d);assert.equal(send(d),false);d.setProposalField('floor','quantity-m04','4',d.amendment.id);assert(send(d));assert.equal(d.respondProposal(id,'declined','guest'),false);d.restart();assert.equal(d.respondProposal(id,'accepted','guest',run,rev),false);assert.equal(d.proposal,null);assert.equal(d.history.length,0);
});
test('immutable audit preserves the rejected request, staff offer and exact bilingual guest response with timestamps',()=>{
 const d=at('booking');change(d);editOffer(d,'owner');send(d,'owner');const sent=structuredClone(d.proposal),rejected=structuredClone(d.amendment.messages);assert(!d.proposal.respondedAt);assert(respond(d));const p=d.proposal;
 assert.equal(p.proposedAt,sent.proposedAt);assert.deepEqual(p.messages,sent.messages);assert.deepEqual(d.amendment.messages,rejected);assert.equal(p.proposedBy.name,'이주모');assert.equal(p.respondedBy.name,'Minh (DEMO)');assert(Date.parse(p.respondedAt)>=Date.parse(p.proposedAt));assert(p.responses.vi.includes(p.summaries.vi));
 const owner=render(d,'owner');for(const value of [p.messages.ko,p.messages.vi,p.responses.ko,p.responses.vi,p.proposedAt,p.respondedAt])assert(owner.includes(value));
 const clone=d.history;clone[0].proposal.values.time='00:00';clone[0].proposal.messages.vi='mutated';assert.deepEqual(d.proposal,p);
});
test('delivery contact information remains unchanged and is never included in kitchen proposals or audit',()=>{
 const d=at('delivery');const before=structuredClone(record(d));change(d);editOffer(d);send(d);for(const phase of ['pending','accepted']){if(phase==='accepted')respond(d);const k=render(d,'kitchen');assert(!k.includes(before.fulfillment.address));assert(!k.includes(before.fulfillment.phone));assert(!k.includes('498,000'));assert(!k.includes('김하늘'));assert(!k.includes('Minh'));assert.deepEqual(record(d).fulfillment,before.fulfillment);}
});
test('an expired reservation alternative is recorded but cannot be applied',t=>{
 const d=at('booking');change(d);editOffer(d);send(d);const before=structuredClone(record(d)),future=Date.parse(d.proposal.values.date+'T22:00:00+07:00');t.mock.timers.enable({apis:['Date'],now:future});assert(respond(d));assert.equal(d.proposal.status,'expired');assert.deepEqual(record(d),before);assert(!d.blocked);assert(render(d,'guest').includes(PROPOSAL_COPY.vi.expired));
});
test('alternatives use prepared local data and no AI, payment, email or cloud calls',()=>{
 for(const file of ['dist/shared/proposal-copy.js','dist/integrated-proposals.js','dist/shared/integrated-demo-state.js'])assert.doesNotMatch(fs.readFileSync(new URL('../'+file,import.meta.url),'utf8'),/fetch\s*\(|XMLHttpRequest|WebSocket|localStorage|sessionStorage|supabase/);
});
