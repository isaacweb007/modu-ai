/** Local-only administrative command model. This is not authentication or a server security boundary. */
export class DomainError extends Error {
  constructor(code, message) { super(message); this.name = 'DomainError'; this.code = code; }
}

const fail = (code, message) => { throw new DomainError(code, message); };
const LANGS = new Set(['ko', 'en', 'vi', 'zh', 'ja', 'km', 'id', 'lo', 'hi']);
const ROLE_PERMISSIONS = {
  operations: ['country.check.update','approval.request:country.activation','diagnostic.read','member.read','billing.read','audit.read','export.record','case.create','case.update','store.profile.update','onboarding.update','approval.request:store.intake','approval.request:store.publication','approval.request:plan.change','approval.request:ai.limit','approval.request:translation.publish','translation.save','announcement.save','announcement.publish'],
  operations_approver: ['country.check.update','approval.request:country.activation','approval.decide:country.activation','diagnostic.read','member.read','billing.read','audit.read','export.record','case.create','case.update','store.profile.update','onboarding.update','approval.request:store.intake','approval.request:store.publication','approval.request:plan.change','approval.request:ai.limit','approval.request:translation.publish','approval.decide:store.intake','approval.decide:store.publication','approval.decide:plan.change','approval.decide:ai.limit','approval.decide:member.permissions','approval.decide:translation.publish','translation.save','announcement.save','announcement.publish'],
  support: ['diagnostic.read','case.create','case.update'],
  finance: ['billing.read','audit.read','export.record','approval.request:billing.refund','approval.request:plan.change'],
  finance_approver: ['billing.read','audit.read','export.record','approval.request:billing.refund','approval.request:plan.change','approval.decide:billing.refund','approval.decide:plan.change'],
  technical: ['diagnostic.read','job.retry','incident.update','approval.request:ai.limit'],
  partner: ['diagnostic.read','case.create','case.update','store.profile.update','onboarding.update'],
  security: ['diagnostic.read','member.read','audit.read','member.invite','member.session.revoke','approval.request:member.permissions','incident.update'],
  auditor: ['member.read','billing.read','audit.read','export.record']
};
export const ROLE_LABELS = Object.freeze({operations:'본사 운영',operations_approver:'운영 승인',support:'고객 지원',finance:'재무 신청',finance_approver:'재무 승인',technical:'기술 운영',partner:'국가 파트너',security:'보안·권한',auditor:'감사 읽기'});
const actor = (id, label, role, countries, storeIds = null) => Object.freeze({id,label,role,countries:Object.freeze(countries),storeIds:storeIds&&Object.freeze(storeIds),permissions:Object.freeze(['metadata.read',...ROLE_PERMISSIONS[role]])});
export const ACTORS = Object.freeze([
  actor('ops-min','본사 운영 · 민','operations',['VN','KR','ID']),
  actor('approve-jin','운영 승인 · 진','operations_approver',['VN','KR','ID']),
  actor('support-hana','고객 지원 · 하나','support',['VN','KR'],['VN-001','VN-002','VN-004','KR-001','KR-002']),
  actor('finance-su','재무 신청 · 수','finance',['VN','KR']),
  actor('finance-lead','재무 승인 · 리드','finance_approver',['VN','KR']),
  actor('tech-jun','기술 운영 · 준','technical',['VN','KR','ID']),
  actor('partner-linh','베트남 파트너 · 린','partner',['VN'],['VN-001','VN-002','VN-004']),
  actor('security-yun','보안·권한 · 윤','security',['VN','KR','ID']),
  actor('audit-reader','감사 읽기','auditor',['VN','KR','ID'])
]);

