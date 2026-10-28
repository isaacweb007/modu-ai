import assert from 'node:assert/strict';
import {createClient} from '@supabase/supabase-js';
import {CLOUD} from '../dist/shared/cloud-config.js';
import {createOwnerSample} from '../dist/shared/owner-sample.js';
import {validDemo} from '../dist/shared/connected-demo.js';
let checks=0;
async function api(path,method='GET',body,token,status=200){const r=await fetch(CLOUD.url+'/functions/v1/modu-api/'+path,{method,headers:{apikey:CLOUD.key,'content-type':'application/json',...(token?{'x-modu-token':token}:{})},body:body?JSON.stringify(body):undefined});const b=await r.json();assert.equal(r.status,status,JSON.stringify(b));checks++;return b;}
const sample=createOwnerSample('ko');
const room=await api('demo','POST',{store:sample.store,menu:sample.items,workspace:{manager:{...sample.manager,messages:[]}}},null,201);
assert(validDemo(room),'Demo response must contain all role credentials');
const sid=room.storeId,owner=room.owner.token,floor=room.floor,kitchen=room.kitchen;
const call=(c,method='GET',body,status=200)=>api(sid+'/staff/'+c.member.id,method,body,c.token,status);
const auth=await api(sid+'/owner-auth','GET',null,owner);assert.equal(auth.demo,true);
assert.equal((await api(sid+'/snapshot','GET',null,owner)).orders.length,0);
const guest=await api(sid+'/visits','POST',{table:7,lang:'vi'},null,201);
const menu=await api(sid+'/public');
let signals=0;
const client=createClient(CLOUD.url,CLOUD.key,{auth:{persistSession:false,autoRefreshToken:false}}),channel=client.channel('modu:'+sid).on('broadcast',{event:'refresh'},m=>{assert(Object.keys(m.payload).every(k=>k==='id'));signals++;});
try{
 await new Promise((ok,bad)=>{const timer=setTimeout(()=>bad(Error('subscription timeout')),12000);channel.subscribe(status=>{if(status==='SUBSCRIBED'){clearTimeout(timer);ok();}});});
 const order=await api(sid+'/orders','POST',{cart:{m01:2},revision:menu.revision,fulfillment:{channel:'dine-in',table:7},requestId:crypto.randomUUID(),lang:'vi'},guest.token,201);
 const action=next=>({action:'order',data:{id:order.id,next}});
 await call(kitchen,'PATCH',action('accepted'),403);await call(floor,'PATCH',action('ready'),403);
 for(const [actor,next] of [[floor,'accepted'],[kitchen,'preparing'],[kitchen,'ready']]){
  await call(actor,'PATCH',action(next));
  const views=await Promise.all([api(sid+'/snapshot','GET',null,owner),api(sid+'/snapshot','GET',null,guest.token),call(floor),call(kitchen)]);
  for(const v of views)assert.equal(v.orders.find(x=>x.id===order.id).status,next);
  assert.equal(views[1].orders.find(x=>x.id===order.id).payment,'unpaid');
 }
 const delivery=await api(sid+'/orders','POST',{cart:{m04:1},revision:menu.revision,fulfillment:{channel:'online',address:'Demo address 25',phone:'+1 202-555-0125'},requestId:crypto.randomUUID(),lang:'vi'},guest.token,201);
 assert((await call(floor)).orders.find(o=>o.id===delivery.id).delivery.address==='Demo address 25');assert(!(await call(kitchen)).orders.find(o=>o.id===delivery.id).delivery);
 const edited=await api(sid+'/team/'+kitchen.member.id,'PATCH',{operation:'permissions',revision:kitchen.member.revision,permissions:['ordersView']},owner);
 await call(kitchen,'PATCH',{action:'order',data:{id:delivery.id,next:'preparing'}},403);
 await api(sid+'/team/'+kitchen.member.id,'PATCH',{operation:'revoke',revision:edited.member.revision},owner);
 await call(kitchen,'GET',null,403);await api(sid+'/team','GET',null,guest.token,403);
 const rpc=await fetch(CLOUD.url+'/rest/v1/rpc/modu_create_connected_demo',{method:'POST',headers:{apikey:CLOUD.key,'content-type':'application/json'},body:'{}'});assert([401,403,404].includes(rpc.status));
 assert(signals>0);console.log(`PASS ${checks} API checks: shared orders, four projections, floor/kitchen transitions, unpaid only, delivery privacy, permission removal/revocation; ${signals} realtime signals.`);
}finally{await client.removeAllChannels();await api(sid+'/owner-auth/logout','POST',{},owner);}
