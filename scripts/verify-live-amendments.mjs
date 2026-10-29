import assert from 'node:assert/strict';
import {CLOUD} from '../dist/shared/cloud-config.js';
import {createOwnerSample} from '../dist/shared/owner-sample.js';
import {frozenReasonMessages} from '../dist/shared/live-rejection.js';
import {LANGS} from '../dist/shared/locale.js';
let checks=0;
async function api(path,method='GET',body,token,status=200){const res=await fetch(CLOUD.url+'/functions/v1/modu-api/'+path,{method,headers:{apikey:CLOUD.key,'content-type':'application/json',...(token?{'x-modu-token':token}:{})},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(20000)});const data=await res.json();assert.equal(res.status,status,`${method} ${path.split('/').slice(-1)}: ${JSON.stringify(data)}`);checks++;return data;}
const sample=createOwnerSample('ko'),room=await api('demo','POST',{store:sample.store,menu:sample.items,workspace:{manager:{...sample.manager,messages:[]}}},null,201);
const sid=room.storeId,owner=room.owner.token,floor=room.floor,kitchen=room.kitchen;
const guest=await api(sid+'/visits','POST',{table:7,lang:'vi'},null,201),other=await api(sid+'/visits','POST',{table:8,lang:'ko'},null,201);
const menu=await api(sid+'/public');
const order=()=>api(sid+'/orders','POST',{cart:{m01:1},revision:menu.revision,fulfillment:{channel:'dine-in',table:7},requestId:crypto.randomUUID(),lang:'vi'},guest.token,201);
const staff=(m,method='GET',data,status=200)=>api(sid+'/staff/'+m.member.id,method,data,m.token,status);
const request=(id,type,kind,data={},who=guest,status=201,lang='vi')=>api(sid+'/amendments','POST',{targetId:id,targetType:type,kind,data,lang,requestId:crypto.randomUUID()},who.token,status);
const staffReview=(m,a,approve,status=200)=>staff(m,'PATCH',{action:'amend',data:{id:a.id,approve,...(!approve?{reason:'verificationRequired'}:{})}},status);
const ownerReview=(a,approve,status=200)=>api(sid+'/amendments/'+a.id,'PATCH',{approve},owner,status);
const snap=(who)=>api(sid+'/snapshot','GET',null,who.token||who);
const statusOrder=async(id,state)=>{for(const v of await Promise.all([snap(owner),snap(guest),staff(floor),staff(kitchen)]))assert.equal(v.orders.find(o=>o.id===id).status,state);};
try{
 const a=await order();
 await request(a.id,'order','cancel',{},other,403);
 const q=await request(a.id,'order','change',{cart:{m01:2,m04:1}});
 await request(a.id,'order','cancel',{},guest,409);
 const [g,own,k]=await Promise.all([snap(guest),snap(owner),staff(kitchen)]);
 assert.equal(g.orders.find(x=>x.id===a.id).lines[0].quantity,1);
 assert(own.amendments.some(x=>x.id===q.id&&x.status==='pending'));
 assert(!('after_data' in k.amendments.find(x=>x.id===q.id)));
 await api(sid+'/orders/'+a.id,'PATCH',{status:'accepted'},owner,409);
 await staff(floor,'PATCH',{action:'order',data:{id:a.id,next:'accepted'}},409);
 await api(sid+'/amendments/'+q.id,'PATCH',{approve:true},guest.token,403);
 await staffReview(kitchen,q,true,403);
 await staff(floor,'PATCH',{action:'amend',data:{id:q.id,approve:false}},400);
 await staff(floor,'PATCH',{action:'amend',data:{id:q.id,approve:false,reason:'slotUnavailable'}},400);
 assert.equal((await snap(guest)).amendments.find(x=>x.id===q.id).status,'pending');
 await staffReview(floor,q,true);
 const after=await snap(guest);assert.equal(after.orders.find(o=>o.id===a.id).lines.find(l=>l.itemId==='m01').quantity,2);assert.equal(after.orders.find(o=>o.id===a.id).lines.find(l=>l.itemId==='m04').quantity,1);
 assert.equal(after.amendments.find(x=>x.id===q.id).status,'approved');
 const cancel=await request(a.id,'order','cancel');await staffReview(floor,cancel,false);const refused=(await snap(guest)).amendments.find(x=>x.id===cancel.id);assert.equal(refused.status,'rejected');assert.equal(refused.reason_messages.vi,frozenReasonMessages('verificationRequired').vi);assert(!('reviewed_by' in refused));const audit=(await snap(owner)).amendments.find(x=>x.id===cancel.id);assert.equal(audit.reason_messages.ko,frozenReasonMessages('verificationRequired').ko);assert.equal(audit.reason_messages.vi,refused.reason_messages.vi);assert(audit.reviewed_by&&audit.reviewed_at);await statusOrder(a.id,'pending');
 for(const lang of Object.keys(LANGS)){const r=await request(a.id,'order','cancel',{},guest,201,lang);assert.equal(r.guest_lang,lang);await staff(floor,'PATCH',{action:'amend',data:{id:r.id,approve:false,reason:'operationalConstraint'}});const row=(await snap(guest)).amendments.find(x=>x.id===r.id);assert.equal(row.reason_messages[lang],frozenReasonMessages('operationalConstraint')[lang]);}
 const offerOrder=await order(),offerRequest=await request(offerOrder.id,'order','change',{cart:{m01:2}});
 const offerPayload={action:'amend',data:{id:offerRequest.id,approve:false,reason:'menuUnavailable',offer:{type:'order',itemId:'m04',quantity:2}}};
 await staff(kitchen,'PATCH',offerPayload,403);await staff(floor,'PATCH',offerPayload);
 const proposed=(await snap(guest)).amendments.find(x=>x.id===offerRequest.id);assert.equal(proposed.proposal_status,'pending');assert.equal(proposed.proposal_data.lines[0].itemId,'m04');assert.equal((await snap(guest)).orders.find(x=>x.id===offerOrder.id).lines[0].itemId,'m01');
 await api(sid+'/amendments/'+offerRequest.id,'PATCH',{acceptOffer:true},other.token,403);await staffReview(floor,offerRequest,true,409);await staff(kitchen,'PATCH',{action:'order',data:{id:offerOrder.id,next:'preparing'}},409);
 await api(sid+'/amendments/'+offerRequest.id,'PATCH',{acceptOffer:true},guest.token);await api(sid+'/amendments/'+offerRequest.id,'PATCH',{acceptOffer:true},guest.token,409);
 const offerViews=await Promise.all([snap(owner),snap(guest),staff(floor),staff(kitchen)]);for(const v of offerViews){const row=v.orders.find(x=>x.id===offerOrder.id);assert.equal(row.lines[0].itemId,'m04');assert.equal(row.lines[0].quantity,2);}const offerLog=offerViews[0].amendments.find(x=>x.id===offerRequest.id);assert.equal(offerLog.status,'rejected');assert.equal(offerLog.proposal_status,'accepted');assert(offerLog.reviewed_by&&offerLog.reviewed_at&&offerLog.proposal_responded_at);
 const counterOrder=await order(),counterInitial=await request(counterOrder.id,'order','change',{cart:{m01:2}});
 await staff(floor,'PATCH',{action:'amend',data:{id:counterInitial.id,approve:false,reason:'menuUnavailable',offer:{type:'order',itemId:'m04',quantity:1}}});
 const counterUrl=sid+'/amendments/'+counterInitial.id+'/counter',key=crypto.randomUUID(),counterBody={requestId:key,lang:'vi',data:{cart:{m04:3,m01:1}}};
 await api(counterUrl,'POST',{...counterBody,data:{cart:{m04:1}}},guest.token,400);await api(counterUrl,'POST',counterBody,other.token,403);
 const counter=await api(counterUrl,'POST',counterBody,guest.token,201),retry=await api(counterUrl,'POST',counterBody,guest.token,201);assert.equal(retry.id,counter.id);assert.equal(counter.parent_amendment_id,counterInitial.id);
 let versions=await Promise.all([snap(owner),snap(guest),staff(floor),staff(kitchen)]);for(const v of versions){const old=v.orders.find(x=>x.id===counterOrder.id);assert.equal(old.lines[0].itemId,'m01');assert.equal(old.lines[0].quantity,1);const requests=v.amendments;assert.equal(requests.find(x=>x.id===counterInitial.id).proposal_status,'countered');assert.equal(requests.find(x=>x.id===counter.id).status,'pending');}
 const kitchenCounter=versions[3].amendments.find(x=>x.id===counter.id);assert(!JSON.stringify(kitchenCounter).includes('unitPrice'));assert(!JSON.stringify(kitchenCounter).includes('total'));assert(kitchenCounter.after_data.lines.some(x=>x.itemId==='m04'));
 await api(sid+'/amendments/'+counterInitial.id,'PATCH',{acceptOffer:true},guest.token,409);await staffReview(kitchen,counter,true,403);
 await staff(floor,'PATCH',{action:'amend',data:{id:counter.id,approve:false,reason:'menuUnavailable',offer:{type:'order',itemId:'m04',quantity:2}}});
 const secondCounter=await api(sid+'/amendments/'+counter.id+'/counter','POST',{requestId:crypto.randomUUID(),lang:'vi',data:{cart:{m04:3}}},guest.token,201);assert.equal(secondCounter.parent_amendment_id,counter.id);
 await staffReview(floor,secondCounter,true);versions=await Promise.all([snap(owner),snap(guest),staff(floor),staff(kitchen)]);for(const v of versions){const updated=v.orders.find(x=>x.id===counterOrder.id);assert.equal(updated.lines[0].itemId,'m04');assert.equal(updated.lines[0].quantity,3);assert.equal(v.amendments.find(x=>x.id===secondCounter.id).status,'approved');}
 const auditTrail=versions[0].amendments;assert.equal(auditTrail.find(x=>x.id===counterInitial.id).proposal_status,'countered');assert.equal(auditTrail.find(x=>x.id===counter.id).proposal_status,'countered');assert(auditTrail.find(x=>x.id===secondCounter.id).reviewed_by&&auditTrail.find(x=>x.id===secondCounter.id).reviewed_at);
 const second=await order();await staff(floor,'PATCH',{action:'order',data:{id:second.id,next:'accepted'}});await staff(kitchen,'PATCH',{action:'order',data:{id:second.id,next:'preparing'}});
 const late=await request(second.id,'order','cancel');await staffReview(floor,late,true,403);await staff(kitchen,'PATCH',{action:'order',data:{id:second.id,next:'ready'}},409);await statusOrder(second.id,'preparing');await ownerReview(late,true);await statusOrder(second.id,'cancelled');
 const date=new Date(Date.now()+3*86400000).toISOString().slice(0,10),later=new Date(Date.now()+4*86400000).toISOString().slice(0,10);
 const booking=await api(sid+'/reservations','POST',{date,time:'18:00',partySize:2,name:'Demo',lang:'vi',requestId:crypto.randomUUID()},guest.token,201);
 await api(sid+'/reservations/'+booking.id,'PATCH',{status:'cancelled'},guest.token,403);
 const rejectedBooking=await request(booking.id,'booking','change',{date:later,time:'19:00',partySize:4});await staff(floor,'PATCH',{action:'amend',data:{id:rejectedBooking.id,approve:false,reason:'slotUnavailable'}});const bookingAudit=(await snap(owner)).amendments.find(x=>x.id===rejectedBooking.id);assert.equal(bookingAudit.reason_messages.vi,frozenReasonMessages('slotUnavailable').vi);const edit=await request(booking.id,'booking','change',{date:later,time:'19:00',partySize:4});
 await staff(floor,'PATCH',{action:'booking',data:{id:booking.id}},409);await staffReview(floor,edit,true);
 const changed=await snap(guest);assert.equal(changed.reservations.find(x=>x.id===booking.id).date,later);assert.equal(changed.reservations.find(x=>x.id===booking.id).party_size,4);
 const proposedBooking=await request(booking.id,'booking','change',{date:later,time:'20:00',partySize:4});
 await api(sid+'/amendments/'+proposedBooking.id,'PATCH',{approve:false,reason:'slotUnavailable',offer:{type:'booking',date:later,time:'21:00'}},owner);
 assert.equal((await snap(guest)).reservations.find(x=>x.id===booking.id).time.slice(0,5),'19:00');await api(sid+'/amendments/'+proposedBooking.id,'PATCH',{acceptOffer:true},guest.token);
 for(const v of await Promise.all([snap(owner),snap(guest),staff(floor)])){const rows=v.reservations||v.bookings;assert.equal(rows.find(x=>x.id===booking.id).time.slice(0,5),'21:00');}
 const bookingOfferLog=(await snap(owner)).amendments.find(x=>x.id===proposedBooking.id);assert.equal(bookingOfferLog.proposal_status,'accepted');assert(bookingOfferLog.proposal_at&&bookingOfferLog.proposal_responded_at);
 const bookingInitial=await request(booking.id,'booking','change',{date:later,time:'20:00',partySize:4});await staff(floor,'PATCH',{action:'amend',data:{id:bookingInitial.id,approve:false,reason:'slotUnavailable',offer:{type:'booking',date:later,time:'22:00'}}});
 const bookingCounter=await api(sid+'/amendments/'+bookingInitial.id+'/counter','POST',{requestId:crypto.randomUUID(),lang:'vi',data:{date:later,time:'23:00',partySize:3}},guest.token,201);
 assert.equal((await snap(guest)).reservations.find(x=>x.id===booking.id).time.slice(0,5),'21:00');await staffReview(floor,bookingCounter,true);
 for(const v of await Promise.all([snap(owner),snap(guest),staff(floor)])){const row=(v.reservations||v.bookings).find(x=>x.id===booking.id);assert.equal(row.time.slice(0,5),'23:00');assert.equal(row.party_size??row.partySize,3);assert.equal(v.amendments.find(x=>x.id===bookingInitial.id).proposal_status,'countered');}
 const bc=await request(booking.id,'booking','cancel');await ownerReview(bc,true);assert.equal((await snap(guest)).reservations.find(x=>x.id===booking.id).status,'cancelled');assert.equal((await staff(floor)).bookings.find(x=>x.id===booking.id).status,'cancelled');
 assert(!(await snap(other)).amendments.some(x=>x.visit_id===guest.visitId));
 const direct=await fetch(CLOUD.url+'/rest/v1/modu_amendments?select=*',{headers:{apikey:CLOUD.key}});assert([401,403].includes(direct.status));
 console.log(`PASS ${checks} API checks: guest ownership, holds, floor review, owner-only after cooking, booking change/cancellation, repeated counter-proposals, all projections, role privacy, and audit history`);
}finally{await api(sid+'/owner-auth/logout','POST',{},owner);}
