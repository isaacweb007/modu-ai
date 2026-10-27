import {MENU} from './menu.js?v=5.6.0';
import {PHRASES,createInterpretation,createInterpretedReply} from './interpreter.js?v=5.6.0';
import {normalizeFulfillment} from './order-details.js?v=5.6.0';

export const SHOWCASE_KEY='one-shop-book-showcase-v1';
export const SHOWCASE_LAST=7;
export function createShowcase(guestLang='vi',runId=crypto.randomUUID(),at=new Date().toISOString()) {
 return {version:1,phase:0,guestLang:Object.hasOwn(PHRASES,guestLang)?guestLang:'vi',runId,at};
}
export function restoreShowcase(raw) {
 try {const s=JSON.parse(raw);if(s.version===1&&Number.isInteger(s.phase)&&s.phase>=0&&s.phase<=SHOWCASE_LAST&&Object.hasOwn(PHRASES,s.guestLang)&&/^[a-f\d-]{36}$/.test(s.runId)&&Number.isFinite(Date.parse(s.at)))return {version:1,phase:s.phase,guestLang:s.guestLang,runId:s.runId,at:s.at};}catch{}
 return createShowcase();
}
// Every step is an atomic, idempotent transition. No shop storage or network is used.
export function advanceShowcase(s,expectedPhase=s.phase) {
 return s.phase===expectedPhase&&s.phase<SHOWCASE_LAST?{...s,phase:s.phase+1}:s;
}
export function showcaseSnapshot(s) {
 const item=structuredClone(MENU.find(x=>x.id==='m01'));
 const request=s.phase>=1?createInterpretation({scenarioId:'order',lang:s.guestLang,original:PHRASES[s.guestLang].order.request,requestId:'interp-showcase-'+s.runId},s.at):null;
 const reply=s.phase>=3?createInterpretedReply(request,s.at):null;
 const order=s.phase>=4?{id:'showcase-order-'+s.runId,number:1,table:7,fulfillment:normalizeFulfillment({channel:'dine-in',table:7}),lang:s.guestLang,lines:[{itemId:item.id,name:item.name,quantity:1,unitPrice:item.price}],total:item.price,currency:'VND',payment:'unpaid',status:['pending','accepted','preparing','ready'][s.phase-4]}:null;
 return {item,request,reply,order,translated:s.phase>=2,activePane:['guest','guest','owner','guest','owner','guest','owner','guest'][s.phase],ready:s.phase===7};
}
// A cancelled generation cannot advance even if an old callback has already queued.
export function createShowcasePlayer({advance,onChange,schedule=setTimeout,cancel=clearTimeout,delay=3600}) {
 let running=false,timer=null,generation=0;
 const arm=()=>{const current=generation;timer=schedule(()=>{if(!running||current!==generation)return;timer=null;if(!advance())running=false;else arm();onChange();},delay);};
 return {get running(){return running;},play(){if(running)return;running=true;generation++;arm();onChange();},pause(){running=false;generation++;if(timer!==null)cancel(timer);timer=null;onChange();},dispose(){running=false;generation++;if(timer!==null)cancel(timer);timer=null;}};
}
