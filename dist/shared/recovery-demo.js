import {createOwnerSample} from './owner-sample.js?v=5.6.0';
export const RECOVERY_SAMPLE_KEY='one-shop-email-recovery-sample-v1';
// A presentation state machine. Never reads credentials, calls a server, or grants owner access.
export function createRecoveryDemo(storage,now=()=>Date.now()){
 let snapshot;try{const saved=JSON.parse(storage.getItem(RECOVERY_SAMPLE_KEY));if(saved?.kind==='fictional-recovery-v1'&&saved.snapshot?.store&&Array.isArray(saved.snapshot.items)&&Array.isArray(saved.snapshot.orders)&&Array.isArray(saved.snapshot.reservations))snapshot=saved.snapshot;}catch{}
 if(!snapshot){const s=createOwnerSample('ko',new Date(now()));snapshot={store:s.store,items:s.items,orders:s.orders,reservations:s.reservations};try{storage.setItem(RECOVERY_SAMPLE_KEY,JSON.stringify({kind:'fictional-recovery-v1',snapshot}));}catch{}}
 const original=structuredClone(snapshot);
 return {stage:'email',email:'owner@example.com',expires:0,used:false,tab:'orders',
  snapshot:()=>structuredClone(original),
  request(email){if(typeof email!=='string'||email.length>254||!/^\S+@[^\s@]+\.[^\s@]+$/.test(email)||/[<>\r\n]/.test(email))throw Error('invalidEmail');this.email=email.trim();this.expires=now()+15*60*1000;this.used=false;this.stage='inbox';},
  valid(){return !this.used&&this.expires>now();},
  open(){if(this.stage!=='inbox'||!this.valid())throw Error('expired');this.stage='password';},
  reset(password,confirm){if(this.stage!=='password'||!this.valid())throw Error('expired');if(typeof password!=='string'||[...password].length<12||[...password].length>128)throw Error('passwordLength');if(password!==confirm)throw Error('passwordMismatch');this.used=true;this.email='';this.stage='done';},
  returnShop(){if(this.stage!=='done')throw Error('expired');this.stage='shop';},
  restart(){this.stage='email';this.email='owner@example.com';this.expires=0;this.used=false;this.tab='orders';}
 };
}
