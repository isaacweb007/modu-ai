import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createOwnerJourney,OWNER_JOURNEY_STEPS,OWNER_JOURNEY_TABS} from '../dist/shared/owner-journey-state.js';
import {OWNER_JOURNEY_COPY} from '../dist/shared/owner-journey-copy.js';
import {createShowcasePlayer} from '../dist/shared/showcase-state.js';
import {LANGS} from '../dist/shared/locale.js';

test('owner journey preserves the same shop and every order across login, recovery, sign-in and replay',()=>{
 const d=createOwnerJourney(new Date('2026-10-28T01:00:00Z')),before=d.snapshot(),visited=[d.step];
 assert.deepEqual([before.items.length,before.orders.length,before.reservations.length],[8,4,3]);
 while(!d.complete){assert(d.advance());visited.push(d.step);assert.deepEqual(d.snapshot(),before);}
 assert.deepEqual(visited,OWNER_JOURNEY_STEPS);assert.equal(d.tab,'orders');
 assert(before.orders.some(o=>o.table&&o.fulfillment.channel==='dine-in'));
 assert(before.orders.some(o=>o.fulfillment.channel==='online'&&o.fulfillment.address&&o.fulfillment.phone));
 assert.equal(d.advance(),false);d.restart();assert.equal(d.step,'login');assert.deepEqual(d.snapshot(),before);
 const copy=d.snapshot();copy.orders[0].total=0;copy.items.length=0;assert.deepEqual(d.snapshot(),before);
});
test('manual navigation stays bounded and history tabs cannot alter stored records',()=>{
 const d=createOwnerJourney(),before=d.snapshot();assert.equal(d.back(),false);assert.equal(d.advance(4),false);
 for(const value of [-1,7,Infinity,NaN,1.5,'5'])assert.equal(d.go(value),false);
 assert.equal(d.selectTab('orders'),false);d.go(5);
 for(const tab of OWNER_JOURNEY_TABS){assert(d.selectTab(tab));assert.equal(d.tab,tab);assert.deepEqual(d.snapshot(),before);}
 assert.equal(d.selectTab('security'),false);d.back();assert.equal(d.step,'signin');assert.equal(d.selectTab('menu'),false);
});
test('automatic owner journey finishes once; pause, manual navigation and disposal cancel queued steps',()=>{
 const d=createOwnerJourney(),tasks=new Map();let id=0;
 const player=createShowcasePlayer({advance:()=>{d.advance();return !d.complete;},onChange:()=>{},schedule:fn=>{tasks.set(++id,fn);return id;},cancel:key=>tasks.delete(key)});
 const tick=()=>{const [key,fn]=tasks.entries().next().value;tasks.delete(key);fn();};
 player.play();const stale=[...tasks.values()][0];player.pause();stale();assert.equal(d.phase,0);assert.equal(tasks.size,0);
 player.play();tick();assert.equal(d.phase,1);const queued=[...tasks.values()][0];player.dispose();d.go(3);queued();assert.equal(d.phase,3);
 player.play();while(tasks.size)tick();assert.equal(d.step,'orders');assert.equal(player.running,false);
 d.restart();player.play();tick();assert.equal(d.phase,1);player.dispose();assert.equal(tasks.size,0);
});
test('owner journey has complete nine-language narration for all seven steps',()=>{
 assert.deepEqual(Object.keys(OWNER_JOURNEY_COPY).sort(),Object.keys(LANGS).sort());
 for(const c of Object.values(OWNER_JOURNEY_COPY)){assert.deepEqual(Object.keys(c),Object.keys(OWNER_JOURNEY_COPY.ko));assert.equal(c.notes.length,OWNER_JOURNEY_STEPS.length);for(const [key,value] of Object.entries(c))assert(key==='notes'?value.every(v=>typeof v==='string'&&v.trim()):typeof value==='string'&&value.trim());}
});
test('book simulation never reads auth storage, sends email, submits credentials or connects to a backend',()=>{
 for(const file of ['dist/owner-journey.js','dist/shared/owner-journey-state.js']){
  const source=fs.readFileSync(new URL('../'+file,import.meta.url),'utf8');
  assert(!/fetch\s*\(|XMLHttpRequest|cloud\.js|owner-auth\.js|supabase|sendMail|\.rpc\(|localStorage|sessionStorage|<form|<input/.test(source));
 }
 const book=fs.readFileSync(new URL('../dist/book.js',import.meta.url),'utf8');assert(book.includes('ownerJourneyShell()'));assert(book.includes('disposeOwnerJourney()'));assert(book.includes('href="#owner-demo"'));
});
