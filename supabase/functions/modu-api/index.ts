import {rejectionMessages} from './rejection-messages.js';
import {hashPassword} from './passwords.js';
import {ownerAuthRoutes} from './owner-auth.ts';
import {connectedDemoRoute} from './connected-demo.ts';
import {createClient} from 'npm:@supabase/supabase-js@2.118.0';
import {fail,text,uuid,requestId,storeData,menuData,workspaceData,messageData,reservationData,fileType,langs,fulfillmentData} from './validation.js';
import {staffData} from './staff-validation.js';
import {createInterpretation,createInterpretedReply} from './interpreter.js';
const admin=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,{auth:{persistSession:false,autoRefreshToken:false}});
const headers={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'apikey, content-type, x-modu-token, x-file-name, x-file-kind','Access-Control-Allow-Methods':'GET, POST, PUT, PATCH, OPTIONS','Cache-Control':'no-store','Content-Type':'application/json'};
const reply=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers});
const hash=async(s:string)=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s))),n=>n.toString(16).padStart(2,'0')).join('');
const token=()=>Array.from(crypto.getRandomValues(new Uint8Array(32)),n=>n.toString(16).padStart(2,'0')).join('');
function checked({data,error}:any){if(error){if(['revoked','noAccess','ownerAccess','ownerOnly'].includes(error.message))fail(error.message,403);if(['permissionConflict','staffLimit','amendPending'].includes(error.message))fail(error.message,409);if(['invalid','invalidBooking','reasonRequired','invalidReason','sameOffer'].includes(error.message))fail(error.message);if(['menuConflict','ownerConflict','emptyCart','soldOut','maxQty','storeNotReady'].includes(error.message))fail(error.message,409);throw new Error('cloudError');}return data;}
async function body(req:Request,max=256000){const reader=req.body?.getReader();if(!reader)fail('invalid');let size=0;const parts:Uint8Array[]=[];while(true){const {done,value}=await reader!.read();if(done)break;size+=value.length;if(size>max){await reader!.cancel();fail('uploadLimit',413);}parts.push(value);}const buf=new Uint8Array(size);let offset=0;for(const p of parts){buf.set(p,offset);offset+=p.length;}return buf;}
async function json(req:Request){try{return JSON.parse(new TextDecoder().decode(await body(req)));}catch(e){if(e.status)throw e;fail('invalid');}}
async function limit(key:string,count:number,seconds=60){if(!checked(await admin.rpc('modu_rate_limit',{p_key:key,p_limit:count,p_seconds:seconds})))fail('limitReached',429);}
async function store(id:string){const data=checked(await admin.from('modu_stores').select('*').eq('id',id).maybeSingle());if(!data)fail('storeMissing',404);return data;}
async function access(req:Request,id:string,ownerOnly=false){const raw=req.headers.get('x-modu-token')||'';if(!/^[a-f0-9]{64}$/.test(raw))fail('ownerAccess',401);const h=await hash(raw);
 const valid=checked(await admin.rpc('modu_owner_session_valid',{p_store:id,p_hash:h}));
 if(valid){const own=checked(await admin.from('modu_owners').select('store_id,workspace,workspace_revision').eq('store_id',id).single());return {owner:true,...own};}
 if(ownerOnly)fail('ownerAccess',403);
 const guest=checked(await admin.from('modu_visits').select('id,store_id,table_no,lang,created_at').eq('store_id',id).eq('token_hash',h).maybeSingle());if(!guest)fail('ownerAccess',403);return {owner:false,...guest};}
function reviewReason(data:any){
 if(typeof data.approve!=='boolean')fail('invalid');
 if(data.approve){if(data.reason!=null&&data.reason!=='')fail('invalid');return {p_reason:null,p_messages:null};}
 if(typeof data.reason!=='string'||!data.reason)fail('reasonRequired');
 const messages=Object.hasOwn(rejectionMessages,data.reason)?rejectionMessages[data.reason]:null;
 if(!messages)fail('invalidReason');return {p_reason:data.reason,p_messages:messages};
}
function offerData(data:any, country:string){
 if(!data||typeof data!=='object')fail('invalid');
 if(data.type==='order'){if(typeof data.itemId!=='string'||!Number.isInteger(data.quantity)||data.quantity<1||data.quantity>20)fail('invalid');return {itemId:data.itemId,quantity:data.quantity};}
 if(data.type==='booking'){const checked=reservationData({date:data.date,time:data.time,partySize:2,name:'guest'},country);return {date:checked.date,time:checked.time};}
 fail('invalid');
}
const ownerRoute=ownerAuthRoutes({admin,checked,fail,hash,token,limit,json,reply});
const createConnectedDemo=connectedDemoRoute({admin,checked,hash,token,limit,json,reply});

