import assert from 'node:assert/strict';import fs from 'node:fs/promises';import {MENU} from '../dist/shared/menu.js';import {createClient} from '@supabase/supabase-js';
const url='https://zaorqadwuqvfpwjefomh.supabase.co',key='sb_publishable_VA0y3BmIgzNPe3E9bh5oMg_xFIVb2WV',base=url+'/functions/v1/modu-api';
async function api(path,method='GET',data,token,expected=200){const res=await fetch(base+'/'+path,{method,headers:{apikey:key,'content-type':'application/json',...(token?{'x-modu-token':token}:{})},body:data?JSON.stringify(data):undefined});const b=await res.json();assert.equal(res.status,expected,JSON.stringify(b));return b;}
const path='artifacts/cloud-fixtures.json';await fs.mkdir('artifacts',{recursive:true});let creds;try{creds=JSON.parse(await fs.readFile(path,'utf8'));}catch{creds={};}
const setup={store:{name:'주모 · 연결 테스트',address:'호찌민 · 개발 확인용 매장',country:'VN'},menu:MENU,workspace:{manager:{profileName:'QA',stage:'name',completed:false,messages:[]}}};
// Test passwords stay in the ignored local fixture file, never in published assets.
const authPath='artifacts/owner-auth-fixtures.json';let authFixtures;try{authFixtures=JSON.parse(await fs.readFile(authPath,'utf8'));}catch{authFixtures={};}
for(const name of ['ownerA','ownerB']){
 const existing=creds[name];authFixtures[name]??={password:crypto.randomUUID()+'!Rami',...(existing?{legacy:existing}:{})};const fixture=authFixtures[name];
 await fs.writeFile(authPath,JSON.stringify(authFixtures),{mode:0o600});
 if(!existing)creds[name]=await api('create','POST',{...setup,password:fixture.password},null,201);
 else {const info=await api(existing.storeId+'/owner-auth','GET',null,existing.token);if(info.mode!=='session')creds[name]=await api(existing.storeId+'/owner-auth/'+(info.mode==='setup'?'setup':'login'),'POST',{password:fixture.password},info.mode==='setup'?existing.token:undefined);}
 fixture.session=creds[name];await fs.writeFile(authPath,JSON.stringify(authFixtures),{mode:0o600});await fs.writeFile(path,JSON.stringify(creds),{mode:0o600});
}
const a=creds.ownerA,b=creds.ownerB;
let snapshot=await api(a.storeId+'/snapshot','GET',null,a.token);await api(a.storeId+'/store','PUT',{store:setup.store,menu:MENU,workspace:{manager:{profileName:'QA',stage:'ready',completed:true,messages:[]}},published:true,revision:snapshot.revision,workspaceRevision:snapshot.workspaceRevision},a.token);
snapshot=await api(a.storeId+'/snapshot','GET',null,a.token);
for(const name of ['guestA','guestB']){if(!creds[name]){creds[name]=await api(a.storeId+'/visits','POST',{table:name==='guestA'?3:8,lang:'ko'},null,201);await fs.writeFile(path,JSON.stringify(creds),{mode:0o600});}}
const ga=creds.guestA,gb=creds.guestB;
await api(a.storeId+'/snapshot','GET',null,null,401);await api(a.storeId+'/snapshot','GET',null,b.token,403);
const client=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});let received;let wake;const signal=new Promise(r=>wake=r);const ch=client.channel('modu:'+a.storeId).on('broadcast',{event:'refresh'},msg=>{received=msg.payload;wake();});await new Promise((resolve,reject)=>{const timeout=setTimeout(()=>reject(Error('realtime timeout')),12000);ch.subscribe(s=>{if(s==='SUBSCRIBED'){clearTimeout(timeout);resolve();}});});
const orderReq={cart:{m01:2},fulfillment:{channel:'dine-in',table:3},revision:snapshot.revision,requestId:crypto.randomUUID(),total:1};const order=await api(a.storeId+'/orders','POST',orderReq,ga.token,201);assert.equal(order.total,MENU[0].price*2);assert.equal(order.payment,'unpaid');assert.equal((await api(a.storeId+'/orders','POST',orderReq,ga.token,201)).id,order.id);
await Promise.race([signal,new Promise((_,reject)=>setTimeout(()=>reject(Error('broadcast missing')),10000))]);assert(Object.keys(received).every(k=>k==='id'));assert(!JSON.stringify(received).includes('테스트'));await client.removeAllChannels();
assert(!(await api(a.storeId+'/snapshot','GET',null,gb.token)).orders.some(o=>o.id===order.id));assert((await api(a.storeId+'/snapshot','GET',null,a.token)).orders.some(o=>o.id===order.id));await api(a.storeId+'/orders/'+order.id,'PATCH',{status:'accepted'},gb.token,403);await api(a.storeId+'/orders/'+order.id,'PATCH',{status:'accepted'},a.token);
await api(a.storeId+'/orders','POST',{...orderReq,requestId:crypto.randomUUID(),revision:0},ga.token,409);
const date=new Date(Date.now()+86400000).toISOString().slice(0,10),booking=await api(a.storeId+'/reservations','POST',{date,time:'19:00',name:'테스트 손님',partySize:2,requestId:crypto.randomUUID()},ga.token,201);await api(a.storeId+'/reservations/'+booking.id,'PATCH',{status:'cancelled'},gb.token,409);await api(a.storeId+'/reservations/'+booking.id,'PATCH',{status:'confirmed'},a.token);
for(const table of ['modu_stores','modu_owners','modu_orders','modu_visits','modu_messages']){const r=await fetch(url+'/rest/v1/'+table+'?select=*',{headers:{apikey:key}});assert(r.status===401||r.status===403,table+' public access');}
console.log('PASS: cross-device store, server-priced idempotent order, owner realtime invalidation, reservation, isolation and direct REST denial');
