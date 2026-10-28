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
 let values=initialRequest(setup.menu(),showcaseSnapshot(service)),draft=structuredClone(values),errors={};
 const resetRequest=()=>{values=initialRequest(setup.menu(),showcaseSnapshot(service));draft=structuredClone(values);errors={};};
 const rebuildSetup=()=>{setup=createShopSetup();while(setup.phase<Math.min(phase,5)){if(setup.phase===3)setup.confirm();else setup.advance();}};
 const actor=()=>phase<6?'owner':showcaseActor({...service,phase:phase-6});
 const link=(lang='ko')=>phase>=5?integratedGuestUrl(lang,service.scenario):null;
 const restart=()=>{phase=0;setup=createShopSetup();service=createShowcase('vi',undefined,undefined,service.scenario);resetRequest();};
 return {
  get phase(){return phase;},get steps(){return service.scenario==='booking'?bookingSteps:INTEGRATED_STEPS;},get step(){return this.steps[phase];},
  get last(){return showcaseLast(service)+6;},get complete(){return phase===this.last;},get scenario(){return service.scenario;},
  get runId(){return service.runId;},get guestLang(){return service.guestLang;},get actor(){return actor();},
  get approved(){return setup.approved;},get group(){return INTEGRATED_GROUPS.findLastIndex(start=>phase>=start);},
  setupView(){return {phase:setup.phase,approved:setup.approved,menu:()=>setup.menu(),link};},
  serviceState(){return phase<6?null:{...service,phase:phase-6};},
  snapshot(){const state=this.serviceState();return state?requestSnapshot(showcaseSnapshot(state),state,values,setup.menu()):null;},
  draft(){return structuredClone(draft);},get errors(){return {...errors};},
  setField(field,value){if(phase!==7)return false;const id=field.replace(/^quantity-/, '');if(field.startsWith('quantity-')&&Object.hasOwn(draft.quantities,id))draft.quantities[id]=String(value);else if(['date','time','partySize','address','phone'].includes(field))draft[field]=String(value);else return false;return true;},
  edit(){if(phase<7)return false;phase=7;service={...service,runId:crypto.randomUUID()};errors={};return true;},
  menu(){return setup.menu();},link,
  advance(expected=phase,by=actor(),runId=service.runId){
   if(expected!==phase||runId!==service.runId||by!==actor()||phase===3||this.complete)return false;
   if(phase<5&&!setup.advance(phase))return false;
   if(phase>=5&&!setup.approved)return false;
   if(phase===7){const result=validateRequest(draft,service.scenario,setup.menu());errors=result.errors;if(!result.valid)return false;if(JSON.stringify(values)!==JSON.stringify(result.values))service={...service,runId:crypto.randomUUID()};values=result.values;draft=structuredClone(values);}
   phase++;return true;
  },
  confirm(expected=phase,runId=service.runId){if(expected!==3||phase!==3||runId!==service.runId||!setup.confirm())return false;phase=4;return true;},
  selectLanguage(lang){if(phase!==6||!Object.hasOwn(LANGS,lang))return false;service={...service,guestLang:lang};return true;},
  selectScenario(value){if(!INTEGRATED_SCENARIOS.includes(value)||value===service.scenario)return false;service={...service,scenario:value};restart();return true;},
  back(){if(!phase)return false;phase--;rebuildSetup();return true;},restart
 };
}
