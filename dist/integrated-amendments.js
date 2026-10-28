import {AMENDMENT_COPY,amendmentResult} from './shared/amendment-copy.js?v=5.18.0';
import {SHOWCASE_COPY} from './shared/showcase-copy.js?v=5.8.0';
import {flowCopy} from './shared/flow-copy.js?v=5.11.0';
import {LANGS} from './shared/locale.js?v=5.6.0';
import {brandMark} from './shared/brand.js?v=5.6.0';
import {esc} from './shared/core.js?v=5.6.0';
const roles=l=>({...SHOWCASE_COPY[l],...flowCopy(l)});
export function amendmentPanel(demo,kind){
 if(demo.phase<11||demo.scenario==='booking'&&kind==='kitchen'||demo.editing&&kind==='guest')return '';
 const lang=kind==='guest'?demo.guestLang:'ko',c=AMENDMENT_COPY[lang],entry=demo.amendment;
 const button=(action,label,extra='')=>`<button type="button" data-amendment="${action}" data-run="${demo.runId}" data-revision="${demo.revision}" ${extra}>${esc(label)}</button>`;
 const controls=kind==='guest'&&demo.canManage?`<div class="amendment-guest-actions" aria-label="${esc(c.guestActions)}">${button('change',c.change)}${button('cancel',c.cancel,'class="amendment-cancel"')}</div>`:'';
 if(!entry)return controls;
 const pending=entry.status==='pending',views=demo.amendmentViews(),canReview=demo.canReview(kind);
 const comparison=entry.kind==='change'&&kind!=='kitchen'?`<details class="amendment-comparison" ${pending?'open':''}><summary>${esc(c.after)}</summary><small>${esc(c.before)}</small><p>${esc(views.before.summaries[lang])}</p><small>${esc(c.after)}</small><p>${esc(views.after.summaries[lang])}</p>${kind!=='guest'&&demo.guestLang!=='ko'?`<div class="show-original"><small>${esc(LANGS[demo.guestLang])}</small><p lang="${demo.guestLang}">${esc(views.after.summaries[demo.guestLang])}</p></div>`:''}</details>`:'';
 return `<section class="amendment-card ${entry.status}" data-amendment-status="${entry.status}" lang="${lang}"><div class="amendment-title">${brandMark(pending?'thinking':'greeting',true)}<strong>${esc(c[entry.kind])}</strong></div><p class="amendment-result" role="status">${esc(amendmentResult(entry,lang))}</p>${pending?`<p>${esc(c[entry.requiredRole==='owner'?'ownerOnly':'staffCan'])}</p><p class="amendment-hold">${esc(c.holding)}</p>`:`<small>${esc(roles(lang)[entry.by])}</small>`}${comparison}${canReview?`<div class="amendment-decisions">${button('approve',c.approve,`data-actor="${kind}" data-request-id="${entry.id}"`)}${button('reject',c.reject,`data-actor="${kind}" data-request-id="${entry.id}" class="amendment-reject"`)}</div>`:''}</section>${controls}<details class="amendment-history"><summary>${esc(c.history)} · ${demo.history.length}</summary><ol>${demo.history.map(h=>`<li>${esc(c[h.kind])} · ${esc(amendmentResult(h,lang))}${h.by?` · ${esc(roles(lang)[h.by])}`:''}</li>`).join('')}</ol></details>`;
}
