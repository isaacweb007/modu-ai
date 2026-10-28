import {can} from './team-state.js?v=5.8.0';
const actions={pending:{status:'accepted',permission:'ordersAccept',label:'accept'},accepted:{status:'preparing',permission:'ordersPrepare',label:'prepare'},preparing:{status:'ready',permission:'ordersPrepare',label:'ready'},ready:{status:'completed',permission:'ordersServe',label:'serve'}};
export const terminalOrder=o=>['completed','cancelled'].includes(o.status);
export function orderAction(order,member=null){const action=actions[order.status];return action&&(!member||can(member,action.permission))?action:null;}
export function orderHint(order,member=null){if(terminalOrder(order))return 'completeHint';if(order.status==='ready')return 'readyServe';if(order.status==='pending')return 'waitingFloor';return 'waitingKitchen';}
export function queueOrders(orders,filter='active',member=null){return orders.filter(o=>filter==='done'?terminalOrder(o):filter==='todo'?!!orderAction(o,member):filter==='waiting'?!terminalOrder(o)&&!orderAction(o,member):filter==='active'?!terminalOrder(o):true).slice().sort((a,b)=>Number(terminalOrder(a))-Number(terminalOrder(b))||Number(!!orderAction(b,member))-Number(!!orderAction(a,member))||((a.at||'').localeCompare(b.at||''))||a.number-b.number);}
export function queueCounts(orders,member=null){return Object.fromEntries(['active','todo','waiting','all','done'].map(filter=>[filter,queueOrders(orders,filter,member).length]));}
export function guestCheckoutStart(table){const n=Number(table);return Number.isInteger(n)&&n>0&&n<=999?{stage:'dine-in',details:{channel:'dine-in',table:n}}:{stage:'channel',details:null};}
export const GUEST_VIEWS=['menu','chat','cart','checkout','orders','reservation','bookings','waiting','points','games','interpreter'];
export const OWNER_VIEWS=['chat','dashboard','team','security'];
export function routeView(hash,owner){const id=hash.replace(/^#/,'');return (owner?OWNER_VIEWS:GUEST_VIEWS).includes(id)?id:null;}

export function guestOrderQueue(orders){return orders.slice().sort((a,b)=>Number(terminalOrder(a))-Number(terminalOrder(b))||(b.at||'').localeCompare(a.at||'')||b.number-a.number);}
