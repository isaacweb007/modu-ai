import test from 'node:test';
import assert from 'node:assert/strict';
import {createRecordTracker} from '../dist/shared/live-records.js';
import {LIVE_COPY} from '../dist/shared/live-copy.js';
test('owner alerts only for newly received records, once across duplicate snapshots',()=>{
 const tracker=createRecordTracker('owner'),initial={orders:[{id:'old',status:'pending'}],reservations:[]};
 assert.deepEqual(tracker.scan(initial),[]);
 const next={orders:[...initial.orders,{id:'new',status:'pending'}],reservations:[{id:'booking',status:'pending'}]};
 assert.deepEqual(tracker.scan(next).map(n=>[n.kind,n.id,n.type]),[['orders','new','new'],['reservations','booking','new']]);
 assert.deepEqual(tracker.scan(next),[]);
 next.orders[1].status='accepted';assert.deepEqual(tracker.scan(next),[]);
 tracker.reset();assert.deepEqual(tracker.scan(next),[]);
});
test('guest sees own order and reservation transitions without another visitor leaking into alerts',()=>{
 const tracker=createRecordTracker('guest',()=> 'me');
 const rows={orders:[{id:'o',sessionId:'me',status:'pending'},{id:'other',sessionId:'else',status:'pending'}],reservations:[{id:'r',sessionId:'me',status:'pending'}]};
 tracker.scan(rows);rows.orders[0].status='accepted';rows.orders[1].status='ready';rows.reservations[0].status='confirmed';
 assert.deepEqual(tracker.scan(rows).map(n=>n.id),['o','r']);
 for(const status of ['preparing','ready','completed']){rows.orders[0].status=status;assert.equal(tracker.scan(rows)[0].id,'o');assert.deepEqual(tracker.scan(rows),[]);}
 rows.reservations[0].status='cancelled';assert.equal(tracker.scan(rows)[0].id,'r');
});
test('every supported language has complete realtime interface copy',()=>{
 assert.equal(Object.keys(LIVE_COPY).length,9);
 for(const row of Object.values(LIVE_COPY)){assert.deepEqual(Object.keys(row),Object.keys(LIVE_COPY.en));for(const value of Object.values(row))assert.ok(typeof value==='string'&&value.trim());}
});
