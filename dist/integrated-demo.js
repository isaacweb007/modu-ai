import {NEGOTIATION_COPY} from './shared/negotiation-copy.js?v=5.21.0';
import {PROPOSAL_COPY,proposalResult} from './shared/proposal-copy.js?v=5.21.0';
import {REJECTION_COPY,reasonMessage} from './shared/rejection-copy.js?v=5.21.0';
import {amendmentPanel} from './integrated-amendments.js?v=5.21.0';
import {AMENDMENT_COPY,amendmentResult} from './shared/amendment-copy.js?v=5.21.0';
import {requestForm} from './integrated-request-form.js?v=5.21.0';
import {REQUEST_COPY} from './shared/integrated-request-copy.js?v=5.17.0';
import {createIntegratedDemo,INTEGRATED_SCENARIOS,integratedQr} from './shared/integrated-demo-state.js?v=5.21.0';
import {INTEGRATED_COPY} from './shared/integrated-demo-copy.js?v=5.41.0';
import {showcaseViews,SHOWCASE_COPY} from './showcase.js?v=5.21.0';
import {shopSetupScreen,SHOP_SETUP_COPY} from './shop-setup.js?v=5.16.0';
import {SETUP_PHOTO,setupLanguage} from './shared/shop-setup-state.js?v=5.14.0';
import {createShowcasePlayer,SHOWCASE_PANES} from './shared/showcase-state.js?v=5.11.0';
import {flowCopy} from './shared/flow-copy.js?v=5.11.0';
import {expansionCopy} from './shared/expansion-copy.js?v=5.8.0';
import {UI} from './shared/copy.js?v=5.6.0';
import {LANGS,tableLabel,formatMoney} from './shared/locale.js?v=5.6.0';
import {esc,icon} from './shared/core.js?v=5.6.0';
import {brandMark,brandLogo} from './shared/brand.js?v=5.6.0';
export {INTEGRATED_COPY};
let journey;
export const integratedDemoShell=()=>'<section id="integrated-demo" class="book-showcase owner-journey integrated-demo" aria-labelledby="integrated-title"></section>';
const playbackIcon=running=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true">${running?'<path d="M8 5v14M16 5v14"/>':'<path d="m8 5 11 7-11 7Z"/>'}</svg>`;

