import test from 'node:test';
import assert from 'node:assert/strict';
import {validDemo,connectedAppLinks,consumeDemoOwnerLink,verifiedDemoCredential,readDemo} from '../dist/shared/connected-demo.js';
const id='11111111-1111-4111-8111-111111111111',member='22222222-2222-4222-8222-222222222222',token='a'.repeat(64);
const fixture=()=>({storeId:id,expiresAt:new Date(Date.now()+86400000).toISOString(),owner:{storeId:id,token},floor:{member:{id:member},token:'b'.repeat(64)},kitchen:{member:{id:'33333333-3333-4333-8333-333333333333'},token:'c'.repeat(64)}});
test('four independent app links share a shop and retain only their own capability',()=>{
 for(const base of ['https://example.test/','https://example.test/modu-ai/']){
  const room=fixture(),links=connectedAppLinks(room,'vi',base);
  for(const [role,href] of Object.entries(links)){
   const u=new URL(href);assert.equal(u.searchParams.get('store'),id);assert.equal(u.searchParams.get('lang'),'vi');assert(!u.searchParams.has('role'));assert(!u.searchParams.has('access'));assert(u.pathname.startsWith(new URL(base).pathname+'jumo/'));
   assert.equal(u.hash,role==='guest'?'':'#access='+room[role].token);
  }
 }
});
test('owner entry clears fragments, requires a server-confirmed demo, and never promotes a real owner session',()=>{
 let sanitized;const c=consumeDemoOwnerLink(connectedAppLinks(fixture(),'ko','https://example.test/').owner,u=>sanitized=u);assert(!new URL(sanitized).hash);
 const result={mode:'session',storeId:id,demo:true,expiresAt:fixture().expiresAt};assert.equal(verifiedDemoCredential(c,result).token,token);
 for(const change of [{demo:false},{demo:undefined},{mode:'login'},{storeId:member},{expiresAt:'invalid'},{expiresAt:new Date(0).toISOString()}])assert.throws(()=>verifiedDemoCredential(c,{...result,...change}));
 assert.throws(()=>consumeDemoOwnerLink('https://example.test/?demo=shared&store='+id+'#access=bad',u=>sanitized=u));assert(!new URL(sanitized).hash);
});
test('expired, malformed and mismatched rooms fail closed',()=>{
 const r=fixture();assert(validDemo(r));assert(!validDemo(r,Date.parse(r.expiresAt)+1));assert(!validDemo({...r,owner:{...r.owner,storeId:member}}));assert.equal(readDemo({getItem:()=>'{bad'}),null);assert.equal(readDemo({getItem:()=>JSON.stringify({...r,expiresAt:new Date(0).toISOString()})}),null);
});
