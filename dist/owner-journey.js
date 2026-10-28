import {createOwnerJourney,OWNER_JOURNEY_TABS} from './shared/owner-journey-state.js?v=5.13.0';
import {OWNER_JOURNEY_COPY} from './shared/owner-journey-copy.js?v=5.13.0';
import {createShowcasePlayer} from './shared/showcase-state.js?v=5.11.0';
import {SHOWCASE_COPY} from './shared/showcase-copy.js?v=5.8.0';
import {recoveryCopy} from './shared/recovery-demo-copy.js?v=5.12.0';
import {ownerAuthCopy} from './shared/owner-auth-copy.js?v=5.11.0';
import {SAMPLE_COPY} from './shared/owner-sample.js?v=5.6.0';
import {ORDER_COPY} from './shared/order-copy.js?v=5.6.0';
import {UI} from './shared/copy.js?v=5.6.0';
import {expansionCopy} from './shared/expansion-copy.js?v=5.8.0';
import {esc,icon} from './shared/core.js?v=5.6.0';
import {formatMoney,formatBooking,partyLabel,tableLabel} from './shared/locale.js?v=5.6.0';
import {brandMark,brandLogo} from './shared/brand.js?v=5.6.0';
export {OWNER_JOURNEY_COPY};
// Kept only in this page's memory, including across language and layout changes.
let journey;
export const ownerJourneyShell=()=>'<section id="owner-demo" class="owner-journey" aria-labelledby="owner-journey-title"></section>';
const glyph=name=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${({play:'<path d="m8 5 11 7-11 7Z"/>',pause:'<path d="M8 5v14M16 5v14"/>',back:'<path d="m14 5-7 7 7 7"/>',next:'<path d="m10 5 7 7-7 7"/>',restart:'<path d="M4 10a8 8 0 1 1 1 7M4 4v6h6"/>',mail:'<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/>'})[name]}</svg>`;

export function bindOwnerJourney(host,lang='ko') {
 if(!host)return ()=>{};
 journey??=createOwnerJourney();
 const demo=journey,c=OWNER_JOURNEY_COPY[lang],r=recoveryCopy(lang),a=ownerAuthCopy(lang),s=SHOWCASE_COPY[lang],u=UI[lang],o=ORDER_COPY[lang],sample=SAMPLE_COPY[lang];
 const data=demo.snapshot(),labels=[a.login,r.emailStep,r.inboxStep,r.passwordStep,c.signin,r.shop,r.orders];
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');let disposed=false;
 const button=(action,label,graphic='',attrs='')=>`<button type="button" data-journey="${action}" ${attrs}>${graphic}<span>${esc(label)}</span></button>`;
 const advanceButton=label=>button('advance',label,icon('arrow'),`class="journey-action" data-expected="${demo.phase}"`);
 const metrics=()=>`<div class="journey-metrics">${[['menu',data.items.length],['orders',data.orders.length],['bookings',data.reservations.length]].map(([key,n])=>`<div><b>${n}</b><span>${esc(r[key])}</span></div>`).join('')}</div>`;
 const fauxField=(label,value)=>`<div class="journey-field"><span>${esc(label)}</span><div>${esc(value)}</div></div>`;
 const status=key=>key==='confirmed'?expansionCopy(lang).bookingConfirmed:u[key];
 const player=createShowcasePlayer({delay:4400,advance:()=>{demo.advance();return !demo.complete;},onChange:render});

 function records(){
  if(demo.tab==='shop')return `<div class="journey-shop-card"><img src="jumo/assets/exterior.jpg" alt="${esc(data.store.name)}" width="480" height="260" loading="lazy"><h4>${esc(data.store.name)}</h4><p>${esc(sample.sampleAbout)}</p><dl><div><dt>${esc(u.address)}</dt><dd>${esc(sample.sampleAddress)}</dd></div><div><dt>${esc(sample.sampleHours)}</dt><dd>${esc(data.store.hours)}</dd></div></dl></div>`;
  if(demo.tab==='orders')return data.orders.map(order=>`<article class="journey-record" data-sample-order="${esc(order.id)}"><header><strong>#${order.number} · ${esc(order.fulfillment.channel==='online'?o.onlineOrder:tableLabel(order.table,lang))}</strong><span class="journey-status">${esc(status(order.status))}</span></header><p>${esc(order.lines.map(line=>line.name[lang]+' × '+line.quantity).join(' · '))}</p><div class="journey-record-total"><b>${esc(formatMoney(order.total,lang))}</b><small>${esc(u.payment)} · ${esc(status(order.payment))} (${esc(u.demo)})</small></div>${order.fulfillment.channel==='online'?`<dl><div><dt>${esc(o.deliveryAddress)}</dt><dd>${esc(order.fulfillment.address)}</dd></div><div><dt>${esc(o.contactPhone)}</dt><dd>${esc(order.fulfillment.phone)}</dd></div></dl>`:''}</article>`).join('');
  if(demo.tab==='bookings')return data.reservations.map(b=>`<article class="journey-record"><header><strong>${esc(b.name)} · ${esc(tableLabel(b.table,lang))}</strong><span class="journey-status">${esc(status(b.status))}</span></header><p>${esc(formatBooking(b.date,b.time,lang))} · ${esc(partyLabel(b.partySize,lang))}</p></article>`).join('');
  return `<div class="journey-menu-list">${data.items.map(item=>`<article class="journey-menu-item"><img src="jumo/${esc(item.image)}" alt="" width="60" height="60" loading="lazy"><div><b>${esc(item.name[lang])}</b><span>${esc(formatMoney(item.price,lang))}</span></div></article>`).join('')}</div>`;
 }
 function screen(){
  const step=demo.step;
  if(step==='login'||step==='signin')return `<div class="journey-login">${brandMark('greeting',true)}<p class="journey-eyebrow">주모 · JUMO</p><h3 tabindex="-1" id="journey-screen-heading">${esc(step==='login'?a.login:c.signin)}</h3><p>${esc(step==='login'?r.title:r.doneTitle)}</p>${fauxField(u.email,'owner@example.com')}${fauxField(a.password,'••••••••••••')}${advanceButton(step==='login'?r.forgot:a.login)}<small>${esc(c.sample)}</small></div>`;
  if(step==='email')return `<div class="journey-login">${brandMark('thinking',true)}<h3 tabindex="-1" id="journey-screen-heading">${esc(r.title)}</h3><p>${esc(r.intro)}</p>${fauxField(r.email,'owner@example.com')}${advanceButton(r.send)}<small>${esc(c.sample)}</small></div>`;
  if(step==='inbox')return `<div class="journey-login"><div class="journey-mail-icon">${glyph('mail')}</div><h3 tabindex="-1" id="journey-screen-heading">${esc(r.inboxTitle)}</h3><p>${esc(r.inboxNote)}</p><article class="journey-mail"><header><b>one shop ai</b><small>${esc(r.to)} · owner@example.com</small></header><h4>${esc(r.subject)}</h4><p>${esc(r.mailBody)}</p>${advanceButton(r.open)}</article></div>`;
  if(step==='password')return `<div class="journey-login">${brandMark('thinking',true)}<h3 tabindex="-1" id="journey-screen-heading">${esc(r.passwordTitle)}</h3><p>${esc(r.passwordNote)}</p>${fauxField(r.passwordStep,'••••••••••••')}${fauxField(a.confirm,'••••••••••••')}${advanceButton(r.save)}<small>${esc(c.sample)}</small></div>`;
  return `<div class="journey-dashboard"><div class="journey-dashboard-heading">${brandMark('order',true)}<div><small>주모 · JUMO</small><h3 tabindex="-1" id="journey-screen-heading">${esc(r.shopTitle)}</h3></div></div><p class="journey-preserved">${icon('check')}${esc(r.preserved)}</p>${metrics()}<div class="journey-tabs" role="tablist" aria-label="${esc(r.shopTitle)}">${OWNER_JOURNEY_TABS.map(key=>button('tab-'+key,r[key],'',`role="tab" id="journey-tab-${key}" aria-selected="${demo.tab===key}" aria-controls="journey-records" tabindex="${demo.tab===key?0:-1}"`)).join('')}</div><div class="journey-records" id="journey-records" role="tabpanel" aria-labelledby="journey-tab-${demo.tab}" tabindex="0">${records()}</div>${step==='shop'?advanceButton(c.check):''}</div>`;
 }

 host.innerHTML=`<header class="journey-intro"><div><span class="journey-eyebrow">one shop ai · Rami</span><h2 id="owner-journey-title">${esc(c.title).replace('\n','<br>')}</h2><p>${esc(c.lead)}</p></div><span class="journey-demo-badge">${icon('profile')}${esc(c.badge)}</span></header><div class="journey-toolbar" role="group" aria-label="${esc(s.progress)}">${button('play',s.start,glyph('play'),'class="journey-primary"')}${button('previous',c.previous,glyph('back'))}${button('next',s.next,glyph('next'))}${button('restart',s.restart,glyph('restart'))}</div><p class="journey-manual">${esc(c.manual)}</p><ol class="journey-steps" aria-label="${esc(s.progress)}">${labels.map((label,i)=>`<li>${button('step-'+i,label,`<i>${String(i+1).padStart(2,'0')}</i>`)}</li>`).join('')}</ol><div class="journey-narration"><div class="journey-rami"></div><div><span>${esc(c.guide)} <b class="journey-counter"></b></span><p role="status" aria-live="polite" aria-atomic="true" class="journey-note"></p></div></div><div class="journey-layout"><div class="journey-device"><header>${brandLogo()}<span>${esc(u.demo)}</span></header><div class="journey-screen"></div></div><aside class="journey-vault" aria-label="${esc(c.saved)}"><span class="journey-eyebrow">주모 · JUMO</span><h3>${esc(c.saved)}</h3><p>${esc(r.passwordNote)}</p><table><thead><tr><th scope="col">${esc(r.shop)}</th><th scope="col">${esc(c.before)}</th><th scope="col">${esc(c.after)}</th></tr></thead><tbody>${[['menu',data.items.length],['orders',data.orders.length],['bookings',data.reservations.length]].map(([key,n])=>`<tr><th scope="row">${esc(r[key])}</th><td>${n}</td><td data-after="${n}">—</td></tr>`).join('')}</tbody></table><p class="journey-vault-state"></p><div class="journey-record-preview"><span>${esc(r.orders)}</span>${data.orders.map(order=>`<p><b>#${order.number}</b><span>${esc(order.fulfillment.channel==='online'?o.onlineOrder:tableLabel(order.table,lang))}</span></p>`).join('')}</div><small>${esc(sample.sampleAddress)}</small></aside></div><p class="journey-notice">${icon('spark')}${esc(c.notice)}</p><div class="journey-links"><a href="jumo/recovery.html?lang=${lang}&v=5.13.0">${esc(r.tryDemo)}${icon('arrow')}</a><a href="jumo/owner.html?lang=${lang}&v=5.13.0">${esc(a.login)}${icon('arrow')}</a></div>`;
 const area=host.querySelector('.journey-screen'),play=host.querySelector('[data-journey="play"]');
 function render(){
  if(disposed)return;
  const focus=document.activeElement,focusedTab=area.contains(focus)&&focus?.getAttribute('role')==='tab'?focus.dataset.journey:null;
  play.innerHTML=glyph(player.running?'pause':'play')+`<span>${esc(player.running?s.pause:demo.complete||demo.phase===0?s.start:s.resume)}</span>`;
  play.setAttribute('aria-pressed',String(player.running));
  host.querySelector('[data-journey="previous"]').disabled=demo.phase===0;
  host.querySelector('[data-journey="next"]').disabled=demo.complete;
  host.querySelectorAll('.journey-steps button').forEach((b,i)=>{b.classList.toggle('reached',i<demo.phase);if(i===demo.phase)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});
  host.querySelector('.journey-counter').textContent=`${String(demo.phase+1).padStart(2,'0')} / 07`;
  host.querySelector('.journey-note').textContent=c.notes[demo.phase];
  host.querySelector('.journey-rami').innerHTML=brandMark(demo.phase<1||demo.phase>=4?'greeting':'thinking',true);
  host.querySelectorAll('[data-after]').forEach(el=>{el.textContent=demo.phase>=5?el.dataset.after:'—';});
  host.querySelector('.journey-vault-state').innerHTML=icon(demo.phase>=5?'check':'orders')+esc(demo.phase>=5?c.same:c.saved);
  host.dataset.phase=demo.phase;area.innerHTML=screen();
  if(focusedTab)area.querySelector(`[data-journey="${focusedTab}"]`)?.focus({preventScroll:true});
 }
 const manual=fn=>{player.dispose();fn();render();};
 function click(event){
  const b=event.target.closest('[data-journey]');if(!b||!host.contains(b))return;const action=b.dataset.journey;
  if(action==='play'){if(player.running){player.pause();return;}if(demo.complete)demo.restart();document.dispatchEvent(new CustomEvent('one-shop-demo-play',{detail:'owner'}));player.play();host.querySelector('.journey-narration').scrollIntoView({block:'start',behavior:'instant'});return;}
  const wasScreen=area.contains(b);
  if(action==='next'||action==='advance')manual(()=>demo.advance(action==='advance'?Number(b.dataset.expected):demo.phase));
  else if(action==='previous')manual(()=>demo.back());
  else if(action==='restart')manual(()=>demo.restart());
  else if(action.startsWith('step-'))manual(()=>demo.go(Number(action.slice(5))));
  else if(action.startsWith('tab-')){manual(()=>demo.selectTab(action.slice(4)));area.querySelector(`[data-journey="${action}"]`)?.focus({preventScroll:true});return;}
  if(wasScreen)area.querySelector('h3')?.focus({preventScroll:true});
 }
 function keydown(event){
  if(event.target.getAttribute('role')!=='tab'||!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
  event.preventDefault();const i=OWNER_JOURNEY_TABS.indexOf(demo.tab),n=OWNER_JOURNEY_TABS.length;
  const next=event.key==='Home'?0:event.key==='End'?n-1:(i+(event.key==='ArrowRight'?1:n-1))%n;
  manual(()=>demo.selectTab(OWNER_JOURNEY_TABS[next]));area.querySelector(`[data-journey="tab-${demo.tab}"]`)?.focus();
 }
 const pause=()=>{if(player.running)player.pause();};
 const hidden=()=>{if(document.hidden)pause();};
 const otherPlayer=event=>{if(event.detail!=='owner')pause();};
 const focus=event=>{if(area.contains(event.target))pause();};
 const observer=new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)pause();});observer.observe(host);
 host.addEventListener('click',click);host.addEventListener('keydown',keydown);host.addEventListener('focusin',focus);
 document.addEventListener('visibilitychange',hidden);document.addEventListener('one-shop-demo-play',otherPlayer);reduced.addEventListener('change',pause);
 render();
 return ()=>{disposed=true;player.dispose();observer.disconnect();host.removeEventListener('click',click);host.removeEventListener('keydown',keydown);host.removeEventListener('focusin',focus);document.removeEventListener('visibilitychange',hidden);document.removeEventListener('one-shop-demo-play',otherPlayer);reduced.removeEventListener('change',pause);};
}
