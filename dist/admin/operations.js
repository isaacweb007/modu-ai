/** Browser-local workflow extensions. No authentication, external messages or production mutations. */
import {ACTORS,can,scopeShops,execute,DomainError} from './domain.js';
const reject=(code,message)=>{throw new DomainError(code,message);};
const clone=value=>structuredClone(value);
const text=(value,label,max=1000,min=1)=>{if(typeof value!=='string'||value.trim().length<min||value.length>max)reject('INVALID',`${label}을(를) ${min}~${max}자로 입력하세요.`);return value.trim();};
const pick=(value,values,label)=>{if(!values.includes(value))reject('INVALID',`${label} 값이 올바르지 않습니다.`);return value;};
const number=(value,label,min,max)=>{if(!Number.isSafeInteger(value)||value<min||value>max)reject('INVALID',`${label}은(는) ${min}~${max} 사이의 정수여야 합니다.`);return value;};
const object=value=>{if(!value||typeof value!=='object'||Array.isArray(value))reject('INVALID','입력 구조를 확인하세요.');return value;};
const row=(state,key,id)=>{const value=state[key]?.find(item=>item.id===id);if(!value)reject('NOT_FOUND','대상 자료를 찾을 수 없습니다.');return value;};
const version=(value,expected)=>{if(!Number.isSafeInteger(expected)||value.version!==expected)reject('VERSION_CONFLICT','다른 담당자가 내용을 변경했습니다. 최신 상태로 다시 확인하세요.');};
const iso=millis=>new Date(millis).toISOString();
function date(value,label){if(typeof value!=='string'||!Number.isFinite(Date.parse(value)))reject('INVALID',`${label}을(를) 확인하세요.`);return iso(Date.parse(value));}
function signature(value,depth=0){
 if(depth>20)reject('INVALID','입력 구조가 너무 깊습니다.');
 if(value===null||['string','boolean'].includes(typeof value))return JSON.stringify(value);
 if(typeof value==='number'&&Number.isFinite(value))return JSON.stringify(value);
 if(Array.isArray(value))return '['+value.map(item=>signature(item,depth+1)).join(',')+']';
 if(value&&typeof value==='object'&&Object.getPrototypeOf(value)===Object.prototype)return '{'+Object.keys(value).sort().map(key=>JSON.stringify(key)+':'+signature(value[key],depth+1)).join(',')+'}';
 reject('INVALID','저장할 수 없는 입력입니다.');
}
const member=(state,id)=>state.members?.find(m=>m.id===id);
const active=(state,id)=>ACTORS.some(a=>a.id===id)&&can(state,id,'metadata.read');
const scoped=(state,id,storeId)=>scopeShops(state,id).some(s=>s.id===storeId);
const name=(state,id)=>member(state,id)?.name||ACTORS.find(a=>a.id===id)?.label||'가상 담당자';
const allCountries=(state,id)=>{const m=member(state,id);return active(state,id)&&m.storeIds===null;};
const policyRole=(state,id)=>allCountries(state,id)&&['operations','operations_approver'].includes(member(state,id)?.role);
const allowedCountry=(state,id,country)=>country==='all'||member(state,id)?.countries.includes(country);
const TASK_ROLES=['operations','operations_approver','support','partner','technical'];
export function canAdvanced(state,actorId,permission,storeId=null){
 if(!active(state,actorId)||(storeId!==null&&!scoped(state,actorId,storeId)))return false;
 if(permission==='task.read')return can(state,actorId,'diagnostic.read',storeId);
 if(permission==='task.create'||permission==='case.sla.update')return can(state,actorId,permission==='task.create'?'case.create':'case.update',storeId);
 if(permission==='task.update')return TASK_ROLES.includes(member(state,actorId).role)&&can(state,actorId,'diagnostic.read',storeId);
 if(permission==='policy.read'||permission==='notification.read'||permission==='report.read')return true;
 if(permission==='policy.draft.save'||permission==='policy.save'||permission==='policy.submit')return policyRole(state,actorId);
 if(permission==='policy.decide')return policyRole(state,actorId)&&member(state,actorId).role==='operations_approver';
 if(permission==='report.export')return can(state,actorId,'export.record');
 return can(state,actorId,permission,storeId);
}
function requireAccess(state,id,permission,storeId=null){if(!canAdvanced(state,id,permission,storeId))reject('FORBIDDEN','현재 역할과 담당 범위에서 이 작업을 할 수 없습니다.');}
function requireCountry(state,id,country){if(!state.countryProfiles.some(c=>c.code===country)||!allowedCountry(state,id,country))reject('FORBIDDEN','이 국가의 정책을 관리할 권한이 없습니다.');}
const policyFields=policy=>({country:policy.country,name:policy.name,trialDays:policy.trialDays,includedUnits:policy.includedUnits,warningPercent:policy.warningPercent,hardLimit:policy.hardLimit,effectiveAt:policy.effectiveAt});
const taskFields=task=>({status:task.status,assignee:task.assignee,priority:task.priority,dueAt:task.dueAt,checklist:task.checklist.map(c=>({id:c.id,done:c.done}))});
function validAssignee(state,id,storeId){const value=text(id,'담당자',100);if(!canAdvanced(state,value,'task.update',storeId))reject('ASSIGNEE_SCOPE','이 샵의 업무를 처리할 수 있는 활성 담당자를 선택하세요.');return value;}