const asObject = (value, label='입력') => { if (!value || typeof value!=='object' || Array.isArray(value)) fail('INVALID',`${label} 형식이 올바르지 않습니다.`); return value; };
const clean = (value, label, max=500, min=1) => { if(typeof value!=='string'||value.trim().length<min||value.length>max) fail('INVALID',`${label}을(를) ${min}~${max}자로 입력하세요.`); return value.trim(); };
const choose = (value, list, label) => { if(!list.includes(value)) fail('INVALID',`${label} 값이 올바르지 않습니다.`); return value; };
const integer = (value, label, min=1, max=1e9) => { if(!Number.isSafeInteger(value)||value<min||value>max)fail('INVALID',`${label}은(는) ${min}~${max} 사이 정수여야 합니다.`);return value; };
const iso = value => new Date(value).toISOString();
function localeValue(value) { try { if(typeof value!=='string'||!LANGS.has(new Intl.Locale(value).language))fail('INVALID','지원하는 기본 언어를 선택하세요.');return Intl.getCanonicalLocales(value)[0]; } catch { fail('INVALID','기본 언어 태그를 확인하세요.'); } }
const find = (state, list, id, label=list) => { const row = state[list]?.find(item=>item.id===id); if(!row) fail('NOT_FOUND',`${label}을(를) 찾을 수 없습니다.`);return row; };
const version = (row, expected) => { if(!Number.isSafeInteger(expected)||(row.version??1)!==expected) fail('VERSION_CONFLICT','다른 담당자가 내용을 바꿨습니다. 최신 내용으로 다시 확인하세요.'); };
const nextVersion = row => { row.version = (row.version??1)+1; };
function assigneeValue(state,value,storeId) { const id=clean(value,'담당자',100,0);if(id&&!can(state,id,'case.update',storeId))fail('ASSIGNEE_SCOPE','이 샵의 지원 업무를 처리할 수 있는 활성 담당자를 선택하세요.');return id; }
const canonical = (value, depth=0) => {
  if(depth>20)fail('INVALID','입력 구조가 너무 깊습니다.');
  if(value===null||typeof value==='string'||typeof value==='boolean') return JSON.stringify(value);
  if(typeof value==='number'&&Number.isFinite(value))return JSON.stringify(value);
  if(Array.isArray(value))return '['+value.map(v=>canonical(v,depth+1)).join(',')+']';
  if(value&&typeof value==='object'&&Object.getPrototypeOf(value)===Object.prototype)return '{'+Object.keys(value).sort().map(key=>JSON.stringify(key)+':'+canonical(value[key],depth+1)).join(',')+'}';
  fail('INVALID','저장할 수 없는 입력값입니다.');
};
function principal(state, actorId) {
  const base=ACTORS.find(a=>a.id===actorId), member=state.members?.find(m=>m.id===actorId);
  if(!base||!member||member.status!=='active'||!Object.hasOwn(ROLE_PERMISSIONS,member.role))return null;
  if(Array.isArray(member.sessions)&&!member.sessions.some(s=>s.active))return null;
  if(!Array.isArray(member.countries)||!(member.storeIds===null||Array.isArray(member.storeIds)))return null;
  return {...base,label:member.name||base.label,role:member.role,countries:member.countries,storeIds:member.storeIds,permissions:['metadata.read',...ROLE_PERMISSIONS[member.role]]};
}
const scoped = (p, shop) => !!p&&!!shop&&p.countries.includes(shop.country)&&(p.storeIds===null||p.storeIds.includes(shop.id));
export function scopeShops(state, actorId, country='all') {
  const p=principal(state,actorId);
  return (state.shops||[]).filter(shop=>scoped(p,shop)&&(country==='all'||shop.country===country));
}
export function can(state, actorId, permission, storeId=null) {
  const p=principal(state,actorId);if(!p)return false;
  if(storeId!==null&&!scoped(p,state.shops?.find(s=>s.id===storeId)))return false;
  if((permission==='country.check.update'||permission.endsWith(':country.activation'))&&p.storeIds!==null)return false;
  if(permission==='approval.request'||permission==='approval.decide')return p.permissions.some(key=>key.startsWith(permission+':'));
  return p.permissions.includes(permission);
}
function requirePermission(state, actorId, permission, storeId=null) {
  if(!can(state,actorId,permission,storeId))fail('FORBIDDEN','현재 담당자와 범위에서 이 작업을 할 수 없습니다.');
}
function countryPermission(state, actorId, code) {
  const p=principal(state,actorId);
  if(code==='all'){if(!p||p.storeIds!==null||!state.countryProfiles.every(c=>p.countries.includes(c.code)))fail('FORBIDDEN','전체 국가 작업 권한이 없습니다.');}
  else if(!p?.countries.includes(code))fail('FORBIDDEN','이 국가의 작업 권한이 없습니다.');
}
function membershipScope(state, actorId, member) {
  const p=principal(state,actorId);
  if(!p||p.storeIds!==null||!member.countries?.every(c=>p.countries.includes(c)))fail('FORBIDDEN','대상 계정의 전체 범위를 관리할 권한이 없습니다.');
}
const KINDS=['country.activation','store.intake','store.publication','plan.change','billing.refund','ai.limit','member.permissions','translation.publish'];
const targetFor = (state,kind,id) => { if(kind==='country.activation'){const profile=state.countryProfiles.find(c=>c.code===id);if(!profile)fail('NOT_FOUND','국가 프로필을 찾을 수 없습니다.');return profile;}return find(state,kind==='billing.refund'?'invoices':kind==='member.permissions'?'members':kind==='translation.publish'?'translations':'shops',id,'변경 대상'); };
function approvalScope(state,actorId,kind,storeId,targetId,mode='request') {
  choose(kind,KINDS,'승인 종류'); const target=targetFor(state,kind,targetId);
  if(['member.permissions','translation.publish','country.activation'].includes(kind)){
    if(storeId!==null)fail('INVALID','이 승인 종류는 샵 한 곳의 변경이 아닙니다.');
    requirePermission(state,actorId,`approval.${mode}:${kind}`);
    if(kind==='member.permissions')membershipScope(state,actorId,target);
    if(kind==='country.activation')countryPermission(state,actorId,target.code);
  } else {
    const realStore=kind==='billing.refund'?target.storeId:target.id;
    if(storeId!==realStore)fail('FORBIDDEN','변경 대상과 샵 범위가 일치하지 않습니다.');
    requirePermission(state,actorId,`approval.${mode}:${kind}`,realStore);
  }
  return target;
}
function validateMembership(state,actorId,value) {
  const data=asObject(value,'권한 범위');choose(data.role,Object.keys(ROLE_PERMISSIONS),'역할');
  if(!Array.isArray(data.countries)||!data.countries.length||new Set(data.countries).size!==data.countries.length)fail('INVALID','국가를 중복 없이 선택하세요.');
  if(!data.countries.every(code=>state.countryProfiles.some(c=>c.code===code)))fail('INVALID','등록된 국가만 선택할 수 있습니다.');
  if(!(data.storeIds===null||Array.isArray(data.storeIds)))fail('INVALID','샵 범위를 지정하세요.');
  if(data.storeIds!==null){
    if(new Set(data.storeIds).size!==data.storeIds.length||data.storeIds.some(id=>!state.shops.some(s=>s.id===id&&data.countries.includes(s.country))))fail('INVALID','샵과 국가의 범위가 일치하지 않습니다.');
  }
  if(data.role==='partner'&&(!Array.isArray(data.storeIds)||data.storeIds.length===0))fail('INVALID','국가 파트너는 담당 샵을 지정해야 합니다.');
  membershipScope(state,actorId,{countries:data.countries,storeIds:data.storeIds});
  return {role:data.role,countries:[...data.countries],storeIds:data.storeIds===null?null:[...data.storeIds]};
}
const PLAN_ALIASES={start:'start',partner:'partner',pro:'pro','라미 시작':'start','라미 파트너':'partner','라미 프로':'pro'};
const PLAN_NAMES=['start','partner','pro'];
const PRICES={VN:{currency:'VND',fees:[199000,499000,999000]},KR:{currency:'KRW',fees:[19000,49000,99000]}};
function normalizedApprovalPayload(state,actorId,kind,target,payload) {
  const data=asObject(payload,'변경 내용');
  if(kind==='country.activation')return {status:choose(data.status,['pilot'],'국가 활성화 상태')};
  if(kind==='store.intake')return {intake:choose(data.intake,['open','paused','closed'],'접수 상태')};
  if(kind==='store.publication')return {publication:choose(data.publication,['published','review','draft'],'공개 상태')};
  if(kind==='plan.change'){
    if(typeof data.plan!=='string'||!Object.hasOwn(PLAN_ALIASES,data.plan))fail('INVALID','요금제를 선택하세요.');
    if(!PRICES[target.country])fail('COUNTRY_PRICE_PENDING','해당 국가의 현지 요금안이 아직 준비되지 않았습니다.');
    return {plan:PLAN_ALIASES[data.plan]};
  }
  if(kind==='billing.refund'){
    integer(data.amount,'환불 금액');if(target.status!=='paid')fail('REFUND_INVALID','수납된 가상 청구에만 환불 시뮬레이션을 할 수 있습니다.');
    const refunded=(state.refunds||[]).filter(r=>r.invoiceId===target.id&&r.status==='simulated').reduce((n,r)=>n+r.amount,0);
    if(data.amount>target.amount-refunded)fail('REFUND_BALANCE','환불 가능한 가상 잔액을 초과했습니다.');
    return {amount:data.amount};
  }
  if(kind==='ai.limit'){
    integer(data.limit,'AI 한도',1,1000000);if(data.limit<=target.usage)fail('LIMIT_BELOW_USAGE','새 한도는 현재 사용량보다 커야 합니다.');return {limit:data.limit};
  }
  if(kind==='member.permissions')return validateMembership(state,actorId,data);
  return {};
}
function openingGate(state,shop) {
  if(!shop.menu?.some(item=>item.available&&Number.isFinite(item.price)&&item.price>=0))fail('PUBLICATION_BLOCKED','판매 가능한 메뉴와 가격을 먼저 확인하세요.');
  if(!shop.onboarding?.length||shop.onboarding.some(check=>check.status!=='done'||!check.evidence?.trim()))fail('ONBOARDING_PENDING','샵 준비 확인과 근거가 모두 필요합니다.');
  const country=state.countryProfiles.find(c=>c.code===shop.country);
  if(!country||country.status!=='pilot'||!country.checks?.length||country.checks.some(check=>check.status!=='done'||!check.evidence?.trim()))fail('COUNTRY_GATE_PENDING','해당 국가의 파일럿 출시 조건과 근거를 먼저 확인하세요.');
}
const EXPORT_FIELDS={
  shops:['id','name','country','city','type','stage','publication','intake','subscription','plan','currency','monthlyFee','limit','usage','version','organization','tenant'],
  orders:['id','storeId','channel','table','tableNo','status','total','amount','currency','createdAt','updatedAt'],
  bookings:['id','storeId','date','time','partySize','status','createdAt'],
  cases:['id','storeId','subject','category','priority','status','assignee','version','createdAt','updatedAt'],
  invoices:['id','storeId','period','amount','currency','status','dueAt','paidAt','version'],
  staff:['id','storeId','role','status','version'],members:['id','name','role','countries','storeIds','status','version'],
  audit:['id','at','actorId','actor','action','storeId','country','target','summary','result'],
  integrations:['id','storeId','name','type','status'],jobs:['id','integrationId','storeId','status','attempts','operationId','updatedAt'],
  incidents:['id','severity','country','status','version','createdAt'],translations:['id','key','locale','status','version','updatedAt'],
  announcements:['id','country','channel','status','version','createdAt']
};
const resourcePermission = resource => resource==='invoices'?'billing.read':resource==='members'||resource==='staff'?'member.read':resource==='audit'?'audit.read':['orders','bookings','cases','integrations','jobs','incidents'].includes(resource)?'diagnostic.read':'metadata.read';
function exportRows(state,actorId,resource,storeId) {
  const p=principal(state,actorId),shops=new Set(scopeShops(state,actorId).map(s=>s.id));
  return state[resource].filter(row=>{
    if(resource==='shops')return shops.has(row.id)&&(storeId===null||row.id===storeId);
    if(row.storeId)return shops.has(row.storeId)&&(storeId===null||row.storeId===storeId);
    if(storeId!==null)return false;
    if(resource==='members')return p.storeIds===null&&row.countries.every(code=>p.countries.includes(code));
    if(row.country&&row.country!=='all')return p.countries.includes(row.country);
    return p.storeIds===null;
  });
}
function authorize(state,actorId,type,data) {
  const direct={'case.create':'case.create','store.profile.update':'store.profile.update','onboarding.update':'onboarding.update'};
  if(direct[type]){const storeId=type==='store.profile.update'?data.id:data.storeId;find(state,'shops',storeId,'샵');requirePermission(state,actorId,direct[type],storeId);return;}
  if(type==='country.check.update'){requirePermission(state,actorId,type);targetFor(state,'country.activation',data.code);countryPermission(state,actorId,data.code);return;}
  if(type==='case.update'){const row=find(state,'cases',data.id,'지원 요청');requirePermission(state,actorId,type,row.storeId);return;}
  if(type==='approval.request'){approvalScope(state,actorId,data.kind,data.storeId,data.targetId);return;}
  if(type==='approval.decide'){const row=find(state,'approvals',data.id,'승인 요청');approvalScope(state,actorId,row.kind,row.storeId,row.targetId,'decide');return;}
  if(type==='member.session.revoke'){requirePermission(state,actorId,type);membershipScope(state,actorId,find(state,'members',data.id,'관리자 계정'));return;}
  if(type==='job.retry'){const row=find(state,'jobs',data.id,'연동 작업');requirePermission(state,actorId,type,row.storeId);return;}
  if(type==='incident.update'){const row=find(state,'incidents',data.id,'장애');requirePermission(state,actorId,type);countryPermission(state,actorId,row.country);if((row.affectedStoreIds||[]).some(id=>!scopeShops(state,actorId).some(s=>s.id===id)))fail('FORBIDDEN','장애의 전체 샵 범위에 대한 권한이 필요합니다.');return;}
  if(type==='translation.save'){requirePermission(state,actorId,type);find(state,'translations',data.id,'번역');return;}
  if(type==='announcement.save'){requirePermission(state,actorId,type);if(data.id)countryPermission(state,actorId,find(state,'announcements',data.id,'공지').country);countryPermission(state,actorId,data.country);return;}
  if(type==='announcement.publish'){requirePermission(state,actorId,type);countryPermission(state,actorId,find(state,'announcements',data.id,'공지').country);return;}
  if(type==='member.invite'){requirePermission(state,actorId,type);return;}
  if(type==='export.record'){
    requirePermission(state,actorId,type,data.storeId??null);if(!Object.hasOwn(EXPORT_FIELDS,data.resource))fail('INVALID','내보내기 대상을 확인하세요.');
    requirePermission(state,actorId,resourcePermission(data.resource),data.storeId??null);return;
  }
  fail('UNKNOWN_COMMAND','지원하지 않는 작업입니다.');
}

