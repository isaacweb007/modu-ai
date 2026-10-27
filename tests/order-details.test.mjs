import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {normalizeFulfillment,filterOrders,channelCounts} from '../dist/shared/order-details.js';
import {fulfillmentData} from '../supabase/functions/modu-api/validation.js';
import {ORDER_COPY} from '../dist/shared/order-copy.js';
import {createOwnerSample,upgradeOwnerSample} from '../dist/shared/owner-sample.js';
import * as S from '../dist/shared/state.js';
const memory=new Map();globalThis.localStorage={getItem:k=>memory.get(k)??null,setItem:(k,v)=>memory.set(k,v)};
test('checkout requires explicit channel, table or usable delivery details on client and server',()=>{
 for(const validate of [normalizeFulfillment,fulfillmentData]){
  for(const input of [null,{}, {channel:'pickup'}])assert.throws(()=>validate(input),/fulfillmentRequired/);
  for(const table of [null,'',0,-1,1000,2.5,'3abc'])assert.throws(()=>validate({channel:'dine-in',table}),/invalidTable/);
  assert.deepEqual(validate({channel:'dine-in',table:'8',address:'never retain',phone:'123456789'}),{channel:'dine-in',table:8});
  for(const input of [{address:'abc',phone:'1234567'},{address:'Demo address',phone:'not a phone'},{address:'Demo address',phone:'123'},{address:'a'.repeat(301),phone:'123456789'},{address:'Demo address',phone:'1234567890123456'}])assert.throws(()=>validate({channel:'online',...input}),/invalidDelivery/);
  assert.deepEqual(validate({channel:'online',address:' Demo address ',phone:'+1 202-555-0100',name:' Sample ',table:3}),{channel:'online',address:'Demo address',phone:'+1 202-555-0100',name:'Sample'});
 }
 assert.equal(readFileSync('dist/shared/order-details.js','utf8'),readFileSync('supabase/functions/modu-api/order-details.js','utf8'));
});
test('orders freeze confirmed routing; retries do not overwrite details or create duplicates',()=>{
 memory.clear();const id=S.ensureSession(null,'ko');S.updateCart(id,'m01',1);assert.throws(()=>S.placeOrder(id,'missing'),/fulfillmentRequired/);assert.equal(S.readState().orders.length,0);
 const delivery={channel:'online',address:'DEMO room 202',phone:'+1 202-555-0100',name:'Sample'};
 const order=S.placeOrder(id,'routed-online',S.cartQuote(S.readState(),id),delivery);delivery.address='changed';assert.equal(order.table,null);assert.equal(S.readState().orders[0].fulfillment.address,'DEMO room 202');
 assert.equal(S.placeOrder(id,'routed-online',undefined,{channel:'dine-in',table:5}).id,order.id);assert.equal(S.readState().orders.length,1);assert.equal(S.readState().orders[0].fulfillment.channel,'online');
 S.updateCart(id,'m04',1);S.placeOrder(id,'routed-table',S.cartQuote(S.readState(),id),{channel:'dine-in',table:12});assert.equal(S.readState().orders[1].table,12);assert.equal(S.posPayload(S.readState()).data.fulfillment.table,12);
});
test('dashboard channel counts, safe sample upgrade and nine locales',()=>{
 const sample=createOwnerSample();assert.deepEqual(channelCounts(sample.orders),{all:4,'dine-in':2,online:2,pending:1,unknown:0});
 assert.equal(filterOrders(sample.orders,'online').length,2);assert(filterOrders(sample.orders,'online').every(o=>o.table===null&&o.fulfillment.address&&o.fulfillment.phone));
 const legacy=structuredClone(sample);delete legacy.sampleRoutingVersion;for(const o of legacy.orders)delete o.fulfillment;legacy.orders[0].status='ready';legacy.manager.messages.push({text:'keep this edit'});const upgraded=upgradeOwnerSample(legacy);assert.equal(upgraded.orders[0].status,'ready');assert.equal(upgraded.manager.messages.at(-1).text,'keep this edit');assert.equal(upgraded.orders[1].fulfillment.channel,'online');assert.equal(legacy.orders[1].fulfillment,undefined);
 assert.equal(filterOrders([{id:'old',table:3}],'unknown').length,1);
 for(const copy of Object.values(ORDER_COPY)){assert.deepEqual(Object.keys(copy),Object.keys(ORDER_COPY.ko));assert(Object.values(copy).every(v=>typeof v==='string'&&v.length>0));}
});
