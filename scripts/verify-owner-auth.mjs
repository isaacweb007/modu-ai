import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {CLOUD} from '../dist/shared/cloud-config.js';
import {createOwnerSample} from '../dist/shared/owner-sample.js';
import {ROLE_PERMISSIONS} from '../dist/shared/team-state.js';
const path='artifacts/owner-auth-fixtures.json',original=JSON.parse(await fs.readFile('artifacts/cloud-fixtures.json','utf8'));
let saved;try{saved=JSON.parse(await fs.readFile(path,'utf8'));}catch{saved={};}
const persist=()=>fs.writeFile(path,JSON.stringify(saved,null,2),{mode:0o600});
const pw=()=>crypto.randomUUID()+'!Rami';let checks=0;
async function api(route,method='GET',data,token,status=200){const r=await fetch(CLOUD.url+'/functions/v1/modu-api/'+route,{method,headers:{apikey:CLOUD.key,'content-type':'application/json',...(token?{'x-modu-token':token}:{})},body:data?JSON.stringify(data):undefined});const b=await r.json();assert.equal(r.status,status,JSON.stringify(b));checks++;return b;}
for(const key of ['ownerA','ownerB']){
 const old=original[key],id=old.storeId;
 if(!saved[key]){saved[key]={password:pw(),legacy:old};await persist();}
 const fixture=saved[key],info=await api(id+'/owner-auth','GET',null,fixture.legacy.token);
 if(info.mode==='setup'){
  await api(id+'/snapshot','GET',null,fixture.legacy.token,403);
  await api(id+'/owner-auth/setup','POST',{password:fixture.password},original.guestA.token,403);
  fixture.session=await api(id+'/owner-auth/setup','POST',{password:fixture.password},fixture.legacy.token);
 }else fixture.session=await api(id+'/owner-auth/login','POST',{password:fixture.password});
 await persist();original[key]=fixture.session;
 await api(id+'/snapshot','GET',null,fixture.legacy.token,403);
 await api(id+'/owner-auth/setup','POST',{password:pw()},fixture.legacy.token,403);
}
const a=saved.ownerA,id=a.session.storeId,guest=original.guestA;
await api(id+'/snapshot','GET',null,undefined,401);
await api(id+'/snapshot','GET',null,original.ownerB.token,403);
await api(id+'/owner-auth/login','POST',{password:'wrong-password-for-demo'},undefined,401);
await api(id+'/owner-auth/password','POST',{password:pw(),currentPassword:a.password},guest.token,401);
const second=await api(id+'/owner-auth/login','POST',{password:a.password});
const before=await api(id+'/snapshot','GET',null,second.token);
await api(id+'/owner-auth/logout','POST',{},a.session.token);
await api(id+'/snapshot','GET',null,a.session.token,403);
const after=await api(id+'/snapshot','GET',null,second.token);assert.deepEqual(before.orders,after.orders);
const nextPassword=pw();a.session=await api(id+'/owner-auth/password','POST',{password:nextPassword,currentPassword:a.password},second.token);const previousPassword=a.password;a.password=nextPassword;await persist();
await api(id+'/snapshot','GET',null,second.token,403);
await api(id+'/owner-auth/login','POST',{password:previousPassword},undefined,401);
const otherDevice=await api(id+'/owner-auth/login','POST',{password:a.password});
assert.equal((await api(id+'/snapshot','GET',null,otherDevice.token)).orders.length,before.orders.length);
await api(id+'/owner-auth/logout','POST',{},otherDevice.token);
// Staff credentials cannot reach any owner route, even when they know the shop ID.
const staff=await api(id+'/team','POST',{name:'Auth QA kitchen',role:'kitchen',permissions:ROLE_PERMISSIONS.kitchen},a.session.token,201);
await api(id+'/snapshot','GET',null,staff.token,403);
await api(id+'/team','GET',null,staff.token,403);
await api(id+'/owner-auth/password','POST',{currentPassword:a.password,password:pw()},staff.token,401);
await api(id+'/owner-auth/setup','POST',{password:pw()},staff.token,403);
const projected=await api(id+'/staff/'+staff.member.id,'GET',null,staff.token);assert(!projected.workspace&&!projected.settings&&!projected.sales);assert(projected.orders.every(o=>!o.delivery&&o.total===undefined));
await api(id+'/team/'+staff.member.id,'PATCH',{operation:'revoke',revision:staff.member.revision},a.session.token);
await api(id+'/staff/'+staff.member.id,'GET',null,staff.token,403);
for(const table of ['modu_owner_passwords','modu_owner_sessions']){const r=await fetch(CLOUD.url+'/rest/v1/'+table+'?select=*',{headers:{apikey:CLOUD.key}});assert([401,403].includes(r.status));checks++;}
for(const name of ['modu_owner_session_valid','modu_owner_logout']){const r=await fetch(CLOUD.url+'/rest/v1/rpc/'+name,{method:'POST',headers:{apikey:CLOUD.key,'content-type':'application/json'},body:JSON.stringify({p_store:id,p_hash:'0'.repeat(64)})});assert([401,403].includes(r.status));checks++;}
if(!saved.created){const sample=createOwnerSample();sample.manager.messages=[];const data={store:sample.store,menu:sample.items,workspace:{manager:sample.manager},seedDemo:true};await api('create','POST',data,null,400);const password=pw(),session=await api('create','POST',{...data,password},null,201);saved.created={password,session};await persist();const seeded=await api(session.storeId+'/snapshot','GET',null,session.token);assert(seeded.published&&seeded.orders.length===1&&seeded.reservations.length===1);assert.equal(seeded.orders[0].payment,'unpaid');}
original.ownerA=a.session;original.ownerB=saved.ownerB.session;await fs.writeFile('artifacts/cloud-fixtures.json',JSON.stringify(original,null,2),{mode:0o600});
console.log(`PASS ${checks} live API checks: legacy setup, password login, independent device sessions, logout replay denied, password rotation, guest/staff isolation, private tables/RPCs and seeded unpaid demo.`);
