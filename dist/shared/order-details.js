// Shared, side-effect-free validation. Kept byte-identical in the Edge Function.
export function normalizeFulfillment(value) {
  if (!value || typeof value !== 'object' || !['dine-in','online'].includes(value.channel)) throw Error('fulfillmentRequired');
  if (value.channel === 'dine-in') {
    const raw=String(value.table??'').trim(), table=Number(raw);
    if (!/^\d{1,3}$/.test(raw) || !Number.isInteger(table) || table<1 || table>999) throw Error('invalidTable');
    return {channel:'dine-in',table};
  }
  const address=String(value.address??'').replace(/[\r\n\t]+/g,' ').trim(), phone=String(value.phone??'').trim(), name=String(value.name??'').trim();
  const digits=phone.replace(/\D/g,'');
  if(address.length<5 || address.length>300 || /[\x00-\x1f]/.test(address) || phone.length>30 || !/^\+?[0-9 ()-]+$/.test(phone) || digits.length<7 || digits.length>15 || name.length>60) throw Error('invalidDelivery');
  return {channel:'online',address,phone,name};
}
export function fulfillmentKey(value) { return JSON.stringify(normalizeFulfillment(value)); }
export function filterOrders(orders,filter='all') {
  if(filter==='pending')return orders.filter(o=>o.status==='pending');
  if(filter==='unknown')return orders.filter(o=>!o.fulfillment);
  if(['online','dine-in'].includes(filter))return orders.filter(o=>o.fulfillment?.channel===filter);
  return orders;
}
export function channelCounts(orders) { return {all:orders.length,'dine-in':filterOrders(orders,'dine-in').length,online:filterOrders(orders,'online').length,pending:filterOrders(orders,'pending').length,unknown:filterOrders(orders,'unknown').length}; }
