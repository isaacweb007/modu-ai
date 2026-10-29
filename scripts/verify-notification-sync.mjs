import assert from 'node:assert/strict';
import {CLOUD} from '../dist/shared/cloud-config.js';
import {createOwnerSample} from '../dist/shared/owner-sample.js';
let checks=0;
async function api(path,method='GET',body,token,status=200){const res=await fetch(CLOUD.url+'/functions/v1/modu-api/'+path,{method,headers:{apikey:CLOUD.key,'content-type':'application/json',...(token?{'x-modu-token':token}:{})},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(20000)});const data=await res.json();assert.equal(res.status,status,`${method} ${path.split('/').at(-1)}: ${JSON.stringify(data)}`);checks++;return data;}
const sample=createOwnerSample('ko'),room=await api('demo','POST',{store:sample.store,menu:sample.items,workspace:{manager:{...sample.manager,messages:[]}}},null,201),sid=room.storeId,owner=room.owner.token,floor=room.floor,kitchen=room.kitchen;
const guest=await api(sid+'/visits','POST',{table:7,lang:'vi'},null,201),other=await api(sid+'/visits','POST',{table:8,lang:'ko'},null,201),menu=await api(sid+'/public');
const snap=token=>api(sid+'/snapshot','GET',null,token),staff=(who,method='GET',body,status=200)=>api(sid+'/staff/'+who.member.id,method,body,who.token,status),mark=(who,id,status=200)=>api(sid+'/notification-read','POST',{id},who,status),staffMark=(who,id,status=200)=>staff(who,'PATCH',{action:'notificationRead',data:{id}},status);
try{
 const order=await api(sid+'/orders','POST',{cart:{m01:1},revision:menu.revision,fulfillment:{channel:'dine-in',table:7},requestId:crypto.randomUUID(),lang:'vi'},guest.token,201);
 const initial=await api(sid+'/amendments','POST',{targetId:order.id,targetType:'order',kind:'change',data:{cart:{m01:2}},requestId:crypto.randomUUID(),lang:'vi'},guest.token,201);
 await staff(floor,'PATCH',{action:'amend',data:{id:initial.id,approve:false,reason:'menuUnavailable',offer:{type:'order',itemId:'m04',quantity:1}}});
 const counter=await api(sid+'/amendments/'+initial.id+'/counter','POST',{requestId:crypto.randomUUID(),lang:'vi',data:{cart:{m04:2}}},guest.token,201);
 const requested=`counter:${counter.id}:requested`,approved=`counter:${counter.id}:approved`;
 const importFor=(token,ids,status=200)=>api(sid+'/notification-import','POST',{ids},token,status),importStaff=(who,ids,status=200)=>staff(who,'PATCH',{action:'notificationImport',data:{ids}},status);
 assert.deepEqual((await importFor(other.token,[counter.id])).keys,[]);assert.deepEqual((await importStaff(kitchen,[counter.id])).keys,[]);
 assert.deepEqual((await importStaff(floor,[counter.id,initial.id])).keys,[requested]);assert.deepEqual((await importFor(owner,[counter.id])).keys,[requested]);
 await importFor(owner,[counter.id,counter.id],400);await importFor(owner,Array.from({length:21},()=>crypto.randomUUID()),400);await importFor('0'.repeat(64),[counter.id],403);
 await mark(guest.token,counter.id,403);await mark(other.token,counter.id,403);await staffMark(kitchen,counter.id,403);await mark(owner,initial.id,403);
 await staffMark(floor,counter.id);await staffMark(floor,counter.id);assert((await staff(floor)).notificationReads.includes(requested));assert((await snap(owner)).notificationReads.includes(requested));
 await mark(owner,counter.id);assert((await snap(owner)).notificationReads.includes(requested));
 await staff(floor,'PATCH',{action:'amend',data:{id:counter.id,approve:true}});
 await mark(other.token,counter.id,403);assert.deepEqual((await importFor(guest.token,[counter.id])).keys,[approved]);assert.deepEqual((await importStaff(kitchen,[counter.id])).keys,[approved]);await mark(guest.token,counter.id);await staffMark(kitchen,counter.id);
 for(const token of [guest.token,guest.token])assert((await snap(token)).notificationReads.includes(approved));
 for(const who of [kitchen,kitchen])assert((await staff(who)).notificationReads.includes(approved));
 assert(!(await snap(other.token)).notificationReads.includes(approved));
 const direct=await fetch(CLOUD.url+'/rest/v1/modu_notification_reads?select=*',{headers:{apikey:CLOUD.key}});assert([401,403].includes(direct.status));
 const outsider=await api(sid+'/staff/'+floor.member.id,'GET',null,kitchen.token,403);
 assert(!outsider.notificationReads);
 const team=await api(sid+'/team','GET',null,owner);const member=team.members.find(m=>m.id===floor.member.id);
 await api(sid+'/team/'+floor.member.id,'PATCH',{operation:'permissions',revision:member.revision,role:'floor',permissions:[]},owner);
 const restricted=await staff(floor);assert(!restricted.notificationReads.includes(requested));await staffMark(floor,counter.id,403);assert.deepEqual((await importStaff(floor,[counter.id])).keys,[]);
 console.log(`PASS ${checks} live API checks: bounded legacy imports, invalid input, role and guest isolation, revoked permissions, idempotency, protected table`);
}finally{await api(sid+'/owner-auth/logout','POST',{},owner);}
