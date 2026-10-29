import test from 'node:test';
import assert from 'node:assert/strict';
import {amendmentMarkup,pendingAmendment,staffAmendmentMarkup} from '../dist/shared/live-amendment.js';
import {AMENDMENT_COPY} from '../dist/shared/amendment-copy.js';
const order={id:'o1',status:'preparing',lines:[{itemId:'a',quantity:1,name:{ko:'김치전',en:'Pancake'}}]};
const pending={id:'r1',target_id:'o1',target_type:'order',kind:'cancel',status:'pending',original_status:'preparing'};
test('late cooking cancellation is visible, held, and reviewable only by the owner',()=>{
 assert.equal(pendingAmendment([pending],'o1'),pending);
 const owner=amendmentMarkup({items:[pending],record:order,type:'order',lang:'ko',owner:true});
 assert(owner.includes('사장님만 승인'));assert(owner.includes('data-amend-review="r1"'));
 const floor=staffAmendmentMarkup({items:[pending],record:order,type:'order',lang:'ko',member:{role:'floor',permissions:['ordersView','ordersAccept']}});
 assert(floor.includes('사장님만 승인'));assert(!floor.includes('data-staff-amend'));
 const kitchen=staffAmendmentMarkup({items:[pending],record:order,type:'order',lang:'ko',member:{role:'kitchen',permissions:['ordersView','ordersPrepare']}});
 assert(!kitchen.includes('data-staff-amend'));
});
test('guest booking change exposes localized, accessible fields; processed requests retain history',()=>{
 const booking={id:'b1',status:'pending',date:'2026-11-02',time:'19:00',partySize:2,name:'A'};
 const html=amendmentMarkup({record:booking,type:'booking',lang:'ko',labels:{date:'방문 날짜',time:'방문 시간',party:'방문 인원'}});
 for(const text of ['방문 날짜','방문 시간','방문 인원','data-amend-cancel','data-form="amend-change"'])assert(html.includes(text));
 assert(!html.includes('조리 중인 메뉴'));
 for(const lang of Object.keys(AMENDMENT_COPY)){
  const history=amendmentMarkup({record:booking,type:'booking',lang,items:[{...pending,target_id:'b1',target_type:'booking',status:'approved',reviewed_by:'owner',reviewed_at:'2026-10-29T00:00:00Z'}]});
  assert(history.includes(AMENDMENT_COPY[lang].cancelled));
 }
});