/** Adds v0.3 fixtures once. Existing schema-v2 business arrays and unknown future fields are preserved. */
export function migrateDemo(state){
 if(!state||state.schemaVersion!==2)reject('SCHEMA_MISMATCH','현재 체험 자료 버전을 확인하세요. 기존 자료를 자동 초기화하지 않습니다.');
 const next=clone(state);const migrating=(next.operationsVersion||0)<1;
 for(const key of ['tasks','policies','notifications','notificationReads']){if(next[key]!==undefined&&!Array.isArray(next[key]))reject('INVALID_STATE','업무 체험 저장 자료를 읽을 수 없습니다.');next[key]||=[];}
 if(!migrating)return next;
 const at=Number.isFinite(Date.parse(next.asOf))?next.asOf:'2026-10-31T02:00:00Z',stamp=delta=>iso(Date.parse(at)+delta*60000);
 const samples=[['TASK-DEMO-301','VN-001','CASE-240','주모 다낭 전달 경로 확인 [가상]','tech-jun','high','doing',-20],['TASK-DEMO-302','VN-002','CASE-241','메뉴 가격 확인 근거 준비 [가상]','support-hana','medium','open',180],['TASK-DEMO-303','VN-004','CASE-243','베트남어 메뉴 안내 검수 [가상]','partner-linh','medium','open',240]];
 for(const [id,storeId,caseId,title,assignee,priority,status,due]of samples){if(!next.shops.some(s=>s.id===storeId)||next.tasks.some(t=>t.id===id))continue;next.tasks.push({id,storeId,caseId:next.cases.some(c=>c.id===caseId)?caseId:null,title,assignee,priority,status,dueAt:stamp(due),version:1,checklist:[{id:id+'-C1',label:'영향 범위와 담당 샵 확인',done:status==='doing'},{id:id+'-C2',label:'가상 확인 근거 기록',done:false},{id:id+'-C3',label:'후속 처리 담당자 확인',done:false}],notes:[{id:id+'-N1',at,actorId:'ops-min',actor:name(next,'ops-min'),text:'상세 업무 흐름을 확인하기 위한 가상 작업입니다.'}],createdBy:'ops-min',createdAt:at,updatedAt:at});}
 for(const code of ['VN','KR']){const id='POLICY-DEMO-'+code;if(!next.countryProfiles.some(c=>c.code===code)||next.policies.some(p=>p.id===id))continue;next.policies.push({id,country:code,name:`${code} 사용량 안내 정책 초안 [가상]`,trialDays:14,includedUnits:2000,warningPercent:90,hardLimit:true,effectiveAt:stamp(4320),reason:'국가별 정책 검토 흐름을 위한 가상 자료입니다.',status:'draft',version:1,draftBy:'ops-min',requesterId:null,submittedVersion:null,submittedSnapshot:null,countryVersion:null,createdAt:at,updatedAt:at,submittedAt:null,expiresAt:null,reviewerId:null,reviewedAt:null,reviewReason:null,history:[],simulationOnly:true});}
 for(const actor of ACTORS){if(next.notifications.some(n=>n.id==='NOTIFY-DEMO-'+actor.id))continue;next.notifications.push({id:'NOTIFY-DEMO-'+actor.id,recipientActorId:actor.id,storeId:null,country:null,kind:'demo.welcome',title:'관리자 업무 체험이 준비됐어요.',summary:'가상 업무·국가 정책·보고서·개인 알림을 살펴보세요. 실제 시스템은 연결하지 않습니다.',targetType:'work',targetId:null,at});}
 next.operationsVersion=1;next.revision=(next.revision||0)+1;return next;
}

