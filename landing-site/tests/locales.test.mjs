import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {LANGUAGES,COPY,DIALOGUE} from '../dist/i18n.js';
const codes=['ko','en','vi','zh','ja','km','id','lo','hi'];
const leaves=(value,path='')=>typeof value==='string'?[path]:Object.entries(value).flatMap(([key,child])=>leaves(child,path?`${path}.${key}`:key));
const at=(value,path)=>path.split('.').reduce((node,key)=>node?.[key],value);
test('all nine book languages have every landing phrase and every guest scenario',()=>{
 assert.deepEqual(LANGUAGES.map(language=>language.code),codes);
 const expected=leaves(COPY.ko).sort();
 for(const code of codes){
  assert.deepEqual(leaves(COPY[code]).sort(),expected,`${code}: translation shape differs`);
  for(const key of expected)assert.ok(at(COPY[code],key).trim(),`${code}.${key}: empty`);
  assert.deepEqual(Object.keys(DIALOGUE[code]).sort(),Object.keys(DIALOGUE.ko).sort());
  for(const value of Object.values(DIALOGUE[code]))assert.ok(value.trim());
 }
});
test('the approved global landing has no concept picker and all static translation references exist',()=>{
 const html=readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');
 assert.ok(!html.includes('concept-switch'));
 assert.ok(!html.includes('data-concept'));
 for(const [,key] of html.matchAll(/data-(?:copy|line|alt)="([^"]+)"/g)){
  for(const code of codes)assert.equal(typeof at(COPY[code],key),'string',`${code}.${key}`);
 }
 assert.ok(html.includes('id="page-language"'));
 assert.ok(html.includes('id="guest-language"'));
});
