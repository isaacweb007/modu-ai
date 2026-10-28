import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createShopSetup,createSetupGuestState,SETUP_STEPS,SETUP_PHOTO,setupGuestUrl} from '../dist/shared/shop-setup-state.js';
import {SHOP_SETUP_COPY} from '../dist/shared/shop-setup-copy.js';
import {LANGS} from '../dist/shared/locale.js';
import {MENU} from '../dist/shared/menu.js';
import {createShowcasePlayer} from '../dist/shared/showcase-state.js';

test('photo-to-shop flow requires explicit menu approval before a link can be published',()=>{
 const d=createShopSetup(),visited=[d.step];
 assert.equal(d.confirm(),false);assert.equal(d.advance(3),false);
 while(d.phase<3){assert.equal(d.link(),null);assert(d.advance());visited.push(d.step);}
 assert.equal(d.advance(),false);assert.equal(d.link(),null);assert.equal(d.confirm(2),false);
 assert(d.confirm());visited.push(d.step);assert.equal(d.approved,true);assert.equal(d.link(),null);
 assert(d.advance());visited.push(d.step);assert.deepEqual(visited,SETUP_STEPS);
 assert.equal(d.link(),setupGuestUrl('ko'));assert.equal(d.advance(),false);assert.equal(d.confirm(),false);
 assert(d.back());assert.equal(d.link(),null);assert(d.back());assert.equal(d.approved,false);assert.equal(d.advance(),false);
 d.restart();assert.equal(d.phase,0);assert.equal(d.approved,false);assert.equal(d.link(),null);assert.equal(d.back(),false);
});
test('the photo scenario, approved menu and QR guest sample share the same eight VND prices',()=>{
 const d=createShopSetup(),s=createSetupGuestState('vi');
 assert.deepEqual(d.menu(),MENU);assert.deepEqual(s.items,MENU);assert.deepEqual(s.menu,{});
 assert.deepEqual(d.menu().map(x=>x.price),[129000,249000,289000,119000,39000,69000,79000,69000]);
 assert.equal(s.store.name,'주모 · JUMO');assert.equal(s.store.country,'VN');
 assert.equal(s.orders.length,0);assert.equal(s.sessions.length,0);assert.equal(s.events.length,0);
 const edited=d.menu();edited[0].price=1;assert.equal(d.menu()[0].price,129000);
 s.items[0].price=2;assert.equal(createSetupGuestState().items[0].price,129000);
 assert(fs.existsSync(new URL('../dist/'+SETUP_PHOTO,import.meta.url)));
});
test('sample QR codes encode public isolated guest URLs with a four-module quiet zone',()=>{
 const ctx={};vm.createContext(ctx);vm.runInContext(fs.readFileSync(new URL('../dist/assets/qrcode.min.js',import.meta.url),'utf8'),ctx);
 for(const lang of Object.keys(LANGS)){
  const url=new URL(setupGuestUrl(lang));assert.equal(url.origin,'https://isaacweb007.github.io');assert.equal(url.pathname,'/modu-ai/jumo/');
  assert.deepEqual([...url.searchParams.keys()],['lang','preview','sample','table','v']);
  assert.equal(url.searchParams.get('lang'),lang);assert.equal(url.searchParams.get('sample'),'onboarding');assert.equal(url.searchParams.get('preview'),'1');
  const q=ctx.qrcode(0,'M');q.addData(url.href);q.make();
  const actual=fs.readFileSync(new URL(`../dist/assets/one-shop/onboarding/qr-${lang}.svg`,import.meta.url),'utf8');
  assert.equal(actual,q.createSvgTag({cellSize:6,margin:24,scalable:true}));
 }
 assert.equal(new URL(setupGuestUrl('invalid')).searchParams.get('lang'),'ko');
});
test('the sample guest overwrites only preview memory, leaving existing local shop records untouched',async()=>{
 const saved=JSON.stringify({version:2,store:{name:'Existing shop'},menu:{m01:{price:1}},sessions:[],orders:[],events:[]});
 let writes=0;
 globalThis.location={search:'?preview=1&sample=onboarding'};globalThis.document={body:{dataset:{role:'guest'}}};
 globalThis.localStorage={getItem:()=>saved,setItem:()=>{writes++;}};
 try{
  const state=await import('../dist/shared/state.js?setup-test');
  state.replaceState(createSetupGuestState());
  assert.equal(state.readState().store.name,'주모 · JUMO');assert.equal(state.menuFor(state.readState())[0].price,129000);
  state.ensureSession(7,'vi');assert.equal(state.readState().sessions[0].lang,'vi');assert.equal(writes,0);
  assert.equal(localStorage.getItem('modu-jumo-demo-v2'),saved);
 }finally{delete globalThis.location;delete globalThis.document;delete globalThis.localStorage;}
 const guest=fs.readFileSync(new URL('../dist/jumo/conversation.js',import.meta.url),'utf8');
 assert(guest.includes("if(!owner&&preview&&params.get('sample')==='onboarding')replaceState(createSetupGuestState(lang));"));
});
test('autoplay confirms the scripted approval; pausing and resetting cannot run stale callbacks',()=>{
 const d=createShopSetup(),jobs=new Map();let seq=0;
 const p=createShowcasePlayer({advance:()=>{d.phase===3?d.confirm():d.advance();return !d.complete;},onChange:()=>{},schedule:fn=>{jobs.set(++seq,fn);return seq;},cancel:id=>jobs.delete(id)});
 p.play();const stale=[...jobs.values()][0];p.pause();stale();assert.equal(d.phase,0);
 p.play();while(jobs.size){const [id,fn]=jobs.entries().next().value;jobs.delete(id);fn();}
 assert(d.approved);assert(d.complete);assert.equal(p.running,false);
 d.restart();p.play();const old=[...jobs.values()][0];p.dispose();d.restart();old();assert.equal(d.phase,0);assert.equal(d.link(),null);
});
test('setup narration and menu labels exist in all nine languages, without real API or upload dependencies',()=>{
 assert.deepEqual(Object.keys(SHOP_SETUP_COPY).sort(),Object.keys(LANGS).sort());
 for(const [lang,c] of Object.entries(SHOP_SETUP_COPY)){
  assert.deepEqual(Object.keys(c),Object.keys(SHOP_SETUP_COPY.ko));assert.equal(c.steps.length,6);
  for(const [key,value] of Object.entries(c))assert(key==='steps'?value.every(x=>x.trim()):typeof value==='string'&&value.trim(),`${lang}.${key}`);
  for(const item of MENU)assert(item.name[lang]?.trim());
 }
 for(const file of ['dist/shop-setup.js','dist/shared/shop-setup-state.js']){
  const source=fs.readFileSync(new URL('../'+file,import.meta.url),'utf8');
  assert.doesNotMatch(source,/fetch\s*\(|XMLHttpRequest|cloud\.js|supabase|\.rpc\(|localStorage|sessionStorage|type="file"/);
 }
});
