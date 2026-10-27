import assert from 'node:assert/strict';import fs from 'node:fs/promises';import {CLOUD} from '../dist/shared/cloud-config.js';
const fixtures=JSON.parse(await fs.readFile('artifacts/cloud-fixtures.json','utf8')),owner=fixtures.ownerA,other=fixtures.guestB;
const base=CLOUD.url+'/functions/v1/modu-api/'+owner.storeId;
async function api(path,method='GET',data,token,status=200){const r=await fetch(base+'/'+path,{method,headers:{apikey:CLOUD.key,'content-type':'application/json',...(token?{'x-modu-token':token}:{})},body:data?JSON.stringify(data):undefined});assert.equal(r.status,status,method+' '+path+' returned '+r.status);return r.json();}
const guest=await api('visits','POST',{table:null,lang:'ko'},null,201),snapshot=await api('snapshot','GET',null,owner.token),cart={m01:1};
const online={channel:'online',address:'DEMO ONLY · Test room 503',phone:'+1 202-555-0105',name:'Sample delivery'};
const payload={cart,revision:snapshot.revision,requestId:crypto.randomUUID(),fulfillment:online};
const receipt=await api('orders','POST',payload,guest.token,201);assert.deepEqual(receipt.fulfillment,online);
const retry=await api('orders','POST',{...payload,fulfillment:{channel:'dine-in',table:24}},guest.token,201);assert.equal(retry.id,receipt.id);assert.deepEqual(retry.fulfillment,online);
const table=await api('orders','POST',{...payload,requestId:crypto.randomUUID(),fulfillment:{channel:'dine-in',table:24,address:'ignored',phone:'ignored'}},guest.token,201);assert.deepEqual(table.fulfillment,{channel:'dine-in',table:24});
const before=await api('snapshot','GET',null,guest.token);assert.equal(before.visits[0].table_no,null);assert.equal(before.orders.length,2);
for(const fulfillment of [undefined,{channel:'dine-in',table:0},{channel:'online',address:'abc',phone:'123'},{channel:'online',address:online.address,phone:'not-a-number'}])await api('orders','POST',{...payload,requestId:crypto.randomUUID(),fulfillment},guest.token,400);
assert.equal((await api('snapshot','GET',null,guest.token)).orders.length,2);
const own=await api('snapshot','GET',null,owner.token);assert.deepEqual(own.orders.find(o=>o.id===receipt.id).fulfillment,online);assert.equal(own.orders.find(o=>o.id===table.id).fulfillment.table,24);
const outsider=await api('snapshot','GET',null,other.token);assert(!outsider.orders.some(o=>o.id===receipt.id));assert(!JSON.stringify(outsider).includes(online.address));assert(!JSON.stringify(await api('public')).includes(online.phone));
console.log('PASS: online address/contact and confirmed table saved atomically, retry details frozen, invalid checkout rejected, owner visibility and guest/public isolation');
