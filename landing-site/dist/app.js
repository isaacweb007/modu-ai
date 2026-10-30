import {LANGUAGES, COPY, DIALOGUE} from './i18n.js?v=3.1';

const supported = new Set(LANGUAGES.map(language => language.code));
const koreanNames = {ko:'한국어',en:'영어',vi:'베트남어',zh:'중국어',ja:'일본어',km:'크메르어',id:'인도네시아어',lo:'라오어',hi:'힌디어'};
const welcomeNames = {ko:'안녕하세요, 라미예요.',en:'Hi, I’m Rami.',vi:'Chào bạn, mình là Rami.',zh:'你好，我是 Rami。',ja:'こんにちは、Ramiです。',km:'សួស្តី ខ្ញុំគឺ Rami។',id:'Halo, aku Rami.',lo:'ສະບາຍດີ ຂ້ອຍແມ່ນ Rami.',hi:'नमस्ते, मैं Rami हूँ।'};
const friendsAlts = {ko:'파란 라미와 알록달록한 동그라미 친구들',en:'Blue Rami and a group of colorful round friends',vi:'Rami màu xanh cùng những người bạn tròn nhiều màu sắc',zh:'蓝色 Rami 和一群色彩缤纷的圆形朋友',ja:'青いRamiと、カラフルで丸い仲間たち',km:'Rami ពណ៌ខៀវ និងមិត្តភក្តិរាងមូលចម្រុះពណ៌',id:'Rami biru bersama teman-teman bulat berwarna-warni',lo:'Rami ສີຟ້າ ແລະໝູ່ວົງມົນຫຼາກສີ',hi:'नीला Rami और उसके रंग-बिरंगे गोल दोस्त'};
const $ = selector => document.querySelector(selector);
const esc = value => String(value).replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
let savedLanguage;try { savedLanguage = localStorage.getItem('rami.landing.language'); } catch {}
const requestedLanguage = new URLSearchParams(location.search).get('lang');
let pageLanguage = supported.has(requestedLanguage) ? requestedLanguage : supported.has(savedLanguage) ? savedLanguage : 'ko';
let guestLanguage = pageLanguage === 'ko' ? 'vi' : pageLanguage;
let guestLanguageChosen = false;
let selectedStep = 0;
const stepButtons = [...document.querySelectorAll('[data-step]')];
const pageSelector = $('#page-language');
const guestSelector = $('#guest-language');