export function execute(state,actorId,command,now=Date.now()) {
  asObject(state,'저장 데이터');if(state.schemaVersion!==2)fail('SCHEMA_MISMATCH','다른 버전의 체험 자료입니다. 초기화가 필요합니다.');
  if(!['shops','orders','bookings','cases','invoices','staff','members','approvals','audit','refunds','integrations','jobs','incidents','translations','announcements','countryProfiles','processedCommands'].every(key=>Array.isArray(state[key])))fail('INVALID_STATE','저장된 체험 자료를 읽을 수 없습니다. 초기화가 필요합니다.');
  if(!Number.isFinite(now)||Number.isNaN(new Date(now).valueOf())||!principal(state,actorId))fail('FORBIDDEN','활성 관리자 역할을 선택하세요. 실제 로그인은 아닌 로컬 권한 시뮬레이션입니다.');
  asObject(command,'명령');const type=clean(command.type,'작업 종류',80),requestId=clean(command.requestId,'요청 식별자',128,8),payload=asObject(command.payload,'명령 내용');
  if(/\s/.test(requestId))fail('INVALID','요청 식별자에 공백을 사용할 수 없습니다.');
  const fingerprint=canonical({type,payload});if(fingerprint.length>25000)fail('INVALID','명령 내용이 너무 큽니다.');
  authorize(state,actorId,type,payload);
  const processed=state.processedCommands?.find(c=>c.actorId===actorId&&c.requestId===requestId);
  if(processed){if(processed.fingerprint!==fingerprint)fail('IDEMPOTENCY_CONFLICT','같은 요청 번호로 다른 내용을 실행할 수 없습니다.');return {state:structuredClone(state),result:structuredClone(processed.result)};}
  const next=structuredClone(state),p=principal(next,actorId),at=iso(now);let result,storeId=null,targetId=payload.id||payload.targetId||null,summary='',countryCode=null;
  const uid=prefix=>{
    const base=`${prefix}-${String((next.revision||0)+1).padStart(5,'0')}-${requestId.replace(/[^a-zA-Z0-9]/g,'').slice(0,8)}`;
    const ids=new Set(Object.values(next).filter(Array.isArray).flatMap(rows=>rows.map(row=>row?.id)));let id=base,n=1;while(ids.has(id))id=base+'-'+n++;return id;
  };
  const done=(id,status,message,extra={})=>({id,status,message,...extra});
  if(type==='case.create'){
    storeId=payload.storeId;const subject=clean(payload.subject,'제목',160),body=clean(payload.body,'요청 내용',4000);
    const category=clean(payload.category,'분류',60),priority=choose(payload.priority,['high','medium','low'],'우선순위');
    const assignee=assigneeValue(next,payload.assignee??'',storeId);
    const relatedType=payload.relatedType||null,relatedId=payload.relatedId||null;
    if(relatedType&&relatedType!=='none'){
      const resource={order:'orders',booking:'bookings',invoice:'invoices',integration:'integrations',store:'shops',orders:'orders',bookings:'bookings',invoices:'invoices'}[relatedType];
      if(!resource)fail('INVALID','관련 자료 종류가 올바르지 않습니다.');const related=find(next,resource,relatedId,'관련 자료');if((resource==='shops'?related.id:related.storeId)!==storeId)fail('FORBIDDEN','다른 샵의 자료를 연결할 수 없습니다.');
    }else if(relatedId)fail('INVALID','관련 자료 종류를 먼저 선택하세요.');
    const row={id:uid('CASE'),storeId,subject,category,priority,status:'open',assignee,version:1,createdAt:at,updatedAt:at,messages:[{id:uid('MSG'),at,author:p.label,visibility:'internal',text:body}],relatedType,relatedId};
    next.cases.unshift(row);targetId=row.id;summary='지원 요청 생성 · '+subject;result=done(row.id,row.status,'로컬 지원 요청을 만들었습니다.',{version:1});
  }else if(type==='case.update'){
    const row=find(next,'cases',payload.id);storeId=row.storeId;version(row,payload.expectedVersion);
    if(payload.status!==undefined)row.status=choose(payload.status,['open','investigating','waiting','resolved'],'지원 상태');
    if(payload.assignee!==undefined)row.assignee=assigneeValue(next,payload.assignee,storeId);
    if(payload.note!==undefined&&payload.note!=='')row.messages.push({id:uid('MSG'),at,author:p.label,visibility:choose(payload.visibility||'internal',['internal','shop'],'메모 공개 범위'),text:clean(payload.note,'처리 메모',4000)});
    if(payload.status===undefined&&payload.assignee===undefined&&!payload.note)fail('INVALID','바꿀 내용이나 메모를 입력하세요.');
    nextVersion(row);row.updatedAt=at;summary='지원 요청 처리 · '+row.status;result=done(row.id,row.status,'지원 처리 내역을 저장했습니다.',{version:row.version});
  }else if(type==='store.profile.update'){
    const row=find(next,'shops',payload.id);storeId=row.id;version(row,payload.expectedVersion);clean(payload.reason,'변경 사유',2000);const fields=asObject(payload.fields,'공개 정보');
    if(!Object.keys(fields).length||Object.keys(fields).some(key=>!['name','city','locale','publicHours'].includes(key)))fail('INVALID','이 화면에서는 상호·도시·언어·영업시간만 바꿀 수 있습니다.');
    for(const [key,value] of Object.entries(fields))row[key]=key==='locale'?localeValue(value):clean(value,key==='name'?'상호':key==='city'?'도시':'영업시간',key==='publicHours'?300:120);
    nextVersion(row);row.updatedAt=at;summary='샵 공개 정보 수정 · '+Object.keys(fields).join(', ');result=done(row.id,'updated','샵 공개 정보를 로컬에 저장했습니다.',{version:row.version});
  }else if(type==='onboarding.update'){
    const shop=find(next,'shops',payload.storeId);storeId=shop.id;version(shop,payload.expectedVersion);const check=shop.onboarding?.find(c=>c.id===payload.checkId);if(!check)fail('NOT_FOUND','샵 준비 확인 항목이 없습니다.');
    check.status=choose(payload.status,['done','pending'],'확인 상태');check.evidence=clean(payload.evidence,'확인 근거',1500,check.status==='done'?1:0);check.owner=p.label;check.updatedAt=at;nextVersion(shop);
    summary='샵 준비 항목 확인 · '+check.id+' · '+check.status;result=done(shop.id,'updated','준비 상태와 확인 근거를 저장했습니다.',{version:shop.version});
  }else if(type==='country.check.update'){
    const profile=targetFor(next,'country.activation',payload.code);version(profile,payload.expectedVersion);
    const check=profile.checks?.find(item=>item.id===payload.checkId);if(!check)fail('NOT_FOUND','국가 출시 확인 항목이 없습니다.');
    const status=choose(payload.status,['done','pending'],'국가 확인 상태'),evidence=clean(payload.evidence,'국가 확인 근거',2000,status==='done'?1:0);
    check.status=status;check.evidence=evidence;check.owner=p.label;check.updatedAt=at;nextVersion(profile);profile.updatedAt=at;countryCode=profile.code;targetId=profile.code;
    summary='국가 출시 근거 시뮬레이션 · '+profile.code+' · '+check.id+' · '+status;result=done(profile.code,'updated','국가 출시 확인 근거를 로컬에 저장했습니다. 실제 승인이나 법적 검증은 아닙니다.',{version:profile.version});
  }else if(type==='approval.request'){
    const target=targetFor(next,payload.kind,payload.targetId);version(target,payload.targetVersion);storeId=payload.storeId;if(payload.kind==='country.activation')countryCode=target.code;
    if(payload.kind==='member.permissions'&&payload.targetId===actorId)fail('SELF_ESCALATION','자기 계정의 권한 변경을 요청할 수 없습니다.');
    const reason=clean(payload.reason,'변경 사유',2000,5);let caseId=payload.caseId||null;
    if(caseId){const related=find(next,'cases',caseId,'관련 지원 요청');if(storeId!==null&&related.storeId!==storeId)fail('FORBIDDEN','다른 샵의 지원 요청을 연결할 수 없습니다.');if(!can(next,actorId,'metadata.read',related.storeId))fail('FORBIDDEN','관련 지원 요청을 볼 수 없습니다.');}
    const data=normalizedApprovalPayload(next,actorId,payload.kind,target,payload.payload);
    const row={id:uid('APR'),kind:payload.kind,storeId,targetId:target.id||target.code,targetVersion:target.version??1,reason,caseId,payload:data,requesterId:actorId,requesterName:p.label,status:'pending',version:1,createdAt:at,expiresAt:iso(now+30*60*1000),reviewerId:null,reviewedAt:null,result:null};
    next.approvals.unshift(row);targetId=row.id;summary='독립 승인 요청 · '+row.kind;result=done(row.id,'pending','다른 담당자의 검토를 요청했습니다.',{version:1});
  }else if(type==='approval.decide'){
    const row=find(next,'approvals',payload.id);storeId=row.storeId;if(row.kind==='country.activation')countryCode=row.targetId;version(row,payload.expectedVersion);
    if(row.status!=='pending')fail('ALREADY_PROCESSED','이미 처리된 승인 요청입니다.');
    if(row.requesterId===actorId)fail('SELF_APPROVAL','신청자와 같은 계정은 승인하거나 거절할 수 없습니다.');
    if(row.kind==='member.permissions'&&row.targetId===actorId)fail('SELF_ESCALATION','자기 계정의 권한 변경을 승인할 수 없습니다.');
    const decision=choose(payload.decision,['approve','reject'],'검토 결과'),reason=clean(payload.reason,'검토 사유',2000,3);
    const target=targetFor(next,row.kind,row.targetId);
    if(!Number.isFinite(Date.parse(row.expiresAt))||Date.parse(row.expiresAt)<=now){row.status='expired';row.result='승인 기한이 지났습니다. 최신 내용으로 다시 신청하세요.';}
    else if((target.version??1)!==row.targetVersion){row.status='stale';row.result='대상 내용이 바뀌었습니다. 최신 버전으로 다시 검토하세요.';}
    else if(decision==='reject'){row.status='rejected';row.result='거절 사유: '+reason;}
    else {
      approvalScope(next,row.requesterId,row.kind,row.storeId,row.targetId,'request');
      const data=normalizedApprovalPayload(next,actorId,row.kind,target,row.payload);
      if(row.kind==='country.activation'){
        if(!target.checks?.length||target.checks.some(check=>check.status!=='done'||typeof check.evidence!=='string'||!check.evidence.trim()))fail('COUNTRY_GATE_PENDING','모든 국가 출시 항목의 확인 근거가 필요합니다.');
        target.status=data.status;target.activatedAt=at;target.activatedBy=actorId;
      }else if(row.kind==='store.intake'){
        if(data.intake==='open'){if(target.publication!=='published')fail('PUBLICATION_BLOCKED','공개된 샵만 접수를 열 수 있습니다.');openingGate(next,target);}
        target.intake=data.intake;
      }else if(row.kind==='store.publication'){
        if(data.publication==='published')openingGate(next,target);target.publication=data.publication;
        if(data.publication!=='published')target.intake='closed';
      }else if(row.kind==='plan.change'){
        const index=PLAN_NAMES.indexOf(data.plan),price=PRICES[target.country];target.plan=data.plan;target.currency=price.currency;target.monthlyFee=price.fees[index];target.limit=[500,2000,5000][index];
      }else if(row.kind==='billing.refund'){
        const refund={id:uid('REF'),invoiceId:target.id,storeId:target.storeId,amount:data.amount,currency:target.currency,status:'simulated',createdAt:at,requestId:row.id,requesterId:row.requesterId,approvedBy:actorId};next.refunds.unshift(refund);
        const refunded=next.refunds.filter(r=>r.invoiceId===target.id&&r.status==='simulated').reduce((n,r)=>n+r.amount,0);if(refunded===target.amount)target.status='refunded';
        target.events||=[];target.events.push({at,actor:p.label,action:`가상 환불 ${data.amount} ${target.currency} · 실제 환불 미실행`});
      }else if(row.kind==='ai.limit')target.limit=data.limit;
      else if(row.kind==='member.permissions'){Object.assign(target,data);target.sessions?.forEach(session=>{session.active=false;session.revokedAt=at;});}
      else if(row.kind==='translation.publish'){if(!target.text?.trim())fail('INVALID','빈 번역을 게시할 수 없습니다.');target.status='published';target.publishedAt=at;target.publishedBy=actorId;}
      nextVersion(target);target.updatedAt=at;row.status='approved';row.result='승인 내용을 로컬 체험 자료에 반영했습니다. 운영 서버·AI·실제 결제는 실행하지 않았습니다.';
    }
    row.reviewerId=actorId;row.reviewedAt=at;row.reviewReason=reason;nextVersion(row);
    summary='독립 검토 · '+row.kind+' · '+row.status;result=done(row.id,row.status,row.result,{version:row.version,targetVersion:target.version??1});
  }else if(type==='member.invite'){
    const name=clean(payload.name,'이름',100),email=clean(payload.email,'이메일',254).toLowerCase();if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))fail('INVALID','이메일 형식을 확인하세요.');
    if(next.members.some(m=>m.email?.toLowerCase()===email))fail('DUPLICATE_EMAIL','이미 등록된 이메일입니다.');const data=validateMembership(next,actorId,payload);
    const row={id:uid('MEM'),name,email,...data,status:'invited',version:1,sessions:[],createdAt:at};next.members.push(row);targetId=row.id;summary='가상 관리자 초대 · 발송/활성화 안 함';result=done(row.id,'invited','가상 초대를 저장했습니다. 메일 발송이나 실제 권한 활성화는 하지 않았습니다.',{version:1});
  }else if(type==='member.session.revoke'){
    const row=find(next,'members',payload.id);version(row,payload.expectedVersion);clean(payload.reason,'회수 사유',2000,3);const session=row.sessions?.find(s=>s.id===payload.sessionId);if(!session)fail('NOT_FOUND','대상 세션이 없습니다.');if(!session.active)fail('ALREADY_PROCESSED','이미 회수된 세션입니다.');session.active=false;session.revokedAt=at;nextVersion(row);
    summary='가상 관리자 세션 회수';result=done(row.id,'revoked','선택한 가상 세션을 회수했습니다.',{version:row.version});
  }else if(type==='job.retry'){
    const row=find(next,'jobs',payload.id);storeId=row.storeId;clean(payload.reason,'재시도 사유',2000,3);if(row.status!=='failed')fail('JOB_NOT_FAILED','실패한 작업만 재시도 대기에 넣을 수 있습니다.');if(row.attempts>=5)fail('RETRY_LIMIT','재시도 한도에 도달했습니다. 원인을 먼저 확인하세요.');
    row.status='queued';row.attempts++;row.updatedAt=at;row.error='';summary='연동 재시도 대기 · 기존 operationId 유지';result=done(row.id,'queued','같은 작업 번호로 재시도 대기에 넣었습니다. 외부 API는 호출하지 않았습니다.');
  }else if(type==='incident.update'){
    const row=find(next,'incidents',payload.id);version(row,payload.expectedVersion);const status=choose(payload.status,['investigating','monitoring','resolved'],'장애 상태'),note=clean(payload.note,'장애 처리 메모',3000,3);
    if(!({investigating:['investigating','monitoring'],monitoring:['investigating','monitoring','resolved'],resolved:['investigating']}[row.status]||[]).includes(status))fail('INVALID_TRANSITION','현재 장애 상태에서 허용되지 않는 단계입니다.');
    row.status=status;row.timeline.push({at,actor:p.label,action:note});nextVersion(row);row.updatedAt=at;summary='장애 상태 갱신 · '+status;result=done(row.id,status,'장애 처리 메모와 상태를 저장했습니다.',{version:row.version});
  }else if(type==='translation.save'){
    const row=find(next,'translations',payload.id);version(row,payload.expectedVersion);row.text=clean(payload.text,'번역 문구',4000);row.status='draft';nextVersion(row);row.updatedAt=at;summary='번역 초안 저장 · '+row.locale;result=done(row.id,'draft','번역 초안을 저장했습니다. 게시에는 독립 승인이 필요합니다.',{version:row.version});
  }else if(type==='announcement.save'){
    const title=clean(payload.title,'공지 제목',160),body=clean(payload.body,'공지 본문',6000),channel=choose(payload.channel,['owner','staff','partner','guest','in_app','email','banner'],'공지 채널');let row;
    if(payload.id){row=find(next,'announcements',payload.id);version(row,payload.expectedVersion);Object.assign(row,{title,body,country:payload.country,channel,status:'draft',updatedAt:at});nextVersion(row);}
    else{row={id:uid('ANN'),title,body,country:payload.country,channel,status:'draft',version:1,createdAt:at};next.announcements.unshift(row);}
    targetId=row.id;summary='공지 초안 저장 · '+row.country;result=done(row.id,'draft','로컬 공지 초안을 저장했습니다.',{version:row.version});
  }else if(type==='announcement.publish'){
    const row=find(next,'announcements',payload.id);version(row,payload.expectedVersion);clean(payload.reason,'게시 사유',2000,3);if(row.status!=='draft')fail('ALREADY_PROCESSED','초안만 게시 시뮬레이션을 할 수 있습니다.');row.status='published';row.publishedAt=at;row.publishedBy=actorId;nextVersion(row);
    summary='공지 게시 시뮬레이션 · 실제 발송 없음';result=done(row.id,'published','로컬 게시 상태로 바꿨습니다. 외부 게시·메일 발송은 하지 않았습니다.',{version:row.version});
  }else if(type==='export.record'){
    const resource=payload.resource;storeId=payload.storeId??null;integer(payload.count,'내보내기 행 수',0,10000);
    if(!Array.isArray(payload.fields)||!payload.fields.length||new Set(payload.fields).size!==payload.fields.length||payload.fields.some(f=>!EXPORT_FIELDS[resource].includes(f)))fail('EXPORT_FIELDS','개인정보·본문·비밀값을 제외한 허용 필드만 내보낼 수 있습니다.');
    const rows=exportRows(next,actorId,resource,storeId);if(payload.count>rows.length)fail('EXPORT_SCOPE','현재 권한 범위보다 많은 행을 기록할 수 없습니다.');
    targetId=resource;summary=`마스킹 로컬 CSV · ${resource} · ${payload.count}행 · ${payload.fields.join(', ')}`;result=done(resource,'recorded','현재 권한 범위의 로컬 CSV 내보내기를 기록했습니다. 외부 전송은 하지 않았습니다.',{count:payload.count});
  }
  next.revision=(next.revision||0)+1;
  const targetShop=storeId&&next.shops.find(s=>s.id===storeId);
  const country=countryCode||targetShop?.country||(type==='incident.update'?find(next,'incidents',payload.id).country:type.startsWith('announcement.')?find(next,'announcements',targetId).country:null);
  next.audit.unshift({id:uid('AUD'),at,actorId,actor:p.label,action:type,storeId,country,target:targetId||storeId||'platform',summary,result:result.status});
  next.processedCommands.push({actorId,requestId,fingerprint,result:structuredClone(result),at});
  return {state:next,result};
}
