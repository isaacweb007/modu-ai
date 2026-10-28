import {LANGS,formatBooking,partyLabel,formatMoney,formatNumber} from './locale.js?v=5.6.0';
import {expansionCopy} from './expansion-copy.js?v=5.8.0';
import {REQUEST_COPY,requestText} from './integrated-request-copy.js?v=5.17.0';

export function requestDateLimits(at=new Date().toISOString()){
 const local=new Date(Date.parse(at)+7*3600000).toISOString();
 return {min:local.slice(0,10),max:new Date(Date.parse(at)+7*3600000+365*86400000).toISOString().slice(0,10),time:local.slice(11,16)};
}
export function initialRequest(menu,snapshot){return {quantities:Object.fromEntries(menu.map((m,i)=>[m.id,i===0?'1':'0'])),date:snapshot.bookingInfo.date,time:'19:00',partySize:'2',address:'DEMO · 12 Đường Mẫu, Quận 1, TP. Hồ Chí Minh',phone:'+84 000 000 000'};}
export function validateRequest(draft,scenario,menu,at){
 const errors={},limits=requestDateLimits(at),values=structuredClone(draft);
 if(scenario==='booking'){
  const date=String(draft.date),parsed=new Date(date+'T00:00:00Z');
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isFinite(parsed.getTime())||parsed.toISOString().slice(0,10)!==date||date<limits.min||date>limits.max)errors.date='dateError';
  if(!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(draft.time)||(date===limits.min&&draft.time<=limits.time))errors.time='timeError';
  if(!/^\d{1,2}$/.test(draft.partySize)||Number(draft.partySize)<1||Number(draft.partySize)>20)errors.partySize='partyError';
 }else{
  let count=0;
  for(const item of menu){const raw=String(draft.quantities[item.id]??'');if(!/^\d{1,2}$/.test(raw)||Number(raw)>20)errors['quantity-'+item.id]='quantityError';else count+=Number(raw);}
  if(!count)errors.menu='menuError';
  if(scenario==='delivery'){
   values.address=String(draft.address).replace(/[\r\n\t]+/g,' ').trim();values.phone=String(draft.phone).trim();
   if(values.address.length<5||values.address.length>300||/[\x00-\x1f]/.test(values.address))errors.address='addressError';
   const digits=values.phone.replace(/\D/g,'');
   if(values.phone.length>30||!/^\+?[0-9 ()-]+$/.test(values.phone)||digits.length<7||digits.length>15)errors.phone='phoneError';
  }
 }
 return {valid:!Object.keys(errors).length,errors,values};
}
// Only approved menu IDs and prices enter the order. Text is assembled from prepared
// localized templates; addresses remain verbatim. No translation service is called.
export function requestSnapshot(base,state,values,menu){
 const lines=menu.filter(m=>Number(values.quantities[m.id])>0).map(item=>({item,quantity:Number(values.quantities[item.id])}));
 const total=lines.reduce((n,line)=>n+line.item.price*line.quantity,0),bookingInfo={...base.bookingInfo,date:values.date,time:values.time,partySize:Number(values.partySize)};
 const fulfillment=state.scenario==='delivery'?{...base.fulfillment,address:values.address,phone:values.phone}:base.fulfillment;
 const messages=Object.fromEntries(Object.keys(LANGS).map(l=>{
  const c=REQUEST_COPY[l],x=expansionCopy(l),items=lines.map(({item,quantity})=>`${item.name[l]} × ${formatNumber(quantity,l)}`).join(', ');
  const booking=`${formatBooking(values.date,values.time,l)} · ${partyLabel(Number(values.partySize),l)} (UTC+7)`;
  const details=state.scenario==='booking'?booking:`${items} · ${c.total}: ${formatMoney(total,l)}`+(state.scenario==='delivery'?` · ${x.deliveryAddress}: ${fulfillment.address} · ${x.contact}: ${fulfillment.phone}`:'');
  const data={items,booking,details,address:fulfillment.address,phone:fulfillment.phone};
  return [l,{request:requestText(l,state.scenario==='dineIn'?'order':state.scenario,data),reply:requestText(l,'reply',data),ready:requestText(l,state.scenario==='booking'?'bookingReady':'ready',data),summary:details}];
 }));
 const guest=messages[state.guestLang],ko=messages.ko,phrases={request:guest.request,ko:ko.request,reply:guest.reply,koReply:ko.reply};
 return {...base,item:lines[0]?.item||base.item,lines,total,fulfillment,bookingInfo,phrases,
  request:base.request?{...base.request,text:guest.request,interpretation:{...base.request.interpretation,ko:ko.request}}:null,
  reply:base.reply?{...base.reply,text:guest.reply,interpretation:{...base.reply.interpretation,original:ko.reply}}:null,
  booking:base.booking?{...base.booking,...bookingInfo}:null,
  order:base.order?{...base.order,fulfillment,lines:lines.map(({item,quantity})=>({itemId:item.id,name:item.name,quantity,unitPrice:item.price})),total}:null,
  readyMessages:Object.fromEntries(Object.entries(messages).map(([l,m])=>[l,m.ready])),summaries:Object.fromEntries(Object.entries(messages).map(([l,m])=>[l,m.summary]))
 };
}
