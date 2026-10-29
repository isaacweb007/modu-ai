// The prior demo stored a JSON array of event keys per shop and identity.
// Keep that original array intact so interrupted imports and older tabs cannot lose receipts.
export function legacyKeys(storage,identity){try{const value=JSON.parse(storage.getItem('one-shop-inbox:'+identity)||'[]');return new Set(Array.isArray(value)?value.filter(x=>typeof x==='string').slice(-1000):[]);}catch{return new Set();}}
export function legacyCandidates(storage,context,events,confirmed=new Set(),blocked=new Set()){
 const legacy=legacyKeys(storage,context.identity),server=new Set(context.snapshot.notificationReads||[]);
 const kind=context.role==='owner'||context.role==='floor'?'requested':context.role==='guest'||context.role==='kitchen'?'approved':null;
 if(!kind)return [];
 const pattern=/^counter:([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}):(requested|approved)$/;
 return [...legacy].flatMap(key=>{const match=pattern.exec(key);if(!match||match[2]!==kind||server.has(key)||confirmed.has(key)||blocked.has(key))return [];return [{key,amendmentId:match[1]}];});
}

export function createLegacyReadImporter({storage,eventsFor,importBatch,onChange=()=>{},retryMs=5000}){
 let context=null,running=false,timer=null,status={state:'idle',count:0},scope=null,signature='',blocked=new Set();const confirmedByIdentity=new Map();
 function setStatus(state,count=0){if(status.state!==state||status.count!==count){status={state,count};onChange(status);}}
 function confirmed(identity){if(!confirmedByIdentity.has(identity))confirmedByIdentity.set(identity,new Set());return confirmedByIdentity.get(identity);}
 function update(value){
  if(!value){context=null;scope=null;signature='';blocked=new Set();if(timer){clearTimeout(timer);timer=null;}return;}
  const events=eventsFor(value),nextSignature=events.map(x=>x.key).sort().join('|');
  if(scope!==value.identity||signature!==nextSignature){scope=value.identity;signature=nextSignature;blocked=new Set();}
  context=value;pump();
 }
 function pump(){
  if(!context||running||timer)return;
  const captured=context,events=eventsFor(captured),todo=legacyCandidates(storage,captured,events,confirmed(captured.identity),blocked);
  if(!todo.length){setStatus(blocked.size?'deferred':'idle',blocked.size);return;}
  const batch=todo.slice(0,20);running=true;setStatus('syncing',todo.length);
  Promise.resolve().then(()=>importBatch(batch,captured)).then(result=>{
   const valid=new Set(batch.map(x=>x.key)),accepted=new Set((Array.isArray(result?.keys)?result.keys:[]).filter(k=>valid.has(k)));
   for(const event of batch){if(accepted.has(event.key))confirmed(captured.identity).add(event.key);else if(context?.identity===captured.identity)blocked.add(event.key);}
   running=false;onChange(status);pump();
  }).catch(()=>{running=false;setStatus('retry',todo.length);if(context?.identity===captured.identity){timer=setTimeout(()=>{timer=null;pump();},retryMs);}});
 }
 return {update,getStatus:()=>status,confirmed:identity=>confirmed(identity)};
}
