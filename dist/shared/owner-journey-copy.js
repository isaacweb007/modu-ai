const keys=['nav','title','lead','badge','notice','guide','before','after','same','saved','sample','signin','check','complete','previous','manual','notes'];
const rows={
 ko:['사장님 로그인·복구 시연','비밀번호를 잊어도,\n샵의 하루는 그대로.','로그인부터 이메일 복구, 기존 샵과 주문 확인까지. 라미와 한 번에 시연해 보세요.','사장님 여정 · 데모','준비된 가상 시연입니다. 실제 메일·로그인·비밀번호 변경·AI·결제는 실행하지 않습니다.','라미의 안내','복구 전','복구 후','기록 그대로','보관 중인 샘플 기록','시연용 화면 · 입력할 필요 없어요','새 비밀번호로 로그인','기존 주문 확인','샵과 주문 기록을 확인했어요','이전 단계','자동 재생 없이 다음 단계 버튼으로도 볼 수 있어요.',[
 '주모 사장님의 로그인 화면입니다. 비밀번호가 기억나지 않는 상황을 시연합니다.',
 '등록한 이메일을 확인합니다. 여기서는 owner@example.com이라는 가상 주소를 사용해요.',
 '메일 앱 대신 화면 안의 데모 메일함을 엽니다. 실제 메일은 발송하지 않아요.',
 '새 비밀번호를 정하는 장면입니다. 직접 입력하지 않아도 되고, 비밀번호를 저장하지 않아요.',
 '재설정한 비밀번호로 다시 로그인하는 장면입니다. 실제 계정에는 접속하지 않아요.',
 '원래 있던 주모 샵으로 돌아왔어요. 메뉴 8개, 주문 4건, 예약 3건이 그대로 있어요.',
 '테이블 번호, 배달 주소·연락처, 메뉴와 주문 상태까지 같은 기록입니다. 탭을 눌러 살펴보세요.'
 ]],
 en:['Owner sign-in & recovery demo','Forgot your password?\nYour shop is still here.','Follow Rami from sign-in through email recovery to your saved shop and orders.','Owner journey · demo','A fictional walkthrough. No email, real sign-in, password change, AI call or payment takes place.','Rami’s guide','Before recovery','After recovery','Records unchanged','Saved sample records','Demo screen · no typing needed','Sign in with new password','View saved orders','Your shop and orders are all here','Previous step','You can also use Next step without automatic playback.',[
 'We start at Jumo’s owner sign-in screen, imagining the owner has forgotten their password.',
 'Confirm the registered email. This demo uses the fictional address owner@example.com.',
 'Open the demo inbox here instead of a mail app. No actual email is sent.',
 'See how a new password would be chosen. No typing is needed and no password is stored.',
 'Preview signing in with the reset password. This does not sign in to a real account.',
 'Welcome back to the same Jumo shop, with all 8 menu items, 4 orders and 3 bookings intact.',
 'Table numbers, delivery details, menu items and order statuses are unchanged. Explore the tabs.'
 ]],
 vi:['Demo đăng nhập và khôi phục','Quên mật khẩu,\nquán vẫn nguyên vẹn.','Cùng Rami xem từ đăng nhập, khôi phục qua email đến mở lại quán và các đơn đã lưu.','Hành trình chủ quán · demo','Kịch bản mô phỏng. Không gửi email thật, đăng nhập tài khoản thật, đổi mật khẩu, gọi AI hay thanh toán.','Rami hướng dẫn','Trước khôi phục','Sau khôi phục','Dữ liệu giữ nguyên','Dữ liệu mẫu đã lưu','Màn hình demo · không cần nhập','Đăng nhập bằng mật khẩu mới','Xem đơn đã lưu','Quán và đơn hàng vẫn còn nguyên','Bước trước','Bạn cũng có thể bấm Bước tiếp theo, không cần phát tự động.',[
 'Bắt đầu từ màn hình đăng nhập của chủ quán Jumo, trong tình huống quên mật khẩu.',
 'Xác nhận email đã đăng ký. Demo dùng địa chỉ giả định owner@example.com.',
 'Mở hộp thư demo ngay trên màn hình. Không mở ứng dụng thư hay gửi email thật.',
 'Xem bước chọn mật khẩu mới. Bạn không cần nhập và hệ thống không lưu mật khẩu.',
 'Mô phỏng đăng nhập lại bằng mật khẩu mới, không truy cập tài khoản thật.',
 'Trở về đúng quán Jumo với 8 món, 4 đơn hàng và 3 lượt đặt bàn được giữ nguyên.',
 'Số bàn, địa chỉ và số điện thoại giao hàng, món ăn và trạng thái đơn vẫn như cũ. Hãy xem các thẻ.'
 ]],
 zh:['店主登录与找回演示','忘了密码，\n店铺记录依然在。','跟随 Rami，从登录、邮件找回到查看原有店铺和订单，一次体验完整流程。','店主使用流程 · 演示','这是虚构场景演示，不会发送真实邮件、登录真实账号、修改密码、调用 AI 或进行支付。','Rami 引导','找回前','找回后','记录未变','已保留的示例记录','演示画面 · 无需输入','使用新密码登录','查看原有订单','店铺和订单记录都还在','上一步','也可以点击下一步，手动查看整个流程。',[
 '从 Jumo 店主登录页面开始，演示店主忘记密码的情景。',
 '确认已登记的邮箱。演示使用虚构地址 owner@example.com。',
 '在当前画面打开演示收件箱，无需邮件应用，也不会发送真实邮件。',
 '展示设置新密码的步骤。无需实际输入，也不会保存任何密码。',
 '展示使用新密码重新登录的过程，不会进入真实账号。',
 '回到原来的 Jumo 店铺，8 道菜品、4 笔订单和 3 条订位记录都还在。',
 '桌号、配送地址和联系方式、菜品及订单状态均保持不变。点击标签查看详情。'
 ]],
 ja:['オーナーログイン・再設定デモ','パスワードを忘れても、\nお店の記録はそのまま。','ログインからメールでの再設定、元の店舗と注文の確認まで、ラミと続けて体験できます。','オーナーの操作 · デモ','架空のシナリオです。実際のメール送信・ログイン・パスワード変更・AI呼び出し・決済は行いません。','ラミの案内','再設定前','再設定後','記録はそのまま','保管中のサンプル記録','デモ画面 · 入力は不要です','新しいパスワードでログイン','保存済みの注文を確認','店舗と注文の記録を確認できました','前のステップ','自動再生を使わず、次のステップを押して進めることもできます。',[
 'ジュモのオーナーログイン画面から始めます。パスワードを忘れた場面のデモです。',
 '登録したメールを確認します。ここでは架空の owner@example.com を使います。',
 'メールアプリの代わりに、画面内のデモ受信箱を開きます。実際のメールは送信しません。',
 '新しいパスワードを設定する場面です。入力は不要で、パスワードも保存しません。',
 '再設定したパスワードでログインし直す場面です。実際のアカウントには接続しません。',
 '元のジュモに戻りました。メニュー8品、注文4件、予約3件がそのまま残っています。',
 'テーブル番号、配達先と連絡先、メニュー、注文状況も同じです。タブから確認できます。'
 ]],
 id:['Demo login & pemulihan pemilik','Lupa kata sandi?\nData kedai tetap utuh.','Ikuti Rami dari login, pemulihan lewat email, hingga melihat kedai dan pesanan yang tersimpan.','Alur pemilik · demo','Simulasi fiktif. Tidak mengirim email asli, login akun asli, mengubah kata sandi, memanggil AI atau memproses pembayaran.','Panduan Rami','Sebelum pemulihan','Setelah pemulihan','Data tetap sama','Catatan contoh tersimpan','Layar demo · tidak perlu mengetik','Login dengan kata sandi baru','Lihat pesanan tersimpan','Data kedai dan pesanan tetap ada','Langkah sebelumnya','Anda juga bisa menekan Langkah berikutnya tanpa pemutaran otomatis.',[
 'Mulai dari layar login pemilik Jumo dengan skenario lupa kata sandi.',
 'Konfirmasikan email terdaftar. Demo memakai alamat fiktif owner@example.com.',
 'Buka kotak masuk demo di layar ini, tanpa aplikasi email atau pengiriman sungguhan.',
 'Lihat langkah memilih kata sandi baru. Tidak perlu mengetik dan tidak ada kata sandi yang disimpan.',
 'Simulasikan login ulang dengan kata sandi baru, tanpa mengakses akun asli.',
 'Kembali ke kedai Jumo yang sama dengan 8 menu, 4 pesanan dan 3 reservasi yang tetap utuh.',
 'Nomor meja, alamat dan kontak pengiriman, menu serta status pesanan tidak berubah. Jelajahi tab yang tersedia.'
 ]],
 hi:['मालिक लॉगिन और रिकवरी डेमो','पासवर्ड भूल गए?\nदुकान के रिकॉर्ड सुरक्षित हैं।','रामी के साथ लॉगिन, ईमेल रिकवरी और पुरानी दुकान व ऑर्डर देखने का पूरा सफ़र देखें।','मालिक का सफ़र · डेमो','यह काल्पनिक डेमो है। असली ईमेल, लॉगिन, पासवर्ड बदलाव, AI कॉल या भुगतान नहीं होता।','रामी का मार्गदर्शन','रिकवरी से पहले','रिकवरी के बाद','रिकॉर्ड वही हैं','सहेजे हुए नमूना रिकॉर्ड','डेमो स्क्रीन · कुछ भरना नहीं है','नए पासवर्ड से लॉगिन','पुराने ऑर्डर देखें','दुकान और ऑर्डर मिल गए','पिछला चरण','अपने हिसाब से देखने के लिए अगला चरण भी दबा सकते हैं।',[
 'जुमो के मालिक की लॉगिन स्क्रीन से शुरुआत होती है। मान लीजिए मालिक पासवर्ड भूल गए हैं।',
 'रजिस्टर्ड ईमेल की पुष्टि करें। डेमो में काल्पनिक पता owner@example.com इस्तेमाल होता है।',
 'ईमेल ऐप की जगह इसी स्क्रीन पर डेमो इनबॉक्स खुलता है। कोई असली ईमेल नहीं भेजा जाता।',
 'नया पासवर्ड चुनने का दृश्य देखें। कुछ टाइप करना नहीं है और कोई पासवर्ड सहेजा नहीं जाता।',
 'नए पासवर्ड से फिर लॉगिन करने का डेमो देखें। किसी असली खाते में प्रवेश नहीं होता।',
 'वही जुमो दुकान वापस आ गई। सभी 8 मेन्यू आइटम, 4 ऑर्डर और 3 बुकिंग मौजूद हैं।',
 'टेबल नंबर, डिलीवरी पता और संपर्क, मेन्यू और ऑर्डर की स्थिति सब वही हैं। टैब खोलकर देखें।'
 ]],
 km:['សាកល្បងចូល និងស្ដារគណនីម្ចាស់ហាង','ភ្លេចពាក្យសម្ងាត់?\nទិន្នន័យហាងនៅដដែល។','តាម Rami ពីការចូល ការស្ដារតាមអ៊ីមែល រហូតដល់មើលហាង និងបញ្ជាទិញដែលបានរក្សាទុក។','ដំណើរម្ចាស់ហាង · គំរូ','នេះជាសេណារីយ៉ូគំរូ។ មិនផ្ញើអ៊ីមែលពិត ចូលគណនីពិត ប្ដូរពាក្យសម្ងាត់ ហៅ AI ឬទូទាត់ប្រាក់ទេ។','ការណែនាំរបស់ Rami','មុនស្ដារ','ក្រោយស្ដារ','ទិន្នន័យនៅដដែល','កំណត់ត្រាគំរូដែលបានរក្សាទុក','អេក្រង់គំរូ · មិនបាច់វាយបញ្ចូល','ចូលដោយពាក្យសម្ងាត់ថ្មី','មើលបញ្ជាទិញចាស់','ព័ត៌មានហាង និងបញ្ជាទិញនៅដដែល','ជំហានមុន','អ្នកក៏អាចចុចជំហានបន្ទាប់ ដោយមិនចាំបាច់លេងស្វ័យប្រវត្តិ។',[
 'ចាប់ផ្តើមពីអេក្រង់ចូលរបស់ម្ចាស់ហាង Jumo ក្នុងស្ថានភាពភ្លេចពាក្យសម្ងាត់។',
 'បញ្ជាក់អ៊ីមែលដែលបានចុះឈ្មោះ។ គំរូនេះប្រើអាសយដ្ឋានសន្មត់ owner@example.com។',
 'បើកប្រអប់សារគំរូនៅលើអេក្រង់នេះ។ មិនបើកកម្មវិធីអ៊ីមែល ឬផ្ញើសារពិតទេ។',
 'មើលជំហានជ្រើសពាក្យសម្ងាត់ថ្មី។ មិនចាំបាច់បញ្ចូល និងមិនរក្សាទុកពាក្យសម្ងាត់ទេ។',
 'មើលការចូលម្ដងទៀតដោយពាក្យសម្ងាត់ថ្មី។ មិនចូលគណនីពិតទេ។',
 'ត្រឡប់ទៅហាង Jumo ដដែល ដោយមានម្ហូប 8 មុខ បញ្ជាទិញ 4 និងការកក់ 3 នៅដដែល។',
 'លេខតុ អាសយដ្ឋាន និងលេខទូរស័ព្ទដឹកជញ្ជូន ម៉ឺនុយ និងស្ថានភាពបញ្ជាទិញនៅដដែល។ ចុចផ្ទាំងដើម្បីមើល។'
 ]],
 lo:['ສາທິດເຂົ້າລະບົບ ແລະກູ້ຄືນ','ລືມລະຫັດຜ່ານ?\nຂໍ້ມູນຮ້ານຍັງຢູ່ຄົບ.','ໄປກັບ Rami ຕັ້ງແຕ່ເຂົ້າລະບົບ ກູ້ຄືນທາງອີເມວ ຈົນເຖິງເບິ່ງຮ້ານ ແລະອໍເດີເກົ່າ.','ຂັ້ນຕອນເຈົ້າຂອງ · ສາທິດ','ນີ້ແມ່ນເຫດການຈຳລອງ. ບໍ່ສົ່ງອີເມວຈິງ ບໍ່ເຂົ້າບັນຊີຈິງ ບໍ່ປ່ຽນລະຫັດ ໃຊ້ AI ຫຼືຊຳລະເງິນ.','Rami ແນະນຳ','ກ່ອນກູ້ຄືນ','ຫຼັງກູ້ຄືນ','ຂໍ້ມູນຄົງເດີມ','ຂໍ້ມູນຕົວຢ່າງທີ່ເກັບໄວ້','ໜ້າຈໍສາທິດ · ບໍ່ຕ້ອງປ້ອນ','ເຂົ້າດ້ວຍລະຫັດໃໝ່','ເບິ່ງອໍເດີເກົ່າ','ຮ້ານ ແລະອໍເດີຍັງຢູ່ຄົບ','ຂັ້ນຕອນກ່ອນ','ສາມາດກົດຂັ້ນຕອນຕໍ່ໄປ ໂດຍບໍ່ໃຊ້ການຫຼິ້ນອັດຕະໂນມັດ.',[
 'ເລີ່ມຈາກໜ້າເຂົ້າລະບົບຂອງເຈົ້າຂອງ Jumo ໃນສະຖານະການລືມລະຫັດຜ່ານ.',
 'ກວດອີເມວທີ່ລົງທະບຽນ. ໃນສາທິດໃຊ້ທີ່ຢູ່ສົມມຸດ owner@example.com.',
 'ເປີດກ່ອງຂໍ້ຄວາມສາທິດໃນໜ້າຈໍນີ້. ບໍ່ເປີດແອັບອີເມວ ຫຼືສົ່ງອີເມວຈິງ.',
 'ເບິ່ງຂັ້ນຕອນຕັ້ງລະຫັດໃໝ່. ບໍ່ຕ້ອງປ້ອນ ແລະບໍ່ເກັບລະຫັດໃດໆ.',
 'ສາທິດການເຂົ້າລະບົບອີກຄັ້ງດ້ວຍລະຫັດໃໝ່. ບໍ່ເຂົ້າບັນຊີຈິງ.',
 'ກັບມາຮ້ານ Jumo ເດີມ ພ້ອມເມນູ 8 ລາຍການ ອໍເດີ 4 ແລະການຈອງ 3 ຄົບຖ້ວນ.',
 'ເລກໂຕະ ທີ່ຢູ່ ແລະເບີໂທຈັດສົ່ງ ເມນູ ແລະສະຖານະອໍເດີຄົງເດີມ. ກົດແຖບເພື່ອເບິ່ງ.'
 ]]
};
export const OWNER_JOURNEY_COPY=Object.fromEntries(Object.entries(rows).map(([lang,values])=>[lang,Object.fromEntries(keys.map((key,index)=>[key,values[index]]))]));
