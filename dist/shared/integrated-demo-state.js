import {rejectionReasons,reasonMessage,DEMO_REVIEWERS} from './rejection-copy.js?v=5.19.0';
import {AMENDMENT_COPY} from './amendment-copy.js?v=5.19.0';
import {createShopSetup,setupGuestUrl} from './shop-setup-state.js?v=5.14.0';
import {createShowcase,showcaseSnapshot,showcaseActor,showcaseLast,SHOWCASE_SCENARIOS} from './showcase-state.js?v=5.11.0';
import {initialRequest,validateRequest,requestSnapshot} from './integrated-request.js?v=5.17.0';
import {LANGS} from './locale.js?v=5.6.0';
export const INTEGRATED_STEPS=Object.freeze(['upload','attached','reading','review','approved','qr','language','menu','request','translation','reply','pending','accepted','preparing','ready']);
export const INTEGRATED_GROUPS=Object.freeze([0,3,5,7,11]);
export const INTEGRATED_SCENARIOS=Object.freeze(['dineIn','booking','delivery']);
const scenarioFor=value=>SHOWCASE_SCENARIOS.includes(value)?value:'dineIn';
const bookingSteps=Object.freeze([...INTEGRATED_STEPS.slice(0,12),'confirmed','notified']);
export function integratedGuestUrl(lang='ko',scenario='dineIn'){
 const url=new URL(setupGuestUrl(lang));
 if(scenarioFor(scenario)!=='dineIn')url.searchParams.delete('table');
 url.searchParams.set('v','5.16.0');return url.href;
}
export const integratedQr=(lang='ko',scenario='dineIn')=>`assets/one-shop/onboarding/integrated-qr-${scenarioFor(scenario)==='dineIn'?'table':'online'}-${Object.hasOwn(LANGS,lang)?lang:'ko'}.svg`;
// One fictional shop and approved menu per run. No account or remote writes.
export function createIntegratedDemo(scenario='dineIn') {
 let phase=0,setup=createShopSetup(),service=createShowcase('vi',undefined,undefined,scenarioFor(scenario));
 let editing=false,cancelled=false,revision=0,amendments=[],reviewDrafts={};
 const pending=()=>amendments.at(-1)?.status==='pending';
 const requiredRole=()=>service.scenario!=='booking'&&phase>=13?'owner':'floor';
 const same=(a,b)=>JSON.stringify(service.scenario==='booking'?[a.date,a.time,Number(a.partySize)]:[setup.menu().map(m=>Number(a.quantities[m.id])),...(service.scenario==='delivery'?[a.address,a.phone]:[])])===JSON.stringify(service.scenario==='booking'?[b.date,b.time,Number(b.partySize)]:[setup.menu().map(m=>Number(b.quantities[m.id])),...(service.scenario==='delivery'?[b.address,b.phone]:[])]);
 let values=initialRequest(setup.menu(),showcaseSnapshot(service)),draft=structuredClone(values),errors={};
 const resetRequest=()=>{values=initialRequest(setup.menu(),showcaseSnapshot(service));draft=structuredClone(values);errors={};editing=false;cancelled=false;revision=0;amendments=[];reviewDrafts={};};
 const newEntry=(kind,after=null)=>{
  const state={...service,phase:phase-6},snapshot=requestSnapshot(showcaseSnapshot(state),state,after||values,setup.menu());
  reviewDrafts={};return {id:crypto.randomUUID(),kind,status:'pending',requiredRole:requiredRole(),before:structuredClone(values),after,by:null,scenario:service.scenario,phase,guestLang:service.guestLang,requestedAt:new Date().toISOString(),requests:Object.fromEntries(Object.keys(LANGS).map(lang=>[lang,AMENDMENT_COPY[lang][kind]+' · '+snapshot.summaries[lang]]))};
 };
 const rebuildSetup=()=>{setup=createShopSetup();while(setup.phase<Math.min(phase,5)){if(setup.phase===3)setup.confirm();else setup.advance();}};
 const actor=()=>editing||cancelled?'guest':pending()?amendments.at(-1).requiredRole:phase<6?'owner':showcaseActor({...service,phase:phase-6});
 const link=(lang='ko')=>phase>=5?integratedGuestUrl(lang,service.scenario):null;
 const restart=()=>{phase=0;setup=createShopSetup();service=createShowcase('vi',undefined,undefined,service.scenario);resetRequest();};
 return {
  get phase(){return phase;},get steps(){return service.scenario==='booking'?bookingSteps:INTEGRATED_STEPS;},get step(){return this.steps[phase];},
  get last(){return showcaseLast(service)+6;},get complete(){return cancelled||phase===this.last&&!editing&&!pending();},get scenario(){return service.scenario;},
  get runId(){return service.runId;},get guestLang(){return service.guestLang;},get actor(){return actor();},
  get editing(){return editing;},get cancelled(){return cancelled;},get revision(){return revision;},get blocked(){return editing||pending()||cancelled;},get canManage(){return phase>=11&&!this.blocked;},get canBack(){return phase>0&&!this.blocked&&!amendments.length;},
  get amendment(){return structuredClone(amendments.at(-1)||null);},get history(){return structuredClone(amendments);},
  get approved(){return setup.approved;},get group(){return INTEGRATED_GROUPS.findLastIndex(start=>phase>=start);},
  setupView(){return {phase:setup.phase,approved:setup.approved,menu:()=>setup.menu(),link};},
  serviceState(){return phase<6?null:{...service,phase:phase-6,revision,blocked:this.blocked,cancelled};},
  snapshot(){const state=this.serviceState();if(!state)return null;const view=requestSnapshot(showcaseSnapshot(state),state,values,setup.menu());view.activePane=actor();view.ready=view.ready&&!this.blocked;view.cancelled=cancelled;if(cancelled){if(view.order)view.order.status='cancelled';if(view.booking)view.booking.status='cancelled';}return view;},
  amendmentViews(){const entry=amendments.at(-1);if(!entry)return null;const state=this.serviceState(),base=showcaseSnapshot(state),project=v=>requestSnapshot(base,state,v,setup.menu());return {before:project(entry.before),after:entry.after?project(entry.after):null};},
  canReview(role){const entry=amendments.at(-1);return pending()&&(role==='owner'||role==='floor'&&entry.requiredRole==='floor');},
  beginChange(){if(!this.canManage)return false;editing=true;draft=structuredClone(values);errors={};revision++;return true;},
  discardChange(){if(!editing)return false;editing=false;draft=structuredClone(values);errors={};revision++;return true;},
  submitChange(){if(!editing)return false;const result=validateRequest(draft,service.scenario,setup.menu());errors=result.errors;if(!result.valid)return false;if(same(values,result.values)){errors={request:'noChanges'};return false;}amendments.push(newEntry('change',result.values));editing=false;revision++;return true;},
  requestCancel(){if(!this.canManage)return false;amendments.push(newEntry('cancel'));revision++;return true;},
  reviewDraft(role){return {...(reviewDrafts[role]||{reason:'',error:false})};},
  selectReason(role,reason,id,runId=service.runId,expectedRevision=revision){
   const entry=amendments.at(-1);if(runId!==service.runId||expectedRevision!==revision||!this.canReview(role)||entry.id!==id||reason!==''&&!rejectionReasons(entry).includes(reason))return false;
   reviewDrafts[role]={reason,error:false};return true;
  },
  resolveAmendment(id,decision,role,runId=service.runId,expectedRevision=revision,reason=this.reviewDraft(role).reason){
   const entry=amendments.at(-1);if(runId!==service.runId||expectedRevision!==revision||!this.canReview(role)||entry.id!==id||!['approved','rejected'].includes(decision))return false;
   if(decision==='rejected'&&!rejectionReasons(entry).includes(reason)){reviewDrafts[role]={reason:'',error:true};return false;}
   entry.status=decision;entry.by=role;entry.processedBy={...DEMO_REVIEWERS[role]};entry.processedAt=new Date().toISOString();entry.reason=decision==='rejected'?reason:null;
   entry.messages=Object.fromEntries(Object.keys(LANGS).map(lang=>[lang,decision==='rejected'?AMENDMENT_COPY[lang].rejected+' '+reasonMessage(reason,lang):AMENDMENT_COPY[lang][entry.kind==='cancel'?'cancelled':'changed']]));
   reviewDrafts={};
   if(decision==='approved'){if(entry.kind==='cancel')cancelled=true;else{const menuChanged=setup.menu().some(m=>Number(values.quantities[m.id])!==Number(entry.after.quantities[m.id]));values=structuredClone(entry.after);draft=structuredClone(values);if(service.scenario!=='booking'&&phase>=13&&menuChanged)phase=12;}}
   revision++;return true;
  },
  draft(){return structuredClone(draft);},get errors(){return {...errors};},
  setField(field,value){if(phase!==7&&!editing)return false;const id=field.replace(/^quantity-/, '');if(field.startsWith('quantity-')&&Object.hasOwn(draft.quantities,id))draft.quantities[id]=String(value);else if(['date','time','partySize','address','phone'].includes(field))draft[field]=String(value);else return false;return true;},
  edit(){if(phase>=11)return this.beginChange();if(phase<7||this.blocked)return false;phase=7;service={...service,runId:crypto.randomUUID()};errors={};return true;},
  menu(){return setup.menu();},link,
  advance(expected=phase,by=actor(),runId=service.runId,expectedRevision=revision){
   if(this.blocked||expectedRevision!==revision||expected!==phase||runId!==service.runId||by!==actor()||phase===3||this.complete)return false;
   if(phase<5&&!setup.advance(phase))return false;
   if(phase>=5&&!setup.approved)return false;
   if(phase===7){const result=validateRequest(draft,service.scenario,setup.menu());errors=result.errors;if(!result.valid)return false;if(JSON.stringify(values)!==JSON.stringify(result.values))service={...service,runId:crypto.randomUUID()};values=result.values;draft=structuredClone(values);}
   phase++;return true;
  },
  confirm(expected=phase,runId=service.runId){if(expected!==3||phase!==3||runId!==service.runId||!setup.confirm())return false;phase=4;return true;},
  selectLanguage(lang){if(phase!==6||!Object.hasOwn(LANGS,lang))return false;service={...service,guestLang:lang};return true;},
  selectScenario(value){if(!INTEGRATED_SCENARIOS.includes(value)||value===service.scenario)return false;service={...service,scenario:value};restart();return true;},
  back(){if(!this.canBack)return false;phase--;rebuildSetup();return true;},restart
 };
}
