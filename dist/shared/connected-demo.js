import {CLOUD} from './cloud-config.js?v=5.9.0';
const uuid=value=>/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(value||'');
const token=value=>/^[a-f0-9]{64}$/.test(value||'');
export const CONNECTED_DEMO_KEY='one-shop-connected-demo-v1';
export function validDemo(room,now=Date.now()){
 return !!room&&uuid(room.storeId)&&Date.parse(room.expiresAt)>now&&room.owner?.storeId===room.storeId&&token(room.owner?.token)&&['floor','kitchen'].every(role=>uuid(room[role]?.member?.id)&&token(room[role]?.token));
}
export function readDemo(storage,now){try{const room=JSON.parse(storage.getItem(CONNECTED_DEMO_KEY));return validDemo(room,now)?room:null;}catch{return null;}}
// The book can be owner-private on Sites; phone invitations use the public app host.
export function connectedAppBase(href){const u=new URL('./',href);return u.hostname==='modu-ai-project-book.isaacweb007.chatgpt.site'?new URL('../',CLOUD.guestBase):u;}
export function connectedAppLinks(room,lang='ko',base){
 if(!validDemo(room))throw Error('demoExpired');
 const url=path=>{const u=new URL(path,base);u.search=new URLSearchParams({lang,v:'5.30.1',store:room.storeId,demo:'shared'});return u;};
 const guest=url('jumo/');guest.searchParams.set('table','7');
 const owner=url('jumo/owner.html');owner.hash='access='+room.owner.token;
 const result={guest:guest.href,owner:owner.href};
 for(const role of ['floor','kitchen']){const u=url('jumo/staff.html');u.searchParams.set('member',room[role].member.id);u.hash='access='+room[role].token;result[role]=u.href;}
 return result;
}
export async function demoRequest(path,method='GET',data,access){
 let response;try{response=await fetch(`${CLOUD.url}/functions/v1/modu-api/${path}`,{method,headers:{apikey:CLOUD.key,'content-type':'application/json',...(access?{'x-modu-token':access}:{})},body:data?JSON.stringify(data):undefined,signal:AbortSignal.timeout(30000)});}catch{throw Error('offline');}
 let result;try{result=await response.json();}catch{throw Error('offline');}
 if(!response.ok)throw Error(result.error||'offline');return result;
}
// Remove the fragment before network activity; only a server-confirmed demo session can use this entry.
export function consumeDemoOwnerLink(href,replace){const u=new URL(href),access=new URLSearchParams(u.hash.slice(1)).get('access');if(access===null)return null;u.hash='';replace(u.href);if(u.searchParams.get('demo')!=='shared'||!uuid(u.searchParams.get('store'))||!token(access))throw Error('noAccess');return {storeId:u.searchParams.get('store'),token:access};}
export function verifiedDemoCredential(candidate,result,now=Date.now()){
 if(!candidate||result?.mode!=='session'||result.demo!==true||result.storeId!==candidate.storeId||!token(candidate.token)||!uuid(candidate.storeId)||Date.parse(result.expiresAt)<=now||!Number.isFinite(Date.parse(result.expiresAt)))throw Error('noAccess');
 return {...candidate,expiresAt:result.expiresAt};
}
