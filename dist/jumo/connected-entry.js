import {consumeDemoOwnerLink,verifiedDemoCredential,demoRequest} from '../shared/connected-demo.js?v=5.34.0';
import {connectedCopy} from '../shared/connected-demo-copy.js?v=5.34.0';
import {ownerCredential} from '../shared/owner-access.js?v=5.11.0';
import {getLang,esc} from '../shared/core.js?v=5.6.0';
const role=document.body.dataset.role,params=new URLSearchParams(location.search),demo=params.get('demo')==='shared';
let blocked=false;
if(demo){
 document.body.classList.add('connected-demo-app');
 const banner=document.createElement('aside');banner.className='connected-app-banner';document.body.prepend(banner);
 const paint=()=>{const lang=getLang(),c=connectedCopy(lang);banner.innerHTML=`<span>${esc(c.banner)} · ${esc((params.get('store')||'').slice(0,8))}</span><a href="../?lang=${esc(lang)}&v=5.34.0#apps">${esc(c.back)}</a>`;};paint();
 new MutationObserver(paint).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
 if(role==='owner')try{
  const candidate=consumeDemoOwnerLink(location.href,url=>history.replaceState(null,'',url))||ownerCredential(localStorage,params.get('store'));
  if(!candidate)throw Error('noAccess');
  const result=await demoRequest(candidate.storeId+'/owner-auth','GET',undefined,candidate.token);
  const credential=verifiedDemoCredential(candidate,result);
  localStorage.setItem('modu-owner-session:'+credential.storeId,JSON.stringify(credential));
 }catch{
  blocked=true;const c=connectedCopy(getLang());
  document.querySelector('#app').innerHTML=`<main class="connected-entry-error"><img src="../assets/one-shop/rami/expressions/hello.webp" alt="" width="112" height="112"><h1>${esc(c.entryError)}</h1><a class="button primary" href="../?lang=${esc(getLang())}&v=5.34.0#apps">${esc(c.back)}</a></main>`;
 }
}
if(!blocked)await import(role==='staff'?'./staff.js?v=5.34.0':'./conversation.js?v=5.34.0');
