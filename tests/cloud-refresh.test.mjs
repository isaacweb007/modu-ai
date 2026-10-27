import test from 'node:test';
import assert from 'node:assert/strict';
globalThis.location={search:''};
globalThis.document={body:{dataset:{role:'guest'}}};
globalThis.localStorage={getItem:()=>null};
const {cloud}=await import('../dist/shared/cloud.js');
const tick=()=>new Promise(resolve=>setTimeout(resolve,180));
test('an invalidation received during an in-flight read is fetched after that read',async()=>{
 cloud.enabled=true;cloud.credential={token:'test'};cloud.storeId='fixture';cloud.dirty=false;cloud.mutating=false;
 const applied=[];cloud.apply=s=>applied.push(s.revision);cloud.setStatus=()=>{};
 let release,reads=0;
 globalThis.fetch=async()=>{const revision=++reads;if(revision===1)await new Promise(r=>release=r);return {ok:true,json:async()=>({store:{media:[]},revision})};};
 const first=cloud.refresh();await cloud.refresh();release();await first;await tick();
 assert.deepEqual(applied,[1,2]);assert.equal(reads,2);assert.equal(cloud.refreshQueued,false);
});
test('an invalidation during an order mutation is retained and read as soon as the mutation ends',async()=>{
 cloud.mutating=true;const applied=[];cloud.apply=s=>applied.push(s.revision);let reads=0;
 globalThis.fetch=async()=>({ok:true,json:async()=>({store:{media:[]},revision:100+(++reads)})});
 await cloud.refresh();assert.equal(reads,0);
 cloud.mutating=false;cloud.drainRefresh();await tick();
 assert.deepEqual(applied,[101]);assert.equal(reads,1);
});
