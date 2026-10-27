import {MENU} from './menu.js?v=5.6.0';
import {PHRASES} from './interpreter.js?v=5.6.0';
import {normalizeFulfillment} from './order-details.js?v=5.6.0';
import {expansionCopy} from './expansion-copy.js?v=5.8.0';
export const SHOWCASE_KEY='one-shop-book-showcase-v2';
export const SHOWCASE_LAST=8;
export const SHOWCASE_SCENARIOS=['dineIn','booking','delivery'];
export const showcaseLast=s=>s.scenario==='booking'?7:8;
export function createShowcase(guestLang='vi',runId=crypto.randomUUID(),at=new Date().toISOString(),scenario='dineIn') {
 return {version:2,phase:0,guestLang:Object.hasOwn(PHRASES,guestLang)?guestLang:'vi',runId,at,scenario:SHOWCASE_SCENARIOS.includes(scenario)?scenario:'dineIn'};
}
export function restoreShowcase(raw) {
 try {const s=JSON.parse(raw);if(s.version===2&&SHOWCASE_SCENARIOS.includes(s.scenario)&&Number.isInteger(s.phase)&&s.phase>=0&&s.phase<=showcaseLast(s)&&Object.hasOwn(PHRASES,s.guestLang)&&/^[a-f\d-]{36}$/.test(s.runId)&&Number.isFinite(Date.parse(s.at)))return {version:2,phase:s.phase,guestLang:s.guestLang,runId:s.runId,at:s.at,scenario:s.scenario};}catch{}
 return createShowcase();
}
export function advanceShowcase(s,expectedPhase=s.phase) {return s.phase===expectedPhase&&s.phase<showcaseLast(s)?{...s,phase:s.phase+1}:s;}
function bookingDate(at){const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Ho_Chi_Minh',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date(Date.parse(at)+86400000));return ['year','month','day'].map(k=>parts.find(p=>p.type===k).value).join('-');}
export function showcaseSnapshot(s) {
 const item=structuredClone(MENU.find(x=>x.id==='m01')),g=expansionCopy(s.guestLang),ko=expansionCopy('ko'),kind=s.scenario;
 const phrases=kind==='dineIn'?{request:PHRASES[s.guestLang].order.request,ko:PHRASES.ko.order.request,reply:PHRASES[s.guestLang].order.reply,koReply:PHRASES.ko.order.reply}:{request:g[kind+'Request'],ko:ko[kind+'Request'],reply:g[kind+'Reply'],koReply:ko[kind+'Reply']};
 const request=s.phase>=2?{id:'showcase-request-'+s.runId,text:phrases.request,interpretation:{ko:phrases.ko,sourceLang:s.guestLang}}:null;
 const reply=s.phase>=4?{text:phrases.reply,interpretation:{original:phrases.koReply,replyTo:request.id}}:null;
 const fulfillment=kind==='delivery'?normalizeFulfillment({channel:'online',address:'DEMO · 12 Đường Mẫu, Quận 1, TP. Hồ Chí Minh',phone:'+84 000 000 000',name:'Minh (DEMO)'}):{channel:'dine-in',table:7};
 const booking={id:'showcase-booking-'+s.runId,number:'R001',name:'Minh (DEMO)',date:bookingDate(s.at),time:'19:00',partySize:2,status:s.phase>=6?'confirmed':'pending'};
 const order=s.phase>=5&&kind!=='booking'?{id:'showcase-order-'+s.runId,number:1,table:kind==='delivery'?null:7,fulfillment,lang:s.guestLang,lines:[{itemId:item.id,name:item.name,quantity:1,unitPrice:item.price}],total:item.price,currency:'VND',payment:'unpaid',status:['pending','accepted','preparing','ready'][s.phase-5]}:null;
 return {item,request,reply,phrases,fulfillment,bookingInfo:booking,booking:kind==='booking'&&s.phase>=5?booking:null,order,translated:s.phase>=3,activePane:['guest','guest','guest','owner','guest','owner','guest','owner','guest'][s.phase],ready:s.phase===showcaseLast(s)};
}
// A cancelled generation cannot advance even if an old callback has already queued.
export function createShowcasePlayer({advance,onChange,schedule=setTimeout,cancel=clearTimeout,delay=3600}) {
 let running=false,timer=null,generation=0;
 const arm=()=>{const current=generation;timer=schedule(()=>{if(!running||current!==generation)return;timer=null;if(!advance())running=false;else arm();onChange();},delay);};
 return {get running(){return running;},play(){if(running)return;running=true;generation++;arm();onChange();},pause(){running=false;generation++;if(timer!==null)cancel(timer);timer=null;onChange();},dispose(){running=false;generation++;if(timer!==null)cancel(timer);timer=null;}};
}
