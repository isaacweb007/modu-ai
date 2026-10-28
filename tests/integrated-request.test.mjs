import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createIntegratedDemo} from '../dist/shared/integrated-demo-state.js';
import {validateRequest,requestDateLimits} from '../dist/shared/integrated-request.js';
import {REQUEST_COPY} from '../dist/shared/integrated-request-copy.js';
import {requestForm} from '../dist/integrated-request-form.js';
import {showcaseViews} from '../dist/showcase.js';
import {LANGS,formatMoney,formatBooking,partyLabel} from '../dist/shared/locale.js';
const step=d=>d.phase===3?d.confirm():d.advance();
const start=(scenario='dineIn',lang='vi')=>{const d=createIntegratedDemo(scenario);while(d.phase<6)step(d);d.selectLanguage(lang);step(d);return d;};
const finish=d=>{while(!d.complete)assert(step(d));return d.snapshot();};
const html=(d,role)=>showcaseViews(d.serviceState(),'ko',{lounge:false,guestEditor:()=>requestForm(d)}).appPane(role,d.snapshot());

test('multiple edited menu quantities set totals, Korean interpretation, receipts and localized ready alerts',()=>{
 for(const scenario of ['dineIn','delivery'])for(const lang of Object.keys(LANGS)){
  const d=start(scenario,lang),menu=d.menu();d.setField('quantity-m01','0');d.setField('quantity-m04','3');d.setField('quantity-m13','2');
  assert(d.advance());const request=d.snapshot().request;assert(request.text.includes(menu[1].name[lang]));assert(request.interpretation.ko.includes(menu[1].name.ko+' × 3'));
  const s=finish(d),total=menu[1].price*3+menu[4].price*2;
  assert.equal(s.order.total,total);assert.deepEqual(s.order.lines.map(l=>[l.itemId,l.quantity]),[['m04',3],['m13',2]]);assert.equal(s.order.payment,'unpaid');
  for(const role of ['guest','floor','kitchen','owner']){const markup=html(d,role);assert(markup.includes(role==='guest'?menu[1].name[lang]:menu[1].name.ko));assert(markup.includes('× 3'));assert(!markup.includes(menu[0].name[role==='guest'?lang:'ko']));}
  assert(html(d,'owner').includes(formatMoney(total,'ko')));assert(!html(d,'kitchen').includes(formatMoney(total,'ko')));assert(s.readyMessages[lang].includes(menu[4].name[lang]));
 }
});
test('edited booking date, time and party size survive all handoffs; kitchen receives no reservation',()=>{
 const d=start('booking'),date=requestDateLimits().max;
 d.setField('date',date);d.setField('time','20:45');d.setField('partySize','6');
 const s=finish(d);assert.equal(s.booking.date,date);assert.equal(s.booking.time,'20:45');assert.equal(s.booking.partySize,6);assert.equal(s.order,null);
 for(const role of ['guest','floor','owner']){const l=role==='guest'?'vi':'ko',markup=html(d,role);assert(markup.includes(formatBooking(date,'20:45',l)));assert(markup.includes(partyLabel(6,l)));assert(markup.includes(s.booking.id));}
 assert(html(d,'guest').includes(s.readyMessages.vi));assert(html(d,'owner').includes(s.readyMessages.ko));assert(!html(d,'kitchen').includes('20:45'));assert(!html(d,'kitchen').includes(s.booking.id));
});
test('delivery details stay consistent and escaped for guest, floor and owner, absent from kitchen',()=>{
 const d=start('delivery'),address='DEMO · 88 <script>alert(1)</script> & Example road',phone='+84 000 123 456';d.setField('address',address);d.setField('phone',phone);d.setField('quantity-m01','2');
 while(d.phase<10)assert(step(d));assert.equal(d.snapshot().order,null);assert(html(d,'guest').includes(phone));assert(html(d,'guest').includes('&lt;script&gt;'));assert(!html(d,'floor').includes(phone));
 const s=finish(d);assert.equal(s.order.fulfillment.address,address);assert.equal(s.order.fulfillment.phone,phone);
 for(const role of ['guest','floor','owner']){const markup=html(d,role);assert(markup.includes(phone));assert(markup.includes('&lt;script&gt;'));assert(!markup.includes('<script>'));}
 const kitchen=html(d,'kitchen');assert(!kitchen.includes(phone));assert(!kitchen.includes('Example road'));assert(!kitchen.includes('show-translation'));assert(!kitchen.includes('미결제'));
});
test('invalid draft cannot create a request, order or reservation; errors retain entries and clear on correction',()=>{
 const d=start('delivery'),run=d.runId;d.setField('quantity-m01','0');d.setField('address','a');d.setField('phone','invalid');
 assert.equal(d.advance(),false);assert.equal(d.phase,7);assert.equal(d.snapshot().request,null);assert.equal(d.snapshot().order,null);assert.equal(d.runId,run);
 assert.deepEqual(d.errors,{menu:'menuError',address:'addressError',phone:'phoneError'});assert.equal(d.draft().address,'a');assert(requestForm(d).includes('aria-invalid="true"'));assert(requestForm(d).includes('role="alert"'));
 d.setField('quantity-m05','2');d.setField('address','DEMO · 80 Sample road');d.setField('phone','+84 000 111 222');assert(d.advance());assert.deepEqual(d.errors,{});assert.equal(d.snapshot().total,d.menu()[2].price*2);
 const b=start('booking');b.setField('date','2026-02-30');b.setField('time','24:00');b.setField('partySize','0');assert.equal(b.advance(),false);assert.deepEqual(b.errors,{date:'dateError',time:'timeError',partySize:'partyError'});assert.equal(b.snapshot().booking,null);
});
test('validation rejects fractions, excess quantities, impossible dates, stale local times and contact abuse',()=>{
 const d=start('delivery'),base=d.draft(),menu=d.menu(),at='2026-10-28T17:20:00.000Z';assert.equal(requestDateLimits(at).min,'2026-10-29');
 for(const qty of ['','-1','0.5','21','1e1','Infinity','0x10']){const draft=structuredClone(base);draft.quantities.m01=qty;assert.equal(validateRequest(draft,'dineIn',menu,at).errors['quantity-m01'],'quantityError');}
 for(const [field,value] of [['address','x'.repeat(301)],['address','Demo\u0000street'],['phone','123'],['phone','9'.repeat(16)],['phone','call me'],['phone','+84 ext 123456789']]){const draft={...base,[field]:value};assert(validateRequest(draft,'delivery',menu,at).errors[field]);}
 for(const [date,time] of [['2026-10-28','23:59'],['2026-10-29','00:10'],['2027-10-30','18:00'],['2027-02-29','18:00']])assert(!validateRequest({...base,date,time},'booking',menu,at).valid);
 assert(validateRequest({...base,date:'2026-10-29',time:'00:21'},'booking',menu,at).valid);
});
test('editing before confirmation removes future outcomes, invalidates stale actions and keeps approved menu',()=>{
 const d=start();while(d.phase<10)step(d);const run=d.runId,menu=d.menu();assert(d.edit());assert.equal(d.phase,7);assert(d.approved);assert.deepEqual(d.menu(),menu);assert.notEqual(d.runId,run);assert.equal(d.snapshot().order,null);assert.equal(d.snapshot().reply,null);assert(!d.snapshot().ready);
 assert.equal(d.advance(7,'guest',run),false);d.setField('quantity-m01','4');const s=finish(d);assert.notEqual(d.runId,run);assert.equal(s.order.lines[0].quantity,4);
 assert.equal(d.setField('quantity-m01','9'),false);while(d.phase>7)d.back();const backRun=d.runId;d.setField('quantity-m01','5');assert(d.advance());assert.notEqual(d.runId,backRun);assert.equal(d.advance(8,'guest',backRun),false);
 d.selectScenario('booking');assert.equal(d.phase,0);assert.equal(d.draft().quantities.m01,'1');assert.equal(d.snapshot(),null);
});
test('nine language forms have labels and retained drafts; invalid and unknown fields never enter menu data',()=>{
 for(const lang of Object.keys(LANGS)){
  assert.deepEqual(Object.keys(REQUEST_COPY[lang]),Object.keys(REQUEST_COPY.ko));assert(Object.values(REQUEST_COPY[lang]).every(v=>typeof v==='string'&&v.trim()));
  for(const scenario of ['dineIn','booking','delivery']){
   const d=start(scenario,lang);assert.equal(d.setField('quantity-unknown','5'),false);assert.equal(d.setField('price','1'),false);const leaked=d.draft();leaked.quantities.m01='99';assert.equal(d.draft().quantities.m01,'1');
   const form=requestForm(d);assert(form.includes('novalidate'));assert(form.includes('type="submit"'));assert(!form.includes('undefined'));assert(!form.includes('NaN'));assert(form.includes(REQUEST_COPY[lang].privacy));
   if(scenario==='booking'){assert(form.includes('name="date"'));assert(form.includes('name="time"'));assert(form.includes('name="partySize"'));}else{for(const m of d.menu())assert(form.includes('for="integrated-input-quantity-'+m.id+'"'));}
  }
 }
 for(const file of ['dist/integrated-request-form.js','dist/shared/integrated-request.js','dist/shared/integrated-request-copy.js'])assert.doesNotMatch(fs.readFileSync(new URL('../'+file,import.meta.url),'utf8'),/fetch\s*\(|XMLHttpRequest|WebSocket|localStorage|sessionStorage|supabase/);
});
