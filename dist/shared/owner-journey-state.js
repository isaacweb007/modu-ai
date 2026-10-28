import {createOwnerSample} from './owner-sample.js?v=5.6.0';

export const OWNER_JOURNEY_STEPS=Object.freeze(['login','email','inbox','password','signin','shop','orders']);
export const OWNER_JOURNEY_TABS=Object.freeze(['shop','orders','bookings','menu']);
// This is a fictional presentation, with no storage, credentials, or account access.
export function createOwnerJourney(at=new Date()) {
 const sample=createOwnerSample('ko',at);
 const original=structuredClone({store:sample.store,items:sample.items,orders:sample.orders,reservations:sample.reservations});
 let phase=0,tab='shop';
 const move=index=>{phase=index;tab=phase===6?'orders':'shop';};
 return {
  get phase(){return phase;},get step(){return OWNER_JOURNEY_STEPS[phase];},get tab(){return tab;},
  get complete(){return phase===OWNER_JOURNEY_STEPS.length-1;},
  snapshot:()=>structuredClone(original),
  advance(expected=phase){if(expected!==phase||this.complete)return false;move(phase+1);return true;},
  back(){if(!phase)return false;move(phase-1);return true;},
  go(index){if(!Number.isInteger(index)||index<0||index>=OWNER_JOURNEY_STEPS.length)return false;move(index);return true;},
  selectTab(value){if(phase<5||!OWNER_JOURNEY_TABS.includes(value))return false;tab=value;return true;},
  restart(){move(0);}
 };
}
