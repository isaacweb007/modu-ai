import {fail,uuid} from './validation.js';
const permissions=['ordersView','ordersAccept','ordersPrepare','ordersServe','bookingsView','bookingsManage','requestsView','deliveryView','menuView','menuEdit','salesView','settingsView','settingsEdit'];
const validPermissions=p=>{if(!Array.isArray(p)||p.length>permissions.length||p.some(x=>!permissions.includes(x)))fail('invalid');return [...new Set(p)];};
export function staffData(b,kind){
 if(!b||typeof b!=='object'||Array.isArray(b))fail('invalid');
 if(kind==='create'){const name=typeof b.name==='string'?b.name.trim():'';if(!name||name.length>30||!['floor','kitchen','custom'].includes(b.role))fail('invalid');return {name,role:b.role,permissions:validPermissions(b.permissions)};}
 if(kind==='manage'){if(!['permissions','rotate','revoke'].includes(b.operation)||!Number.isSafeInteger(b.revision)||b.revision<1)fail('invalid');return {operation:b.operation,revision:b.revision,...(b.operation==='permissions'?{permissions:validPermissions(b.permissions)}:{})};}
 if(kind==='action'){const d=b.data;if(!d||typeof d!=='object'||Array.isArray(d))fail('invalid');
  if(b.action==='order'){if(!uuid(d.id)||!['accepted','preparing','ready','completed'].includes(d.next))fail('invalid');return {action:b.action,data:{id:d.id,next:d.next}};}
  if(b.action==='booking'){if(!uuid(d.id))fail('invalid');return {action:b.action,data:{id:d.id}};}
  if(b.action==='menu'){if(typeof d.id!=='string'||!/^[a-zA-Z0-9_-]{1,80}$/.test(d.id)||typeof d.available!=='boolean')fail('invalid');return {action:b.action,data:{id:d.id,available:d.available}};}
  if(b.action==='settings'){if(typeof d.phone!=='string'||!/^[+0-9 ()-]{7,30}$/.test(d.phone))fail('invalid');return {action:b.action,data:{phone:d.phone.trim()}};}
 }
 fail('invalid');
}
