// UI-only permission rehearsal. Production authorization must run on the server.
export const PERMISSIONS=['ordersView','ordersAccept','ordersPrepare','ordersServe','bookingsView','bookingsManage','requestsView','deliveryView','menuView','menuEdit','salesView','settingsView','settingsEdit'];
export const DEPENDS={ordersAccept:'ordersView',ordersPrepare:'ordersView',ordersServe:'ordersView',deliveryView:'ordersView',bookingsManage:'bookingsView',menuEdit:'menuView',settingsEdit:'settingsView'};
export const ROLE_PERMISSIONS={floor:['ordersView','ordersAccept','ordersServe','bookingsView','bookingsManage','requestsView','menuView'],kitchen:['ordersView','ordersPrepare','menuView','menuEdit'],custom:[]};
export function cleanPermissions(input=[]){const allowed=PERMISSIONS.filter(p=>input.includes(p));return allowed.filter(p=>!DEPENDS[p]||allowed.includes(DEPENDS[p]));}
export function ensureTeam(s){if(s.teamVersion===1)return s;s.teamVersion=1;s.teamMembers=[{id:'staff-'+crypto.randomUUID(),name:'Minh',role:'floor',permissions:[...ROLE_PERMISSIONS.floor]},{id:'staff-'+crypto.randomUUID(),name:'Jin',role:'kitchen',permissions:[...ROLE_PERMISSIONS.kitchen]}];s.teamAudit=[];return s;}
export const memberFor=(s,id)=>s.teamMembers?.find(m=>m.id===id)||null;
export const can=(member,permission)=>!!member&&cleanPermissions(member.permissions).includes(permission);
const requireOwner=actor=>{if(actor!=='owner')throw Error('noAccess');};
const audit=(s,actor,action,target)=>{s.teamAudit??=[];s.teamAudit.unshift({id:crypto.randomUUID(),actor,action,target,at:new Date().toISOString()});s.teamAudit=s.teamAudit.slice(0,60);};
export function registerMember(s,actor,data){requireOwner(actor);const name=String(data.name||'').trim();if(!name||name.length>30)throw Error('invalidName');if(!Object.hasOwn(ROLE_PERMISSIONS,data.role))throw Error('noAccess');const member={id:'staff-'+crypto.randomUUID(),name,role:data.role,permissions:cleanPermissions(data.permissions??ROLE_PERMISSIONS[data.role])};s.teamMembers.push(member);audit(s,'owner','register',member.name);return member;}
export function updateMember(s,actor,id,permissions){requireOwner(actor);const member=memberFor(s,id);if(!member)throw Error('revoked');member.permissions=cleanPermissions(permissions);audit(s,'owner','permissions',member.name);return member;}
export function removeMember(s,actor,id){requireOwner(actor);const member=memberFor(s,id);if(!member)return false;s.teamMembers=s.teamMembers.filter(m=>m.id!==id);audit(s,'owner','remove',member.name);return true;}
export function staffProjection(s,id){const member=memberFor(s,id);if(!member)return null;const view={member:structuredClone(member),shopName:s.store.name};
 if(can(member,'ordersView'))view.orders=s.orders.map(o=>({id:o.id,number:o.number,status:o.status,table:o.fulfillment?.table||o.table,channel:o.fulfillment?.channel||'dine-in',lines:o.lines.map(line=>({itemId:line.itemId,quantity:line.quantity,name:(s.items||[]).find(i=>i.id===line.itemId)?.name||line.name||{}})),...(can(member,'deliveryView')&&o.fulfillment?.channel==='online'?{delivery:structuredClone(o.fulfillment)}:{}),...(can(member,'salesView')?{total:o.total,payment:o.payment}:{})}));
 if(can(member,'bookingsView'))view.bookings=(s.reservations||[]).map(r=>({id:r.id,date:r.date,time:r.time,partySize:r.partySize,name:r.name,status:r.status}));
 if(can(member,'requestsView'))view.requests=s.events.filter(e=>['eventStaff','complaint'].includes(e.type)&&!e.reviewed).map(e=>({id:e.id,table:s.sessions.find(v=>v.id===e.sessionId)?.table||null,text:e.detail?.question||'',key:e.detail?.questionKey||''}));
 if(can(member,'menuView'))view.items=(s.items||[]).map(i=>({id:i.id,name:i.name,available:s.menu?.[i.id]?.available!==false}));
 if(can(member,'salesView'))view.sales=s.orders.filter(o=>o.payment==='paid').reduce((n,o)=>n+o.total,0);
 if(can(member,'settingsView'))view.settings={name:s.store.name,phone:s.store.phone};
 return view;
}
export function staffAction(s,id,action,data={}){const member=memberFor(s,id);if(!member)throw Error('revoked');const requirePermission=p=>{if(!can(member,p))throw Error('noAccess');};let target;
 if(action==='order'){requirePermission('ordersView');const rule={accepted:'ordersAccept',preparing:'ordersPrepare',ready:'ordersPrepare',completed:'ordersServe'}[data.next];if(!rule)throw Error('noAccess');requirePermission(rule);const o=s.orders.find(x=>x.id===data.id);if(!o)throw Error('noRecords');if(({pending:'accepted',accepted:'preparing',preparing:'ready',ready:'completed'})[o.status]!==data.next)return false;o.status=data.next;target='#'+o.number;}
 else if(action==='booking'){requirePermission('bookingsView');requirePermission('bookingsManage');const r=s.reservations.find(x=>x.id===data.id);if(!r)throw Error('noRecords');if(r.status!=='pending')return false;r.status='confirmed';target=r.name;}
 else if(action==='menu'){requirePermission('menuView');requirePermission('menuEdit');if(!s.items.some(i=>i.id===data.id))throw Error('noRecords');s.menu??={};s.menu[data.id]={...s.menu[data.id],available:data.available===true};target=data.id;}
 else if(action==='settings'){requirePermission('settingsView');requirePermission('settingsEdit');const phone=String(data.phone||'').trim();if(!/^[+0-9 ()-]{7,30}$/.test(phone))throw Error('noPermissions');s.store.phone=phone;target=s.store.name;}
 else throw Error('noAccess');
 audit(s,member.name,action+(data.next?':'+data.next:''),target);return true;
}
