import {createShopSetup,SETUP_PHOTO,setupLanguage} from './shared/shop-setup-state.js?v=5.14.0';
import {SHOP_SETUP_COPY} from './shared/shop-setup-copy.js?v=5.14.0';
import {createShowcasePlayer} from './shared/showcase-state.js?v=5.11.0';
import {SHOWCASE_COPY} from './shared/showcase-copy.js?v=5.8.0';
import {esc,icon} from './shared/core.js?v=5.6.0';
import {formatMoney} from './shared/locale.js?v=5.6.0';
import {brandMark,brandLogo} from './shared/brand.js?v=5.6.0';
export {SHOP_SETUP_COPY};
let setup;
export const shopSetupShell=()=>'<section id="setup-demo" class="owner-journey shop-setup" aria-labelledby="shop-setup-title"></section>';
const playerIcon=paused=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true">${paused?'<path d="m8 5 11 7-11 7Z"/>':'<path d="M8 5v14M16 5v14"/>'}</svg>`;

export function shopSetupScreen(demo,lang='ko') {
 const c=SHOP_SETUP_COPY[lang],moods=['greeting','greeting','thinking','thinking','order','greeting'];
 const button=(action,label,graphic='',attrs='')=>`<button type="button" data-setup="${action}" ${attrs}>${graphic}<span>${esc(label)}</span></button>`;
 const action=label=>button(demo.phase===3?'confirm':'advance',label,icon(demo.phase===3?'check':'arrow'),`class="setup-action" data-expected="${demo.phase}"`);
 const menu=()=>`<div class="setup-menu"><header><strong>${esc(c.count)}</strong><small>${esc(c.currency)}</small></header><table><thead><tr><th scope="col">${esc(c.name)}</th><th scope="col">${esc(c.price)}</th></tr></thead><tbody>${demo.menu().map(item=>`<tr><th scope="row">${esc(item.name[lang])}${lang!=='ko'?`<small lang="ko">${esc(item.name.ko)}</small>`:''}</th><td>${esc(formatMoney(item.price,lang))}</td></tr>`).join('')}</tbody></table></div>`;
 const bubble=(text,owner=false)=>`<div class="setup-bubble ${owner?'setup-owner':'setup-rami'}">${owner?'':brandMark(moods[demo.phase],true)}<p>${esc(text)}</p></div>`;
 function screen(){
  if(demo.phase===0)return `<div class="setup-welcome">${brandMark('greeting',true)}<h3 tabindex="-1">${esc(c.upload)}</h3><p>${esc(c.lead)}</p>${action(c.upload)}</div>`;
  if(demo.phase===1)return `${bubble(c.ownerMessage,true)}<div class="setup-attachment"><img src="${SETUP_PHOTO}" alt="${esc(c.photo)}" width="70" height="92"><div><b>${esc(c.photo)}</b><small>JUMO · MENU · VND</small>${icon('check')}</div></div>${bubble(c.attached)}${action(c.steps[2])}`;
  if(demo.phase===2)return `${bubble(c.ownerMessage,true)}<div class="setup-reading">${brandMark('thinking',true)}<h3 tabindex="-1">${esc(c.reading)}</h3><span class="setup-dots" aria-hidden="true"><i></i><i></i><i></i></span><small>${esc(c.badge)}</small></div>${action(c.review)}`;
  if(demo.phase===3||demo.phase===4)return `${bubble(demo.phase===3?c.review:c.approved,demo.phase===4)}<h3 class="setup-result-heading" tabindex="-1">${esc(demo.phase===3?c.result:c.steps[4])}</h3>${menu()}${action(demo.phase===3?c.confirm:c.publish)}`;
  const url=demo.link(lang),qr=`assets/one-shop/onboarding/qr-${lang}.svg`;
  return `${bubble(c.ready)}<div class="setup-share"><h3 tabindex="-1">주모 · JUMO</h3><span class="setup-approved">${icon('check')}${esc(c.count)} · ${esc(c.steps[4])}</span><img class="setup-qr" src="${qr}" width="248" height="248" alt="${esc(c.qr)}"><p>${esc(c.scanNote)}</p><a class="setup-shop-link" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(url)}</a><a class="setup-action" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(c.open)}${icon('arrow')}</a><div class="setup-share-buttons">${button('copy',c.copy,icon('qr'))}<a href="${qr}" download="one-shop-jumo-qr-${lang}.svg">${esc(c.download)}</a></div><p class="setup-copy-status" role="status" aria-live="polite"></p></div>`;
 }
 return screen();
}
export function bindShopSetup(host,language='ko') {
 if(!host)return ()=>{};
 setup??=createShopSetup();
 const demo=setup,lang=setupLanguage(language),c=SHOP_SETUP_COPY[lang],s=SHOWCASE_COPY[lang],reduced=matchMedia('(prefers-reduced-motion:reduce)');
 const notes=[c.lead,c.attached,c.reading,c.review,c.approved,c.ready];
 const moods=['greeting','greeting','thinking','thinking','order','greeting'];
 let disposed=false;
 const button=(action,label,graphic='',attrs='')=>`<button type="button" data-setup="${action}" ${attrs}>${graphic}<span>${esc(label)}</span></button>`;
 const advance=()=>demo.phase===3?demo.confirm():demo.advance();
 const player=createShowcasePlayer({delay:4200,advance:()=>{advance();return !demo.complete;},onChange:render});
 host.innerHTML=`<header class="journey-intro"><div><span class="journey-eyebrow">one shop ai · Rami</span><h2 id="shop-setup-title">${esc(c.title).replace('\n','<br>')}</h2><p>${esc(c.lead)}</p></div><span class="journey-demo-badge">${icon('qr')}${esc(c.badge)}</span></header><div class="journey-toolbar" role="group" aria-label="${esc(s.progress)}">${button('play',s.start,playerIcon(true),'class="journey-primary"')}${button('previous',c.previous)}${button('next',s.next,icon('arrow'))}${button('restart',s.restart)}</div><p class="journey-manual">${esc(c.manual)}</p><ol class="setup-steps" aria-label="${esc(s.progress)}">${c.steps.map((label,i)=>`<li><i>${String(i+1).padStart(2,'0')}</i><span>${esc(label)}</span></li>`).join('')}</ol><div class="journey-narration"><div class="journey-rami"></div><div><span>${esc(c.guide)} <b class="journey-counter"></b></span><p class="journey-note" role="status" aria-live="polite" aria-atomic="true"></p></div></div><div class="setup-layout"><figure class="setup-source"><div class="setup-source-heading"><span>01 / ${esc(c.source)}</span><b>JUMO</b></div><a href="${SETUP_PHOTO}" target="_blank" rel="noopener noreferrer" aria-label="${esc(c.photoNote)}"><img src="${SETUP_PHOTO}" alt="${esc(c.photo)}" width="1088" height="1448" loading="lazy"></a><figcaption>${esc(c.photoNote)}</figcaption></figure><div class="journey-device setup-device"><header>${brandLogo()}<span>${esc(c.badge)}</span></header><div class="setup-app-body"></div></div></div><p class="journey-notice">${icon('spark')}${esc(c.notice)}</p>`;
 const area=host.querySelector('.setup-app-body'),play=host.querySelector('[data-setup="play"]');
 function render(){
  if(disposed)return;
  play.innerHTML=playerIcon(!player.running)+`<span>${esc(player.running?s.pause:demo.complete||demo.phase===0?s.start:s.resume)}</span>`;
  play.setAttribute('aria-pressed',String(player.running));
  host.querySelector('[data-setup="previous"]').disabled=demo.phase===0;
  const next=host.querySelector('[data-setup="next"]');next.disabled=demo.complete;
  next.innerHTML=`<span>${esc(demo.phase===3?c.confirm:s.next)}</span>${icon('arrow')}`;
  host.querySelectorAll('.setup-steps li').forEach((el,i)=>{el.classList.toggle('reached',i<demo.phase);if(i===demo.phase)el.setAttribute('aria-current','step');else el.removeAttribute('aria-current');});
  host.querySelector('.journey-counter').textContent=`${String(demo.phase+1).padStart(2,'0')} / 06`;
  host.querySelector('.journey-note').textContent=notes[demo.phase];
  host.querySelector('.journey-rami').innerHTML=brandMark(moods[demo.phase],true);
  host.dataset.phase=demo.phase;area.innerHTML=shopSetupScreen(demo,lang);area.scrollTop=0;
 }
 const manual=fn=>{player.dispose();fn();render();};
 async function click(event){
  const b=event.target.closest('[data-setup]');if(!b||!host.contains(b))return;
  const key=b.dataset.setup;
  if(key==='play'){if(player.running){player.pause();return;}if(demo.complete)demo.restart();document.dispatchEvent(new CustomEvent('one-shop-demo-play',{detail:'setup'}));player.play();host.querySelector('.journey-narration').scrollIntoView({block:'start',behavior:'instant'});return;}
  if(key==='copy'){
   const url=demo.link(lang),node=host.querySelector('.setup-copy-status');if(!url||!node)return;
   try{await navigator.clipboard.writeText(url);if(!disposed&&node.isConnected)node.textContent=c.copied;}catch{if(!disposed&&node.isConnected)node.textContent=c.copyFailed;}return;
  }
  const wasInside=area.contains(b);
  if(key==='next')manual(advance);
  else if(key==='advance')manual(()=>demo.advance(Number(b.dataset.expected)));
  else if(key==='confirm')manual(()=>demo.confirm(Number(b.dataset.expected)));
  else if(key==='previous')manual(()=>demo.back());
  else if(key==='restart')manual(()=>demo.restart());
  if(wasInside)area.querySelector('h3,button')?.focus({preventScroll:true});
 }
 const pause=()=>{if(player.running)player.pause();},hidden=()=>{if(document.hidden)pause();};
 const other=event=>{if(event.detail!=='setup')pause();};
 const focus=event=>{if(area.contains(event.target)||event.target.closest('.setup-source'))pause();};
 const observer=new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)pause();});observer.observe(host);
 host.addEventListener('click',click);host.addEventListener('focusin',focus);
 document.addEventListener('visibilitychange',hidden);document.addEventListener('one-shop-demo-play',other);reduced.addEventListener('change',pause);
 render();
 return ()=>{disposed=true;player.dispose();observer.disconnect();host.removeEventListener('click',click);host.removeEventListener('focusin',focus);document.removeEventListener('visibilitychange',hidden);document.removeEventListener('one-shop-demo-play',other);reduced.removeEventListener('change',pause);};
}
