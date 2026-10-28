import {createShopSetup,setupGuestUrl} from './shop-setup-state.js?v=5.14.0';
import {createShowcase,showcaseSnapshot,showcaseActor} from './showcase-state.js?v=5.11.0';
import {LANGS} from './locale.js?v=5.6.0';
export const INTEGRATED_STEPS=Object.freeze(['upload','attached','reading','review','approved','qr','language','menu','request','translation','reply','pending','accepted','preparing','ready']);
export const INTEGRATED_GROUPS=Object.freeze([0,3,5,7,11]);
// One fictional shop, approved menu and order. Presentation state never leaves memory.
export function createIntegratedDemo() {
 let phase=0,setup=createShopSetup(),service=createShowcase('vi');
 const rebuildSetup=()=>{setup=createShopSetup();while(setup.phase<Math.min(phase,5)){if(setup.phase===3)setup.confirm();else setup.advance();}};
 const actor=()=>phase<6?'owner':showcaseActor({...service,phase:phase-6});
 return {
  get phase(){return phase;},get step(){return INTEGRATED_STEPS[phase];},get complete(){return phase===14;},
  get runId(){return service.runId;},get guestLang(){return service.guestLang;},get actor(){return actor();},
  get approved(){return setup.approved;},get group(){return INTEGRATED_GROUPS.findLastIndex(start=>phase>=start);},
  setupView(){return {phase:setup.phase,approved:setup.approved,menu:()=>setup.menu(),link:lang=>setup.link(lang)};},
  serviceState(){return phase<6?null:{...service,phase:phase-6};},
  snapshot(){return phase<6?null:showcaseSnapshot(this.serviceState());},
  menu(){return setup.menu();},link(lang='ko'){return phase>=5?setupGuestUrl(lang):null;},
  advance(expected=phase,by=actor(),runId=service.runId){
   if(expected!==phase||runId!==service.runId||by!==actor()||phase===3||this.complete)return false;
   if(phase<5&&!setup.advance(phase))return false;
   if(phase>=5&&!setup.approved)return false;
   phase++;return true;
  },
  confirm(expected=phase,runId=service.runId){if(expected!==3||phase!==3||runId!==service.runId||!setup.confirm())return false;phase=4;return true;},
  selectLanguage(lang){if(phase!==6||!Object.hasOwn(LANGS,lang))return false;service={...service,guestLang:lang};return true;},
  back(){if(!phase)return false;phase--;rebuildSetup();return true;},
  restart(){phase=0;setup=createShopSetup();service=createShowcase('vi');}
 };
}
