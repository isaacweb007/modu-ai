import {createIntegratedDemo,INTEGRATED_STEPS} from './shared/integrated-demo-state.js?v=5.15.0';
import {INTEGRATED_COPY} from './shared/integrated-demo-copy.js?v=5.15.0';
import {showcaseViews,SHOWCASE_COPY} from './showcase.js?v=5.15.0';
import {shopSetupScreen,SHOP_SETUP_COPY} from './shop-setup.js?v=5.15.0';
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
 journey??=createIntegratedDemo();
 const demo=journey,lang=setupLanguage(language),c=INTEGRATED_COPY[lang],s=SHOWCASE_COPY[lang],a=SHOP_SETUP_COPY[lang],e=expansionCopy(lang),f=flowCopy(lang),u=UI[lang];
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');let disposed=false,pane=demo.actor;
 const button=(action,label,graphic='',attrs='')=>`<button type="button" data-integrated="${action}" ${attrs}>${graphic}<span>${esc(label)}</span></button>`;
 const step=()=>{const changed=demo.phase===3?demo.confirm():demo.advance();pane=demo.actor;return changed;};
 const player=createShowcasePlayer({delay:4200,advance:()=>{step();return !demo.complete;},onChange:render});
 const stageLabels=[...a.steps,e.languageStep,u.menu,s.stepLabels[0],s.stepLabels[1],s.stepLabels[2],s.confirm,s.floor+' · '+s.accept,s.kitchen+' · '+s.prepare,s.guest+' · '+u.ready];
 const groups=['registration','approval','arrival','conversation','service'];
 const note=()=>[a.lead,a.attached,a.reading,a.review,a.approved,c.scan,demo.guestLang==='vi'?c.scanned:e.languageNote,demo.guestLang==='vi'?c.menuNote:s.emptyGuest,s.stepNotes[0],s.stepNotes[1],s.stepNotes[2],s.stepNotes[3],f.acceptedByFloor,s.kitchen+' · '+s.prepare,c.done][demo.phase];
 const mood=()=>demo.phase===2||demo.phase===3||demo.phase===9?'thinking':demo.phase>=11&&demo.phase<14?'order':'greeting';
 const menuSummary=()=>`<details class="integrated-origin"><summary>${icon('check')} ${esc(a.steps[4])} · ${esc(a.count)} · ${esc(a.currency)}</summary><div>${demo.menu().map(item=>`<p><span>${esc(item.name[lang])}</span><b>${esc(formatMoney(item.price,lang))}</b></p>`).join('')}</div></details>`;
 function scene(){
  if(demo.phase<6)return `<div class="setup-layout"><figure class="setup-source"><div class="setup-source-heading"><span>${esc(a.source)}</span><b>JUMO</b></div><a href="${SETUP_PHOTO}" target="_blank" rel="noopener noreferrer" aria-label="${esc(a.photoNote)}"><img src="${SETUP_PHOTO}" alt="${esc(a.photo)}" width="1088" height="1448" loading="lazy"></a><figcaption>${esc(a.photoNote)}</figcaption></figure><div class="journey-device setup-device"><header>${brandLogo()}<span>${esc(s.owner)}</span></header><div class="setup-app-body">${demo.phase===5?button('scan',c.scan,icon('qr'),'class="integrated-scan"'):''}${shopSetupScreen(demo.setupView(),lang)}</div></div></div><p class="integrated-waiting">${icon('chat')}${esc(c.waiting)}</p>`;
  const state=demo.serviceState(),snapshot=demo.snapshot(),views=showcaseViews(state,lang,{lounge:false});
  return `${menuSummary()}<div class="show-tabs" role="group" aria-label="${esc(s.progress)}">${SHOWCASE_PANES.map(key=>button('pane-'+key,s[key],'',`aria-pressed="${pane===key}"`)).join('')}</div><p class="integrated-panels-note">${esc(f.panesNote)}</p><div class="show-overview" aria-label="${esc(s.progress)}">${SHOWCASE_PANES.map(key=>`<div class="${demo.actor===key?'current':''}"><b>${esc(s[key])}</b><span>${esc(snapshot.order?u[snapshot.order.status]:stageLabels[demo.phase])}</span></div>`).join('')}</div><div class="show-pair">${SHOWCASE_PANES.map(key=>views.appPane(key,snapshot)).join('')}</div><p class="show-language-note">${esc(s.languageNote)}</p>${demo.complete?`<p class="integrated-finished">${icon('check')}${esc(c.done)}</p>`:''}`;
 }
 host.innerHTML=`<header class="journey-intro"><div><span class="journey-eyebrow">one shop ai · Rami</span><h2 id="integrated-title">${esc(c.title).replace('\n','<br>')}</h2><p>${esc(c.lead)}</p></div><span class="journey-demo-badge">${icon('spark')}${esc(a.badge)}</span></header><div class="integrated-toolbar" role="group" aria-label="${esc(s.progress)}">${button('play',c.start,playbackIcon(false),'class="integrated-primary"')}${button('previous',a.previous)}${button('next',s.next,icon('arrow'))}${button('restart',s.restart)}</div><p class="journey-manual">${esc(c.manual)}</p><ol class="integrated-groups">${groups.map((key,i)=>`<li><span>${String(i+1).padStart(2,'0')}</span>${esc(c[key])}</li>`).join('')}</ol><div class="integrated-progress" role="progressbar" aria-label="${esc(s.progress)}" aria-valuemin="1" aria-valuemax="15"><i></i></div><div class="integrated-narration"><div class="integrated-rami"></div><div><span class="integrated-counter"></span><h3 class="integrated-step"></h3><p role="status" aria-live="polite" aria-atomic="true" class="integrated-note"></p></div></div><div class="integrated-context"><strong>주모 · JUMO</strong><span class="integrated-context-state"></span><small>${esc(c.same)}</small></div><div class="integrated-scene"></div><p class="journey-notice">${icon('spark')}${esc(s.notice)} ${esc(a.notice)}</p><nav class="integrated-links" aria-label="${esc(c.details)}"><span>${esc(c.details)}</span><a href="#setup-demo">${esc(a.nav)}${icon('arrow')}</a><a href="#live-demo">${esc(s.title)}${icon('arrow')}</a></nav>`;
 const area=host.querySelector('.integrated-scene'),play=host.querySelector('[data-integrated="play"]');
 const followScene=()=>{const target=matchMedia('(max-width:760px)').matches?area.querySelector(demo.phase<6?'.setup-device':'.show-pair'):host.querySelector('.integrated-narration');target?.scrollIntoView({block:'start',behavior:'instant'});};
 function render(){
  if(disposed)return;
  const oldPhase=Number(host.dataset.phase),focused=area.contains(document.activeElement)?document.activeElement:null,focusAction=focused?.dataset.integrated,focusLang=focused?.dataset.entryLang;
  host.dataset.phase=demo.phase;host.dataset.activePane=pane;host.dataset.stage=demo.phase<6?'setup':'service';area.dataset.run=demo.runId;
  play.innerHTML=playbackIcon(player.running)+`<span>${esc(player.running?s.pause:demo.complete||demo.phase===0?c.start:s.resume)}</span>`;play.setAttribute('aria-pressed',String(player.running));
  host.querySelector('[data-integrated="previous"]').disabled=demo.phase===0;
  const next=host.querySelector('[data-integrated="next"]');next.disabled=demo.complete;next.innerHTML=`<span>${esc(demo.phase===3?a.confirm:demo.phase===5?c.scan:s.next)}</span>${icon('arrow')}`;
  host.querySelectorAll('.integrated-groups li').forEach((el,i)=>{el.classList.toggle('reached',i<demo.group);if(i===demo.group)el.setAttribute('aria-current','step');else el.removeAttribute('aria-current');});
  host.querySelector('.integrated-progress').setAttribute('aria-valuenow',demo.phase+1);host.querySelector('.integrated-progress i').style.width=`${(demo.phase+1)/INTEGRATED_STEPS.length*100}%`;
  host.querySelector('.integrated-counter').textContent=`${String(demo.phase+1).padStart(2,'0')} / 15 · ${c.watch} · ${s[demo.actor]}`;
  host.querySelector('.integrated-step').textContent=stageLabels[demo.phase];host.querySelector('.integrated-note').textContent=note();host.querySelector('.integrated-rami').innerHTML=brandMark(mood(),true);
  host.querySelector('.integrated-context-state').textContent=demo.phase<5?a.count:demo.phase<6?a.count+' · QR':`${a.count} · ${tableLabel(7,lang)} · ${LANGS[demo.guestLang]}`;
  area.innerHTML=scene();
  if(demo.phase>=6)area.querySelectorAll('.show-thread').forEach(el=>{el.scrollTop=demo.phase===6?0:el.scrollHeight;});
  if(focusAction)area.querySelector(`[data-integrated="${focusAction}"]`)?.focus({preventScroll:true});
  else if(focusLang)area.querySelector(`[data-entry-lang="${focusLang}"]`)?.focus({preventScroll:true});
  else if(focused&&oldPhase!==demo.phase){host.querySelector('[data-integrated="next"]').focus({preventScroll:true});}
  if(player.running&&oldPhase!==demo.phase)followScene();
 }
 const manual=fn=>{player.dispose();fn();render();};
 async function click(event){
  const b=event.target.closest('button');if(!b||!host.contains(b)||b.disabled)return;
  const action=b.dataset.integrated,run=area.dataset.run;
  if(action==='play'){if(player.running){player.pause();return;}if(demo.complete)demo.restart();pane=demo.actor;document.dispatchEvent(new CustomEvent('one-shop-demo-play',{detail:'integrated'}));player.play();followScene();return;}
  if(action==='next'){manual(step);return;}
  if(action==='previous'){manual(()=>{demo.back();pane=demo.actor;});return;}
  if(action==='restart'){manual(()=>{demo.restart();pane=demo.actor;});return;}
  if(action==='scan'){manual(()=>{demo.advance(5,'owner',run);pane=demo.actor;});return;}
  if(action?.startsWith('pane-')&&SHOWCASE_PANES.includes(action.slice(5))){manual(()=>{pane=action.slice(5);});return;}
  if(b.dataset.entryLang){manual(()=>demo.selectLanguage(b.dataset.entryLang));return;}
  if(b.dataset.action==='guest-enter'){manual(()=>{demo.advance(6,'guest',run);pane=demo.actor;});return;}
  if(b.dataset.showAction==='advance'){manual(()=>{demo.advance(Number(b.dataset.expected)+6,b.dataset.actor,run);pane=demo.actor;});return;}
  if(b.dataset.setup==='confirm'){manual(()=>{demo.confirm(Number(b.dataset.expected),run);pane=demo.actor;});return;}
  if(b.dataset.setup==='advance'){manual(()=>demo.advance(Number(b.dataset.expected),'owner',run));return;}
  if(b.dataset.setup==='copy'){
   const url=demo.link(lang),node=area.querySelector('.setup-copy-status');if(!url||!node)return;
   try{await navigator.clipboard.writeText(url);if(node.isConnected)node.textContent=a.copied;}catch{if(node.isConnected)node.textContent=a.copyFailed;}
  }
 }
 const pause=()=>{if(player.running)player.pause();},hidden=()=>{if(document.hidden)pause();},other=e=>{if(e.detail!=='integrated')pause();};
 const observer=new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)pause();});observer.observe(host);
 host.addEventListener('click',click);document.addEventListener('visibilitychange',hidden);document.addEventListener('one-shop-demo-play',other);reduced.addEventListener('change',pause);render();
 return ()=>{disposed=true;player.dispose();observer.disconnect();host.removeEventListener('click',click);document.removeEventListener('visibilitychange',hidden);document.removeEventListener('one-shop-demo-play',other);reduced.removeEventListener('change',pause);};
}
