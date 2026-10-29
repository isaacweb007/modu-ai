const keys=['requested','guestApproved','kitchenApproved','requestedDetails','agreedDetails','alert'];
const rows={
 ko:['손님이 대안을 수정해 다시 요청했어요','샵에서 재요청을 승인했어요','손님의 재요청이 승인됐어요','다시 요청한 내용','합의된 내용','라미 알림'],
 en:['The guest has revised the offer','The shop approved your revised request','The guest’s revised request was approved','Revised request','Agreed details','Rami alert'],
 vi:['Khách đã chỉnh sửa đề xuất và gửi lại','Quán đã đồng ý với yêu cầu mới của bạn','Yêu cầu mới của khách đã được duyệt','Yêu cầu đã chỉnh sửa','Thông tin đã thống nhất','Thông báo Rami'],
 zh:['客人修改了方案并重新提交','店铺已同意您修改后的请求','客人修改后的请求已获批准','修改后的请求','已商定内容','拉米提醒'],
 ja:['お客様が代替案を修正して再リクエストしました','お店が再リクエストを承認しました','お客様の再リクエストが承認されました','修正されたリクエスト','合意した内容','ラミのお知らせ'],
 km:['ភ្ញៀវបានកែសំណើ ហើយផ្ញើម្ដងទៀត','ហាងបានយល់ព្រមលើសំណើថ្មីរបស់អ្នក','សំណើថ្មីរបស់ភ្ញៀវត្រូវបានអនុម័ត','សំណើដែលបានកែប្រែ','ព័ត៌មានដែលបានព្រមព្រៀង','ការជូនដំណឹងពីរ៉ាមី'],
 id:['Pelanggan mengubah usulan dan mengirim lagi','Kedai menyetujui permintaan baru Anda','Permintaan baru pelanggan telah disetujui','Permintaan yang diubah','Detail yang disepakati','Notifikasi Rami'],
 lo:['ລູກຄ້າແກ້ໄຂຂໍ້ສະເໜີ ແລະສົ່ງຄືນ','ຮ້ານໄດ້ອະນຸມັດຄຳຂໍໃໝ່ຂອງທ່ານ','ຄຳຂໍໃໝ່ຂອງລູກຄ້າໄດ້ຮັບການອະນຸມັດ','ຄຳຂໍທີ່ແກ້ໄຂ','ຂໍ້ມູນທີ່ຕົກລົງ','ແຈ້ງເຕືອນຈາກຣາມີ'],
 hi:['ग्राहक ने प्रस्ताव बदलकर फिर भेजा है','दुकान ने आपका बदला हुआ अनुरोध मंज़ूर किया','ग्राहक का बदला हुआ अनुरोध मंज़ूर हुआ','बदला हुआ अनुरोध','तय जानकारी','रामी की सूचना']
};
export const COUNTER_NOTIFICATION_COPY=Object.fromEntries(Object.entries(rows).map(([lang,row])=>[lang,Object.fromEntries(keys.map((key,i)=>[key,row[i]]))]));
