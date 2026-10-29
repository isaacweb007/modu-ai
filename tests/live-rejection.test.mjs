import test from 'node:test';
import assert from 'node:assert/strict';
import {REASON_IDS,liveReasons,liveReasonMessage,frozenReasonMessages} from '../dist/shared/live-rejection.js';
import {rejectionMessages} from '../supabase/functions/modu-api/rejection-messages.js';
import {amendmentMarkup,staffAmendmentMarkup} from '../dist/shared/live-amendment.js';
import {LANGS} from '../dist/shared/locale.js';
const order={id:'o1',status:'accepted',lines:[{itemId:'m1',quantity:1,name:{ko:'김치전',vi:'Bánh kimchi'}}]};
const request={id:'a1',target_id:'o1',target_type:'order',kind:'change',status:'pending',original_status:'accepted',guest_lang:'vi',after_data:{lines:[{itemId:'m1',quantity:2,name:{ko:'김치전',vi:'Bánh kimchi'}}]}};
test('each selectable scenario is localized consistently between app and server',()=>{
 for(const id of REASON_IDS){const messages=frozenReasonMessages(id);assert.deepEqual(messages,rejectionMessages[id]);for(const lang of Object.keys(LANGS))assert(messages[lang]&&liveReasonMessage(id,lang)===messages[lang]);}
 assert.deepEqual(liveReasons(request),['menuUnavailable','operationalConstraint','verificationRequired']);
 assert(liveReasons({...request,original_status:'preparing'}).includes('preparationStarted'));
 assert(liveReasons({...request,target_type:'booking'}).includes('slotUnavailable'));
 assert(!liveReasons({...request,kind:'cancel',target_type:'booking'}).includes('slotUnavailable'));
});
test('owner review requires reason, shows bilingual original with frozen results, and guests see their own language only',()=>{
 const pending=amendmentMarkup({record:order,items:[request],owner:true,type:'order',lang:'ko'});
 assert(pending.includes('name="reason" required'));assert(pending.includes('data-guest-lang="vi"'));assert(pending.includes('value="menuUnavailable"'));assert(!pending.includes('value="slotUnavailable"'));
 const decided={...request,status:'rejected',reason_code:'menuUnavailable',reason_messages:frozenReasonMessages('menuUnavailable'),reviewed_by:'Minh <staff>',reviewed_at:'2026-10-29T01:00:00Z'};
 const owner=amendmentMarkup({record:order,items:[decided],owner:true,type:'order',lang:'ko'});
 for(const value of ['김치전','Bánh kimchi',decided.reason_messages.ko,decided.reason_messages.vi,'Minh &lt;staff&gt;'])assert(owner.includes(value));
 const guest=amendmentMarkup({record:order,items:[decided],type:'order',lang:'vi'});
 assert(guest.includes(decided.reason_messages.vi));assert(!guest.includes('Minh'));assert(!guest.includes(decided.reason_messages.ko));
});
test('floor reviews permitted requests; late requests and kitchen have no review form',()=>{
 const staff={role:'floor',permissions:['ordersView','ordersAccept']};
 assert(staffAmendmentMarkup({items:[request],record:order,type:'order',lang:'ko',member:staff}).includes('data-form="staff-amend-reject"'));
 assert(!staffAmendmentMarkup({items:[request],record:{...order,status:'preparing'},type:'order',lang:'ko',member:staff}).includes('data-form="staff-amend-reject"'));
 assert(!staffAmendmentMarkup({items:[request],record:order,type:'order',lang:'ko',member:{role:'kitchen',permissions:['ordersView']}}).includes('data-form="staff-amend-reject"'));
});
