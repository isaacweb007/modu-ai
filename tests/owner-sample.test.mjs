import test from 'node:test';import assert from 'node:assert/strict';
import {createOwnerSample,SAMPLE_COPY,SAMPLE_STORAGE} from '../dist/shared/owner-sample.js';
import {ownerSampleMode} from '../dist/shared/experience-mode.js';
import * as S from '../dist/shared/state.js?v=5.5.1';
import * as C from '../dist/shared/conversation-state.js';
const memory=new Map();globalThis.localStorage={getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v)};
test('sample contains usable linked orders, future bookings, private drafts and localized menus',()=>{
 const now=new Date('2026-10-27T08:00:00Z'),sample=createOwnerSample('ko',now);
 assert.equal(sample.manager.completed,true);assert.equal(sample.manager.stage,'ready');assert.equal(sample.items.length,8);assert.equal(sample.orders.length,4);assert.equal(sample.reservations.length,3);
 assert.deepEqual(C.metrics(sample),{sales:765000,orders:4,bookings:2,requests:2});
 for(const o of sample.orders){assert(sample.sessions.some(v=>v.id===o.sessionId));assert.equal(o.total,o.lines.reduce((sum,l)=>sum+l.quantity*l.unitPrice,0));for(const l of o.lines)assert(sample.items.some(i=>i.id===l.itemId));}
 for(const r of sample.reservations){assert(sample.sessions.some(v=>v.id===r.sessionId));assert(r.date>=sample.sampleCreated);}
 for(const [lang,copy] of Object.entries(SAMPLE_COPY)){assert.deepEqual(Object.keys(copy),Object.keys(SAMPLE_COPY.ko));assert(Object.values(copy).every(s=>typeof s==='string'&&s.length>0));assert(createOwnerSample(lang,now).items.every(i=>i.name[lang]));}
 sample.orders[0].lines[0].name.ko='edited';assert.notEqual(createOwnerSample().orders[0].lines[0].name.ko,'edited');
});
test('demo actions persist in the sample storage and cannot overwrite a registered store',()=>{
 const liveKey='modu-cloud-owner:test';localStorage.setItem(liveKey,'existing store record');S.configureState(SAMPLE_STORAGE);S.replaceState(createOwnerSample());
 S.setOrderState('sample-order-4','accepted');C.updateReservation('sample-booking-2','confirmed');S.markReviewed('sample-complaint-1');C.addMessage('owner',null,{role:'user',text:'오늘 상황 알려줘'});
 assert.equal(S.readState().orders[3].status,'accepted');assert.equal(C.metrics().bookings,1);assert.equal(C.metrics().requests,1);assert.equal(C.thread('owner',null).at(-1).text,'오늘 상황 알려줘');
 assert.equal(localStorage.getItem(liveKey),'existing store record');
 S.replaceState(createOwnerSample());assert.equal(C.metrics().bookings,2);assert.equal(S.readState().orders[3].status,'pending');assert.equal(localStorage.getItem(liveKey),'existing store record');
});
test('default owner entry uses the sample while explicit registered-store links retain cloud mode',()=>{
 assert(ownerSampleMode('owner','?lang=ko'));assert(ownerSampleMode('owner','?preview=1&store=123'));
 assert(!ownerSampleMode('owner','?live=1'));assert(!ownerSampleMode('owner','?store=123'));assert(!ownerSampleMode('guest','?lang=ko'));assert(!ownerSampleMode('guest','?preview=1'));
});
