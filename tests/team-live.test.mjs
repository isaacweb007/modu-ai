import test from 'node:test';
import assert from 'node:assert/strict';
import {createTeamSync,consumeStaffLink,staffLink} from '../dist/shared/team-live.js';
import {staffData} from '../supabase/functions/modu-api/staff-validation.js';
import {TEAM_LIVE_COPY} from '../dist/shared/team-live-copy.js';
const turn=()=>new Promise(r=>setImmediate(r));
test('late reads cannot resurrect data after a permission invalidation',async()=>{
 let release,reads=0;const seen=[];const s=createTeamSync({staff:true,onchange:x=>seen.push(x.data),read:async()=>{if(++reads===1){await new Promise(r=>release=r);return {private:'old'};}throw Error('revoked');}});
 const first=s.refresh();s.invalidate();release();await first;await turn();assert.equal(s.status,'revoked');assert.equal(s.data,null);assert(!seen.some(x=>x?.private));assert.equal(reads,2);
});
test('offline or hidden staff screens immediately erase data and reject writes',async()=>{
 let writes=0;const s=createTeamSync({staff:true,read:async()=>({orders:[1]}),write:async()=>writes++});await s.refresh();s.suspend();assert.equal(s.data,null);await assert.rejects(s.mutate('','PATCH',{}),/offline/);assert.equal(writes,0);await s.invalidate();assert.deepEqual(s.data,{orders:[1]});s.stop();await assert.rejects(s.mutate('','PATCH',{}));
});
test('queued refresh reads the latest status after a staff mutation and never applies an older read',async()=>{
 let release,server='pending',reads=0;const s=createTeamSync({staff:true,read:async()=>{const value=server;if(++reads===2)await new Promise(r=>release=r);return {status:value};},write:async()=>{server='accepted';}});await s.refresh();const old=s.refresh();const mutation=s.mutate('','PATCH',{});await turn();release();await old;await mutation;await turn();assert.deepEqual(s.data,{status:'accepted'});assert.equal(s.status,'live');
});
test('staff link secrets remain in the fragment, are erased before storage/use, and scope to shop/member',()=>{
 const store='11111111-1111-4111-8111-111111111111',member='22222222-2222-4222-8222-222222222222',token='a'.repeat(64),url=staffLink(store,member,token),data=new Map(),events=[];
 const storage={getItem:k=>data.get(k),setItem:(k,v)=>{events.push('store');data.set(k,v);}};
 assert(!new URL(url).search.includes(token));const credential=consumeStaffLink(url,storage,u=>{events.push('erase');assert(!u.includes(token));});assert.deepEqual(events,['erase','store']);assert.equal(credential.token,token);assert.equal(consumeStaffLink(url.split('#')[0],storage,()=>{}).token,token);assert.equal(consumeStaffLink(url.replace(store,member).split('#')[0],storage,()=>{}),null);
});
test('server staff validation rejects forged capabilities and strips unrelated fields',()=>{
 assert.throws(()=>staffData({name:'A',role:'owner',permissions:[]},'create'));
 assert.throws(()=>staffData({name:'A',role:'floor',permissions:['payment']},'create'));
 assert.throws(()=>staffData({operation:'permissions',revision:0,permissions:[]},'manage'));
 assert.throws(()=>staffData({action:'payment',data:{}},'action'));
 assert.deepEqual(staffData({action:'settings',data:{phone:'+1 202-555-0101',role:'owner',price:1}},'action'),{action:'settings',data:{phone:'+1 202-555-0101'}});
});
test('cloud staff interface text covers every supported language',()=>{
 assert.equal(Object.keys(TEAM_LIVE_COPY).length,9);const keys=Object.keys(TEAM_LIVE_COPY.ko).sort();for(const value of Object.values(TEAM_LIVE_COPY)){assert.deepEqual(Object.keys(value).sort(),keys);assert(Object.values(value).every(x=>typeof x==='string'&&x.trim()));}
});
