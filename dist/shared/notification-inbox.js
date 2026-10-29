import {counterSummary} from './counter-notifications.js?v=5.32.2';
import {COUNTER_NOTIFICATION_COPY} from './counter-notification-copy.js?v=5.32.2';

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
 ko:['알림함','읽지 않음','읽음','읽음 처리','내역 보기','아직 알림이 없습니다','닫기','같은 사용자의 기기에 읽음 상태 동기화'],
 en:['Notifications','Unread','Read','Mark as read','View record','No notifications yet','Close','Read status syncs across your devices'],
 vi:['Thông báo','Chưa đọc','Đã đọc','Đánh dấu đã đọc','Xem chi tiết','Chưa có thông báo','Đóng','Trạng thái đã đọc được đồng bộ trên các thiết bị'],
 zh:['通知','未读','已读','标记已读','查看详情','暂无通知','关闭','已读状态会同步到您的设备'],
 ja:['お知らせ','未読','既読','既読にする','詳細を見る','お知らせはまだありません','閉じる','既読状態は端末間で同期されます'],
 km:['ការជូនដំណឹង','មិនទាន់អាន','បានអាន','សម្គាល់ថាបានអាន','មើលព័ត៌មាន','មិនទាន់មានការជូនដំណឹង','បិទ','ស្ថានភាពអានត្រូវបានធ្វើសមកាលកម្មតាមឧបករណ៍'],
 id:['Notifikasi','Belum dibaca','Dibaca','Tandai sudah dibaca','Lihat detail','Belum ada notifikasi','Tutup','Status baca disinkronkan di perangkat Anda'],
 lo:['ແຈ້ງເຕືອນ','ຍັງບໍ່ໄດ້ອ່ານ','ອ່ານແລ້ວ','ໝາຍວ່າອ່ານແລ້ວ','ເບິ່ງລາຍລະອຽດ','ຍັງບໍ່ມີແຈ້ງເຕືອນ','ປິດ','ສະຖານະອ່ານຊິງຄ໌ໃນອຸປະກອນຂອງທ່ານ'],
 hi:['सूचनाएँ','अपठित','पढ़ी गई','पढ़ी गई चिह्नित करें','विवरण देखें','अभी कोई सूचना नहीं','बंद करें','पढ़ने की स्थिति आपके उपकरणों में सिंक होती है']
};
const shareCopy={
 ko:{url:'본인 전용 링크',button:'다른 기기에서 이어보기 링크 복사',note:'이 링크는 내 주문과 알림에 접근할 수 있어요. 본인 기기에만 사용하세요.',copied:'전용 링크를 복사했어요. 본인 기기에서 열어 주세요.',error:'연결하지 못했어요. 다시 시도해 주세요.'},
 en:{url:'Private link',button:'Copy link to continue on another device',note:'This private link gives access to your orders and notifications. Use it only on your own devices.',copied:'Private link copied. Open it on your device.',error:'Could not connect. Please try again.'},
 vi:{url:'Liên kết riêng',button:'Sao chép liên kết để mở trên thiết bị khác',note:'Liên kết riêng này mở đơn hàng và thông báo của bạn. Chỉ dùng trên thiết bị của bạn.',copied:'Đã sao chép liên kết riêng. Hãy mở trên thiết bị của bạn.',error:'Không thể kết nối. Vui lòng thử lại.'},
 zh:{url:'私人链接',button:'复制链接，在其他设备继续',note:'此私人链接可访问您的订单和通知，请仅在自己的设备使用。',copied:'私人链接已复制，请在您的设备上打开。',error:'无法连接，请重试。'},
 ja:{url:'専用リンク',button:'別の端末で続けるリンクをコピー',note:'この専用リンクから注文と通知にアクセスできます。自分の端末だけで使ってください。',copied:'専用リンクをコピーしました。自分の端末で開いてください。',error:'接続できませんでした。もう一度お試しください。'},
 km:{url:'តំណឯកជន',button:'ចម្លងតំណដើម្បីបន្តលើឧបករណ៍ផ្សេង',note:'តំណឯកជននេះអាចចូលមើលការបញ្ជាទិញ និងការជូនដំណឹងរបស់អ្នក។ ប្រើតែលើឧបករណ៍ផ្ទាល់ខ្លួន។',copied:'បានចម្លងតំណឯកជន។ សូមបើកលើឧបករណ៍របស់អ្នក។',error:'មិនអាចភ្ជាប់បានទេ។ សូមព្យាយាមម្ដងទៀត។'},
 id:{url:'Tautan pribadi',button:'Salin tautan untuk melanjutkan di perangkat lain',note:'Tautan pribadi ini membuka pesanan dan notifikasi Anda. Gunakan hanya di perangkat Anda.',copied:'Tautan pribadi disalin. Buka di perangkat Anda.',error:'Tidak dapat terhubung. Coba lagi.'},
 lo:{url:'ລິ້ງສ່ວນຕົວ',button:'ຄັດລອກລິ້ງເພື່ອໃຊ້ໃນອຸປະກອນອື່ນ',note:'ລິ້ງສ່ວນຕົວນີ້ເຂົ້າເຖິງຄຳສັ່ງຊື້ແລະແຈ້ງເຕືອນຂອງທ່ານ. ໃຊ້ສະເພາະອຸປະກອນຂອງທ່ານ.',copied:'ຄັດລອກລິ້ງສ່ວນຕົວແລ້ວ.',error:'ເຊື່ອມຕໍ່ບໍ່ໄດ້. ກະລຸນາລອງໃໝ່.'},
 hi:{url:'निजी लिंक',button:'दूसरे डिवाइस पर जारी रखने का लिंक कॉपी करें',note:'इस निजी लिंक से आपके ऑर्डर और सूचनाएँ खुलती हैं। इसे केवल अपने डिवाइस पर इस्तेमाल करें।',copied:'निजी लिंक कॉपी हुआ। इसे अपने डिवाइस पर खोलें।',error:'कनेक्ट नहीं हो सका। फिर कोशिश करें।'}
};
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function createNotificationInbox({onOpen,onMark,onShare}){
 let host,open=false,current=null,pending=new Set(),feedback='',shareUrl='';
 function draw(){
  if(!current||!host)return;const {snapshot,role,visitId,identity,lang}=current;
  const events=notificationHistory(snapshot,role,visitId),read=new Set(snapshot.notificationReads||[]),count=events.filter(e=>!read.has(e.key)).length;
  const [name,unread,readLabel,mark,view,empty,close,device]=labels[lang]||labels.en,copy=COUNTER_NOTIFICATION_COPY[lang]||COUNTER_NOTIFICATION_COPY.en;
  const items=events.map(e=>{const isRead=read.has(e.key),title=e.type==='counterRequested'?copy.requested:role==='kitchen'?copy.kitchenApproved:copy.guestApproved;const details=counterSummary(e.amendment,lang);const number=e.kind==='orders'?'#'+String(e.row.number||''):'';let time='';try{if(e.at)time=new Intl.DateTimeFormat(lang==='ko'?'ko-KR':lang==='vi'?'vi-VN':undefined,{dateStyle:'short',timeStyle:'short'}).format(new Date(e.at));}catch{}return `<li class="inbox-item ${isRead?'':'unread'}"><div class="inbox-meta"><span>${escape(isRead?readLabel:unread)}</span><time>${escape(time)}</time></div><strong>${escape(title)}</strong><p>${escape(number)} ${escape(details)}</p><div class="inbox-actions">${!isRead?`<button type="button" data-inbox-read="${escape(e.key)}" ${pending.has(e.key)?'disabled':''}>${escape(mark)}</button>`:''}<button type="button" data-inbox-open="${escape(e.key)}">${escape(view)}</button></div></li>`;}).join('');
  const html=`<button type="button" class="inbox-trigger" data-inbox-toggle aria-expanded="${open}" aria-controls="inbox-panel">${escape(name)}${count?` <span role="status" aria-live="polite" aria-label="${escape(unread)} ${count}">${count}</span>`:''}</button>${open?`<section id="inbox-panel" class="inbox-panel" aria-label="${escape(name)}"><header><strong>${escape(name)}</strong><button type="button" data-inbox-toggle aria-label="${escape(close)}">×</button></header><small>${escape(device)}</small>${role==='guest'&&onShare?`<button class="inbox-share" type="button" data-inbox-share>${escape(shareCopy[lang]?.button||shareCopy.en.button)}</button><small>${escape(shareCopy[lang]?.note||shareCopy.en.note)}</small>`:''}${shareUrl?`<label class="inbox-share-url">${escape(shareCopy[lang]?.url||shareCopy.en.url)}<input readonly value="${escape(shareUrl)}"></label>`:''}${feedback?`<p class="inbox-feedback" role="status">${escape(feedback)}</p>`:''}<ol>${items||`<li class="inbox-empty">${escape(empty)}</li>`}</ol></section>`:''}`;
  if(host.dataset.signature!==html){host.innerHTML=html;host.dataset.signature=html;}host.hidden=false;
 }
 async function markEvent(event){if(!current||!event||pending.has(event.key))return false;if((current.snapshot.notificationReads||[]).includes(event.key))return true;pending.add(event.key);feedback='';draw();try{await onMark(event);return true;}catch{feedback=shareCopy[current?.lang]?.error||shareCopy.en.error;return false;}finally{pending.delete(event.key);draw();}}
 async function click(e){const button=e.target.closest('button');if(!button)return;if(button.hasAttribute('data-inbox-toggle')){open=!open;feedback='';draw();host.querySelector(open?'[data-inbox-toggle][aria-label]':'[data-inbox-toggle]')?.focus({preventScroll:true});return;}if(button.hasAttribute('data-inbox-share')){try{shareUrl=await onShare();try{await navigator.clipboard.writeText(shareUrl);feedback=shareCopy[current?.lang]?.copied||shareCopy.en.copied;}catch{feedback='';}}catch{feedback=shareCopy[current?.lang]?.error||shareCopy.en.error;}draw();return;}const eventKey=button.dataset.inboxRead||button.dataset.inboxOpen;if(!eventKey||!current)return;const event=notificationHistory(current.snapshot,current.role,current.visitId).find(x=>x.key===eventKey);if(!event)return;const wantsOpen=!!button.dataset.inboxOpen;if(!await markEvent(event))return;if(wantsOpen){open=false;draw();onOpen(event);}else{draw();host.querySelector('[data-inbox-open="'+CSS.escape(eventKey)+'"]')?.focus({preventScroll:true});}}

 return {async mark(eventKey){const event=current&&notificationHistory(current.snapshot,current.role,current.visitId).find(x=>x.key===eventKey);return event?markEvent(event):false;},update(value){current=value;if(!host){host=document.createElement('aside');host.id='one-inbox';host.addEventListener('click',click);document.body.append(host);}draw();},hide({preserveOpen=false}={}){current=null;if(!preserveOpen)open=false;shareUrl='';if(host)host.hidden=true;},remove(){current=null;open=false;shareUrl='';host?.remove();host=null;}};
}
