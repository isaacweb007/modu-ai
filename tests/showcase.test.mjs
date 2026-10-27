import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createShowcase,advanceShowcase,showcaseSnapshot,restoreShowcase,createShowcasePlayer,showcaseLast,SHOWCASE_SCENARIOS} from '../dist/shared/showcase-state.js';
import {SHOWCASE_COPY} from '../dist/shared/showcase-copy.js';
import {EXPANSION_COPY} from '../dist/shared/expansion-copy.js';
import {LANGS} from '../dist/shared/locale.js';

test('all three scenarios keep original, Korean meaning and reply in all nine languages',()=>{
 for(const scenario of SHOWCASE_SCENARIOS)for(const lang of Object.keys(LANGS)){
  let s=createShowcase(lang,undefined,undefined,scenario);assert.equal(showcaseSnapshot(s).request,null);
  s=advanceShowcase(s);assert.equal(showcaseSnapshot(s).request,null); // language selection comes first
  s=advanceShowcase(s);let snap=showcaseSnapshot(s);assert.ok(snap.request.text);assert.equal(snap.request.text,snap.phrases.request);assert.equal(snap.translated,false);
  s=advanceShowcase(s);snap=showcaseSnapshot(s);assert.equal(snap.translated,true);assert.equal(snap.request.interpretation.ko,snap.phrases.ko);assert.equal(snap.reply,null);
  s=advanceShowcase(s);snap=showcaseSnapshot(s);assert.equal(snap.reply.interpretation.original,snap.phrases.koReply);assert.equal(snap.reply.text,snap.phrases.reply);assert.equal(snap.reply.interpretation.replyTo,snap.request.id);assert.equal(snap.order,null);assert.equal(snap.booking,null);
 }
});
test('dine-in and delivery confirm one unpaid order and retain routing through every state',()=>{
 for(const scenario of ['dineIn','delivery']){let s=createShowcase('vi',undefined,undefined,scenario),id,route;
  for(let phase=0;phase<=8;phase++){const snap=showcaseSnapshot(s);assert.equal(s.phase,phase);assert.equal(snap.booking,null);if(phase<5)assert.equal(snap.order,null);else{id??=snap.order.id;route??=snap.order.fulfillment;assert.equal(snap.order.id,id);assert.deepEqual(snap.order.fulfillment,route);assert.equal(snap.order.status,['pending','accepted','preparing','ready'][phase-5]);assert.equal(snap.order.payment,'unpaid');assert.equal(snap.order.total,129000);assert.equal(snap.order.lines[0].quantity,1);if(scenario==='delivery'){assert.equal(snap.order.table,null);assert.match(route.address,/DEMO/);assert.equal(route.phone,'+84 000 000 000');}else assert.equal(snap.order.table,7);}s=advanceShowcase(s);}
  assert.equal(advanceShowcase(s),s);assert.equal(showcaseSnapshot(s).ready,true);
 }
});
test('booking stays separate from orders, freezes tomorrow in the shop timezone, and requires acceptance',()=>{
 let s=createShowcase('vi',undefined,'2026-10-27T20:00:00Z','booking'),id;
 for(let phase=0;phase<=7;phase++){const snap=showcaseSnapshot(s);assert.equal(snap.order,null);assert.equal(snap.bookingInfo.date,'2026-10-29');assert.equal(snap.bookingInfo.time,'19:00');assert.equal(snap.bookingInfo.partySize,2);if(phase<5)assert.equal(snap.booking,null);else{id??=snap.booking.id;assert.equal(snap.booking.id,id);assert.equal(snap.booking.status,phase>=6?'confirmed':'pending');assert.ok(!('payment' in snap.booking));}s=advanceShowcase(s);}
 assert.equal(showcaseLast(s),7);assert.equal(showcaseSnapshot(s).ready,true);assert.equal(advanceShowcase(s),s);
});
test('replay and scenario changes cannot reuse old records, stale clicks cannot advance',()=>{
 const state=advanceShowcase(createShowcase());assert.equal(advanceShowcase(state,0),state);
 const restarted=createShowcase(state.guestLang,undefined,undefined,'delivery');assert.notEqual(restarted.runId,state.runId);assert.equal(restarted.phase,0);assert.equal(showcaseSnapshot(restarted).order,null);
});
test('restoration validates scenario-specific bounds and keeps only isolated metadata',()=>{
 const s={...createShowcase('ja',undefined,undefined,'booking'),phase:6};assert.deepEqual(restoreShowcase(JSON.stringify({...s,extra:'drop'})),s);
 for(const raw of ['bad','null','{}',JSON.stringify({...s,phase:8}),JSON.stringify({...s,phase:-1}),JSON.stringify({...s,scenario:'unknown'}),JSON.stringify({...s,guestLang:'xx'}),JSON.stringify({...s,at:'invalid'}),JSON.stringify({...s,runId:'<img>'})])assert.equal(restoreShowcase(raw).phase,0);
});
test('pause/dispose invalidate queued callbacks and playback stops at the selected scenario end',()=>{
 for(const scenario of SHOWCASE_SCENARIOS){let s=createShowcase('vi',undefined,undefined,scenario),queue=[],cancelled=[];
 const p=createShowcasePlayer({schedule:fn=>{queue.push(fn);return queue.length;},cancel:id=>cancelled.push(id),advance:()=>{s=advanceShowcase(s);return s.phase<showcaseLast(s);},onChange:()=>{}});
 p.play();p.play();assert.equal(queue.length,1);const stale=queue[0];p.pause();stale();assert.equal(s.phase,0);assert.deepEqual(cancelled,[1]);p.play();let i=1;while(p.running)queue[i++]();assert.equal(s.phase,showcaseLast(s));s=createShowcase();p.play();const old=queue.at(-1);p.dispose();old();assert.equal(s.phase,0);}
});
test('new scenario, intro and team copy covers all nine locales',()=>{
 for(const catalog of [SHOWCASE_COPY,EXPANSION_COPY]){assert.deepEqual(Object.keys(catalog).sort(),Object.keys(LANGS).sort());for(const c of Object.values(catalog)){assert.deepEqual(Object.keys(c).sort(),Object.keys(catalog.ko).sort());for(const [k,v] of Object.entries(c)){if(Array.isArray(v)){assert.equal(v.length,catalog.ko[k].length);assert.ok(v.every(x=>typeof x==='string'&&x.trim()));}else assert.ok(typeof v==='string'&&v.trim());}}}
});
test('paired presentation never imports cloud clients, actual AI or payment code',async()=>{
 for(const file of ['../dist/showcase.js','../dist/shared/showcase-state.js']){const src=await readFile(new URL(file,import.meta.url),'utf8');assert.doesNotMatch(src,/\bfetch\s*\(|\bXMLHttpRequest\b|\bWebSocket\b|localStorage|supabase|cloud\.js|store\.js|payment\.js/);}
});
