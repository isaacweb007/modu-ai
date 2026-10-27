import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createClient} from '@supabase/supabase-js';
import {CLOUD} from '../dist/shared/cloud-config.js';
import {PHRASES} from '../dist/shared/interpreter.js';
const f=JSON.parse(await fs.readFile('artifacts/cloud-fixtures.json','utf8')),owner=f.ownerA,guest=f.guestA,other=f.guestB;
const base=CLOUD.url+'/functions/v1/modu-api/';
async function api(path,token,method='GET',data,status=200){const r=await fetch(base+path,{method,headers:{apikey:CLOUD.key,'content-type':'application/json',...(token?{'x-modu-token':token}:{})},body:data?JSON.stringify(data):undefined});const body=await r.json();assert.equal(r.status,status,JSON.stringify(body));return body;}
const client=createClient(CLOUD.url,CLOUD.key,{auth:{persistSession:false,autoRefreshToken:false}});let received=0;
const ch=client.channel('modu:'+owner.storeId).on('broadcast',{event:'refresh'},m=>{assert.deepEqual(Object.keys(m.payload),['id']);received++;});
try{
 await new Promise((resolve,reject)=>{const timeout=setTimeout(()=>reject(Error('realtime subscribe timeout')),10000);ch.subscribe(s=>{if(s==='SUBSCRIBED'){clearTimeout(timeout);resolve();}});});
 const snap=()=>api(owner.storeId+'/snapshot',owner.token);
 const before=await snap(),data={lang:'vi',scenarioId:'water',original:PHRASES.vi.water.request,requestId:'interp-'+crypto.randomUUID()};
 const m=await api(owner.storeId+'/interpreter',guest.token,'POST',data,201);
 assert.equal(m.interpretation.ko,PHRASES.ko.water.request);assert.equal(m.text,data.original);
 assert.deepEqual(await api(owner.storeId+'/interpreter',guest.token,'POST',data,201),m);
 let view=await snap();assert.equal(view.orders.length,before.orders.length);assert.equal(view.reservations.length,before.reservations.length);assert(view.messages.some(x=>x.request_id===m.id));
 assert(!(await api(owner.storeId+'/snapshot',other.token)).messages.some(x=>x.request_id===m.id));
 const body={visitId:guest.visitId,replyTo:m.id};
 await api(owner.storeId+'/interpreter-reply',guest.token,'POST',body,403);
 await api(owner.storeId+'/interpreter-reply',f.ownerB.token,'POST',body,403);
 await api(owner.storeId+'/interpreter-reply',owner.token,'POST',{...body,visitId:other.visitId},404);
 const reply=await api(owner.storeId+'/interpreter-reply',owner.token,'POST',body,201);
 assert.equal(reply.text,PHRASES.vi.water.reply);assert.equal(reply.interpretation.original,PHRASES.ko.water.reply);
 assert.deepEqual(await api(owner.storeId+'/interpreter-reply',owner.token,'POST',body,201),reply);
 const mine=await api(owner.storeId+'/snapshot',guest.token);assert.equal(mine.messages.filter(x=>x.request_id===reply.id).length,1);
 assert(!(await api(owner.storeId+'/snapshot',other.token)).messages.some(x=>x.request_id===reply.id));
 await api(owner.storeId+'/interpreter',guest.token,'POST',{...data,original:'Tôi không bị dị ứng.',scenarioId:'allergy'},400);
 await api(owner.storeId+'/messages',guest.token,'POST',{records:[reply]},400);
 for(const lang of ['en','zh','ja','km','lo','hi','id']){const r=await api(owner.storeId+'/interpreter',guest.token,'POST',{lang,scenarioId:'mild',original:PHRASES[lang].mild.request,requestId:'interp-'+crypto.randomUUID()},201);const a=await api(owner.storeId+'/interpreter-reply',owner.token,'POST',{visitId:guest.visitId,replyTo:r.id},201);assert.equal(a.text,PHRASES[lang].mild.reply);}
 const orderData={cart:{m01:1},revision:before.revision,requestId:crypto.randomUUID(),lang:'vi',fulfillment:{channel:'dine-in',table:3}};
 const order=await api(owner.storeId+'/orders',guest.token,'POST',orderData,201);
 await api(owner.storeId+'/orders',guest.token,'POST',{...orderData,lang:'ja'},201);
 const receipt=(await snap()).messages.find(m=>m.request_id==='receipt-'+order.id)?.payload;
 assert.equal(receipt.interpretation.sourceLang,'vi');assert(receipt.interpretation.ko.includes(order.lines[0].name.ko));assert(receipt.text.includes(order.lines[0].name.vi));
 const booking=await api(owner.storeId+'/reservations',guest.token,'POST',{date:new Date(Date.now()+86400000).toISOString().slice(0,10),time:'19:00',partySize:2,name:'Interpreter demo',lang:'ja',requestId:crypto.randomUUID()},201);
 assert.equal((await snap()).messages.find(m=>m.request_id==='receipt-'+booking.id)?.payload.interpretation.sourceLang,'ja');
 assert(received>0,'realtime invalidation received');
 console.log('PASS: 8 foreign languages + Korean pairing, owner reply, realtime, idempotency, foreign-guest/foreign-shop isolation, unsupported text rejection, frozen order and booking language.');
} finally {await client.removeAllChannels();}
