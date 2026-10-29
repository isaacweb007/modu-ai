import test from 'node:test';
import assert from 'node:assert/strict';
import {createPendingReadSync,pendingReadKeys} from '../dist/shared/pending-read-sync.js';
import {minimalNotificationEvents} from '../dist/shared/notification-inbox.js';
const makeStorage=()=>{const data=new Map();return {get length(){return data.size},key:i=>[...data.keys()][i]??null,getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,String(v)),removeItem:k=>data.delete(k),dump:()=>[...data]};};
const key=(n,type='requested')=>`counter:00000000-0000-4000-8000-${String(n).padStart(12,'0')}:${type}`;
const ev=(n,type='requested')=>({key:key(n,type),amendmentId:`00000000-0000-4000-8000-${String(n).padStart(12,'0')}`});
const context=(identity,events,reads=[])=>({identity,snapshot:{events,notificationReads:reads}});
const eventsFor=c=>c.snapshot.events;
const until=async fn=>{for(let n=0;n<200;n++){if(fn())return;await new Promise(r=>setTimeout(r,5));}throw Error('timed out');};
test('all roles retain offline reads and synchronize once the same identity reconnects',async()=>{
 for(const role of ['guest','floor','kitchen','owner']){
  const storage=makeStorage(),type=['guest','kitchen'].includes(role)?'approved':'requested',item=ev(1,type),identity='shop:'+role;
  let online=false,calls=0;const server=new Set();
  const sync=createPendingReadSync({storage,eventsFor,isOnline:()=>online,retryMs:5,importBatch:async batch=>{calls++;for(const e of batch)server.add(e.key);return {keys:batch.map(e=>e.key)};}});
  sync.update(context(identity,[item]));assert(sync.enqueue(identity,item.key));assert(sync.pending(identity).has(item.key));assert.equal(calls,0);
  // A new instance represents reopening the same browser with a durable pending receipt.
  sync.update(null);const reopened=createPendingReadSync({storage,eventsFor,isOnline:()=>online,retryMs:5,importBatch:async batch=>{calls++;for(const e of batch)server.add(e.key);return {keys:batch.map(e=>e.key)};}});
  reopened.update(context(identity,[item]));assert.equal(reopened.getStatus(),'retry');online=true;reopened.retry();await until(()=>server.has(item.key));
  assert.equal(calls,1);assert.equal(reopened.pending(identity).size,0);
  // A second device reads the server's actor-scoped snapshot.
  const secondDevice=context(identity,[item],[...server]);assert(secondDevice.snapshot.notificationReads.includes(item.key));
 }
});
test('a failed request preserves the durable receipt and retries without a second click',async()=>{
 const s=makeStorage(),item=ev(2),ctx=context('shop:owner',[item]);let calls=0;
 const sync=createPendingReadSync({storage:s,eventsFor,retryMs:5,importBatch:async batch=>{calls++;if(calls===1)throw Error('network');return {keys:batch.map(e=>e.key)};}});
 sync.update(ctx);sync.enqueue(ctx.identity,item.key);await until(()=>calls===1);assert(sync.pending(ctx.identity).has(item.key));await until(()=>sync.confirmed(ctx.identity).has(item.key));assert.equal(sync.pending(ctx.identity).size,0);assert.equal(calls,2);
});
test('identity isolation, permission changes and partial server rejection retain unsent records',async()=>{
 const s=makeStorage(),a=ev(1),b=ev(2),sent=[];let accepted=[a.key];
 const sync=createPendingReadSync({storage:s,eventsFor,importBatch:async batch=>{sent.push(...batch.map(x=>x.key));return {keys:accepted};}});
 sync.enqueue('shop:staff:a',a.key);sync.enqueue('shop:staff:a',b.key);
 sync.update(context('shop:staff:b',[a,b]));await new Promise(r=>setTimeout(r,10));assert.deepEqual(sent,[]);
 sync.update(context('shop:staff:a',[a]));await until(()=>sync.confirmed('shop:staff:a').has(a.key));assert(sync.pending('shop:staff:a').has(b.key));assert.deepEqual(sent,[a.key]);
 sync.update(context('shop:staff:a',[a,b]));await until(()=>sent.includes(b.key));assert(sync.pending('shop:staff:a').has(b.key));assert.equal(sync.getStatus(),'deferred');
 accepted=[b.key];sync.retry();await until(()=>!sync.pending('shop:staff:a').has(b.key));
});
test('separate pending keys never store customer details and storage failure is explicit',()=>{
 const s=makeStorage(),sync=createPendingReadSync({storage:s,eventsFor,importBatch:async()=>({keys:[]})});
 assert(sync.enqueue('shop:guest',key(1,'approved')));assert(sync.enqueue('shop:guest',key(2,'approved')));assert.equal(pendingReadKeys(s,'shop:guest').size,2);assert(s.dump().every(([k,v])=>k.startsWith('one-shop-pending-read:')&&v==='1'));
 assert.equal(sync.enqueue('shop:guest','not-an-event'),false);const full={...s,setItem(){throw Error('quota')}};assert.equal(createPendingReadSync({storage:full,eventsFor,importBatch:async()=>({})}).enqueue('shop:guest',key(3)),false);
});
test('offline staff notifications retain only minimal metadata and no customer or order details',()=>{
 const reduced=minimalNotificationEvents([{...ev(1),id:'order',type:'counterRequested',kind:'orders',at:'2026-01-01',row:{number:1,address:'private'},amendment:{after_data:{address:'private'}}}]);
 assert.equal(JSON.stringify(reduced).includes('private'),false);assert.equal(reduced[0].key,key(1));
});