async function media(id:string){const files=checked(await admin.from('modu_media').select('id,name,type,size,kind,path').eq('store_id',id).order('created_at').limit(30));if(!files.length)return [];const urls=checked(await admin.storage.from('modu-store-media').createSignedUrls(files.map((x:any)=>x.path),3600));return files.map((x:any,i:number)=>{const {path,...m}=x;return {...m,url:urls[i]?.signedUrl||''};});}
async function notificationReads(storeId:string,actorType:string,actorId:string){const rows=checked(await admin.from('modu_notification_reads').select('amendment_id,event_type').eq('store_id',storeId).eq('actor_type',actorType).eq('actor_id',actorId).order('read_at',{ascending:false}).limit(1000));return rows.map((row:any)=>`counter:${row.amendment_id}:${row.event_type}`);}
async function snapshot(st:any,auth:any){let oq=admin.from('modu_orders').select('*,modu_visits(table_no,lang)').eq('store_id',st.id).order('created_at',{ascending:false}).limit(500);let rq=admin.from('modu_reservations').select('*,modu_visits(table_no,lang)').eq('store_id',st.id).order('created_at',{ascending:false}).limit(500);let vq=admin.from('modu_visits').select('id,table_no,lang,created_at').eq('store_id',st.id).order('created_at',{ascending:false}).limit(500);let mq=admin.from('modu_messages').select('id,visit_id,request_id,kind,payload,reviewed,created_at').eq('store_id',st.id).order('created_at',{ascending:false}).limit(2000);if(!auth.owner){oq=oq.eq('visit_id',auth.id);rq=rq.eq('visit_id',auth.id);vq=vq.eq('id',auth.id);mq=mq.eq('visit_id',auth.id);}
 let aq=admin.from('modu_amendments').select('id,visit_id,target_id,target_type,kind,status,before_data,after_data,original_status,guest_lang,created_at,reviewed_at,reviewed_by,reviewed_member,reason_code,reason_messages,proposal_data,proposal_status,proposal_at,proposal_responded_at,parent_amendment_id').eq('store_id',st.id).order('created_at',{ascending:false}).limit(500);if(!auth.owner)aq=aq.eq('visit_id',auth.id);const [orders,reservations,visits,messages,files,amendments,reads]=await Promise.all([oq,rq,vq,mq,media(st.id),aq,notificationReads(st.id,auth.owner?'owner':'guest',auth.owner?st.id:auth.id)]);return {notificationReads:reads,amendments:auth.owner?checked(amendments):checked(amendments).map(({reviewed_by,reviewed_member,...row}:any)=>row),id:st.id,store:{...st.public_data,media:files},menu:st.menu,revision:st.revision,published:st.published,orders:checked(orders),reservations:checked(reservations),visits:checked(visits),messages:checked(messages),workspace:auth.owner?auth.workspace:undefined,workspaceRevision:auth.owner?auth.workspace_revision:undefined,visitId:auth.owner?undefined:auth.id};}