export function visibleNotifications(state,actorId){
 if(!canAdvanced(state,actorId,'notification.read'))return [];
 return (state.notifications||[]).filter(n=>{
  if(n.recipientActorId!==actorId)return false;
  if(n.country&&!allowedCountry(state,actorId,n.country))return false;
  if(n.storeId&&!scoped(state,actorId,n.storeId))return false;
  const p=n.requiredPermission||'metadata.read';return canAdvanced(state,actorId,p,n.storeId??null);
 });
}
const countBy=rows=>[...new Set(rows.map(r=>r.status))].map(status=>({status,count:rows.filter(r=>r.status===status).length}));
function interval(filters={}){const startAt=filters.startAt??null,endAt=filters.endAt??null;const start=startAt===null?-Infinity:Date.parse(date(startAt,'시작일')),end=endAt===null?Infinity:Date.parse(date(endAt,'종료일'));if(start>end)reject('INVALID','시작일은 종료일보다 늦을 수 없습니다.');return {startAt:startAt===null?null:iso(start),endAt:endAt===null?null:iso(end),inside:value=>{const millis=Date.parse(value);return Number.isFinite(millis)&&millis>=start&&millis<=end;}};}
/** Pure, scope-checked aggregation. No raw conversation, contact, checklist note or invoice line is returned. */
export function reportFor(state,actorId,country='all',filters={}){
 requireAccess(state,actorId,'report.read');if(country!=='all'&&!state.countryProfiles.some(c=>c.code===country))reject('INVALID','국가 필터를 확인하세요.');
 const bounds=interval(filters),shops=scopeShops(state,actorId,country),ids=new Set(shops.map(s=>s.id));
 const diagnostic=can(state,actorId,'diagnostic.read'),billing=can(state,actorId,'billing.read'),now=Number.isFinite(filters.now)?filters.now:(Date.parse(state.asOf)||0);
 const within=(list,stamp=r=>r.createdAt)=>(state[list]||[]).filter(r=>ids.has(r.storeId)&&bounds.inside(stamp(r)));
 const orders=diagnostic?within('orders'):[],bookings=diagnostic?within('bookings'):[],cases=diagnostic?within('cases'):[],tasks=diagnostic?within('tasks'):[];
 const invoices=billing?within('invoices',r=>r.events?.[0]?.at||r.dueAt):[],invoiceIds=new Set(invoices.map(i=>i.id));
 const refunds=billing?(state.refunds||[]).filter(r=>invoiceIds.has(r.invoiceId)&&r.status==='simulated'):[];
 const rows=[...new Set(shops.map(s=>s.country))].map(code=>{
  const region=shops.filter(s=>s.country===code),regionIds=new Set(region.map(s=>s.id));
  return {country:code,shops:region.length,publishedShops:region.filter(s=>s.publication==='published').length,openIntake:region.filter(s=>s.intake==='open').length,orders:diagnostic?orders.filter(r=>regionIds.has(r.storeId)).length:null,bookings:diagnostic?bookings.filter(r=>regionIds.has(r.storeId)).length:null,openCases:diagnostic?cases.filter(r=>regionIds.has(r.storeId)&&r.status!=='resolved').length:null,openTasks:diagnostic?tasks.filter(r=>regionIds.has(r.storeId)&&r.status!=='done').length:null,overdueTasks:diagnostic?tasks.filter(r=>regionIds.has(r.storeId)&&r.status!=='done'&&Date.parse(r.dueAt)<now).length:null};
 });
 const countKeys=['shops','publishedShops','openIntake','orders','bookings','openCases','openTasks','overdueTasks'];const totals=Object.fromEntries(countKeys.map(key=>[key,!diagnostic&&['orders','bookings','openCases','openTasks','overdueTasks'].includes(key)?null:rows.reduce((sum,r)=>sum+(r[key]||0),0)]));
 const billingByCurrency=[...new Set(invoices.map(r=>r.currency))].map(currency=>{const selected=invoices.filter(r=>r.currency===currency),selectedIds=new Set(selected.map(r=>r.id)),paid=selected.filter(r=>r.paidAt&&['paid','refunded'].includes(r.status)).reduce((sum,r)=>sum+r.amount,0),refunded=refunds.filter(r=>r.currency===currency&&selectedIds.has(r.invoiceId)).reduce((sum,r)=>sum+r.amount,0);return {currency,invoiceCount:selected.length,issuedAmount:selected.reduce((sum,r)=>sum+r.amount,0),paidAmount:paid,outstandingAmount:selected.filter(r=>['open','past_due'].includes(r.status)).reduce((sum,r)=>sum+r.amount,0),refundedAmount:refunded,netCollectedAmount:paid-refunded};});
 const openCases=cases.filter(c=>c.status!=='resolved');return {country,startAt:bounds.startAt,endAt:bounds.endAt,asOf:state.asOf,rows,totals,billingByCurrency,ordersByStatus:countBy(orders),bookingsByStatus:countBy(bookings),caseSla:{open:diagnostic?openCases.length:null,overdue:diagnostic?openCases.filter(c=>c.dueAt&&Date.parse(c.dueAt)<now).length:null,escalated:diagnostic?openCases.filter(c=>c.escalated).length:null},tasksByStatus:countBy(tasks)};
}

