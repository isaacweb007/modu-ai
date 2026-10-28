import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {test} from 'node:test';
import * as access from '../dist/shared/owner-access.js';

const source=fs.readFileSync(new URL('../dist/shared/owner-auth.js',import.meta.url),'utf8').replace(/^import .*;\n/gm,'').replace('export function createOwnerAuth','function createOwnerAuth');
const id='00000000-0000-4000-8000-000000000001';
// Deliberately synthetic credentials. No API or external network calls are made.
const old={storeId:id,token:'a'.repeat(64),expiresAt:'2030-01-01T00:00:00Z'};
const fresh={storeId:id,token:'b'.repeat(64),expiresAt:'2030-01-01T00:00:00Z'};
const key='modu-owner-session:'+id;
function deferred(){let resolve,reject;const promise=new Promise((ok,bad)=>{resolve=ok;reject=bad;});return {promise,resolve,reject};}
function harness(){
 const rootEvents={},windowEvents={},values=new Map(),calls=[],ready=[];
 const storage={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,String(v)),removeItem:k=>values.delete(k)};
 const feedback={textContent:'',focus(){}};
 const root={addEventListener:(name,fn)=>rootEvents[name]=fn,querySelector:()=>feedback,innerHTML:''};
 const ctx={...access,URL,URLSearchParams,Date,JSON,localStorage:storage,location:{search:'?store='+id,href:'https://example.test/owner.html?store='+id},history:{replaceState(){}},window:{addEventListener:(name,fn)=>windowEvents[name]=fn},document:{documentElement:{},title:''},setTimeout:()=>0,clearTimeout(){},request:(...args)=>{const d=deferred();calls.push({args,...d});return d.promise;},ownerAuthCopy:()=>({cloudError:'error'}),FormData:class {constructor(form){this.values=form.values;} *[Symbol.iterator](){yield*Object.entries(this.values);}},CLOUD:{guestBase:'https://example.test/'},esc:x=>x??'',languageOptions:()=>'',icon:()=>'',brandMark:()=>'',brandLogo:()=>'',createOwnerSample:()=>({manager:{messages:[]},store:{},items:[],inventory:[],staffTasks:[]})};
 vm.createContext(ctx);vm.runInContext(source+'\nglobalThis.factory=createOwnerAuth;',ctx);
 const auth=ctx.factory({root,getLang:()=> 'ko',onReady:async c=>ready.push(c),onLocked(){},onSuspend(){}});
 function submit(kind='login'){
  const button={disabled:false,removeAttribute(){}};
  const form={dataset:{authForm:kind},values:{password:'sample-password-123',confirm:'sample-password-123',currentPassword:'previous-password-123'},querySelector:()=>button,reset(){}};
  return rootEvents.submit({target:{closest:()=>form},preventDefault(){},stopPropagation(){}});
 }
 function writeFresh({emit=true}={}){storage.setItem(key,JSON.stringify(fresh));if(emit)windowEvents.storage({key});}
 function storedIs(c){return access.readJson(storage,key)?.token===c.token;}
 async function settleIssued(promise,credential=old){calls[0].resolve(credential);await new Promise(resolve=>setImmediate(resolve));if(calls[1]?.args[0].endsWith('/logout'))calls[1].resolve({ok:true});await promise;}
 return {auth,storage,ready,calls,submit,writeFresh,storedIs,settleIssued,windowEvents};
}
await test('pending login + cross-tab storage event preserves newer session and revokes stale issued session',async()=>{
 const h=harness(),p=h.submit();h.writeFresh();await h.settleIssued(p);
 assert(h.storedIs(fresh));assert.equal(h.ready.length,0);assert(h.calls[1]?.args[0].endsWith('/logout'));assert.equal(h.auth.pending,false);
});
await test('pending password change + cross-tab storage event cannot reenter stale issued session',async()=>{
 const h=harness();await h.auth.enter(old);const p=h.submit('password');h.writeFresh();await h.settleIssued(p);
 assert(h.storedIs(fresh));assert.equal(h.ready.length,1);assert.equal(h.auth.ready,false);
});
await test('pending login detects newer stored session even before storage event is delivered',async()=>{
 const h=harness(),p=h.submit();h.writeFresh({emit:false});await h.settleIssued(p);
 assert(h.storedIs(fresh));assert.equal(h.ready.length,0);assert(h.calls[1]?.args[0].endsWith('/logout'));
});
await test('pending boot + delivered storage event cannot reenter stale session',async()=>{
 const h=harness();h.storage.setItem(key,JSON.stringify(old));const p=h.auth.boot();h.writeFresh();h.calls[0].resolve({mode:'session',name:'Demo'});await p;
 assert(h.storedIs(fresh));assert.equal(h.ready.length,0);
});
await test('pending boot preserves newer session before storage event delivery',async()=>{
 const h=harness();h.storage.setItem(key,JSON.stringify(old));const p=h.auth.boot();h.writeFresh({emit:false});h.calls[0].resolve({mode:'session',name:'Demo'});await p;
 assert(h.storedIs(fresh),'boot overwrote the newer stored session');assert.equal(h.ready.length,0);
});
await test('pending logout does not delete a newer cross-tab login',async()=>{
 const h=harness();await h.auth.enter(old);const p=h.auth.logout();h.writeFresh();h.calls[0].resolve({ok:true});await p;
 assert(h.storedIs(fresh),'late logout deleted the newer stored session');
});
await test('unchanged login succeeds normally',async()=>{
 const h=harness(),p=h.submit();await h.settleIssued(p);
 assert(h.storedIs(old));assert.equal(h.ready.length,1);assert.equal(h.auth.pending,false);
});
await test('unchanged boot resumes normally',async()=>{
 const h=harness();h.storage.setItem(key,JSON.stringify(old));const p=h.auth.boot();h.calls[0].resolve({mode:'session',name:'Demo'});await p;
 assert(h.storedIs(old));assert.equal(h.ready.length,1);assert.equal(h.auth.ready,true);
});
await test('unchanged logout clears its own session normally',async()=>{
 const h=harness();await h.auth.enter(old);const p=h.auth.logout();h.calls[0].resolve({ok:true});await p;
 assert.equal(h.storage.getItem(key),null);assert.equal(h.auth.ready,false);
});
await test('late failed logout does not resume a null credential after cross-tab login',async()=>{
 const h=harness();await h.auth.enter(old);const p=h.auth.logout();h.writeFresh();h.calls[0].reject(Error('cloudOffline'));await p;
 assert(h.storedIs(fresh));assert.equal(h.ready.length,1,'late logout called onReady after the session changed');
});
