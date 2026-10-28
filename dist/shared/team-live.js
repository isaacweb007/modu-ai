import {CLOUD} from './cloud-config.js?v=5.9.0';
import {createClient} from '../assets/supabase.js?v=5.6.0';

export async function teamRequest(store,path,method='GET',data,token){
 let response;try{response=await fetch(`${CLOUD.url}/functions/v1/modu-api/${store}/${path}`,{method,headers:{apikey:CLOUD.key,'content-type':'application/json','x-modu-token':token},body:data?JSON.stringify(data):undefined,signal:AbortSignal.timeout(15000)});}catch{throw Error('offline');}
 let result;try{result=await response.json();}catch{throw Error('offline');}
 if(!response.ok)throw Error(result.error||'offline');return result;
}
// Every network invalidation supersedes an earlier read, including one already in flight.
export function createTeamSync({read,write,onchange=()=>{},staff=false}){
 const sync={data:null,status:'connecting',busy:false,stopped:false,generation:0,reading:null,pending:false,
  notify(){if(!this.stopped)onchange(this);},
  invalidate(){if(this.stopped)return;this.generation++;this.pending=true;if(staff){this.data=null;this.status='connecting';this.notify();}return this.refresh();},
  suspend(){this.generation++;this.pending=false;this.data=null;this.status='offline';this.notify();},
  async refresh(){if(this.stopped)return;if(this.reading){this.pending=true;return this.reading;}const generation=this.generation;this.pending=false;
   this.reading=(async()=>{try{const data=await read();if(this.stopped||generation!==this.generation)return;const changed=JSON.stringify(data)!==JSON.stringify(this.data)||this.status!=='live';this.data=data;this.status='live';if(changed)this.notify();}
   catch(e){if(this.stopped||generation!==this.generation)return;this.data=null;this.status=['revoked','noAccess','ownerAccess','demoExpired'].includes(e.message)?'revoked':e.message==='limitReached'?'limitReached':'offline';this.notify();}})();
   await this.reading;this.reading=null;if(this.pending&&!this.stopped)return this.refresh();
  },
  async mutate(path,method,data){if(this.stopped||this.busy||this.status!=='live')throw Error(this.status==='revoked'?'revoked':'offline');this.busy=true;this.generation++;let result,error;
   try{result=await write(path,method,data);}catch(e){error=e;}finally{this.busy=false;await this.invalidate();}
   if(error)throw error;return result;
  },
  stop(){this.stopped=true;this.generation++;this.data=null;}
 };return sync;
}
export function connectTeam({storeId,token,memberId,onchange}){
 const staff=!!memberId,path=staff?'staff/'+memberId:'team';
 const sync=createTeamSync({staff,onchange,read:()=>teamRequest(storeId,path,'GET',null,token),write:(sub,method,data)=>teamRequest(storeId,staff?path:sub,method,data,token)});
 const client=createClient(CLOUD.url,CLOUD.key,{auth:{persistSession:false,autoRefreshToken:false}});let debounce;
 const invalidate=()=>{clearTimeout(debounce);debounce=setTimeout(()=>{if(document.visibilityState!=='hidden'&&navigator.onLine)sync.invalidate();},150);};
 const channel=client.channel('modu:'+storeId).on('broadcast',{event:'refresh'},invalidate).subscribe(status=>{if(status==='SUBSCRIBED')invalidate();else if(['CHANNEL_ERROR','TIMED_OUT','CLOSED'].includes(status)&&staff)sync.suspend();});
 const poll=setInterval(()=>{if(document.visibilityState!=='hidden'&&navigator.onLine)sync.refresh();},20000);
 const visibility=()=>{if(document.visibilityState==='hidden'){if(staff)sync.suspend();}else sync.invalidate();};
 const online=()=>sync.invalidate(),offline=()=>sync.suspend();
 document.addEventListener('visibilitychange',visibility);window.addEventListener('online',online);window.addEventListener('offline',offline);
 const stop=sync.stop.bind(sync);sync.stop=()=>{stop();clearTimeout(debounce);clearInterval(poll);client.removeChannel(channel);document.removeEventListener('visibilitychange',visibility);window.removeEventListener('online',online);window.removeEventListener('offline',offline);};
 sync.refresh();return sync;
}
export function staffLink(storeId,memberId,token,lang='ko'){const url=new URL('staff.html',CLOUD.guestBase);url.search=new URLSearchParams({store:storeId,member:memberId,lang,v:'5.11.0'});url.hash='access='+token;return url.href;}
// Fragment never reaches the HTTP server or referrer; erase it before any API call.
export function consumeStaffLink(url,storage,replace){const u=new URL(url),storeId=u.searchParams.get('store'),memberId=u.searchParams.get('member'),fragment=new URLSearchParams(u.hash.slice(1)),raw=fragment.get('access');
 if(raw!==null){u.hash='';replace(u.href);}
 const uuid=/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
 if(!uuid.test(storeId||'')||!uuid.test(memberId||''))return null;const key=`one-shop-staff:${storeId}:${memberId}`;
 if(raw!==null){if(!/^[a-f0-9]{64}$/.test(raw))return null;storage.setItem(key,raw);}
 const token=storage.getItem(key);return /^[a-f0-9]{64}$/.test(token||'')?{storeId,memberId,token,key}:null;
}