// The server supplies both languages; clients cannot invent an owner translation.
async function saveThread(storeId:string,visitId:string,payload:any){
 checked(await admin.from('modu_messages').upsert({store_id:storeId,visit_id:visitId,request_id:payload.id,kind:'thread',payload},{onConflict:'visit_id,request_id',ignoreDuplicates:true}));
 const row=checked(await admin.from('modu_messages').select('payload').eq('store_id',storeId).eq('visit_id',visitId).eq('request_id',payload.id).eq('kind','thread').single());
 if(row.payload?.interpretation?.direction!==payload.interpretation.direction)fail('ownerConflict',409);
 return row.payload;
}
async function receipt(storeId:string,auth:any,row:any,kind:string,language:string){
 const sourceLang=langs.includes(language)?language:auth.lang;
 const describe=(lang:string)=>kind==='orders'?row.lines.map((l:any)=>(l.name?.[lang]||l.name?.ko||l.itemId)+' × '+l.quantity).join(' · '):row.date+' '+row.time+' · '+row.party_size+' · '+row.name;
 await saveThread(storeId,auth.id,{id:'receipt-'+row.id,at:row.created_at||new Date().toISOString(),role:'user',text:describe(sourceLang),interpretation:{direction:'receipt',recordKind:kind,recordId:row.id,sourceLang,original:describe(sourceLang),ko:describe('ko')}});
 return row;
}
Deno.serve(async(req:Request)=>{if(req.method==='OPTIONS')return new Response(null,{headers});try{
 const path=new URL(req.url).pathname.split('/').filter(Boolean);const root=path.indexOf('modu-api');const parts=path.slice(root+1);const [id,action,item]=parts;
 const ip=req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||'unknown';const ipKey=await hash(ip);await limit('request:'+ipKey,300);
 if(id==='health'&&req.method==='GET')return reply({ok:true,version:9});
 if(id==='demo'&&parts.length===1&&req.method==='POST')return await createConnectedDemo(req,ipKey);
 if(id==='create'&&req.method==='POST'){await limit('create:'+ipKey,5,3600);const b=await json(req),secret=token(),password=await hashPassword(b.password);const result=checked(await admin.rpc('modu_create_password_store',{p_legacy_hash:await hash(token()),p_store:storeData(b.store),p_menu:menuData(b.menu),p_workspace:workspaceData(b.workspace),p_password:password,p_session_hash:await hash(secret),p_seed:b.seedDemo===true}));return reply({...result,token:secret},201);}
 if(!uuid(id))fail('storeMissing',404);const st=await store(id);
 if(st.demo_expires_at&&Date.parse(st.demo_expires_at)<=Date.now())fail('demoExpired',410);
 if(action==='owner-auth')return await ownerRoute(req,id,item,ipKey,st);
 if(action==='public'&&req.method==='GET'){if(!st.published)fail('storeNotReady',404);return reply({id,store:{...st.public_data,media:await media(id)},menu:st.menu,revision:st.revision,published:true});}
 if(action==='visits'&&req.method==='POST'){if(!st.published)fail('storeNotReady',404);await limit('visit:'+ipKey,40,3600);const b=await json(req),secret=token();if(b.table!=null&&(!Number.isInteger(b.table)||b.table<1||b.table>999))fail('invalid');const visit=checked(await admin.from('modu_visits').insert({store_id:id,token_hash:await hash(secret),table_no:b.table??null,lang:langs.includes(b.lang)?b.lang:'ko'}).select('id').single());return reply({storeId:id,visitId:visit.id,token:secret},201);}
 // Staff has a separate projection and can never enter owner or guest routes.
 if(action==='staff'&&uuid(item)&&['GET','PATCH'].includes(req.method)){
  const raw=req.headers.get('x-modu-token')||'';if(!/^[a-f0-9]{64}$/.test(raw))fail('revoked',403);
  const h=await hash(raw);await limit('staff:'+h,120);
  if(req.method==='GET'){const data=checked(await admin.rpc('modu_staff_snapshot',{p_store:id,p_member:item,p_hash:h}));const visible=new Set((data.amendments||[]).map((a:any)=>a.id));const reads=await notificationReads(id,'staff',item);return reply({...data,notificationReads:reads.filter((key:string)=>visible.has(key.split(':')[1]))});}
  const b=await json(req);if(b.action==='notificationRead'){if(!uuid(b.data?.id))fail('invalid');return reply(checked(await admin.rpc('modu_notification_mark',{p_store:id,p_hash:h,p_actor:'staff',p_member:item,p_amendment:b.data.id})));}if(b.action==='amend'){if(!uuid(b.data?.id)||typeof b.data?.approve!=='boolean')fail('invalid');const args={p_store:id,p_hash:h,p_member:item,p_request:b.data.id,...reviewReason(b.data)};if(b.data.offer){if(b.data.approve)fail('invalid');return reply(checked(await admin.rpc('modu_amend_offer',{...args,p_data:offerData(b.data.offer,st.public_data.country)})));}return reply(checked(await admin.rpc('modu_amend_review',{...args,p_approve:b.data.approve})));}const data=staffData(b,'action');
  return reply(checked(await admin.rpc('modu_staff_action',{p_store:id,p_member:item,p_hash:h,p_action:data.action,p_data:data.data})));
 }
 const ownActions=['store','workspace','media','review','interpreter-reply','team'];const auth=await access(req,id,ownActions.includes(action));await limit('access:'+await hash(req.headers.get('x-modu-token')!),180);
 if(action==='team'){
  if(req.method==='GET'){
   const [members,audit]=await Promise.all([admin.from('modu_staff').select('id,name,role,permissions,revision,expires_at').eq('store_id',id).is('revoked_at',null).order('created_at'),admin.from('modu_staff_audit').select('id,actor,action,target,created_at').eq('store_id',id).order('created_at',{ascending:false}).limit(60)]);
   return reply({members:checked(members).map(({expires_at,...m}:any)=>({...m,expiresAt:expires_at})),audit:checked(audit).map(({created_at,...a}:any)=>({...a,at:created_at}))});
  }
  if(req.method==='POST'||req.method==='PATCH'){
   await limit('team:'+id,40);const b=staffData(await json(req),req.method==='POST'?'create':'manage');
   if(req.method==='PATCH'&&!uuid(item))fail('invalid');
   const operation=req.method==='POST'?'create':b.operation,secret=['create','rotate'].includes(operation)?token():null;
   const member=checked(await admin.rpc('modu_staff_manage',{p_store:id,p_owner_hash:await hash(req.headers.get('x-modu-token')!),p_action:operation,p_member:req.method==='POST'?null:item,p_data:b,p_hash:secret?await hash(secret):null}));
   return reply({member,...(secret?{token:secret}:{})},req.method==='POST'?201:200);
  }
 }
 if(action==='notification-read'&&req.method==='POST'){const b=await json(req);if(!uuid(b.id))fail('invalid');return reply(checked(await admin.rpc('modu_notification_mark',{p_store:id,p_hash:await hash(req.headers.get('x-modu-token')!),p_actor:auth.owner?'owner':'guest',p_member:null,p_amendment:b.id})));}
 if(action==='amendments'&&uuid(item)&&parts.length===4&&parts[3]==='counter'&&req.method==='POST'){
  if(auth.owner)fail('noAccess',403);await limit('amend:'+auth.id,20);const b=await json(req);
  const parent=checked(await admin.from('modu_amendments').select('id,target_type').eq('id',item).eq('store_id',id).eq('visit_id',auth.id).maybeSingle());if(!parent)fail('noAccess',403);
  let data=b.data||{};if(parent.target_type==='booking')data=reservationData({...data,name:'guest'},st.public_data.country);data={...data,guestLang:langs.includes(b.lang)?b.lang:auth.lang};
  return reply(checked(await admin.rpc('modu_amend_counter',{p_store:id,p_visit:auth.id,p_parent:item,p_request_id:requestId(b.requestId),p_data:data})),201);
 }
 if(action==='amendments'&&req.method==='POST'){
  if(auth.owner)fail('noAccess',403);await limit('amend:'+auth.id,20);const b=await json(req);
  if(!uuid(b.targetId)||!['order','booking'].includes(b.targetType)||!['change','cancel'].includes(b.kind))fail('invalid');
  let data=b.data||{};if(b.kind==='change'&&b.targetType==='booking')data=reservationData({...data,name:'guest'},st.public_data.country);data={...data,guestLang:langs.includes(b.lang)?b.lang:auth.lang};
  return reply(checked(await admin.rpc('modu_amend_submit',{p_store:id,p_visit:auth.id,p_target:b.targetId,p_type:b.targetType,p_kind:b.kind,p_request:requestId(b.requestId),p_data:data})),201);
 }
 if(action==='amendments'&&req.method==='PATCH'&&uuid(item)){
  const b=await json(req);if(!auth.owner){if(typeof b.acceptOffer!=='boolean')fail('ownerAccess',403);return reply(checked(await admin.rpc('modu_amend_offer_reply',{p_store:id,p_visit:auth.id,p_request:item,p_accept:b.acceptOffer})));}if(typeof b.approve!=='boolean')fail('invalid');
  const args={p_store:id,p_hash:await hash(req.headers.get('x-modu-token')!),p_member:null,p_request:item,...reviewReason(b)};if(b.offer){if(b.approve)fail('invalid');return reply(checked(await admin.rpc('modu_amend_offer',{...args,p_data:offerData(b.offer,st.public_data.country)})));}return reply(checked(await admin.rpc('modu_amend_review',{...args,p_approve:b.approve})));
 }
 if(action==='snapshot'&&req.method==='GET'){if(!auth.owner&&!st.published)fail('storeNotReady',404);return reply(await snapshot(st,auth));}
 if(action==='store'&&req.method==='PUT'){const b=await json(req),data=storeData(b.store),menu=menuData(b.menu),workspace=workspaceData(b.workspace);if(b.published&&(!data.address||!workspace.manager.completed))fail('required');const rev=checked(await admin.rpc('modu_save_store',{p_id:id,p_revision:b.revision,p_store:data,p_menu:menu,p_workspace:{...workspace,expectedRevision:b.workspaceRevision},p_published:b.published===true}));return reply({revision:rev,workspaceRevision:auth.workspace_revision+1});}
 if(action==='workspace'&&req.method==='PUT'){const b=await json(req);const rows=checked(await admin.from('modu_owners').update({workspace:workspaceData(b.workspace),workspace_revision:auth.workspace_revision+1}).eq('store_id',id).eq('workspace_revision',b.workspaceRevision).select('store_id'));if(!rows.length)fail('ownerConflict',409);return reply({workspaceRevision:auth.workspace_revision+1});}
 if(action==='orders'&&req.method==='POST'){if(auth.owner)fail('invalid');await limit('order:'+auth.id,12);const b=await json(req);const row=checked(await admin.rpc('modu_place_routed_order',{p_store:id,p_visit:auth.id,p_request:requestId(b.requestId),p_cart:b.cart,p_revision:b.revision,p_fulfillment:fulfillmentData(b.fulfillment)}));return reply(await receipt(id,auth,row,'orders',b.lang),201);}
 if(action==='orders'&&req.method==='PATCH'&&uuid(item)){if(!auth.owner)fail('ownerAccess',403);const b=await json(req),prior={accepted:'pending',preparing:'accepted',ready:'preparing',completed:'ready'}[b.status];if(!prior)fail('invalid');const result=checked(await admin.from('modu_orders').update({status:b.status}).eq('store_id',id).eq('id',item).eq('status',prior).select('id'));if(!result.length)fail('ownerConflict',409);return reply({ok:true});}
 if(action==='reservations'&&req.method==='POST'){if(auth.owner||!st.published)fail('invalid');await limit('booking:'+auth.id,8);const b=await json(req),rid=requestId(b.requestId);const old=checked(await admin.from('modu_reservations').select('*').eq('visit_id',auth.id).eq('request_id',rid).maybeSingle());if(old)return reply(await receipt(id,auth,old,'reservations',b.lang));const data=reservationData(b,st.public_data.country);const row=await admin.from('modu_reservations').insert({store_id:id,visit_id:auth.id,request_id:rid,...data}).select('*').single();if(row.error?.code==='23505')return reply(await receipt(id,auth,checked(await admin.from('modu_reservations').select('*').eq('visit_id',auth.id).eq('request_id',rid).single()),'reservations',b.lang));return reply(await receipt(id,auth,checked(row),'reservations',b.lang),201);}
 if(action==='reservations'&&req.method==='PATCH'&&uuid(item)){const b=await json(req);if(!auth.owner||!['confirmed','cancelled'].includes(b.status))fail('ownerAccess',403);let q=admin.from('modu_reservations').update({status:b.status}).eq('store_id',id).eq('id',item).neq('status','cancelled');if(!auth.owner)q=q.eq('visit_id',auth.id);const rows=checked(await q.select('id'));if(!rows.length)fail('ownerConflict',409);return reply({ok:true});}
 if(action==='interpreter'&&req.method==='POST'){
  if(auth.owner||!st.published)fail('invalid');await limit('interpreter:'+auth.id,20);
  const count=await admin.from('modu_messages').select('id',{count:'exact',head:true}).eq('visit_id',auth.id);checked(count);if((count.count||0)>=600)fail('limitReached',429);
  const b=await json(req);let payload;try{payload=createInterpretation(b);}catch(e){fail(e.message);}
  return reply(await saveThread(id,auth.id,payload),201);
 }
 if(action==='interpreter-reply'&&req.method==='POST'){
  await limit('interpreter-reply:'+id,60);const b=await json(req);if(!uuid(b.visitId)||!/^interp-[a-zA-Z0-9_-]{8,60}$/.test(b.replyTo||''))fail('invalid');
  const row=checked(await admin.from('modu_messages').select('payload').eq('store_id',id).eq('visit_id',b.visitId).eq('request_id',b.replyTo).eq('kind','thread').maybeSingle());
  if(!row||row.payload?.interpretation?.direction!=='guest')fail('invalidInterpretation',404);
  let payload;try{payload=createInterpretedReply(row.payload);}catch(e){fail(e.message);}
  return reply(await saveThread(id,b.visitId,payload),201);
 }
 if(action==='messages'&&req.method==='POST'){if(auth.owner)fail('invalid');await limit('messages:'+auth.id,30);const b=await json(req);if(!Array.isArray(b.records)||b.records.length>30)fail('invalid');const count=await admin.from('modu_messages').select('id',{count:'exact',head:true}).eq('visit_id',auth.id);if((count.count||0)>600)fail('limitReached',429);if(b.records.some((r:any)=>/^(interp-|reply-interp-|receipt-)/.test(r.id||'')))fail('invalid');const records=b.records.map((r:any)=>({store_id:id,visit_id:auth.id,request_id:requestId(r.id),kind:r.kind==='event'?'event':'thread',payload:r.kind==='event'?{type:['complaint','eventStaff','eventChat','eventOffTopic','eventLimit'].includes(r.type)?r.type:'eventChat',detail:{question:text(r.detail?.question),reply:text(r.detail?.reply,50),lang:langs.includes(r.detail?.lang)?r.detail.lang:auth.lang}}:messageData(r)}));checked(await admin.from('modu_messages').upsert(records,{onConflict:'visit_id,request_id',ignoreDuplicates:true}));return reply({ok:true});}
 if(action==='review'&&req.method==='PATCH'&&uuid(item)){checked(await admin.from('modu_messages').update({reviewed:true}).eq('store_id',id).eq('id',item).eq('kind','event'));return reply({ok:true});}
 if(action==='media'&&req.method==='POST'){await limit('upload:'+id,30,3600);const count=await admin.from('modu_media').select('id',{count:'exact',head:true}).eq('store_id',id);if((count.count||0)>=30)fail('uploadLimit',413);const type=req.headers.get('content-type')||'',kind=req.headers.get('x-file-kind')==='menu'?'menu':'venue';const extensions={'image/jpeg':'jpg','image/png':'png','image/webp':'webp','image/heic':'heic','image/heif':'heif','video/mp4':'mp4','video/webm':'webm','video/quicktime':'mov'};const ext=extensions[type];if(!ext||(kind==='menu'&&!type.startsWith('image/')))fail('mediaFailure');const bytes=await body(req,type.startsWith('image/')?5242880:26214400);if(!fileType(bytes,type))fail('mediaFailure');const path=id+'/'+crypto.randomUUID()+'.'+ext;checked(await admin.storage.from('modu-store-media').upload(path,bytes,{contentType:type,upsert:false}));const row=await admin.from('modu_media').insert({store_id:id,path,type,kind,size:bytes.length,name:text(decodeURIComponent(req.headers.get('x-file-name')||'upload'),150)}).select('id,name,type,kind,size').single();if(row.error){await admin.storage.from('modu-store-media').remove([path]);checked(row);}return reply(row.data,201);}
 fail('invalid',404);
 }catch(e){return reply({error:e.status?e.message:'cloudError'},e.status||500);}});