const CUSTOM=new Set(['task.create','task.update','case.sla.update','policy.draft.save','policy.submit','policy.decide','notification.read','report.export']);
function authorize(state,id,type,payload){
 if(type==='task.create'){row(state,'shops',payload.storeId);requireAccess(state,id,type,payload.storeId);return;}
 if(type==='task.update'){const task=row(state,'tasks',payload.id);requireAccess(state,id,type,task.storeId);if(member(state,id).role==='technical'&&task.assignee!==id)reject('FORBIDDEN','기술 담당자는 본인에게 배정된 작업만 처리할 수 있습니다.');return;}
 if(type==='case.sla.update'){requireAccess(state,id,type,row(state,'cases',payload.id).storeId);return;}
 if(type==='policy.draft.save'){requireAccess(state,id,type);requireCountry(state,id,payload.country);if(payload.id)requireCountry(state,id,row(state,'policies',payload.id).country);return;}
 if(type==='policy.submit'||type==='policy.decide'){requireAccess(state,id,type);requireCountry(state,id,row(state,'policies',payload.id).country);return;}
 if(type==='notification.read'){requireAccess(state,id,type);return;}
 if(type==='report.export'){requireAccess(state,id,type);return;}
}
const NOTIFICATION_TEXT={
 case:['지원 요청에 새 처리 내역이 있어요.','권한이 있는 지원 요청 화면에서 확인하세요.'],task:['담당 업무가 업데이트됐어요.','체크 항목과 기한을 업무 화면에서 확인하세요.'],policy:['국가 정책 검토가 업데이트됐어요.','실제 청구에 적용하지 않는 정책 시뮬레이션입니다.'],approval:['검토 요청의 처리 상태가 바뀌었어요.','권한이 있는 승인 화면에서 최신 결과를 확인하세요.'],billing:['가상 청구 검토 상태가 바뀌었어요.','실제 결제나 환불은 실행하지 않았습니다.'],member:['관리자 권한 검토가 업데이트됐어요.','필요한 경우 가상 세션이 회수되며 실제 계정은 변경하지 않습니다.'],operation:['샵 운영 검토가 업데이트됐어요.','현재 권한 범위의 샵 화면에서 결과를 확인하세요.'],technical:['기술 운영 작업이 업데이트됐어요.','실제 외부 시스템 작업은 실행하지 않았습니다.']
};
function notify(next,actorId,type,payload,result,at,eventId){
 if(type==='notification.read'||type==='export.record'||type==='report.export')return;
 let group='operation',storeId=payload.storeId??null,country=null,targetType='shops',targetId=payload.id||result.id,permission='metadata.read',only=null;
 if(type.startsWith('task.')){group='task';const task=next.tasks.find(t=>t.id===result.id);storeId=task?.storeId??storeId;targetType='work';permission='task.read';only=new Set([actorId,task?.assignee,task?.createdBy,...next.members.filter(m=>['operations','operations_approver'].includes(m.role)).map(m=>m.id)]);}
 else if(type.startsWith('case.')){group='case';const item=next.cases.find(c=>c.id===result.id);storeId=item?.storeId??storeId;targetType='support';permission='diagnostic.read';only=new Set([actorId,item?.assignee,...next.members.filter(m=>['operations','operations_approver','support'].includes(m.role)).map(m=>m.id)]);}
 else if(type.startsWith('policy.')){group='policy';const item=next.policies.find(p=>p.id===result.id);country=item?.country;targetType='policies';permission='policy.read';only=new Set(next.members.filter(m=>['operations','operations_approver'].includes(m.role)).map(m=>m.id));}
 else if(type.startsWith('approval.')){const approval=next.approvals.find(a=>a.id===result.id);storeId=approval?.storeId??null;country=approval?.kind==='country.activation'?approval.targetId:null;targetType='approvals';group=approval?.kind==='billing.refund'?'billing':approval?.kind==='member.permissions'?'member':'approval';permission=group==='billing'?'billing.read':group==='member'?'member.read':'metadata.read';only=new Set([actorId,approval?.requesterId,...next.members.filter(m=>can(next,m.id,`approval.decide:${approval?.kind}`,storeId)).map(m=>m.id)]);}
 else if(type.startsWith('member.')){group='member';targetType='members';permission='member.read';only=new Set([actorId,...next.members.filter(m=>m.role==='security').map(m=>m.id)]);}
 else if(type==='job.retry'||type==='incident.update'){group='technical';const entry=type==='job.retry'?next.jobs.find(j=>j.id===result.id):next.incidents.find(i=>i.id===result.id);storeId=entry?.storeId??null;country=entry?.country??null;targetType='integrations';permission='diagnostic.read';only=new Set([actorId,...next.members.filter(m=>['technical','operations','operations_approver','security'].includes(m.role)).map(m=>m.id)]);}
 else if(type==='store.profile.update'||type==='onboarding.update'){storeId=type==='store.profile.update'?payload.id:payload.storeId;targetId=storeId;}
 else if(type==='country.check.update'){country=payload.code;targetType='countries';only=new Set([actorId,...next.members.filter(m=>['operations','operations_approver'].includes(m.role)).map(m=>m.id)]);}
 else if(type==='translation.save'){targetType='content';only=new Set([actorId,...next.members.filter(m=>['operations','operations_approver'].includes(m.role)).map(m=>m.id)]);}
 else if(type.startsWith('announcement.')){targetType='content';country=next.announcements.find(a=>a.id===result.id)?.country;only=new Set([actorId,...next.members.filter(m=>['operations','operations_approver'].includes(m.role)).map(m=>m.id)]);}
 if(storeId)country=next.shops.find(s=>s.id===storeId)?.country||country;const [title,summary]=NOTIFICATION_TEXT[group];
 for(const candidate of ACTORS){const id=candidate.id;if(only&&!only.has(id))continue;if(!active(next,id)||!canAdvanced(next,id,permission,storeId)||country&&country!=='all'&&!allowedCountry(next,id,country))continue;const notificationId=`N-${eventId}-${id}`;if(next.notifications.some(n=>n.id===notificationId))continue;next.notifications.unshift({id:notificationId,recipientActorId:id,storeId,country:country==='all'?null:country,kind:type,title,summary,targetType,targetId,requiredPermission:permission,at});}
}

