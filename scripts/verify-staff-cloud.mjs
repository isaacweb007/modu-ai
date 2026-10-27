import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createClient} from '@supabase/supabase-js';
import {CLOUD} from '../dist/shared/cloud-config.js';
import {ROLE_PERMISSIONS} from '../dist/shared/team-state.js';
const fixtures=JSON.parse(await fs.readFile('artifacts/cloud-fixtures.json','utf8'));
const owner=fixtures.ownerA,otherOwner=fixtures.ownerB,guest=fixtures.guestA,otherGuest=fixtures.guestB;
let assertions=0;
async function api(store,path,method='GET',body,token,status=200){const r=await fetch(CLOUD.url+'/functions/v1/modu-api/'+store+'/'+path,{method,headers:{apikey:CLOUD.key,'content-type':'application/json',...(token?{'x-modu-token':token}:{})},body:body?JSON.stringify(body):undefined});const b=await r.json();assert.equal(r.status,status,JSON.stringify(b));assertions++;return b;}
const staffCall=(c,action='GET',body,status=200,store=owner.storeId)=>api(store,'staff/'+c.member.id,action,body,c.token,status);
let floor,kitchen,channel,client;const registered=[];let signals=0;
try{
 const s=await api(owner.storeId,'snapshot','GET',null,owner.token);
 for(const role of ['floor','kitchen']){const c=await api(owner.storeId,'team','POST',{name:'QA '+role,role,permissions:ROLE_PERMISSIONS[role]},owner.token,201);registered.push(c);if(role==='floor')floor=c;else kitchen=c;}
 const denied=await api(owner.storeId,'team','GET',null,guest.token,403);assert(denied.error);
 await api(owner.storeId,'team','POST',{name:'forged',role:'floor',permissions:[]},otherOwner.token,403);
 await api(owner.storeId,'team','GET',null,floor.token,403);
 await api(owner.storeId,'snapshot','GET',null,kitchen.token,403);
 await staffCall(floor,'GET',null,403,otherOwner.storeId);
 await staffCall({member:floor.member,token:guest.token},'GET',null,403);
 const deviceA=await staffCall(kitchen),deviceB=await staffCall(kitchen);assert.deepEqual(deviceA,deviceB);
 assert(!deviceA.bookings&&!deviceA.requests&&!deviceA.settings&&!deviceA.sales&&!deviceA.workspace);assert(!JSON.stringify(deviceA).includes('token_hash'));
 assert(deviceA.orders.every(o=>!o.delivery&&o.total===undefined&&!o.lines.some(l=>'price' in l)));
 client=createClient(CLOUD.url,CLOUD.key,{auth:{persistSession:false,autoRefreshToken:false}});
 channel=client.channel('modu:'+owner.storeId).on('broadcast',{event:'refresh'},m=>{assert(Object.keys(m.payload).every(k=>k==='id'));signals++;});
 await new Promise((ok,bad)=>{const timeout=setTimeout(()=>bad(Error('Realtime subscription timeout')),12000);channel.subscribe(status=>{if(status==='SUBSCRIBED'){clearTimeout(timeout);ok();}});});
 const order=await api(owner.storeId,'orders','POST',{cart:{m01:1},revision:s.revision,fulfillment:{channel:'online',address:'DEMO ONLY · staff sync test address',phone:'+1 202-555-0108'},requestId:crypto.randomUUID()},guest.token,201);
 const action=next=>({action:'order',data:{id:order.id,next}});
 await staffCall(kitchen,'PATCH',action('accepted'),403);
 await staffCall(floor,'PATCH',action('ready'),403);
 for(const [actor,next] of [[floor,'accepted'],[kitchen,'preparing'],[kitchen,'ready'],[floor,'completed']]){
  await staffCall(actor,'PATCH',action(next));
  const [a,b,c]=await Promise.all([api(owner.storeId,'snapshot','GET',null,owner.token),api(owner.storeId,'snapshot','GET',null,guest.token),staffCall(kitchen)]);
  assert.equal(a.orders.find(o=>o.id===order.id).status,next);assert.equal(b.orders.find(o=>o.id===order.id).status,next);assert.equal(c.orders.find(o=>o.id===order.id).status,next);assert.equal(b.orders.find(o=>o.id===order.id).payment,'unpaid');
 }
 await staffCall(floor,'PATCH',action('completed')); // idempotent acknowledgement
 await staffCall(kitchen,'PATCH',action('preparing'),409);
 assert(!(await api(owner.storeId,'snapshot','GET',null,otherGuest.token)).orders.some(o=>o.id===order.id));
 const b=await api(otherOwner.storeId,'snapshot','GET',null,otherOwner.token);
 if(b.orders[0])await staffCall(floor,'PATCH',{action:'order',data:{id:b.orders[0].id,next:'accepted'}},403);
 await staffCall(kitchen,'PATCH',{action:'payment',data:{id:order.id,status:'paid'}},400);
 let edited=await api(owner.storeId,'team/'+kitchen.member.id,'PATCH',{operation:'permissions',revision:kitchen.member.revision,permissions:[...ROLE_PERMISSIONS.kitchen,'deliveryView']},owner.token);
 assert((await staffCall(kitchen)).orders.find(o=>o.id===order.id).delivery.address.includes('DEMO ONLY'));
 await api(owner.storeId,'team/'+kitchen.member.id,'PATCH',{operation:'permissions',revision:kitchen.member.revision,permissions:[]},owner.token,409);
 edited=await api(owner.storeId,'team/'+kitchen.member.id,'PATCH',{operation:'permissions',revision:edited.member.revision,permissions:['ordersView']},owner.token);
 assert(!(await staffCall(kitchen)).orders.find(o=>o.id===order.id).delivery);
 await staffCall(kitchen,'PATCH',action('ready'),403);
 const rotated=await api(owner.storeId,'team/'+kitchen.member.id,'PATCH',{operation:'rotate',revision:edited.member.revision},owner.token);
 await staffCall(kitchen,'GET',null,403);
 assert((await staffCall(rotated)).member.id===kitchen.member.id);
 await api(owner.storeId,'team/'+kitchen.member.id,'PATCH',{operation:'revoke',revision:rotated.member.revision},owner.token);
 await staffCall(rotated,'GET',null,403);await staffCall(rotated,'PATCH',action('ready'),403);
 assert(!(await api(owner.storeId,'team','GET',null,owner.token)).members.some(m=>m.id===kitchen.member.id));
 for(const table of ['modu_staff','modu_staff_audit']){const r=await fetch(CLOUD.url+'/rest/v1/'+table+'?select=*',{headers:{apikey:CLOUD.key}});assert([401,403].includes(r.status));}
 const rpc=await fetch(CLOUD.url+'/rest/v1/rpc/modu_staff_snapshot',{method:'POST',headers:{apikey:CLOUD.key,'content-type':'application/json'},body:JSON.stringify({p_store:owner.storeId,p_member:floor.member.id,p_hash:'0'.repeat(64)})});assert([401,403].includes(rpc.status));
 assert(signals>0,'No realtime invalidations');
 console.log(`PASS: ${assertions} API checks; independent staff reads, floor/kitchen→owner/guest sync, minimal fields, revisions, rotation, revocation, unpaid-only and ${signals} empty realtime signals`);
}finally{
 if(client)await client.removeAllChannels();
 const current=await api(owner.storeId,'team','GET',null,owner.token);
 for(const c of registered){const m=current.members.find(m=>m.id===c.member.id);if(m)await api(owner.storeId,'team/'+m.id,'PATCH',{operation:'revoke',revision:m.revision},owner.token);}
}
