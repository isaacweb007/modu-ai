import {createPendingReadSync} from './pending-read-sync.js?v=5.35.0';
import {createLegacyReadImporter} from './legacy-read-import.js?v=5.35.0';
import {counterSummary} from './counter-notifications.js?v=5.35.0';
import {COUNTER_NOTIFICATION_COPY} from './counter-notification-copy.js?v=5.35.0';

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
export function minimalNotificationEvents(events){return events.map(({key,type,kind,id,amendmentId,at})=>({key,type,kind,id,amendmentId,at}));}
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
const importCopy={
 ko:{syncing:'이 기기의 이전 읽음 기록을 동기화하고 있어요.',retry:'연결되면 이전 읽음 기록을 다시 동기화할게요.',deferred:'확인할 수 없는 이전 기록은 이 기기에 보관됩니다.'},
 en:{syncing:'Syncing earlier read history from this device.',retry:'We will retry syncing your earlier read history when connected.',deferred:'Earlier records that cannot be verified remain on this device.'},
 vi:{syncing:'Đang đồng bộ trạng thái đã đọc trước đây từ thiết bị này.',retry:'Sẽ thử đồng bộ lại khi có kết nối.',deferred:'Các mục cũ chưa thể xác minh vẫn được giữ trên thiết bị này.'},
 zh:{syncing:'正在同步此设备以前的已读记录。',retry:'连接恢复后将重新同步以前的已读记录。',deferred:'无法验证的旧记录仍保存在此设备上。'},
 ja:{syncing:'この端末の以前の既読履歴を同期しています。',retry:'接続が戻り次第、以前の既読履歴を再同期します。',deferred:'確認できない以前の記録はこの端末に残ります。'},
 km:{syncing:'កំពុងធ្វើសមកាលកម្មប្រវត្តិអានចាស់ពីឧបករណ៍នេះ។',retry:'នឹងព្យាយាមធ្វើសមកាលកម្មម្ដងទៀតពេលមានការតភ្ជាប់។',deferred:'កំណត់ត្រាចាស់ដែលមិនអាចផ្ទៀងផ្ទាត់បាននៅតែលើឧបករណ៍នេះ។'},
 id:{syncing:'Menyinkronkan riwayat baca sebelumnya dari perangkat ini.',retry:'Riwayat baca akan disinkronkan lagi saat terhubung.',deferred:'Catatan lama yang tidak dapat diverifikasi tetap di perangkat ini.'},
 lo:{syncing:'ກຳລັງຊິງຄ໌ປະຫວັດທີ່ອ່ານກ່ອນໜ້າຈາກອຸປະກອນນີ້.',retry:'ຈະລອງຊິງຄ໌ອີກຄັ້ງເມື່ອເຊື່ອມຕໍ່.',deferred:'ລາຍການເກົ່າທີ່ກວດສອບບໍ່ໄດ້ຍັງຢູ່ໃນອຸປະກອນນີ້.'},
 hi:{syncing:'इस डिवाइस का पुराना पढ़ा हुआ इतिहास सिंक हो रहा है।',retry:'कनेक्शन मिलने पर पुराना इतिहास फिर सिंक होगा।',deferred:'जिन पुराने रिकॉर्ड की पुष्टि नहीं हो सकी वे इसी डिवाइस पर रहेंगे।'}
};
const pendingCopy={
 ko:{syncing:'읽음 기록을 서버에 저장하고 있어요.',retry:'읽음 기록을 이 기기에 보관했어요. 연결이 복구되면 다시 전송합니다.',deferred:'확인할 수 없는 읽음 기록은 이 기기에 남아 있어요.',saved:'전송 대기',offline:'연결이 끊겼어요. 알림만 읽음 처리할 수 있으며 자세한 내용은 연결 후 확인해 주세요.',storageError:'기기에 읽음 기록을 저장하지 못했어요. 저장 공간을 확인하고 다시 시도해 주세요.'},
 en:{syncing:'Saving read status to the server.',retry:'Read status is saved on this device and will retry when connected.',deferred:'Unverified read records remain on this device.',saved:'Waiting to sync',offline:'Offline. You can mark notifications as read; details return when connected.',storageError:'Could not save on this device. Check storage and try again.'},
 vi:{syncing:'Đang lưu trạng thái đã đọc lên máy chủ.',retry:'Đã lưu trên thiết bị và sẽ gửi lại khi có kết nối.',deferred:'Các mục chưa xác minh vẫn được giữ trên thiết bị.',saved:'Chờ đồng bộ',offline:'Mất kết nối. Bạn vẫn có thể đánh dấu đã đọc; xem chi tiết khi kết nối lại.',storageError:'Không thể lưu trên thiết bị. Hãy kiểm tra bộ nhớ và thử lại.'},
 zh:{syncing:'正在将已读状态保存到服务器。',retry:'已保存在此设备，连接恢复后将重试。',deferred:'未验证的记录仍保存在此设备。',saved:'等待同步',offline:'连接已断开。仍可标记已读，详情将在连接后显示。',storageError:'无法保存在设备上，请检查存储空间后重试。'},
 ja:{syncing:'既読状態をサーバーに保存しています。',retry:'端末に保存しました。接続が戻ると再送します。',deferred:'確認できない記録はこの端末に残ります。',saved:'同期待ち',offline:'オフラインです。既読にできますが、詳細は接続後に確認してください。',storageError:'端末に保存できませんでした。空き容量を確認してください。'},
 km:{syncing:'កំពុងរក្សាទុកស្ថានភាពអានលើម៉ាស៊ីនមេ។',retry:'បានរក្សាទុកលើឧបករណ៍ ហើយនឹងផ្ញើម្ដងទៀតពេលមានអ៊ីនធឺណិត។',deferred:'កំណត់ត្រាដែលមិនទាន់ផ្ទៀងផ្ទាត់នៅលើឧបករណ៍។',saved:'រង់ចាំសមកាលកម្ម',offline:'ផ្ដាច់អ៊ីនធឺណិត។ អាចសម្គាល់ថាអាន ហើយមើលព័ត៌មានពេលភ្ជាប់ឡើងវិញ។',storageError:'រក្សាទុកលើឧបករណ៍មិនបានទេ។ សូមពិនិត្យទំហំផ្ទុក។'},
 id:{syncing:'Menyimpan status baca ke server.',retry:'Tersimpan di perangkat dan akan dikirim lagi saat terhubung.',deferred:'Catatan yang belum diverifikasi tetap di perangkat.',saved:'Menunggu sinkronisasi',offline:'Koneksi terputus. Anda dapat menandai dibaca; detail tersedia saat terhubung.',storageError:'Tidak dapat menyimpan di perangkat. Periksa ruang penyimpanan.'},
 lo:{syncing:'ກຳລັງບັນທຶກສະຖານະອ່ານໄປຫາເຊີບເວີ.',retry:'ບັນທຶກໃນອຸປະກອນແລ້ວ ແລະຈະສົ່ງອີກເມື່ອເຊື່ອມຕໍ່.',deferred:'ລາຍການທີ່ຍັງບໍ່ຢືນຢັນຍັງຢູ່ໃນອຸປະກອນ.',saved:'ລໍຖ້າຊິງຄ໌',offline:'ຂາດການເຊື່ອມຕໍ່. ໝາຍວ່າອ່ານໄດ້ ແລະເບິ່ງລາຍລະອຽດເມື່ອກັບມາ.',storageError:'ບັນທຶກບໍ່ໄດ້. ກະລຸນາກວດພື້ນທີ່ຈັດເກັບ.'},
 hi:{syncing:'पढ़ने की स्थिति सर्वर पर सहेज रहे हैं।',retry:'इस डिवाइस पर सहेजा गया है; कनेक्शन आने पर फिर भेजेंगे।',deferred:'अपुष्ट रिकॉर्ड इस डिवाइस पर रहेंगे।',saved:'सिंक की प्रतीक्षा',offline:'कनेक्शन नहीं है। सूचना पढ़ी गई चिह्नित कर सकते हैं; विवरण कनेक्शन पर दिखेगा।',storageError:'डिवाइस पर सहेज नहीं सके। स्टोरेज जाँचकर फिर कोशिश करें।'}
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
export function createNotificationInbox({onOpen,onShare,onImport}){
 let host,open=false,current=null,feedback='',shareUrl='';
 const queue=createPendingReadSync({storage:localStorage,eventsFor:c=>notificationHistory(c.snapshot,c.role,c.visitId),importBatch:(batch,c)=>onImport(batch,c),isOnline:()=>navigator.onLine!==false,onChange:()=>draw()});
 const eventsOf=c=>c.offlineEvents||notificationHistory(c.snapshot,c.role,c.visitId);
 window.addEventListener('online',()=>queue.retry());
 window.addEventListener('storage',e=>{if(e.key?.startsWith('one-shop-pending-read:')){queue.retry();draw();}});
 const importer=createLegacyReadImporter({storage:localStorage,eventsFor:c=>notificationHistory(c.snapshot,c.role,c.visitId),importBatch:(batch,c)=>onImport(batch,c),onChange:()=>draw()});
 function draw(){
  if(!current||!host)return;const {snapshot,role,visitId,identity,lang}=current;
  const events=eventsOf(current),queued=queue.pending(identity),read=new Set([...(snapshot.notificationReads||[]),...importer.confirmed(identity),...queue.confirmed(identity),...queued]),count=events.filter(e=>!read.has(e.key)).length;
  const [name,unread,readLabel,mark,view,empty,close,device]=labels[lang]||labels.en,copy=COUNTER_NOTIFICATION_COPY[lang]||COUNTER_NOTIFICATION_COPY.en;
  const items=events.map(e=>{const isRead=read.has(e.key),title=e.type==='counterRequested'?copy.requested:role==='kitchen'?copy.kitchenApproved:copy.guestApproved;const details=current.offlineEvents?'':counterSummary(e.amendment,lang);const number=!current.offlineEvents&&e.kind==='orders'?'#'+String(e.row.number||''):'';let time='';try{if(e.at)time=new Intl.DateTimeFormat(lang==='ko'?'ko-KR':lang==='vi'?'vi-VN':undefined,{dateStyle:'short',timeStyle:'short'}).format(new Date(e.at));}catch{}return `<li class="inbox-item ${isRead?'':'unread'}"><div class="inbox-meta"><span>${escape(isRead?readLabel:unread)}${queued.has(e.key)&&!queue.confirmed(identity).has(e.key)&&!(snapshot.notificationReads||[]).includes(e.key)?' · '+escape((pendingCopy[lang]||pendingCopy.en).saved):''}</span><time>${escape(time)}</time></div><strong>${escape(title)}</strong><p>${escape(number)} ${escape(details)}</p><div class="inbox-actions">${!isRead?`<button type="button" data-inbox-read="${escape(e.key)}" >${escape(mark)}</button>`:''}${current.offlineEvents?'':`<button type="button" data-inbox-open="${escape(e.key)}">${escape(view)}</button>`}</div></li>`;}).join('');
  const html=`<button type="button" class="inbox-trigger" data-inbox-toggle aria-expanded="${open}" aria-controls="inbox-panel">${escape(name)}${count?` <span role="status" aria-live="polite" aria-label="${escape(unread)} ${count}">${count}</span>`:''}</button>${open?`<section id="inbox-panel" class="inbox-panel" aria-label="${escape(name)}"><header><strong>${escape(name)}</strong><button type="button" data-inbox-toggle aria-label="${escape(close)}">×</button></header><small>${escape(device)}</small>${role==='guest'&&onShare?`<button class="inbox-share" type="button" data-inbox-share>${escape(shareCopy[lang]?.button||shareCopy.en.button)}</button><small>${escape(shareCopy[lang]?.note||shareCopy.en.note)}</small>`:''}${shareUrl?`<label class="inbox-share-url">${escape(shareCopy[lang]?.url||shareCopy.en.url)}<input readonly value="${escape(shareUrl)}"></label>`:''}${current.offlineEvents?`<p class="inbox-feedback" role="status">${escape((pendingCopy[lang]||pendingCopy.en).offline)}</p>`:''}${queue.getStatus()!=='idle'?`<p class="inbox-feedback" role="status">${escape((pendingCopy[lang]||pendingCopy.en)[queue.getStatus()])}</p>`:''}${importer.getStatus().state!=='idle'?`<p class="inbox-feedback" role="status">${escape(importCopy[lang]?.[importer.getStatus().state]||importCopy.en[importer.getStatus().state])}</p>`:''}${feedback?`<p class="inbox-feedback" role="status">${escape(feedback)}</p>`:''}<ol>${items||`<li class="inbox-empty">${escape(empty)}</li>`}</ol></section>`:''}`;
  if(host.dataset.signature!==html){host.innerHTML=html;host.dataset.signature=html;}host.hidden=false;
 }
 async function markEvent(event){if(!current||!event)return false;const identity=current.identity;if((current.snapshot.notificationReads||[]).includes(event.key)||importer.confirmed(identity).has(event.key)||queue.confirmed(identity).has(event.key)||queue.pending(identity).has(event.key))return true;feedback='';if(!queue.enqueue(identity,event.key)){feedback=(pendingCopy[current.lang]||pendingCopy.en).storageError;draw();return false;}draw();return true;}
 async function click(e){const button=e.target.closest('button');if(!button)return;if(button.hasAttribute('data-inbox-toggle')){open=!open;feedback='';draw();host.querySelector(open?'[data-inbox-toggle][aria-label]':'[data-inbox-toggle]')?.focus({preventScroll:true});return;}if(button.hasAttribute('data-inbox-share')){try{shareUrl=await onShare();try{await navigator.clipboard.writeText(shareUrl);feedback=shareCopy[current?.lang]?.copied||shareCopy.en.copied;}catch{feedback='';}}catch{feedback=shareCopy[current?.lang]?.error||shareCopy.en.error;}draw();return;}const eventKey=button.dataset.inboxRead||button.dataset.inboxOpen;if(!eventKey||!current)return;const event=eventsOf(current).find(x=>x.key===eventKey);if(!event)return;const wantsOpen=!!button.dataset.inboxOpen;if(!await markEvent(event))return;if(wantsOpen){open=false;draw();onOpen(event);}else{draw();host.querySelector('[data-inbox-open="'+CSS.escape(eventKey)+'"]')?.focus({preventScroll:true});}}

 return {async mark(eventKey){const event=current&&eventsOf(current).find(x=>x.key===eventKey);return event?markEvent(event):false;},update(value){current=value;importer.update(value);queue.update(value);if(!host){host=document.createElement('aside');host.id='one-inbox';host.addEventListener('click',click);document.body.append(host);}draw();},suspend({hidden=false}={}){if(!current)return;if(!current.offlineEvents){const events=minimalNotificationEvents(eventsOf(current));current={role:current.role,identity:current.identity,lang:current.lang,visitId:current.visitId,snapshot:{notificationReads:[...(current.snapshot.notificationReads||[])]},offlineEvents:events};importer.update(null);queue.update(null);}draw();if(host)host.hidden=hidden;},hide({preserveOpen=false}={}){current=null;importer.update(null);queue.update(null);if(!preserveOpen)open=false;shareUrl='';if(host)host.hidden=true;},remove(){current=null;importer.update(null);queue.update(null);open=false;shareUrl='';host?.remove();host=null;}};
}
