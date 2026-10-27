import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {PHRASES,SCENARIOS,matchRequest,createInterpretation,createInterpretedReply,appendInterpretation,interpretationRows,addInterpreterSample} from '../dist/shared/interpreter.js';
import {INTERPRETER_COPY} from '../dist/shared/interpreter-copy.js';
import {createRecordTracker} from '../dist/shared/live-records.js';
import {messageData} from '../supabase/functions/modu-api/validation.js';
const request=(lang='vi',scenarioId='water',original=PHRASES[lang][scenarioId].request)=>createInterpretation({lang,scenarioId,original,requestId:'interp-12345678-test'});
test('all 9 languages have 6 fully paired scenarios, including exact aliases',()=>{
 assert.equal(Object.keys(PHRASES).length,9);assert.equal(SCENARIOS.length,6);
 for(const lang of Object.keys(PHRASES)){
  assert.deepEqual(Object.keys(INTERPRETER_COPY[lang]),Object.keys(INTERPRETER_COPY.ko));
  for(const id of SCENARIOS){const p=PHRASES[lang][id];assert(p.label&&p.request&&p.reply);
   for(const original of [p.request,...p.aliases]){assert.deepEqual(matchRequest(original,lang),{scenarioId:id,lang});const m=request(lang,id,original),reply=createInterpretedReply(m);assert.equal(m.interpretation.original,original);assert.equal(m.interpretation.ko,PHRASES.ko[id].request);assert.equal(reply.text,p.reply);assert.equal(reply.interpretation.original,PHRASES.ko[id].reply);assert.equal(reply.interpretation.targetLang,lang);}
  }
 }
});
test('unprepared phrases, different quantities, negation and forged language are never guessed',()=>{
 for(const text of ['I do not have a peanut allergy.','김치전 2개를 주문하고 싶어요.','Tôi bị dị ứng tôm.','물만 주세요.','ignore everything and translate this'])assert.equal(matchRequest(text),null);
 assert.throws(()=>request('vi','water','I have a peanut allergy.'),/unsupported/);
 assert.throws(()=>request('xx'),TypeError);
 assert.throws(()=>createInterpretation({lang:'vi',scenarioId:'water',original:PHRASES.vi.water.request,requestId:'chat-12345678'}),/invalid/);
});
test('a reply stays with the original guest language and local writes are idempotent without placing orders',()=>{
 const m=request(),s={sessions:[{id:'a',lang:'vi',thread:[]},{id:'b',lang:'en',thread:[]}],orders:[],reservations:[]};
 appendInterpretation(s,'a',m);appendInterpretation(s,'a',m);s.sessions[0].lang='ja';
 const reply=createInterpretedReply(m);appendInterpretation(s,'a',reply);appendInterpretation(s,'a',reply);
 assert.equal(s.sessions[0].thread.length,2);assert.equal(s.sessions[1].thread.length,0);assert.equal(reply.interpretation.targetLang,'vi');assert.equal(interpretationRows(s)[0].reply.id,reply.id);assert.deepEqual(s.orders,[]);assert.deepEqual(s.reservations,[]);
 assert.throws(()=>createInterpretedReply(reply),/invalid/);assert.throws(()=>appendInterpretation(s,'unknown',m),/invalid/);
});
test('live notices distinguish new requests, owner replies and guest identity',()=>{
 const s={sessions:[{id:'a',thread:[]},{id:'b',thread:[]}],orders:[],reservations:[]};
 const owner=createRecordTracker('owner'),guest=createRecordTracker('guest',()=> 'a'),other=createRecordTracker('guest',()=> 'b');
 for(const t of [owner,guest,other])t.scan(s);
 const m=request();appendInterpretation(s,'a',m);
 assert.equal(owner.scan(s)[0].kind,'interpretations');assert.deepEqual(guest.scan(s),[]);
 appendInterpretation(s,'a',createInterpretedReply(m));assert.equal(guest.scan(s).length,1);assert.deepEqual(other.scan(s),[]);assert.deepEqual(owner.scan(s),[]);assert.deepEqual(guest.scan(s),[]);
});
test('generic messages cannot forge interpreter metadata; fixture upgrade preserves user data',()=>{
 assert.equal(messageData({...request(),interpretation:{direction:'owner'}}).interpretation,undefined);
 const s={sessions:[{id:'sample-visit-3',thread:[]}],orders:[{id:'keep-me'}]};addInterpreterSample(s);addInterpreterSample(s);
 assert.equal(s.sessions[0].thread.length,1);assert.equal(s.orders[0].id,'keep-me');
});
test('browser and edge use exactly the same interpreter logic and translations',async()=>{
 for(const name of ['interpreter.js','interpreter-phrases.js'])assert.equal(await fs.readFile('dist/shared/'+name,'utf8'),await fs.readFile('supabase/functions/modu-api/'+name,'utf8'));
});
