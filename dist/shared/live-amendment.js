import {AMENDMENT_COPY} from './amendment-copy.js?v=5.19.0';
import {esc} from './core.js?v=5.6.0';
const c=l=>AMENDMENT_COPY[l]||AMENDMENT_COPY.en;
const ownerName={ko:'사장님',en:'Owner',vi:'Chủ quán',zh:'店主',ja:'オーナー',km:'ម្ចាស់ហាង',id:'Pemilik',lo:'ເຈົ້າຂອງ',hi:'मालिक'};
const dataSummary=(data,lang)=>data?.lines?data.lines.map(x=>`${x.name?.[lang]||x.name?.ko||x.itemId} × ${x.quantity}`).join(' · '):data?.date?`${data.date} ${String(data.time).slice(0,5)} · ${data.partySize}`:'';
export const pendingAmendment=(items,id)=>(items||[]).find(x=>x.target_id===id&&x.status==='pending');
export function amendmentMarkup({items=[],record,type,lang='ko',owner=false,menu=[],local=false,labels={date:'Date',time:'Time',party:'Guests'}}){
 if(local)return '';
 const copy=c(lang),history=items.filter(x=>x.target_id===record.id),pending=pendingAmendment(history,record.id),terminal=type==='order'?['completed','cancelled'].includes(record.status):record.status==='cancelled';
 const historyMarkup=history.length?`<div class="amend-history"><strong>${esc(copy.history)}</strong>${history.map(a=>`<div class="amend-record"><b>${esc(copy[a.kind])} · ${esc(copy[a.status==='pending'?'pending':a.status==='rejected'?'rejected':a.kind==='cancel'?'cancelled':'changed'])}</b>${a.after_data?`<p>${esc(copy.after)}: ${esc(dataSummary(a.after_data,lang))}</p>`:''}${a.reviewed_by?`<small>${esc(a.reviewed_by==='owner'?(ownerName[lang]||ownerName.en):a.reviewed_by)} · ${esc(new Date(a.reviewed_at).toLocaleString(lang))}</small>`:''}</div>`).join('')}</div>`:'';
 if(pending){const late=type==='order'&&['preparing','ready'].includes(record.status);return historyMarkup+`<p class="amend-note">${esc(late?copy.ownerOnly:copy.staffCan)} ${type==='order'?esc(copy.holding):''}</p>${owner?`<div class="inline-actions"><button class="button primary" data-amend-review="${esc(pending.id)}" data-approve="true">${esc(copy.approve)}</button><button class="button" data-amend-review="${esc(pending.id)}" data-approve="false">${esc(copy.reject)}</button></div>`:''}`;}
 if(owner||terminal)return historyMarkup;
 const inputs=type==='order'?menu.filter(x=>x.available!==false).map(x=>`<label class="amend-line"><span>${esc(x.name?.[lang]||x.name?.ko||x.id)}</span><input type="number" name="item-${esc(x.id)}" min="0" max="20" step="1" value="${record.lines.find(l=>l.itemId===x.id)?.quantity||0}" aria-label="${esc(x.name?.[lang]||x.name?.ko||x.id)}"></label>`).join(''):`<label>${esc(labels.date)}<input type="date" name="date" value="${esc(record.date)}" required></label><label>${esc(labels.time)}<input type="time" name="time" value="${esc(record.time)}" required></label><label>${esc(labels.party)}<input type="number" name="partySize" min="1" max="20" value="${esc(record.partySize)}" required></label>`;
 return historyMarkup+`<details class="amend-editor"><summary>${esc(copy.change)}</summary>${type==='order'?`<p>${esc(copy.editNote)}</p>`:''}<form data-form="amend-change" data-type="${type}" data-target="${esc(record.id)}">${inputs}<button class="button primary">${esc(copy.submit)}</button></form></details><button class="button" data-amend-cancel="${esc(record.id)}" data-type="${type}">${esc(copy.cancel)}</button>`;
}
export function staffAmendmentMarkup({items=[],record,type,lang='ko',member}){
 const copy=c(lang),a=pendingAmendment(items,record.id);if(!a)return '';
 const late=type==='order'&&['preparing','ready'].includes(record.status),canReview=member.role==='floor'&&!late&&(type==='order'?member.permissions.includes('ordersAccept'):member.permissions.includes('bookingsManage'));
 return `<div class="amend-record"><b>${esc(copy[a.kind])} · ${esc(copy.pending)}</b>${a.after_data?`<p>${esc(copy.after)}: ${esc(dataSummary(a.after_data,lang))}</p>`:''}<p>${esc(late?copy.ownerOnly:copy.staffCan)}</p>${canReview?`<div class="inline-actions"><button class="button primary" data-staff-amend="${esc(a.id)}" data-approve="true">${esc(copy.approve)}</button><button class="button" data-staff-amend="${esc(a.id)}" data-approve="false">${esc(copy.reject)}</button></div>`:''}</div>`;
}
export function amendmentCopy(lang,key){return c(lang)[key]||key;}
