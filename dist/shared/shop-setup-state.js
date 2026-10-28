import {MENU} from './menu.js?v=5.6.0';
import {LANGS} from './locale.js?v=5.6.0';
import {createOwnerSample} from './owner-sample.js?v=5.6.0';

export const SETUP_STEPS=Object.freeze(['welcome','attached','reading','review','approved','ready']);
export const SETUP_PHOTO='assets/one-shop/onboarding/jumo-menu-photo.png';
export const setupLanguage=lang=>Object.hasOwn(LANGS,lang)?lang:'ko';
export function setupGuestUrl(lang='ko') {
 const url=new URL('https://isaacweb007.github.io/modu-ai/jumo/');
 url.search=new URLSearchParams({lang:setupLanguage(lang),preview:'1',sample:'onboarding',table:'7',v:'5.14.0'});
 return url.href;
}
export function createSetupGuestState(lang='ko') {
 const {store}=createOwnerSample(setupLanguage(lang));
 return {version:2,store,items:structuredClone(MENU),menu:{},sessions:[],orders:[],events:[],activeSession:null};
}
// An isolated scripted presentation: no account, upload, OCR, or remote writes.
export function createShopSetup() {
 let phase=0,approved=false;
 return {
  get phase(){return phase;},get step(){return SETUP_STEPS[phase];},
  get complete(){return phase===5;},get approved(){return approved;},
  menu:()=>structuredClone(MENU),
  link(lang='ko'){return this.complete&&approved?setupGuestUrl(lang):null;},
  advance(expected=phase){
   if(expected!==phase||this.complete)return false;
   if(phase===3)return false; // Owner approval is an explicit, separate step.
   if(phase===4&&!approved)return false;
   phase++;return true;
  },
  confirm(expected=phase){if(expected!==3||phase!==3)return false;approved=true;phase=4;return true;},
  back(){if(phase===0)return false;phase--;if(phase<4)approved=false;return true;},
  restart(){phase=0;approved=false;}
 };
}
