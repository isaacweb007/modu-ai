import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createIntegratedDemo,INTEGRATED_STEPS} from '../dist/shared/integrated-demo-state.js';
import {INTEGRATED_COPY} from '../dist/shared/integrated-demo-copy.js';
import {createShowcase,createShowcasePlayer,SHOWCASE_PANES,showcaseSnapshot} from '../dist/shared/showcase-state.js';
import {showcaseViews} from '../dist/showcase.js';
import {shopSetupScreen} from '../dist/shop-setup.js';
import {LANGS} from '../dist/shared/locale.js';
const step=d=>d.phase===3?d.confirm():d.advance();

test('one journey carries the approved menu into a Vietnamese table order and all four ready screens',()=>{
 const d=createIntegratedDemo(),menu=d.menu(),visited=[];let orderId;
 for(let phase=0;phase<15;phase++){
  assert.equal(d.phase,phase);visited.push(d.step);assert.deepEqual(d.menu(),menu);
  assert.equal(d.approved,phase>=4);assert.equal(!!d.link(),phase>=5);
  if(phase<6)assert.equal(d.snapshot(),null);
  else{
   const s=d.snapshot();assert.equal(d.guestLang,'vi');assert.equal(s.item.id,menu[0].id);assert.equal(s.item.price,menu[0].price);
   assert.equal(s.fulfillment.table,7);assert.equal(s.activePane,d.actor);
   if(phase>=8){assert.equal(s.request.interpretation.sourceLang,'vi');assert(s.request.interpretation.ko.includes('김치전'));}
   if(phase<11)assert.equal(s.order,null);
   else{orderId??=s.order.id;assert.equal(s.order.id,orderId);assert.equal(s.order.lang,'vi');assert.equal(s.order.table,7);assert.equal(s.order.total,menu[0].price);assert.equal(s.order.payment,'unpaid');assert.equal(s.order.status,['pending','accepted','preparing','ready'][phase-11]);}
  }
  step(d);
 }
 assert.deepEqual(visited,INTEGRATED_STEPS);assert(d.complete);assert.equal(d.advance(),false);
 const s=d.snapshot(),views=showcaseViews(d.serviceState(),'ko',{lounge:false});
 for(const role of SHOWCASE_PANES){const html=views.appPane(role,s);assert(html.includes(s.order.id));assert(html.includes('data-order-status="ready"'));}
 assert(views.appPane('guest',s).includes('lang="vi"'));assert(views.appPane('owner',s).includes(s.request.interpretation.ko));
});
test('confirmation, actor and phase guards prevent skipped review or kitchen acceptance',()=>{
 const d=createIntegratedDemo();assert.equal(d.confirm(),false);
 while(d.phase<3)assert(d.advance());assert.equal(d.advance(),false);assert.equal(d.link(),null);assert.equal(d.confirm(2),false);assert(d.confirm());
 while(d.phase<11)assert(d.advance());assert.equal(d.actor,'floor');assert.equal(d.advance(11,'kitchen'),false);assert.equal(d.advance(10,'floor'),false);
 assert(d.advance(11,'floor'));assert.equal(d.actor,'kitchen');assert.equal(d.advance(12,'owner'),false);
 assert(d.advance(12,'kitchen'));assert(d.advance(13,'kitchen'));assert(d.complete);
});
test('language selection and backward navigation retain the shop but remove future outcomes',()=>{
 const d=createIntegratedDemo();assert.equal(d.selectLanguage('en'),false);while(d.phase<6)step(d);
 const id=d.runId,menu=d.menu();assert.equal(d.selectLanguage('invalid'),false);assert(d.selectLanguage('ja'));assert.equal(d.runId,id);assert.deepEqual(d.menu(),menu);
 while(!d.complete)step(d);assert.equal(d.snapshot().order.lang,'ja');assert.equal(d.selectLanguage('en'),false);
 while(d.phase>10)d.back();assert.equal(d.snapshot().order,null);
 while(d.phase>3)d.back();assert.equal(d.approved,false);assert.equal(d.link(),null);assert.equal(d.advance(),false);
 while(d.phase>0)d.back();assert.equal(d.back(),false);assert.deepEqual(d.menu(),menu);
});
test('replay starts with no approval or order and rejects a prior run’s action',()=>{
 const d=createIntegratedDemo(),run=d.runId;while(!d.complete)step(d);d.restart();assert.notEqual(d.runId,run);assert.equal(d.phase,0);assert.equal(d.snapshot(),null);assert.equal(d.approved,false);assert.equal(d.link(),null);assert.equal(d.guestLang,'vi');
 assert.equal(d.advance(0,'owner',run),false);while(d.phase<3)step(d);assert.equal(d.confirm(3,run),false);
});
test('one player crosses setup, QR, language and service exactly once; cancelled callbacks cannot cross boundaries',()=>{
 const d=createIntegratedDemo(),jobs=new Map();let id=0;
 const p=createShowcasePlayer({advance:()=>{step(d);return !d.complete;},onChange:()=>{},schedule:fn=>{jobs.set(++id,fn);return id;},cancel:key=>jobs.delete(key)});
 const tick=()=>{const [key,fn]=jobs.entries().next().value;jobs.delete(key);fn();};
 p.play();while(d.phase<5)tick();const pending=[...jobs.values()][0];p.pause();pending();assert.equal(d.phase,5);assert.equal(jobs.size,0);
 p.play();while(jobs.size)tick();assert.equal(d.phase,14);assert.equal(p.running,false);assert(d.snapshot().ready);
 d.restart();p.play();const stale=[...jobs.values()][0];p.dispose();d.restart();stale();assert.equal(d.phase,0);assert.equal(jobs.size,0);
});
test('shared setup and service renderers still support nine languages and all original order scenarios',()=>{
 assert.deepEqual(Object.keys(INTEGRATED_COPY).sort(),Object.keys(LANGS).sort());
 for(const lang of Object.keys(LANGS)){
  assert.deepEqual(Object.keys(INTEGRATED_COPY[lang]),Object.keys(INTEGRATED_COPY.ko));assert(Object.values(INTEGRATED_COPY[lang]).every(v=>typeof v==='string'&&v.trim()));
  const d=createIntegratedDemo();while(d.phase<6){const html=shopSetupScreen(d.setupView(),lang);assert(!html.includes('undefined'));assert.equal(html.includes('setup-qr'),d.phase===5);step(d);}
  for(const scenario of ['dineIn','booking','delivery'])for(let phase=0;phase<=(scenario==='booking'?7:8);phase++){
   const state={...createShowcase(lang,undefined,undefined,scenario),phase},views=showcaseViews(state,lang);
   for(const role of SHOWCASE_PANES){const html=views.appPane(role,showcaseSnapshot(state));assert(!html.includes('undefined'));assert(html.includes(`data-pane="${role}"`));}
  }
 }
});
test('integrated presentation has no account, storage, AI, mail, upload or payment connection',()=>{
 for(const file of ['dist/integrated-demo.js','dist/shared/integrated-demo-state.js']){
  const src=fs.readFileSync(new URL('../'+file,import.meta.url),'utf8');assert.doesNotMatch(src,/fetch\s*\(|XMLHttpRequest|WebSocket|localStorage|sessionStorage|supabase|cloud\.js|owner-auth\.js|type="file"/);
 }
 const book=fs.readFileSync(new URL('../dist/book.js',import.meta.url),'utf8');assert(book.includes('integratedDemoShell()'));assert(book.includes('disposeIntegratedDemo()'));assert(book.includes('href="#integrated-demo"'));
});