export function bindIntegratedDemo(host,language='ko') {
 if(!host)return ()=>{};
 journey??=createIntegratedDemo(new URLSearchParams(location.search).get('scenario'));
 const demo=journey,lang=setupLanguage(language),c=INTEGRATED_COPY[lang],s=SHOWCASE_COPY[lang],a=SHOP_SETUP_COPY[lang],e=expansionCopy(lang),f=flowCopy(lang),u=UI[lang],r=REQUEST_COPY[lang],m=AMENDMENT_COPY[lang];
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');let disposed=false,pane=demo.actor;
 const button=(action,label,graphic='',attrs='')=>`<button type="button" data-integrated="${action}" ${attrs}>${graphic}<span>${esc(label)}</span></button>`;
 const step=()=>{const changed=demo.phase===3?demo.confirm():demo.advance();pane=demo.actor;return changed;};
 const player=createShowcasePlayer({delay:4200,advance:()=>{const changed=step();return changed&&!demo.complete;},onChange:render});
 const booking=()=>demo.scenario==='booking';
 const stageLabels=()=>[...a.steps,e.languageStep,r.title,...(booking()?e.bookingSteps.slice(0,3):s.stepLabels.slice(0,3)),booking()?e.bookingConfirm:s.confirm,s.floor+' · '+(booking()?e.bookingAccept:s.accept),...(booking()?[s.guest+' · '+e.bookingConfirmed]:[s.kitchen+' · '+s.prepare,s.guest+' · '+u.ready])];
 const groups=['registration','approval','arrival','conversation','service'];
 const done=()=>demo.cancelled?m.cancelled:demo.snapshot()?.readyMessages[lang]||c.done;
 const note=()=>{
  if(demo.cancelled)return m.cancelled;
  if(demo.editing)return demo.countering?NEGOTIATION_COPY[lang].hint:m.editNote;
  if(demo.amendment?.status==='pending')return `${demo.amendment.sourceProposalId?NEGOTIATION_COPY[lang].waiting:m.pending} · ${m[demo.amendment.requiredRole==='owner'?'ownerOnly':'staffCan']} ${m.holding}`;
  if(demo.proposal)return `${proposalResult(demo.proposal,lang)} · ${demo.proposal.status==='pending'?PROPOSAL_COPY[lang].hold:demo.snapshot().summaries[lang]}`;
  if(demo.amendment)return `${amendmentResult(demo.amendment,lang)} · ${demo.snapshot().summaries[lang]}`;
  if(demo.phase===7)return r.flowNote;
  if(demo.phase>=8)return demo.complete?done():`${stageLabels()[demo.phase]} · ${demo.snapshot().summaries[lang]}`;
  const requestNotes=demo.scenario==='dineIn'?s.stepNotes:e[demo.scenario+'Notes'];
  return [a.lead,a.attached,a.reading,a.review,a.approved,c.scan,demo.scenario==='dineIn'&&demo.guestLang==='vi'?c.scanned:e.languageNote,booking()?e.bookingNotes[0]:demo.scenario==='delivery'?e.deliveryWaiting:demo.guestLang==='vi'?c.menuNote:s.emptyGuest,...requestNotes.slice(0,4),booking()?s.floor+' · '+e.bookingConfirmed:f.acceptedByFloor,...(booking()?[done()]:[s.kitchen+' · '+s.prepare,done()])][demo.phase];
 };
 const mood=()=>demo.phase===2||demo.phase===3||demo.phase===9?'thinking':demo.phase>=11&&!demo.complete?'order':'greeting';
 const menuSummary=()=>`<details class="integrated-origin"><summary>${icon('check')} ${esc(a.steps[4])} · ${esc(a.count)} · ${esc(a.currency)}</summary><div>${demo.menu().map(item=>`<p><span>${esc(item.name[lang])}</span><b>${esc(formatMoney(item.price,lang))}</b></p>`).join('')}</div></details>`;
 function scene(){
  if(demo.phase<6)return `<div class="setup-layout"><figure class="setup-source"><div class="setup-source-heading"><span>${esc(a.source)}</span><b>JUMO</b></div><a href="${SETUP_PHOTO}" target="_blank" rel="noopener noreferrer" aria-label="${esc(a.photoNote)}"><img src="${SETUP_PHOTO}" alt="${esc(a.photo)}" width="1088" height="1448" loading="lazy"></a><figcaption>${esc(a.photoNote)}</figcaption></figure><div class="journey-device setup-device"><header>${brandLogo()}<span>${esc(s.owner)}</span></header><div class="setup-app-body">${demo.phase===5?button('scan',c.scan,icon('qr'),'class="integrated-scan"'):''}${shopSetupScreen(demo.setupView(),lang,{qr:integratedQr(lang,demo.scenario)})}</div></div></div><p class="integrated-waiting">${icon('chat')}${esc(c.waiting)}</p>`;
  const state=demo.serviceState(),snapshot=demo.snapshot(),views=showcaseViews(state,lang,{lounge:false,editing:demo.editing,blockActions:demo.blocked,afterContent:kind=>amendmentPanel(demo,kind),guestEditor:()=>requestForm(demo,demo.editing?{copy:{...AMENDMENT_COPY[demo.guestLang],title:AMENDMENT_COPY[demo.guestLang].change,hint:AMENDMENT_COPY[demo.guestLang].editNote},footer:`<button type="button" data-amendment="discard" class="amendment-discard">${esc(demo.countering?NEGOTIATION_COPY[demo.guestLang].discard:AMENDMENT_COPY[demo.guestLang].discard)}</button>`}:{})});
  return `${menuSummary()}${demo.phase>=8?`<div class="integrated-edit">${button('edit',demo.phase>=11?m.change:r.edit,icon('menu'),demo.phase>=11&&!demo.canManage?'disabled':'')}${demo.phase>=11?button('cancel',m.cancel,icon('close'),!demo.canManage?'disabled':''):''}<p>${esc(demo.phase>=11?m.policy:r.changed)}</p></div>`:''}<div class="show-tabs" role="group" aria-label="${esc(s.progress)}">${SHOWCASE_PANES.map(key=>button('pane-'+key,s[key],'',`aria-pressed="${pane===key}"`)).join('')}</div><p class="integrated-panels-note">${esc(f.panesNote)}</p><div class="show-overview" aria-label="${esc(s.progress)}">${SHOWCASE_PANES.map(key=>`<div class="${demo.actor===key?'current':''}"><b>${esc(s[key])}</b><span>${esc(snapshot.booking?(key==='kitchen'?'—':snapshot.booking.status==='cancelled'?m.cancelledLabel:snapshot.booking.status==='confirmed'?e.bookingConfirmed:u.pending):snapshot.order?snapshot.order.status==='cancelled'?m.cancelledLabel:u[snapshot.order.status]:stageLabels()[demo.phase])}</span></div>`).join('')}</div><div class="show-pair">${SHOWCASE_PANES.map(key=>views.appPane(key,snapshot)).join('')}</div><p class="show-language-note">${esc(s.languageNote)}</p>${demo.complete?`<p class="integrated-finished">${icon('check')}${esc(done())}</p>`:''}`;
 }
 host.innerHTML=`<header class="journey-intro"><div><span class="journey-eyebrow">one shop ai · Rami</span><h2 id="integrated-title">${esc(c.title).replace('\n','<br>')}</h2><p>${esc(c.lead)}</p><p>${esc(r.flowNote)}</p><details class="integrated-policy"><summary>${esc(m.guestActions)}</summary><p>${esc(m.policy)}</p><p>${esc(m.editNote)}</p><p>${esc(REJECTION_COPY[lang].policy)}</p><p>${esc(PROPOSAL_COPY[lang].policy)}</p><p>${esc(NEGOTIATION_COPY[lang].policy)}</p></details></div><span class="journey-demo-badge">${icon('spark')}${esc(a.badge)}</span></header><div class="integrated-scenarios" role="group" aria-label="${esc(e.scenario)}">${INTEGRATED_SCENARIOS.map(key=>button('scenario-'+key,e[key],icon(key==='dineIn'?'menu':key==='booking'?'profile':'globe'),`aria-pressed="${demo.scenario===key}" aria-describedby="integrated-scenario-note"`)).join('')}</div><p id="integrated-scenario-note" class="integrated-scenario-note">${esc(c.scenarioHint)}</p><div class="integrated-toolbar" role="group" aria-label="${esc(s.progress)}">${button('play',c.start,playbackIcon(false),'class="integrated-primary"')}${button('previous',a.previous)}${button('next',s.next,icon('arrow'))}${button('restart',s.restart)}</div><p class="journey-manual">${esc(c.manual)}</p><ol class="integrated-groups">${groups.map((key,i)=>`<li><span>${String(i+1).padStart(2,'0')}</span>${esc(c[key])}</li>`).join('')}</ol><div class="integrated-progress" role="progressbar" aria-label="${esc(s.progress)}" aria-valuemin="1" aria-valuemax="${demo.steps.length}"><i></i></div><div class="integrated-narration"><div class="integrated-rami"></div><div><span class="integrated-counter"></span><h3 class="integrated-step"></h3><p role="status" aria-live="polite" aria-atomic="true" class="integrated-note"></p></div></div><div class="integrated-context"><strong>주모 · JUMO</strong><span class="integrated-context-state"></span><small>${esc(c.same)}</small></div><div class="integrated-scene"></div><p class="journey-notice">${icon('spark')}${esc(s.notice)} ${esc(a.notice)}</p><nav class="integrated-links" aria-label="${esc(c.details)}"><span>${esc(c.details)}</span><a href="#setup-demo">${esc(a.nav)}${icon('arrow')}</a><a href="#live-demo">${esc(s.title)}${icon('arrow')}</a></nav>`;
 const area=host.querySelector('.integrated-scene'),play=host.querySelector('[data-integrated="play"]');
 const followScene=()=>{const target=matchMedia('(max-width:760px)').matches?area.querySelector(demo.phase<6?'.setup-device':'.show-pair'):host.querySelector('.integrated-narration');target?.scrollIntoView({block:'start',behavior:'instant'});};
 function render(){
  if(disposed)return;
  const oldPhase=Number(host.dataset.phase),focused=area.contains(document.activeElement)?document.activeElement:null,focusAction=focused?.dataset.integrated,focusLang=focused?.dataset.entryLang;
  host.dataset.phase=demo.phase;host.dataset.editing=demo.editing;host.dataset.countering=demo.countering;host.dataset.amendment=demo.amendment?.status||'';host.dataset.proposal=demo.proposal?.status||'';host.dataset.scenario=demo.scenario;host.dataset.activePane=pane;host.dataset.stage=demo.phase<6?'setup':'service';area.dataset.run=demo.runId;area.dataset.revision=demo.revision;
  play.innerHTML=playbackIcon(player.running)+`<span>${esc(player.running?s.pause:demo.complete||demo.phase===0?c.start:s.resume)}</span>`;play.setAttribute('aria-pressed',String(player.running));play.disabled=demo.blocked&&!demo.cancelled;
  host.querySelector('[data-integrated="previous"]').disabled=!demo.canBack;
  const next=host.querySelector('[data-integrated="next"]');next.disabled=demo.complete||demo.blocked;next.innerHTML=`<span>${esc(demo.phase===3?a.confirm:demo.phase===5?c.scan:s.next)}</span>${icon('arrow')}`;
  host.querySelectorAll('.integrated-scenarios button').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.integrated==='scenario-'+demo.scenario)));
  host.querySelectorAll('.integrated-groups li').forEach((el,i)=>{el.classList.toggle('reached',i<demo.group);if(i===demo.group)el.setAttribute('aria-current','step');else el.removeAttribute('aria-current');});
  host.querySelector('.integrated-progress').setAttribute('aria-valuemax',demo.steps.length);
  host.querySelector('.integrated-progress').setAttribute('aria-valuenow',demo.phase+1);host.querySelector('.integrated-progress i').style.width=`${(demo.phase+1)/demo.steps.length*100}%`;
  host.querySelector('.integrated-counter').textContent=`${String(demo.phase+1).padStart(2,'0')} / ${demo.steps.length} · ${c.watch} · ${s[demo.actor]}`;
  host.querySelector('.integrated-step').textContent=demo.cancelled?m.cancelledLabel:demo.editing?(demo.countering?NEGOTIATION_COPY[lang].title:m.change):demo.proposal?.status==='pending'?PROPOSAL_COPY[lang].pending:demo.amendment?.status==='pending'?(demo.amendment.sourceProposalId?NEGOTIATION_COPY[lang].waiting:m.pending):demo.amendment?.agreementSummaries?NEGOTIATION_COPY[lang].agreementTitle:stageLabels()[demo.phase];host.querySelector('.integrated-note').textContent=note();host.querySelector('.integrated-rami').innerHTML=brandMark(mood(),true);
  host.querySelector('.integrated-context-state').textContent=`${e[demo.scenario]} · ${a.count}`+(demo.phase<5?'':demo.phase<6?' · QR':` · ${demo.scenario==='dineIn'?tableLabel(7,lang):e.online} · ${LANGS[demo.guestLang]}`);
  area.innerHTML=scene();
  if(demo.phase>=6)area.querySelectorAll('.show-thread').forEach(el=>{
   const role=el.closest('[data-pane]').dataset.pane;
   el.scrollTop=demo.phase===6||demo.phase===7||demo.editing&&role==='guest'?0:el.scrollHeight;
   const latest=demo.amendment?.processedAt&&!demo.editing?el.querySelector(demo.proposal?(role==='owner'?'.proposal-audit':'.proposal-card'):(role==='owner'&&!demo.amendment.agreementSummaries?'.amendment-owner-history':'.amendment-card')):null;
   if(latest)el.scrollTop+=latest.getBoundingClientRect().top-el.getBoundingClientRect().top-12;
  });
  if(focusAction)area.querySelector(`[data-integrated="${focusAction}"]`)?.focus({preventScroll:true});
  else if(focusLang)area.querySelector(`[data-entry-lang="${focusLang}"]`)?.focus({preventScroll:true});
  else if(focused&&oldPhase!==demo.phase){host.querySelector('[data-integrated="next"]').focus({preventScroll:true});}
  if(player.running&&oldPhase!==demo.phase)followScene();
 }
 const manual=fn=>{player.dispose();fn();render();if((demo.phase===7||demo.editing)&&Object.keys(demo.errors).length)area.querySelector('.request-errors')?.focus();};
 async function click(event){
  const errorLink=event.target.closest('.request-errors a');if(errorLink){event.preventDefault();area.querySelector(errorLink.getAttribute('href'))?.focus();return;}
  const b=event.target.closest('button');if(!b||!host.contains(b)||b.disabled)return;
  const action=b.dataset.integrated,run=area.dataset.run;
  if(action?.startsWith('scenario-')){manual(()=>{if(demo.selectScenario(action.slice(9))){pane=demo.actor;const url=new URL(location.href);url.searchParams.set('scenario',demo.scenario);url.hash='integrated-demo';history.replaceState(null,'',url);}});return;}
  if(action==='play'){if(player.running){player.pause();return;}if(demo.complete)demo.restart();pane=demo.actor;document.dispatchEvent(new CustomEvent('one-shop-demo-play',{detail:'integrated'}));player.play();followScene();return;}
  if(action==='cancel'){manual(()=>{demo.requestCancel();pane=demo.actor;});followScene();return;}
  if(b.dataset.proposal){
   if(b.dataset.run!==demo.runId||Number(b.dataset.revision)!==demo.revision)return;
   const kind=b.dataset.proposal,role=b.dataset.actor;
   manual(()=>{
    if(kind==='compose')demo.beginProposal(role,b.dataset.requestId,b.dataset.run,Number(b.dataset.revision));
    else if(kind==='discard')demo.discardProposal(role,b.dataset.requestId,b.dataset.run,Number(b.dataset.revision));
    else if(kind==='counter')demo.beginCounterProposal(b.dataset.proposalId,role,b.dataset.run,Number(b.dataset.revision));
    else if(kind==='accept'||kind==='decline')demo.respondProposal(b.dataset.proposalId,kind==='accept'?'accepted':'declined',role,b.dataset.run,Number(b.dataset.revision));
    pane=role;
   });
   if(kind==='compose')area.querySelector(`[data-proposal-editor="${role}"] input`)?.focus();else if(kind==='discard')area.querySelector(`[data-pane="${role}"] [data-proposal="compose"]`)?.focus();else followScene();return;
  }
  if(b.dataset.amendment){
   const kind=b.dataset.amendment;if(kind==='discard'){manual(()=>{demo.discardChange();pane='guest';});return;}
   if(b.dataset.run!==demo.runId||Number(b.dataset.revision)!==demo.revision)return;
   let handled=false;
   manual(()=>{
    if(kind==='change')demo.beginChange();else if(kind==='cancel')demo.requestCancel();
    else if(kind==='approve'||kind==='reject')handled=demo.resolveAmendment(b.dataset.requestId,kind==='approve'?'approved':'rejected',b.dataset.actor,b.dataset.run,Number(b.dataset.revision));
    pane=kind==='approve'||kind==='reject'?(handled?'guest':b.dataset.actor):demo.actor;
   });
   if(kind==='approve'&&!handled&&demo.reviewDraft(b.dataset.actor).approvalError){area.querySelector(`[data-pane="${b.dataset.actor}"] .negotiation-error`)?.focus();}else if(kind==='reject'&&!handled){const invalid=demo.reviewDraft(b.dataset.actor).error?area.querySelector(`#rejection-reason-${b.dataset.actor}`):area.querySelector(`[data-proposal-editor="${b.dataset.actor}"] .proposal-errors`);invalid?.focus();}else followScene();return;
  }
  if(action==='edit'){manual(()=>{demo.edit();pane='guest';});followScene();return;}
  if(action==='next'){manual(step);return;}
  if(action==='previous'){manual(()=>{demo.back();pane=demo.actor;});return;}
  if(action==='restart'){manual(()=>{demo.restart();pane=demo.actor;});return;}
  if(action==='scan'){manual(()=>{demo.advance(5,'owner',run);pane=demo.actor;});return;}
  if(action?.startsWith('pane-')&&SHOWCASE_PANES.includes(action.slice(5))){manual(()=>{pane=action.slice(5);});return;}
  if(b.dataset.entryLang){manual(()=>demo.selectLanguage(b.dataset.entryLang));return;}
  if(b.dataset.action==='guest-enter'){manual(()=>{demo.advance(6,'guest',run);pane=demo.actor;});return;}
  if(b.dataset.showAction==='advance'){manual(()=>{demo.advance(Number(b.dataset.expected)+6,b.dataset.actor,run,Number(b.dataset.revision??area.dataset.revision));pane=demo.actor;});return;}
  if(b.dataset.setup==='confirm'){manual(()=>{demo.confirm(Number(b.dataset.expected),run);pane=demo.actor;});return;}
  if(b.dataset.setup==='advance'){manual(()=>demo.advance(Number(b.dataset.expected),'owner',run));return;}
  if(b.dataset.setup==='copy'){
   const url=demo.link(lang),node=area.querySelector('.setup-copy-status');if(!url||!node)return;
   try{await navigator.clipboard.writeText(url);if(node.isConnected)node.textContent=a.copied;}catch{if(node.isConnected)node.textContent=a.copyFailed;}
  }
 }
 function input(event){const field=event.target;
  if(field.matches('[data-proposal-field]')){
   if(!demo.setProposalField(field.dataset.actor,field.name,field.value,field.dataset.requestId,field.dataset.run,Number(field.dataset.revision)))return;
   const box=field.closest('.proposal-editor'),view=demo.proposalDraftView(field.dataset.actor),total=box.querySelector('[data-proposal-total]');
   if(total)total.textContent=view?formatMoney(view.total,'ko'):'—';
   box.querySelector('[data-proposal-preview]').textContent=view?.summaries[demo.guestLang]||REQUEST_COPY.ko.errors;return;
  }
  if(field.matches('[data-rejection-reason]')){
   if(!demo.selectReason(field.dataset.actor,field.value,field.dataset.requestId,field.dataset.run,Number(field.dataset.revision)))return;
   const box=field.closest('.amendment-rejection'),preview=box.querySelector('.rejection-preview');
   field.setAttribute('aria-invalid','false');box.querySelector('.rejection-error').hidden=true;preview.hidden=!field.value;
   preview.querySelector('[data-rejection-preview]').textContent=field.value?AMENDMENT_COPY[demo.guestLang].rejected+' '+reasonMessage(field.value,demo.guestLang):'';return;
  }
  if(!field.closest('.integrated-request-form'))return;demo.setField(field.name,field.value);const output=area.querySelector('[data-request-total]');if(output){const draft=demo.draft(),total=demo.menu().reduce((sum,m)=>{const q=Number(draft.quantities[m.id]);return sum+(Number.isInteger(q)&&q>=0&&q<=20?q*m.price:0);},0);output.textContent=formatMoney(total,demo.guestLang);}}
 function focus(event){if(!event.target.closest('.integrated-request-form')||!player.running)return;player.dispose();play.innerHTML=playbackIcon(false)+`<span>${esc(s.resume)}</span>`;play.setAttribute('aria-pressed','false');}
 function submit(event){if(!event.target.matches('.integrated-request-form'))return;event.preventDefault();manual(()=>{if(demo.editing){demo.submitChange();pane=demo.actor;}else step();});if(demo.phase!==7&&!demo.editing)followScene();}
 const pause=()=>{if(player.running)player.pause();},hidden=()=>{if(document.hidden)pause();},other=e=>{if(e.detail!=='integrated')pause();};
 const observer=new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)pause();});observer.observe(host);
 host.addEventListener('input',input);host.addEventListener('change',input);host.addEventListener('focusin',focus);host.addEventListener('submit',submit);host.addEventListener('click',click);document.addEventListener('visibilitychange',hidden);document.addEventListener('one-shop-demo-play',other);reduced.addEventListener('change',pause);render();
 return ()=>{disposed=true;player.dispose();observer.disconnect();host.removeEventListener('input',input);host.removeEventListener('change',input);host.removeEventListener('focusin',focus);host.removeEventListener('submit',submit);host.removeEventListener('click',click);document.removeEventListener('visibilitychange',hidden);document.removeEventListener('one-shop-demo-play',other);reduced.removeEventListener('change',pause);};
}