export function executeAdmin(state,actorId,command,now=Date.now()){
 const migrated=migrateDemo(state);object(command);object(command.payload);if(!Number.isFinite(now)||Number.isNaN(new Date(now).valueOf()))reject('INVALID','기준 시간을 확인하세요.');
 if(!CUSTOM.has(command.type)){
  const wasProcessed=migrated.processedCommands?.some(c=>c.actorId===actorId&&c.requestId===command.requestId),out=execute(migrated,actorId,command,now);
  if(!wasProcessed)notify(out.state,actorId,command.type,command.payload,out.result,iso(now),out.state.audit[0].id);
  return out;
 }
 if(!active(migrated,actorId))reject('FORBIDDEN','활성 관리자 역할이 필요합니다. 실제 로그인은 아닌 권한 체험입니다.');
 const type=text(command.type,'작업 종류',80),payload=command.payload,requestId=text(command.requestId,'요청 식별자',128,8);if(/\s/.test(requestId))reject('INVALID','요청 식별자에 공백을 넣을 수 없습니다.');
 const fingerprint=signature({type,payload});if(fingerprint.length>25000)reject('INVALID','입력 내용이 너무 큽니다.');authorize(migrated,actorId,type,payload);
 const prior=migrated.processedCommands.find(c=>c.actorId===actorId&&c.requestId===requestId);if(prior){if(prior.fingerprint!==fingerprint)reject('IDEMPOTENCY_CONFLICT','같은 요청 번호로 다른 내용을 실행할 수 없습니다.');return {state:migrated,result:clone(prior.result)};}
 const next=migrated,at=iso(now);let result,storeId=null,country=null,target=null,before=null,after=null,summary='';
 const uid=prefix=>{const stem=`${prefix}-${(next.revision||0)+1}-${requestId.replace(/[^a-zA-Z0-9]/g,'').slice(0,8)}`;let id=stem,n=1;const ids=new Set(Object.values(next).filter(Array.isArray).flatMap(a=>a.map(r=>r?.id)));while(ids.has(id))id=stem+'-'+n++;return id;};
 const done=(id,status,message,more={})=>({id,status,message,...more});
 if(type==='task.create'){
  storeId=payload.storeId;const title=text(payload.title,'업무 제목',160),assignee=validAssignee(next,payload.assignee,storeId),priority=pick(payload.priority,['high','medium','low'],'우선순위'),dueAt=date(payload.dueAt,'업무 기한');if(Date.parse(dueAt)<=now)reject('INVALID','새 업무 기한은 현재보다 나중이어야 합니다.');
  const caseId=payload.caseId||null;if(caseId&&row(next,'cases',caseId).storeId!==storeId)reject('FORBIDDEN','같은 샵의 지원 요청만 연결할 수 있습니다.');
  if(!Array.isArray(payload.checklist)||!payload.checklist.length||payload.checklist.length>20)reject('INVALID','확인 항목을 1~20개 입력하세요.');const labels=payload.checklist.map(x=>text(x,'확인 항목',200));if(new Set(labels).size!==labels.length)reject('INVALID','같은 확인 항목을 중복 등록할 수 없습니다.');
  const id=uid('TASK'),task={id,storeId,caseId,title,assignee,priority,dueAt,status:'open',version:1,checklist:labels.map((label,i)=>({id:id+'-C'+(i+1),label,done:false})),notes:[],createdBy:actorId,createdAt:at,updatedAt:at};next.tasks.unshift(task);target=id;after=taskFields(task);summary='가상 업무 생성 · 담당/기한/확인 항목';result=done(id,'open','가상 업무를 만들었습니다.',{version:1});
 }else if(type==='task.update'){
  const task=row(next,'tasks',payload.id);version(task,payload.expectedVersion);storeId=task.storeId;before=taskFields(task);const status=pick(payload.status,['open','doing','done'],'업무 상태'),note=text(payload.note,'처리 메모',3000,3);
  if(!Array.isArray(payload.checklist)||new Set(payload.checklist.map(c=>c.id)).size!==payload.checklist.length)reject('INVALID','확인 항목 값을 확인하세요.');
  for(const item of payload.checklist){if(!item||typeof item.done!=='boolean')reject('INVALID','확인 상태는 완료/미완료로 선택하세요.');const check=task.checklist.find(c=>c.id===item.id);if(!check)reject('INVALID','등록된 업무 확인 항목만 바꿀 수 있습니다.');check.done=item.done;}
  if(status==='done'&&task.checklist.some(c=>!c.done))reject('CHECKLIST_PENDING','모든 확인 항목을 마친 뒤 업무를 완료하세요.');
  task.status=status;task.version++;task.updatedAt=at;task.notes.push({id:uid('TASKNOTE'),at,actorId,actor:name(next,actorId),text:note});target=task.id;after=taskFields(task);summary='가상 업무 상태·확인 항목 갱신';result=done(task.id,status,'업무 처리와 메모를 저장했습니다.',{version:task.version});
 }else if(type==='case.sla.update'){
  const item=row(next,'cases',payload.id);version(item,payload.expectedVersion);storeId=item.storeId;const reason=text(payload.reason,'기한 변경 사유',2000,3);if(typeof payload.escalated!=='boolean')reject('INVALID','에스컬레이션 상태를 확인하세요.');const dueAt=date(payload.dueAt,'지원 처리 기한');if(Date.parse(dueAt)<Date.parse(item.createdAt))reject('INVALID','처리 기한은 문의 접수보다 빠를 수 없습니다.');
  before={priority:item.priority,dueAt:item.dueAt??null,escalated:!!item.escalated};item.priority=pick(payload.priority,['high','medium','low'],'우선순위');item.dueAt=dueAt;item.escalated=payload.escalated;item.version++;item.updatedAt=at;item.messages.push({id:uid('SLANOTE'),at,author:name(next,actorId),visibility:'internal',text:'SLA 처리 근거: '+reason});after={priority:item.priority,dueAt:item.dueAt,escalated:item.escalated};target=item.id;summary='지원 처리 기한·에스컬레이션 갱신';result=done(item.id,'updated','지원 처리 기한과 내부 근거를 저장했습니다.',{version:item.version});
 }else if(type==='policy.draft.save'){
  country=payload.country;const fields={country,name:text(payload.name,'정책 이름',160),trialDays:number(payload.trialDays,'체험 기간',0,90),includedUnits:number(payload.includedUnits,'포함 답변 횟수',1,1000000),warningPercent:number(payload.warningPercent,'사용량 경고 비율',1,99),hardLimit:payload.hardLimit,effectiveAt:date(payload.effectiveAt,'적용 예정일')};if(typeof fields.hardLimit!=='boolean')reject('INVALID','한도 도달 시 새 AI 생성 중지 여부를 선택하세요.');if(Date.parse(fields.effectiveAt)<=now)reject('INVALID','정책 적용 예정일은 미래여야 합니다.');const reason=text(payload.reason,'정책 변경 사유',2000,5);let policy;
  if(payload.id){policy=row(next,'policies',payload.id);version(policy,payload.expectedVersion);if(policy.country!==country)reject('INVALID','정책의 국가를 바꾸지 말고 새 국가 초안을 만드세요.');if(policy.status==='pending')reject('POLICY_PENDING','검토 중인 정책은 수정할 수 없습니다. 검토 종료 후 새 버전으로 저장하세요.');before={...policyFields(policy),status:policy.status,version:policy.version};policy.history||=[];policy.history.push({at,actorId,action:'draft.save',previous:clone(before)});Object.assign(policy,fields,{reason,status:'draft',version:policy.version+1,draftBy:actorId,updatedAt:at,requesterId:null,submittedVersion:null,submittedSnapshot:null,countryVersion:null,submittedAt:null,expiresAt:null,reviewerId:null,reviewedAt:null,reviewReason:null});}
  else{policy={id:uid('POLICY'),...fields,reason,status:'draft',version:1,draftBy:actorId,requesterId:null,submittedVersion:null,submittedSnapshot:null,countryVersion:null,createdAt:at,updatedAt:at,submittedAt:null,expiresAt:null,reviewerId:null,reviewedAt:null,reviewReason:null,history:[],simulationOnly:true};next.policies.unshift(policy);}
  target=policy.id;after={...policyFields(policy),status:policy.status,version:policy.version};summary='국가 사용량 정책 초안 저장 · 실제 청구 미적용';result=done(policy.id,'draft','정책 초안을 저장했습니다. 실제 구독·청구·AI 동작은 바꾸지 않았습니다.',{version:policy.version});
 }else if(type==='policy.submit'){
  const policy=row(next,'policies',payload.id);version(policy,payload.expectedVersion);country=policy.country;if(policy.status!=='draft')reject('POLICY_NOT_DRAFT','초안만 검토 요청할 수 있습니다.');if(Date.parse(policy.effectiveAt)<=now)reject('POLICY_EFFECTIVE_PAST','적용 예정일을 미래로 고친 뒤 요청하세요.');before={status:policy.status,version:policy.version};policy.status='pending';policy.version++;policy.requesterId=actorId;policy.submittedVersion=policy.version;policy.submittedSnapshot=signature(policyFields(policy));policy.countryVersion=next.countryProfiles.find(c=>c.code===country).version??1;policy.submittedAt=at;policy.expiresAt=iso(now+30*60000);policy.updatedAt=at;policy.reviewedAt=null;policy.reviewerId=null;policy.reviewReason=null;target=policy.id;after={status:policy.status,version:policy.version};summary='국가 정책 독립 검토 요청';result=done(policy.id,'pending','다른 담당자의 정책 검토를 요청했습니다.',{version:policy.version});
 }else if(type==='policy.decide'){
  const policy=row(next,'policies',payload.id);version(policy,payload.expectedVersion);country=policy.country;if(policy.status!=='pending')reject('ALREADY_PROCESSED','검토 대기 정책만 처리할 수 있습니다.');if(policy.requesterId===actorId||policy.draftBy===actorId)reject('SELF_APPROVAL','신청하거나 작성한 본인은 정책을 승인·거절할 수 없습니다.');pick(payload.decision,['approve','reject'],'검토 결과');const reason=text(payload.reason,'검토 사유',2000,3);before={status:policy.status,version:policy.version};
  if(!canAdvanced(next,policy.requesterId,'policy.submit')||!allowedCountry(next,policy.requesterId,country))reject('FORBIDDEN','신청자의 현재 정책 권한이 회수됐습니다.');
  const profile=next.countryProfiles.find(c=>c.code===country);
  if(!Number.isFinite(Date.parse(policy.expiresAt))||Date.parse(policy.expiresAt)<=now||Date.parse(policy.effectiveAt)<=now)policy.status='expired';
  else if((profile.version??1)!==policy.countryVersion||policy.version!==policy.submittedVersion||signature(policyFields(policy))!==policy.submittedSnapshot)policy.status='stale';
  else policy.status=payload.decision==='approve'?'approved':'rejected';
  policy.reviewerId=actorId;policy.reviewedAt=at;policy.reviewReason=reason;policy.version++;policy.updatedAt=at;policy.history||=[];policy.history.push({at,actorId,action:'review',status:policy.status,reason});target=policy.id;after={status:policy.status,version:policy.version};summary='국가 정책 독립 검토 · '+policy.status;result=done(policy.id,policy.status,policy.status==='approved'?'가상 정책을 승인했습니다. 실제 청구·답변 횟수는 변경하지 않습니다.':policy.status==='stale'?'국가 조건이나 정책이 바뀌어 새 검토가 필요합니다.':policy.status==='expired'?'검토 기한 또는 적용 예정일이 지났습니다.':'정책 초안 검토를 거절했습니다.',{version:policy.version});
 }else if(type==='notification.read'){
  if(!Array.isArray(payload.ids)||payload.ids.length<1||payload.ids.length>200||new Set(payload.ids).size!==payload.ids.length)reject('INVALID','읽음 처리할 알림을 1~200개 선택하세요.');const visible=new Set(visibleNotifications(next,actorId).map(n=>n.id));if(payload.ids.some(id=>typeof id!=='string'||!visible.has(id)))reject('FORBIDDEN','본인이 현재 볼 수 있는 알림만 읽음 처리할 수 있습니다.');
  before={readCount:next.notificationReads.filter(r=>r.actorId===actorId).length};let added=0;for(const id of payload.ids){if(next.notificationReads.some(r=>r.actorId===actorId&&r.notificationId===id))continue;next.notificationReads.push({id:`READ-${actorId}-${id}`,actorId,notificationId:id,readAt:at});added++;}after={readCount:next.notificationReads.filter(r=>r.actorId===actorId).length};target=actorId;summary='개인 알림 읽음 처리 · '+added+'건';result=done(actorId,'read','선택한 본인 알림을 읽음 처리했습니다.',{count:added});
 }else if(type==='report.export'){
  const countryFilter=payload.country||'all',report=reportFor(next,actorId,countryFilter,{startAt:payload.startAt??null,endAt:payload.endAt??null,now});country=countryFilter==='all'?null:countryFilter;target='aggregate-report';before=null;after={country:countryFilter,startAt:report.startAt,endAt:report.endAt,rowCount:report.rows.length,currencies:report.billingByCurrency.map(r=>r.currency)};summary='현재 권한·기간의 가상 집계 CSV · 개인정보/원문 제외';result=done(target,'recorded','허용 범위의 집계 내보내기를 기록했습니다. 외부 전송은 하지 않았습니다.',{report});
 }
 next.revision=(next.revision||0)+1;if(storeId)country=next.shops.find(s=>s.id===storeId)?.country||null;const eventId=uid('AUD-OPS');next.audit.unshift({id:eventId,at,actorId,actor:name(next,actorId),action:type,storeId,country,target,summary,result:result.status,before,after});next.processedCommands.push({actorId,requestId,fingerprint,result:clone(result),at});notify(next,actorId,type,payload,result,at,eventId);return {state:next,result};
}
