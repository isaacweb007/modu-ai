// Each receipt has its own key so different tabs cannot overwrite one another's queue.
// Only opaque event identifiers are stored; order and customer details stay out of storage.
const prefix = identity => `one-shop-pending-read:${encodeURIComponent(identity)}:`;
const valid = /^counter:[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}:(requested|approved)$/;
export function pendingReadKeys(storage,identity){
 const result=new Set(),start=prefix(identity);
 try{for(let i=0;i<storage.length;i++){const k=storage.key(i);if(!k?.startsWith(start))continue;try{const value=decodeURIComponent(k.slice(start.length));if(valid.test(value))result.add(value);}catch{}}}catch{}
 return result;
}
export function createPendingReadSync({storage,eventsFor,importBatch,onChange=()=>{},retryMs=5000,isOnline=()=>true}){
 let context=null,running=false,timer=null,status='idle',blocked=new Set(),scope=null;
 const confirmedByIdentity=new Map();
 const confirmed=identity=>{if(!confirmedByIdentity.has(identity))confirmedByIdentity.set(identity,new Set());return confirmedByIdentity.get(identity);};
 function setStatus(next){if(status!==next){status=next;onChange();}}
 function update(value){
  if(!value){context=null;scope=null;blocked=new Set();if(timer)clearTimeout(timer);timer=null;setStatus('idle');return;}
  if(scope!==value.identity){scope=value.identity;blocked=new Set();if(timer)clearTimeout(timer);timer=null;}
  context=value;pump();
 }
 function enqueue(identity,key){
  if(!identity||!valid.test(key))return false;
  try{const k=prefix(identity)+encodeURIComponent(key);storage.setItem(k,'1');if(storage.getItem(k)!=='1')return false;}catch{return false;}
  blocked.delete(key);onChange();pump();return true;
 }
 function pump(){
  if(!context||running||timer)return;
  const captured=context,queued=pendingReadKeys(storage,captured.identity),server=new Set(captured.snapshot.notificationReads||[]);
  // Already-saved receipts are safe to discard, even after a browser was closed mid-sync.
  for(const key of queued)if(server.has(key)||confirmed(captured.identity).has(key)){try{storage.removeItem(prefix(captured.identity)+encodeURIComponent(key));}catch{}queued.delete(key);confirmed(captured.identity).add(key);}
  const visible=new Map(eventsFor(captured).map(e=>[e.key,e]));
  const todo=[...queued].filter(k=>visible.has(k)&&!blocked.has(k)).slice(0,20);
  if(!queued.size){setStatus('idle');return;}
  if(!isOnline()){setStatus('retry');return;}
  if(!todo.length){setStatus('deferred');return;}
  running=true;setStatus('syncing');
  Promise.resolve().then(()=>importBatch(todo.map(k=>visible.get(k)),captured)).then(result=>{
   const accepted=new Set((Array.isArray(result?.keys)?result.keys:[]).filter(k=>todo.includes(k)));
   for(const key of todo){if(accepted.has(key)){confirmed(captured.identity).add(key);try{storage.removeItem(prefix(captured.identity)+encodeURIComponent(key));}catch{}}else if(context?.identity===captured.identity)blocked.add(key);}
   running=false;onChange();pump();
  }).catch(()=>{running=false;if(context?.identity===captured.identity){setStatus('retry');timer=setTimeout(()=>{timer=null;pump();},retryMs);}else pump();});
 }
 function retry(){if(timer)clearTimeout(timer);timer=null;blocked=new Set();pump();}
 return {update,enqueue,retry,confirmed,getStatus:()=>status,pending:identity=>pendingReadKeys(storage,identity)};
}
