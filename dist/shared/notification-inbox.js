import {counterSummary} from './counter-notifications.js?v=5.31.0';
import {COUNTER_NOTIFICATION_COPY} from './counter-notification-copy.js?v=5.31.0';

// Event details come only from the latest authorized snapshot; storage contains IDs, never shop data.
export function notificationHistory(snapshot,role,visitId){
 const events=[];
 for(const a of snapshot?.amendments||[]){
  if(!a.parent_amendment_id)continue;
  if(role==='guest'&&a.visit_id!==visitId)continue;
  const kind=a.target_type==='booking'?'reservations':'orders';
  if(role==='kitchen'&&kind!=='orders')continue;
  const rows=kind==='orders'?snapshot.orders:(snapshot.reservations||snapshot.bookings);
  const row=rows?.find(r=>r.id===a.target_id);if(!row)continue;
  const requested=role==='owner'||role==='floor';
  if(!requested&&!(['guest','kitchen'].includes(role)&&a.status==='approved'))continue;
  const type=requested?'counterRequested':'counterApproved';
  events.push({key:`counter:${a.id}:${requested?'requested':'approved'}`,id:a.target_id,kind,type,amendmentId:a.id,at:requested?a.created_at:a.reviewed_at,amendment:a,row});
 }
 return events.sort((a,b)=>String(b.at||'').localeCompare(String(a.at||''))||a.key.localeCompare(b.key));
}
export function readKeys(storage,key){try{const value=JSON.parse(storage.getItem(key)||'[]');return new Set(Array.isArray(value)?value.filter(x=>typeof x==='string').slice(-1000):[]);}catch{return new Set();}}
export function markRead(storage,key,eventKey){const read=readKeys(storage,key);read.add(eventKey);try{storage.setItem(key,JSON.stringify([...read].slice(-1000)));}catch{}return read;}
const labels={
 ko:['알림함','읽지 않음','읽음','읽음 처리','내역 보기','아직 알림이 없습니다','닫기','기기에 읽음 상태 저장'],
 en:['Notifications','Unread','Read','Mark as read','View record','No notifications yet','Close','Read status is saved on this device'],
 vi:['Thông báo','Chưa đọc','Đã đọc','Đánh dấu đã đọc','Xem chi tiết','Chưa có thông báo','Đóng','Trạng thái đã đọc được lưu trên thiết bị này'],
 zh:['通知','未读','已读','标记已读','查看详情','暂无通知','关闭','已读状态保存在此设备'],
 ja:['お知らせ','未読','既読','既読にする','詳細を見る','お知らせはまだありません','閉じる','既読状態はこの端末に保存されます'],
 km:['ការជូនដំណឹង','មិនទាន់អាន','បានអាន','សម្គាល់ថាបានអាន','មើលព័ត៌មាន','មិនទាន់មានការជូនដំណឹង','បិទ','ស្ថានភាពអានត្រូវបានរក្សាទុកលើឧបករណ៍នេះ'],
 id:['Notifikasi','Belum dibaca','Dibaca','Tandai sudah dibaca','Lihat detail','Belum ada notifikasi','Tutup','Status baca disimpan di perangkat ini'],
 lo:['ແຈ້ງເຕືອນ','ຍັງບໍ່ໄດ້ອ່ານ','ອ່ານແລ້ວ','ໝາຍວ່າອ່ານແລ້ວ','ເບິ່ງລາຍລະອຽດ','ຍັງບໍ່ມີແຈ້ງເຕືອນ','ປິດ','ສະຖານະອ່ານຖືກບັນທຶກໃນອຸປະກອນນີ້'],
 hi:['सूचनाएँ','अपठित','पढ़ी गई','पढ़ी गई चिह्नित करें','विवरण देखें','अभी कोई सूचना नहीं','बंद करें','पढ़ने की स्थिति इस डिवाइस पर सहेजी जाती है']
};
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function createNotificationInbox({onOpen,storage=localStorage}){
 let host,open=false,current=null;
 function draw(){
  if(!current||!host)return;const {snapshot,role,visitId,identity,lang}=current;
  const key='one-shop-inbox:'+identity,events=notificationHistory(snapshot,role,visitId),read=readKeys(storage,key),count=events.filter(e=>!read.has(e.key)).length;
  const [name,unread,readLabel,mark,view,empty,close,device]=labels[lang]||labels.en,copy=COUNTER_NOTIFICATION_COPY[lang]||COUNTER_NOTIFICATION_COPY.en;
  const items=events.map(e=>{const isRead=read.has(e.key),title=e.type==='counterRequested'?copy.requested:role==='kitchen'?copy.kitchenApproved:copy.guestApproved;const details=counterSummary(e.amendment,lang);const number=e.kind==='orders'?'#'+String(e.row.number||''):'';let time='';try{if(e.at)time=new Intl.DateTimeFormat(lang==='ko'?'ko-KR':lang==='vi'?'vi-VN':undefined,{dateStyle:'short',timeStyle:'short'}).format(new Date(e.at));}catch{}return `<li class="inbox-item ${isRead?'':'unread'}"><div class="inbox-meta"><span>${escape(isRead?readLabel:unread)}</span><time>${escape(time)}</time></div><strong>${escape(title)}</strong><p>${escape(number)} ${escape(details)}</p><div class="inbox-actions">${!isRead?`<button type="button" data-inbox-read="${escape(e.key)}">${escape(mark)}</button>`:''}<button type="button" data-inbox-open="${escape(e.key)}">${escape(view)}</button></div></li>`;}).join('');
  const html=`<button type="button" class="inbox-trigger" data-inbox-toggle aria-expanded="${open}" aria-controls="inbox-panel">${escape(name)}${count?` <span role="status" aria-live="polite" aria-label="${escape(unread)} ${count}">${count}</span>`:''}</button>${open?`<section id="inbox-panel" class="inbox-panel" aria-label="${escape(name)}"><header><strong>${escape(name)}</strong><button type="button" data-inbox-toggle aria-label="${escape(close)}">×</button></header><small>${escape(device)}</small><ol>${items||`<li class="inbox-empty">${escape(empty)}</li>`}</ol></section>`:''}`;
  if(host.dataset.signature!==html){host.innerHTML=html;host.dataset.signature=html;}host.hidden=false;
 }
 function click(e){const button=e.target.closest('button');if(!button)return;if(button.hasAttribute('data-inbox-toggle')){open=!open;draw();host.querySelector(open?'[data-inbox-toggle][aria-label]':'[data-inbox-toggle]')?.focus({preventScroll:true});return;}const eventKey=button.dataset.inboxRead||button.dataset.inboxOpen;if(!eventKey||!current)return;const event=notificationHistory(current.snapshot,current.role,current.visitId).find(x=>x.key===eventKey);if(!event)return;markRead(storage,'one-shop-inbox:'+current.identity,eventKey);if(button.dataset.inboxOpen){open=false;draw();onOpen(event);}else{draw();host.querySelector('[data-inbox-open="'+CSS.escape(eventKey)+'"]')?.focus({preventScroll:true});}}
 return {mark(eventKey){if(current){markRead(storage,'one-shop-inbox:'+current.identity,eventKey);draw();}},update(value){current=value;if(!host){host=document.createElement('aside');host.id='one-inbox';host.addEventListener('click',click);document.body.append(host);}draw();},hide(){current=null;open=false;if(host)host.hidden=true;},remove(){current=null;open=false;host?.remove();host=null;}};
}
