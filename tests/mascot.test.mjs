import test from 'node:test';
import assert from 'node:assert/strict';
import {messageMood,currentMood} from '../dist/shared/mascot-state.js';
import {VISUAL_COPY} from '../dist/shared/visual-copy.js';
import {LANGS} from '../dist/shared/core.js';

test('pending replies take priority over prior orders, without changing records',()=>{
 const messages=[{role:'assistant',key:'orderSent',card:'orders'},{role:'user',text:'ingredients?'}];
 const before=structuredClone(messages);
 assert.equal(currentMood(messages,{pending:true}),'thinking');
 assert.equal(currentMood(messages),'order');
 assert.equal(currentMood([]),'greeting');
 assert.equal(messageMood({role:'assistant',answer:{key:'offTopic'}}),'thinking');
 assert.equal(messageMood({role:'assistant',card:'reservation'}),'order');
 assert.deepEqual(messages,before);
});

test('character and reader controls have text in all nine supported languages',()=>{
 for(const lang of Object.keys(LANGS)){
  assert.deepEqual(Object.keys(VISUAL_COPY[lang]),Object.keys(VISUAL_COPY.ko));
  assert(Object.values(VISUAL_COPY[lang]).every(value=>typeof value==='string'&&value.trim().length));
 }
});
