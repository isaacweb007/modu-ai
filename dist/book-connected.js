import {CONNECTED_DEMO_KEY,readDemo,validDemo,connectedAppBase,connectedAppLinks,demoRequest} from './shared/connected-demo.js?v=5.29.1';
import {connectedCopy} from './shared/connected-demo-copy.js?v=5.29.1';
import {createOwnerSample} from './shared/owner-sample.js?v=5.6.0';
let pending=null;
export function bindConnectedApps(root,lang){
 if(!root)return ()=>{};
 const c=connectedCopy(lang),button=root.querySelector('[data-demo-create]'),status=root.querySelector('[data-demo-status]');
 let disposed=false,room=readDemo(localStorage),busy=!!pending;
 function draw(message=''){
  if(disposed)return;
  if(!validDemo(room))room=null;
  const links=room?connectedAppLinks(room,lang,connectedAppBase(location.href)):{};
  button.disabled=busy;button.textContent=busy?c.working:room?c.newRoom:c.start;
  root.querySelector('[data-demo-new-note]').hidden=!room;
  status.textContent=message||(room?c.ready+' · '+room.storeId.slice(0,8):'');
  root.querySelector('[data-demo-expiry]').textContent=room?c.expires+' '+new Intl.DateTimeFormat(lang,{dateStyle:'short',timeStyle:'short'}).format(new Date(room.expiresAt)):'';
  root.querySelectorAll('[data-connected-role]').forEach(a=>{const href=links[a.dataset.connectedRole];if(href){a.href=href;a.removeAttribute('aria-disabled');a.removeAttribute('tabindex');}else{a.removeAttribute('href');a.setAttribute('aria-disabled','true');a.tabIndex=-1;}});
  root.querySelectorAll('[data-demo-copy]').forEach(b=>b.disabled=!room);
 }
 async function settle(promise){try{room=await promise;}catch(error){busy=false;draw(error.message==='limitReached'?c.limit:c.error);return;}finally{busy=false;}draw();}
 async function create(){
  if(busy)return;busy=true;draw();
  if(!pending){const sample=createOwnerSample('ko');pending=demoRequest('demo','POST',{store:sample.store,menu:sample.items,workspace:{manager:{...sample.manager,messages:[]},inventory:sample.inventory,staffTasks:[]}}).then(result=>{if(!validDemo(result))throw Error('offline');try{localStorage.setItem(CONNECTED_DEMO_KEY,JSON.stringify(result));}catch{}return result;}).finally(()=>{pending=null;});}
  await settle(pending);
 }
 async function click(e){const copy=e.target.closest('[data-demo-copy]');if(!copy||!validDemo(room))return;try{await navigator.clipboard.writeText(connectedAppLinks(room,lang,connectedAppBase(location.href))[copy.dataset.demoCopy]);status.textContent=c.copied;}catch{status.textContent=c.copyFailed;}}
 button.addEventListener('click',create);root.addEventListener('click',click);
 const refresh=()=>{if(!busy){room=readDemo(localStorage);draw();}},timer=setInterval(()=>{if(room&&!validDemo(room))draw();},30000);
 window.addEventListener('storage',refresh);draw();if(pending)settle(pending);
 return()=>{disposed=true;clearInterval(timer);window.removeEventListener('storage',refresh);button.removeEventListener('click',create);root.removeEventListener('click',click);};
}
