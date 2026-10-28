import {PROPOSAL_COPY,proposalResult} from './shared/proposal-copy.js?v=5.20.0';
import {REQUEST_COPY} from './shared/integrated-request-copy.js?v=5.17.0';
import {requestDateLimits} from './shared/integrated-request.js?v=5.17.0';
import {auditTime} from './shared/rejection-copy.js?v=5.19.0';
import {LANGS,formatMoney,partyLabel} from './shared/locale.js?v=5.6.0';
import {brandMark} from './shared/brand.js?v=5.6.0';
import {esc} from './shared/core.js?v=5.6.0';
const proposalError=code=>code==='differentProposal'?'기존 내용 및 손님 변경 요청과 다른 메뉴·수량 또는 예약 시간을 제안해 주세요.':REQUEST_COPY.ko[code];
export function proposalEditor(demo,role){
 if(!demo.canReview(role)||demo.amendment.kind!=='change')return '';
 const d=demo.proposalDraft(role),entry=demo.amendment,attrs=`data-actor="${role}" data-request-id="${entry.id}" data-run="${demo.runId}" data-revision="${demo.revision}"`;
 if(!d)return `<button type="button" class="proposal-compose" data-proposal="compose" ${attrs}>다른 ${demo.scenario==='booking'?'예약 시간':'메뉴'} 제안하기</button>`;
 const id=key=>`proposal-${role}-${key}`,c=REQUEST_COPY.ko,limits=requestDateLimits(),menu=demo.menu();
 const inputAttrs=key=>`id="${id(key)}" name="${key}" data-proposal-field ${attrs} ${d.errors[key]?`aria-invalid="true" aria-describedby="${id(key)}-error"`:''}`;
 const error=key=>d.errors[key]?`<small class="request-error" id="${id(key)}-error">${esc(proposalError(d.errors[key]))}</small>`:'';
 const view=demo.proposalDraftView(role);
 return `<section class="proposal-editor" data-proposal-editor="${role}" aria-labelledby="proposal-title-${role}"><h4 id="proposal-title-${role}">대안 작성</h4><p>손님이 수락해야 반영됩니다. ${demo.scenario==='booking'?'날짜·시간을 바꿔 제안하세요. 인원은 손님 변경 요청을 따릅니다.':'아래는 제안할 전체 주문 구성입니다. 메뉴별 수량을 바꾸고 총액을 확인하세요.'}</p>${Object.keys(d.errors).length?`<div class="proposal-errors" role="alert" tabindex="-1"><strong>${esc(c.errors)}</strong><ul>${Object.values(d.errors).map(code=>`<li>${esc(proposalError(code))}</li>`).join('')}</ul></div>`:''}${demo.scenario==='booking'?`<label for="${id('date')}">제안 날짜</label><input ${inputAttrs('date')} type="date" value="${esc(d.values.date)}" min="${limits.min}" max="${limits.max}">${error('date')}<label for="${id('time')}">제안 시간 · UTC+7</label><input ${inputAttrs('time')} type="time" step="60" value="${esc(d.values.time)}">${error('time')}<p>${esc(partyLabel(Number(d.values.partySize),'ko'))}</p>`:`<fieldset><legend>제안 메뉴와 수량</legend>${menu.map(m=>`<div class="proposal-menu-row"><label for="${id('quantity-'+m.id)}">${esc(m.name.ko)}<small>${esc(formatMoney(m.price,'ko'))}</small></label><input ${inputAttrs('quantity-'+m.id)} type="number" min="0" max="20" step="1" inputmode="numeric" value="${esc(d.values.quantities[m.id])}" aria-label="${esc(m.name.ko+' 제안 수량')}">${error('quantity-'+m.id)}</div>`).join('')}</fieldset><div class="proposal-total"><span>${esc(c.total)}</span><output data-proposal-total>${view?esc(formatMoney(view.total,'ko')):'—'}</output></div>${demo.scenario==='delivery'?'<p>배달 주소·연락처는 현재 확정된 내용을 유지합니다.</p>':''}`}<details class="proposal-draft-preview"><summary>손님 언어로 제안 미리보기 · ${esc(LANGS[entry.guestLang])}</summary><p lang="${entry.guestLang}" data-proposal-preview>${esc(view?.summaries[entry.guestLang]||c.errors)}</p></details><button type="button" data-proposal="discard" ${attrs}>대안 작성 취소</button></section>`;
}
export function proposalPanel(demo,role){
 const entry=demo.amendment,p=entry?.proposal;if(!p)return '';
 const lang=role==='guest'?entry.guestLang:'ko',c=PROPOSAL_COPY[lang],view=demo.proposalView(),before=demo.amendmentViews().before;
 const kitchen=role==='kitchen',booking=demo.scenario==='booking';
 const details=which=>kitchen?which.lines.map(({item,quantity})=>`${item.name.ko} × ${quantity}`).join(', '):which.summaries[lang];
 const attrs=`data-proposal-id="${p.id}" data-run="${demo.runId}" data-revision="${demo.revision}" data-actor="guest"`;
 return `<section class="proposal-card ${p.status}" data-proposal-status="${p.status}" lang="${lang}"><div class="amendment-title">${brandMark(p.status==='pending'?'thinking':'greeting',true)}<strong>${esc(c.title)}</strong></div><p class="proposal-result" role="status">${esc(proposalResult(p,lang))}</p>${kitchen&&booking?`<p>${esc(c.kitchenBooking)}</p>`:`<details class="proposal-current"><summary>${esc(c.current)}</summary><p>${esc(details(before))}</p></details><small>${esc(c.proposed)}</small><p class="proposal-details">${esc(details(view))}</p>`}${p.status==='pending'?`<p class="proposal-hold">${esc(c.hold)}</p>${role==='guest'?`<div class="proposal-actions"><button type="button" data-proposal="accept" ${attrs}>${esc(c.accept)}</button><button type="button" data-proposal="decline" ${attrs}>${esc(c.decline)}</button></div>`:''}`:''}</section>`;
}
export function proposalAudit(entry){
 const p=entry.proposal;if(!p)return '';
 const bilingual=messages=>`<small>한국어</small><p lang="ko">${esc(messages.ko)}</p>${entry.guestLang!=='ko'?`<small>${esc(LANGS[entry.guestLang])} · 원문</small><p lang="${entry.guestLang}">${esc(messages[entry.guestLang])}</p>`:''}`;
 return `<section class="proposal-audit" data-proposal-audit="${p.id}"><h4>대안 제안 · ${esc(proposalResult(p,'ko'))}</h4><dl class="amendment-audit-meta"><div><dt>제안자</dt><dd>${esc(p.proposedBy.name)} · ${p.proposedBy.role==='owner'?'사장님':'홀 직원'}</dd></div><div><dt>제안 시각</dt><dd><time datetime="${p.proposedAt}">${esc(auditTime(p.proposedAt))}</time></dd></div></dl><details class="proposal-sent" ${p.status==='pending'?'open':''}><summary>제안 내용 · 한국어와 원문</summary>${bilingual(p.messages)}</details>${p.respondedAt?`<dl class="amendment-audit-meta"><div><dt>${p.status==='accepted'?'수락자':'응답자'}</dt><dd>${esc(p.respondedBy.name)} · 손님</dd></div><div><dt>${p.status==='accepted'?'수락 시각':'응답 시각'}</dt><dd><time datetime="${p.respondedAt}">${esc(auditTime(p.respondedAt))}</time></dd></div></dl><div class="proposal-response">${bilingual(p.responses)}</div>`:''}</section>`;
}
