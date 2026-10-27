import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createShowcase,advanceShowcase,showcaseSnapshot,restoreShowcase,createShowcasePlayer,SHOWCASE_KEY} from '../dist/shared/showcase-state.js';
import {SHOWCASE_COPY} from '../dist/shared/showcase-copy.js';
import {LANGS} from '../dist/shared/locale.js';
import {PHRASES} from '../dist/shared/interpreter.js';

test('paired showcase preserves guest original, Korean meaning and reply across all languages',()=>{
 for(const lang of Object.keys(LANGS)){
  let state=createShowcase(lang);assert.equal(state.phase,0);assert.equal(showcaseSnapshot(state).request,null);
  state=advanceShowcase(state);let snap=showcaseSnapshot(state);assert.equal(snap.request.text,PHRASES[lang].order.request);assert.equal(snap.translated,false);assert.equal(snap.order,null);
  state=advanceShowcase(state);snap=showcaseSnapshot(state);assert.equal(snap.translated,true);assert.equal(snap.request.interpretation.ko,PHRASES.ko.order.request);assert.equal(snap.reply,null);
  state=advanceShowcase(state);snap=showcaseSnapshot(state);assert.equal(snap.reply.interpretation.original,PHRASES.ko.order.reply);assert.equal(snap.reply.text,PHRASES[lang].order.reply);assert.equal(snap.reply.interpretation.replyTo,snap.request.id);assert.equal(snap.order,null);
 }
});
test('only confirmation creates one unpaid table 7 order; both panes derive the same lifecycle',()=>{
 let state=createShowcase();let id;
 for(let phase=0;phase<=7;phase++){
  const snap=showcaseSnapshot(state);assert.equal(state.phase,phase);
  if(phase<4)assert.equal(snap.order,null);
  else {id??=snap.order.id;assert.equal(snap.order.id,id);assert.equal(snap.order.status,['pending','accepted','preparing','ready'][phase-4]);assert.equal(snap.order.table,7);assert.deepEqual(snap.order.fulfillment,{channel:'dine-in',table:7});assert.equal(snap.order.total,129000);assert.equal(snap.order.currency,'VND');assert.equal(snap.order.payment,'unpaid');assert.equal(snap.order.lines[0].quantity,1);}
  const before=state;state=advanceShowcase(state);assert.equal(before.phase,phase);
 }
 assert.equal(advanceShowcase(state),state);assert.equal(showcaseSnapshot(state).ready,true);
 const restart=createShowcase(state.guestLang);assert.notEqual(restart.runId,state.runId);assert.equal(showcaseSnapshot(restart).order,null);
});
test('stale manual click cannot skip phases or change a completed order',()=>{
 const state=advanceShowcase(createShowcase());assert.equal(advanceShowcase(state,0),state);
 const final={...state,phase:7};assert.equal(advanceShowcase(final,7),final);
});
test('restoration validates state and keeps only isolated scenario metadata',()=>{
 const state={...createShowcase('ja'),phase:6};assert.deepEqual(restoreShowcase(JSON.stringify({...state,extra:'not persisted'})),state);
 for(const raw of ['bad','null','{}',JSON.stringify({...state,phase:8}),JSON.stringify({...state,phase:-1}),JSON.stringify({...state,guestLang:'xx'}),JSON.stringify({...state,at:'invalid'}),JSON.stringify({...state,runId:'<img>'})])assert.equal(restoreShowcase(raw).phase,0);
 assert.equal(createShowcase('invalid').guestLang,'vi');assert.equal(SHOWCASE_KEY,'one-shop-book-showcase-v1');
});
test('pause/restart/dispose invalidate already queued timers and playback stops at ready',()=>{
 let state=createShowcase(),queue=[],cancelled=[],changes=0;
 const player=createShowcasePlayer({schedule:fn=>{queue.push(fn);return queue.length;},cancel:id=>cancelled.push(id),advance:()=>{state=advanceShowcase(state);return state.phase<7;},onChange:()=>changes++});
 player.play();player.play();assert.equal(queue.length,1);const stale=queue[0];player.pause();stale();assert.equal(state.phase,0);assert.equal(player.running,false);assert.deepEqual(cancelled,[1]);
 player.play();let cursor=1;while(player.running)queue[cursor++]();assert.equal(state.phase,7);assert.equal(queue.length,8);assert.ok(changes>=9);
 state=createShowcase();player.play();const old=queue.at(-1);player.dispose();old();assert.equal(state.phase,0);
});
test('showcase copy is complete for nine locales with seven steps',()=>{
 assert.deepEqual(Object.keys(SHOWCASE_COPY).sort(),Object.keys(LANGS).sort());
 for(const c of Object.values(SHOWCASE_COPY)){assert.deepEqual(Object.keys(c).sort(),Object.keys(SHOWCASE_COPY.ko).sort());assert.equal(c.stepLabels.length,7);assert.equal(c.stepNotes.length,7);for(const value of Object.values(c))assert.ok(Array.isArray(value)?value.every(s=>typeof s==='string'&&s.trim()):typeof value==='string'&&value.trim());}
});
test('book showcase never imports shop persistence, cloud clients, actual AI or payments',async()=>{
 const files=await Promise.all(['../dist/showcase.js','../dist/shared/showcase-state.js'].map(p=>readFile(new URL(p,import.meta.url),'utf8')));
 for(const source of files)assert.doesNotMatch(source,/\bfetch\s*\(|\bXMLHttpRequest\b|\bWebSocket\b|localStorage|supabase|cloud\.js|store\.js|payment\.js/);
});