function valueAt(object,path) {
  const value = path.split('.').reduce((current,key) => current?.[key],object);
  if (typeof value !== 'string') throw new Error(`Missing landing translation: ${pageLanguage}.${path}`);
  return value;
}
function money() {
  return new Intl.NumberFormat(LANGUAGES.find(language=>language.code===pageLanguage).locale,{style:'currency',currency:'KRW',maximumFractionDigits:0}).format(15000);
}
function link(base,hash='') {
  const url = new URL(base);url.searchParams.set('lang',pageLanguage);url.hash=hash;return url.href;
}
function syncLinks() {
  document.querySelectorAll('[data-book]').forEach(anchor=>anchor.href=link('https://book.ramiai.dev/'));
  document.querySelectorAll('[data-onboarding]').forEach(anchor=>anchor.href=link('https://book.ramiai.dev/','onboarding'));
  document.querySelectorAll('[data-demo]').forEach(anchor=>anchor.href=link('https://isaacweb007.github.io/modu-ai/','integrated-demo'));
  document.querySelectorAll('[data-apps]').forEach(anchor=>anchor.href=link('https://isaacweb007.github.io/modu-ai/','apps'));
}
function applyLanguage(code,{announce=false,updateUrl=true}={}) {
  pageLanguage = supported.has(code) ? code : 'ko';
  const copy = COPY[pageLanguage];
  document.documentElement.lang = pageLanguage;
  document.title = copy.pageTitle;
  $('meta[name="description"]').content = copy.meta;
  $('meta[property="og:title"]').content = copy.pageTitle;
  document.querySelectorAll('[data-copy]').forEach(node=>node.textContent=valueAt(copy,node.dataset.copy));
  document.querySelectorAll('[data-line]').forEach(node=>node.textContent=valueAt(copy,node.dataset.line));
  document.querySelectorAll('[data-alt]').forEach(node=>node.alt=valueAt(copy,node.dataset.alt));
  $('.rami-welcome strong').textContent=welcomeNames[pageLanguage];
  $('.closing-art img').alt=friendsAlts[pageLanguage];
  $('.step-tabs').setAttribute('aria-label',copy.experienceEyebrow);
  $('.benefits').setAttribute('aria-label',copy.navHow);
  pageSelector.value=pageLanguage;
  if (!guestLanguageChosen) guestLanguage=pageLanguage==='ko'?'vi':pageLanguage;
  guestSelector.value=guestLanguage;
  syncLinks();renderStep();
  try { localStorage.setItem('rami.landing.language',pageLanguage); } catch {}
  const url=new URL(location.href);url.searchParams.delete('concept');
  if(pageLanguage==='ko')url.searchParams.delete('lang');else url.searchParams.set('lang',pageLanguage);
  $('link[rel="canonical"]').href=url.origin+url.pathname+(pageLanguage==='ko'?'':`?lang=${pageLanguage}`);
  if(updateUrl)history.replaceState(null,'',url);
  if(announce)$('#language-status').textContent=copy.switchAnnounce;
}
function renderStep() {
  const copy=COPY[pageLanguage],dialogue=DIALOGUE[guestLanguage];
  stepButtons.forEach((button,index)=>{const active=index===selectedStep;button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1;});
  const panel=$('#step-panel');panel.setAttribute('aria-labelledby',`step-${selectedStep}`);
  $('#step-rami').src=`./assets/rami-${['hello','ordering','celebrate'][selectedStep]}.webp`;
  $('#step-label').textContent=copy.stageLabels[selectedStep];
  $('#step-title').textContent=copy.stageTitles[selectedStep];
  const check='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>';
  const down='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v16m-5-5 5 5 5-5"/></svg>';
  let messages,ticket;
  const message=(text,type,agent=false)=>`<p class="message ${type}" lang="${guestLanguage}">${agent?'<strong>Rami</strong>':''}${esc(text)}</p>`;
  if(selectedStep===0){
    messages=message(dialogue.hello,'guest')+message(welcomeNames[guestLanguage]+' '+COPY[guestLanguage].ramiWelcome,'agent',true);
    ticket=`<p class="ticket-body" lang="ko">3번 테이블에 손님이 오셨어요.<br>${koreanNames[guestLanguage]}로 안내를 시작해요.</p>`;
  }else if(selectedStep===1){
    messages=message(dialogue.question,'guest')+message(dialogue.answer,'agent',true)+message(dialogue.order,'guest');
    ticket=`<p class="ticket-body" lang="ko">바삭 감자전 × 1<br>요청: 맵지 않게 해주세요.</p><div class="ticket-total"><span>${esc(copy.item)} × 1</span><strong>${esc(money())}</strong></div>`;
  }else{
    messages=message(dialogue.ready,'agent',true);
    ticket=`<p class="ticket-body" lang="ko">바삭 감자전 × 1 · 준비 완료</p><div class="states"><span>${check}${esc(copy.accepted)}</span><span>${check}${esc(copy.ready)}</span></div>`;
  }
  $('#step-content').innerHTML=`<div class="conversation"><div class="conversation-label"><span>${esc(copy.guestLabel)}</span><span class="language-tag" lang="${guestLanguage}">${esc(LANGUAGES.find(language=>language.code===guestLanguage).name)}</span></div><div class="message-stack">${messages}</div></div><div class="handoff">${down}</div><div class="shop-ticket"><div class="ticket-top"><span>${esc(copy.ownerLabel)}</span><span class="ticket-table">${esc(copy.table)}</span></div>${ticket}</div><p class="shop-note">${esc(copy.shopNote)}</p>`;
}
pageSelector.addEventListener('change',event=>applyLanguage(event.target.value,{announce:true}));
guestSelector.addEventListener('change',event=>{if(!supported.has(event.target.value))return;guestLanguage=event.target.value;guestLanguageChosen=true;renderStep();});
stepButtons.forEach((button,index)=>{
  button.addEventListener('click',()=>{selectedStep=index;renderStep();});
  button.addEventListener('keydown',event=>{let next;if(event.key==='ArrowRight')next=(index+1)%3;else if(event.key==='ArrowLeft')next=(index+2)%3;else if(event.key==='Home')next=0;else if(event.key==='End')next=2;else return;event.preventDefault();selectedStep=next;renderStep();stepButtons[next].focus();});
});
applyLanguage(pageLanguage);
