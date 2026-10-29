import assert from 'node:assert/strict';
import {CLOUD} from '../dist/shared/cloud-config.js';
import {createOwnerSample} from '../dist/shared/owner-sample.js';
import {createPendingReadSync} from '../dist/shared/pending-read-sync.js';
const api=async(path,method='GET',body,token,status=200)=>{const r=await fetch(CLOUD.url+'/functions/v1/modu-api/'+path,{method,headers:{apikey:CLOUD.key,'content-type':'application/json',...(token?{'x-modu-token':token}:{})},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(20000)});const x=await r.json();assert.equal(r.status,status,JSON.stringify(x));return x;};
const storage=()=>{const m=new Map();return {get length(){return m.size},key:i=>[...m.keys()][i]??null,getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,v),removeItem:k=>m.delete(k)};};
const wait=async fn=>{for(let i=0;i<200;i++){if(fn())return;await new Promise(r=>setTimeout(r,25));}throw Error('sync timeout');};
const sample=createOwnerSample('ko');
const room=await api('demo','POST',{store:sample.store,menu:sample.items,workspace:{manager:{...sample.manager,messages:[]}}},null,201);
const sid=room.storeId,owner=room.owner.token,floor=room.floor,kitchen=room.kitchen;
const snap=token=>api(sid+'/snapshot','GET',null,token),staff=(who,method='GET',body)=>api(sid+'/staff/'+who.member.id,method,body,who.token);
try{
 const guest=await api(sid+'/visits','POST',{table:7,lang:'vi'},null,201),pub=await api(sid+'/public');
 const order=await api(sid+'/orders','POST',{cart:{m01:1},revision:pub.revision,fulfillment:{channel:'dine-in',table:7},requestId:crypto.randomUUID(),lang:'vi'},guest.token,201);
 const initial=await api(sid+'/amendments','POST',{targetId:order.id,targetType:'order',kind:'change',data:{cart:{m01:2}},requestId:crypto.randomUUID(),lang:'vi'},guest.token,201);
 await staff(floor,'PATCH',{action:'amend',data:{id:initial.id,approve:false,reason:'menuUnavailable',offer:{type:'order',itemId:'m04',quantity:1}}});
 const counter=await api(sid+'/amendments/'+initial.id+'/counter','POST',{requestId:crypto.randomUUID(),lang:'vi',data:{cart:{m04:2}}},guest.token,201);
 async function check(role,actor,type){
  const key=`counter:${counter.id}:${type}`,event={key,amendmentId:counter.id},identity=sid+':'+role,local=storage();let online=false,calls=0;
  const get=()=>role==='floor'||role==='kitchen'?staff(actor):snap(actor);
  const send=async batch=>{calls++;return role==='floor'||role==='kitchen'?staff(actor,'PATCH',{action:'notificationImport',data:{ids:batch.map(x=>x.amendmentId)}}):api(sid+'/notification-import','POST',{ids:batch.map(x=>x.amendmentId)},actor);};
  const ctx={identity,snapshot:{notificationReads:(await get()).notificationReads,events:[event]}};
  const create=()=>createPendingReadSync({storage:local,eventsFor:c=>c.snapshot.events,importBatch:send,isOnline:()=>online,retryMs:10});
  const first=create();first.update(ctx);assert(first.enqueue(identity,key));assert.equal(calls,0);assert(!(await get()).notificationReads.includes(key));first.update(null);
  const reopened=create();reopened.update(ctx);online=true;reopened.retry();await wait(()=>reopened.confirmed(identity).has(key));assert.equal(reopened.pending(identity).size,0);
  // Independent server reads represent two devices for exactly this identity.
  const [a,b]=await Promise.all([get(),get()]);assert(a.notificationReads.includes(key)&&b.notificationReads.includes(key));
 }
 await check('floor',floor,'requested');await check('owner',owner,'requested');
 await staff(floor,'PATCH',{action:'amend',data:{id:counter.id,approve:true}});
 await check('kitchen',kitchen,'approved');await check('guest',guest.token,'approved');
 console.log('PASS: live server offline queue, reopening, retry and independent device snapshots for guest, floor, kitchen and owner');
}finally{await api(sid+'/owner-auth/logout','POST',{},owner);}
