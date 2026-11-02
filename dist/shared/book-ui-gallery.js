import {esc,icon} from './core.js?v=5.36.0';

// Actual screenshots, not generated UI. Captions describe only the visible demo.
export const GALLERY_SCREENS=[
 ['guest-language','guest',415,932],['guest-menu','guest',415,932],
 ['guest-chat','guest',415,932],['guest-order','guest',415,899],
 ['owner-manager','owner',415,899],['owner-dashboard','owner',415,899],
 ['owner-operations','owner',415,899],['owner-team','owner',415,3653],
 ['staff-floor','staff',430,932],['staff-kitchen','staff',430,932],['staff-menu','staff',415,899]
].map(([id,role,width,height])=>({id,role,width,height,src:`assets/ui-gallery/${id}.webp`}));

const keys=['nav','title','intro','note','open','close','previous','next','download','tryApps','rolesLabel','roles','summaries','screens'];
const rows={
 ko:['앱 UI 화면 모음','손님부터 오너까지,\n실제 화면으로 만나보세요.','라미와 대화하는 모습부터 주문 확인과 직원 권한까지. 역할을 고르고 이미지를 눌러 화면을 자세히 살펴보세요.','주모 데모를 직접 캡처한 화면입니다. 이미지 속 언어는 한국어이며, 제목과 설명은 선택한 언어로 바뀝니다. 실제 AI·결제는 연결하지 않았어요.','크게 보기','닫기','이전 화면','다음 화면','이미지 저장','앱을 직접 체험하기','보고 싶은 앱 선택',['손님앱','오너앱','직원앱'],['QR로 들어와 언어를 고르고, 라미와 이야기하며 주문해요.','매니저 라미와 대화하고, 샵의 주문과 직원 권한을 살펴요.','홀은 접수와 서빙을, 주방은 조리와 준비 완료를 맡아요.'],[
 ['QR 접속과 첫 인사','라미가 손님을 맞이하고 편한 언어를 고르게 도와요.'],['사진으로 고르는 메뉴','메뉴 사진·설명·가격을 확인하고 원하는 음식을 담아요.'],['라미에게 물어보기','준비된 대화로 메뉴 추천과 재료 안내를 살펴봐요.'],['내 주문과 준비 완료','테이블 번호, 주문 내역, 준비 상태를 한곳에서 확인해요.'],
 ['샵 매니저와 대화','라미에게 오늘의 샵 상황을 물어보고 요약을 받아요.'],['샵 현황 대시보드','주문 경로와 테이블을 확인하고 다음 작업을 진행해요.'],['운영 자료 한곳에','주문 수를 살피고 자재·직원·세무 자료로 이동해요.'],['직원 등록과 권한','홀과 주방에 필요한 보기·작업 권한을 설정해요. 확대하면 아래 내용까지 볼 수 있어요.'],
 ['홀의 주문 확인과 서빙','테이블과 메뉴를 확인하고, 준비된 음식을 손님에게 전달해요.'],['주방의 준비 완료','접수된 주문을 조리하고 완료 상태를 홀과 공유해요.'],['직원이 보는 메뉴','내 역할에서 볼 수 있는 메뉴와 판매 상태를 확인해요.']]],
 en:['App screen gallery','See the experience,\nfrom guest to owner.','Explore conversations with Rami, orders and staff access. Choose a role, then open an image for a closer look.','Captured from the Jumo demo. Screenshots are in Korean; titles and captions follow your selected language. Live AI and payments are not connected.','Enlarge','Close','Previous screen','Next screen','Save image','Try the apps','Choose an app',['Guest app','Owner app','Staff app'],['Enter by QR, choose a language, talk to Rami and order.','Talk to your manager, follow orders and manage staff access.','Floor staff receive and serve orders; the kitchen cooks and marks them ready.'],[
 ['QR entry and welcome','Rami welcomes guests and helps them choose a language.'],['Browse the photo menu','Check photos, descriptions and prices, then add a dish.'],['Ask Rami','Explore prepared menu recommendations and ingredient information.'],['Your order and progress','Check your table, order details and preparation status together.'],
 ['Talk to your shop manager','Ask Rami for a summary of the shop today.'],['Shop dashboard','Check order channels and table numbers, then take the next action.'],['Operations in one place','Review order counts and open inventory, staff or tax records.'],['Staff and permissions','Set viewing and action permissions for floor and kitchen staff. Enlarge to scroll through the full screen.'],
 ['Floor orders and service','Check the table and dishes, then serve the prepared order.'],['Kitchen ready status','Prepare accepted orders and share their ready status with the floor.'],['The staff menu','See the menu and availability allowed for your role.']]],
 vi:['Thư viện giao diện','Khám phá từng màn hình,\ntừ khách đến chủ quán.','Từ trò chuyện với Rami đến theo dõi đơn và phân quyền nhân viên. Chọn vai trò rồi nhấn ảnh để xem rõ hơn.','Ảnh chụp trực tiếp từ demo Jumo bằng tiếng Hàn. Tiêu đề và mô tả đổi theo ngôn ngữ đã chọn. Chưa kết nối AI hay thanh toán thật.','Phóng to','Đóng','Màn hình trước','Màn hình sau','Lưu ảnh','Trải nghiệm ứng dụng','Chọn ứng dụng',['Ứng dụng khách','Ứng dụng chủ quán','Ứng dụng nhân viên'],['Quét QR, chọn ngôn ngữ, trò chuyện với Rami và gọi món.','Trò chuyện với quản lý Rami, theo dõi đơn và phân quyền nhân viên.','Nhân viên phục vụ nhận đơn và lên món; bếp chế biến và báo món đã sẵn sàng.'],[
 ['Quét QR và lời chào','Rami chào khách và giúp chọn ngôn ngữ phù hợp.'],['Chọn món qua hình ảnh','Xem ảnh, mô tả và giá rồi thêm món muốn gọi.'],['Hỏi Rami','Thử gợi ý món và thông tin nguyên liệu theo hội thoại mẫu.'],['Đơn hàng và tiến độ','Xem số bàn, chi tiết đơn và trạng thái chuẩn bị tại một nơi.'],
 ['Trò chuyện với quản lý','Hỏi Rami để xem tóm tắt tình hình quán hôm nay.'],['Bảng tổng quan quán','Xem nguồn đơn và số bàn rồi thực hiện bước tiếp theo.'],['Thông tin vận hành','Xem số đơn và mở mục nguyên liệu, nhân viên hoặc thuế.'],['Nhân viên và phân quyền','Cấp quyền xem và thao tác cho phục vụ và bếp. Phóng to để cuộn xem toàn bộ.'],
 ['Phục vụ nhận và lên món','Kiểm tra bàn, món ăn và mang món đã sẵn sàng đến khách.'],['Bếp báo hoàn tất','Chế biến đơn đã nhận và báo trạng thái sẵn sàng cho phục vụ.'],['Thực đơn cho nhân viên','Xem món và tình trạng bán trong phạm vi quyền được cấp.']]],
 zh:['应用界面图集','从顾客到店主，\n看看实际使用的界面。','从与拉米对话到订单和员工权限，选择角色，点击图片即可放大查看。','图片为 Jumo 演示的实际韩语截图。标题和说明随所选语言切换。尚未连接真实 AI 或支付。','放大查看','关闭','上一张','下一张','保存图片','亲自体验应用','选择应用',['顾客应用','店主应用','员工应用'],['扫码、选择语言，与拉米对话并点单。','与拉米经理对话，查看订单并管理员工权限。','前厅接单与上菜，厨房负责制作并标记备餐完成。'],[
 ['扫码与欢迎','拉米迎接顾客，帮助选择熟悉的语言。'],['看图选菜','查看菜品图片、介绍与价格，将喜欢的菜加入订单。'],['问问拉米','体验预设的菜品推荐与食材介绍。'],['订单与备餐进度','在一处查看桌号、订单详情和备餐状态。'],
 ['与店铺经理对话','请拉米汇总今天的店铺情况。'],['店铺总览','查看订单来源和桌号，继续下一步处理。'],['运营资料','查看订单数量，进入库存、员工或税务资料。'],['员工与权限','设置前厅和厨房的查看与操作权限。放大后可滚动查看完整界面。'],
 ['前厅订单与上菜','核对桌号和菜品，将备好的餐点送给顾客。'],['厨房备餐完成','制作已接订单，并向前厅同步完成状态。'],['员工菜单','查看当前角色有权访问的菜品与在售状态。']]],
 ja:['アプリ画面ギャラリー','お客様からオーナーまで、\n実際の画面で見てみましょう。','ラミとの会話、注文、スタッフの権限。役割を選び、画像を押すと詳しく確認できます。','Jumoのデモを実際に撮影した韓国語の画面です。見出しと説明は選択した言語に変わります。実際のAI・決済は未接続です。','拡大する','閉じる','前の画面','次の画面','画像を保存','アプリを試す','アプリを選ぶ',['お客様アプリ','オーナーアプリ','スタッフアプリ'],['QRから入り、言語を選んでラミと話しながら注文。','ラミと話して、注文やスタッフの権限を確認。','ホールは受付と配膳、厨房は調理と準備完了を担当。'],[
 ['QRアクセスとご挨拶','ラミがお迎えし、使いやすい言語選びをお手伝い。'],['写真からメニュー選び','写真・説明・価格を見て、食べたい料理を追加。'],['ラミに質問','用意された会話で、おすすめや食材の案内を体験。'],['注文と準備状況','テーブル番号、注文内容、調理の進み具合を確認。'],
 ['店舗マネージャーと会話','ラミに今日のお店の状況をまとめてもらいます。'],['店舗ダッシュボード','注文経路やテーブルを確認し、次の作業へ。'],['運営資料をひとまとめに','注文数を見て、在庫・スタッフ・税務資料へ進みます。'],['スタッフ登録と権限','ホールと厨房の閲覧・操作権限を設定。拡大すると下まで確認できます。'],
 ['ホールの注文確認と配膳','テーブルと料理を確認し、出来上がった料理をお届け。'],['厨房の準備完了','受け付けた注文を調理し、完了をホールと共有。'],['スタッフ用メニュー','自分の役割で閲覧できるメニューと販売状況を確認。']]],
 km:['បណ្ដុំអេក្រង់កម្មវិធី','មើលអេក្រង់ពិត\nសម្រាប់ភ្ញៀវនិងម្ចាស់ហាង។','ពីការជជែកជាមួយ Rami ដល់ការបញ្ជាទិញនិងសិទ្ធិបុគ្គលិក។ ជ្រើសតួនាទី រួចចុចរូបដើម្បីមើលច្បាស់។','រូបថតពីកម្មវិធីសាកល្បង Jumo ជាភាសាកូរ៉េ។ ចំណងជើងនិងការពន្យល់ប្ដូរតាមភាសាដែលបានជ្រើស។ មិនភ្ជាប់ AI ឬទូទាត់ពិតទេ។','ពង្រីក','បិទ','អេក្រង់មុន','អេក្រង់បន្ទាប់','រក្សារូប','សាកល្បងកម្មវិធី','ជ្រើសកម្មវិធី',['កម្មវិធីភ្ញៀវ','កម្មវិធីម្ចាស់ហាង','កម្មវិធីបុគ្គលិក'],['ចូលតាម QR ជ្រើសភាសា ជជែកជាមួយ Rami និងបញ្ជាទិញ។','ជជែកជាមួយ Rami តាមដានការបញ្ជាទិញ និងគ្រប់គ្រងសិទ្ធិបុគ្គលិក។','អ្នកបម្រើទទួលការបញ្ជាទិញនិងបម្រើម្ហូប។ ផ្ទះបាយចម្អិននិងប្រាប់ថារួចរាល់។'],[
 ['ចូលតាម QR និងស្វាគមន៍','Rami ស្វាគមន៍ភ្ញៀវនិងជួយជ្រើសភាសា។'],['ជ្រើសម្ហូបតាមរូប','មើលរូប ព័ត៌មាននិងតម្លៃ រួចបន្ថែមម្ហូប។'],['សួរ Rami','សាកល្បងការណែនាំម្ហូបនិងគ្រឿងផ្សំតាមសន្ទនាគំរូ។'],['ការបញ្ជាទិញនិងស្ថានភាព','មើលលេខតុ ព័ត៌មានការបញ្ជាទិញ និងស្ថានភាពចម្អិន។'],
 ['ជជែកជាមួយអ្នកគ្រប់គ្រង','សុំឱ្យ Rami សង្ខេបស្ថានភាពហាងថ្ងៃនេះ។'],['ផ្ទាំងស្ថានភាពហាង','មើលប្រភពការបញ្ជាទិញនិងលេខតុ រួចធ្វើជំហានបន្ទាប់។'],['ព័ត៌មានប្រតិបត្តិការ','មើលចំនួនបញ្ជាទិញ និងបើកសម្ភារៈ បុគ្គលិក ឬឯកសារពន្ធ។'],['បុគ្គលិកនិងសិទ្ធិ','កំណត់សិទ្ធិមើលនិងធ្វើការសម្រាប់អ្នកបម្រើនិងផ្ទះបាយ។ ពង្រីកដើម្បីមើលទាំងអស់។'],
 ['អ្នកបម្រើពិនិត្យនិងបម្រើ','ពិនិត្យតុនិងម្ហូប ហើយបម្រើម្ហូបដែលរួចរាល់។'],['ផ្ទះបាយរួចរាល់','ចម្អិនការបញ្ជាទិញដែលបានទទួល និងប្រាប់អ្នកបម្រើថារួចរាល់។'],['ម៉ឺនុយបុគ្គលិក','មើលម៉ឺនុយនិងស្ថានភាពលក់តាមសិទ្ធិរបស់ខ្លួន។']]],
 id:['Galeri layar aplikasi','Lihat layar aslinya,\ndari tamu hingga pemilik.','Jelajahi percakapan Rami, pesanan dan akses staf. Pilih peran lalu tekan gambar untuk melihat lebih jelas.','Tangkapan layar demo Jumo berbahasa Korea. Judul dan keterangan mengikuti bahasa pilihan Anda. AI dan pembayaran nyata belum terhubung.','Perbesar','Tutup','Layar sebelumnya','Layar berikutnya','Simpan gambar','Coba aplikasinya','Pilih aplikasi',['Aplikasi tamu','Aplikasi pemilik','Aplikasi staf'],['Masuk lewat QR, pilih bahasa, bicara dengan Rami dan pesan.','Bicara dengan manajer Rami, pantau pesanan dan atur akses staf.','Pelayan menerima dan menyajikan pesanan; dapur memasak dan menandai siap.'],[
 ['Masuk QR dan sambutan','Rami menyambut tamu dan membantu memilih bahasa.'],['Pilih dari foto menu','Lihat foto, deskripsi dan harga lalu tambahkan hidangan.'],['Tanya Rami','Coba saran menu dan informasi bahan melalui percakapan siap pakai.'],['Pesanan dan prosesnya','Lihat nomor meja, rincian pesanan dan status persiapan.'],
 ['Bicara dengan manajer','Minta Rami merangkum keadaan kedai hari ini.'],['Dasbor kedai','Periksa asal pesanan dan nomor meja untuk tindakan berikutnya.'],['Informasi operasional','Lihat jumlah pesanan dan buka inventaris, staf atau catatan pajak.'],['Staf dan izin akses','Atur izin melihat dan bekerja bagi pelayan serta dapur. Perbesar untuk menggulir seluruh layar.'],
 ['Pesanan dan pelayanan','Periksa meja serta menu, lalu sajikan makanan yang siap.'],['Status siap dari dapur','Masak pesanan yang diterima dan kabarkan kesiapan ke pelayan.'],['Menu untuk staf','Lihat menu dan ketersediaan sesuai peran Anda.']]],
 lo:['ຮູບໜ້າຈໍແອັບ','ເບິ່ງໜ້າຈໍຈິງ\nຈາກລູກຄ້າຮອດເຈົ້າຂອງ.','ຈາກການລົມກັບ Rami ເຖິງອໍເດີແລະສິດພະນັກງານ. ເລືອກບົດບາດແລ້ວກົດຮູບເພື່ອເບິ່ງໃຫ້ຊັດ.','ຮູບຈາກເດໂມ Jumo ເປັນພາສາເກົາຫຼີ. ຫົວຂໍ້ແລະຄຳອະທິບາຍປ່ຽນຕາມພາສາທີ່ເລືອກ. ບໍ່ເຊື່ອມ AI ຫຼືຈ່າຍເງິນຈິງ.','ຂະຫຍາຍ','ປິດ','ໜ້າຈໍກ່ອນ','ໜ້າຈໍຕໍ່ໄປ','ບັນທຶກຮູບ','ລອງໃຊ້ແອັບ','ເລືອກແອັບ',['ແອັບລູກຄ້າ','ແອັບເຈົ້າຂອງ','ແອັບພະນັກງານ'],['ເຂົ້າດ້ວຍ QR ເລືອກພາສາ ລົມກັບ Rami ແລະສັ່ງອາຫານ.','ລົມກັບ Rami ຕິດຕາມອໍເດີ ແລະຈັດການສິດພະນັກງານ.','ໜ້າຮ້ານຮັບແລະເສີບອາຫານ ຄົວແຕ່ງແລະແຈ້ງວ່າພ້ອມ.'],[
 ['ເຂົ້າ QR ແລະຕ້ອນຮັບ','Rami ຕ້ອນຮັບແລະຊ່ວຍເລືອກພາສາ.'],['ເລືອກເມນູຈາກຮູບ','ເບິ່ງຮູບ ລາຍລະອຽດ ແລະລາຄາ ແລ້ວເພີ່ມອາຫານ.'],['ຖາມ Rami','ລອງຄຳແນະນຳເມນູແລະສ່ວນປະກອບຕາມບົດສົນທະນາ.'],['ອໍເດີແລະສະຖານະ','ເບິ່ງເລກໂຕະ ລາຍການອາຫານ ແລະຄວາມຄືບໜ້າ.'],
 ['ລົມກັບຜູ້ຈັດການ','ຂໍໃຫ້ Rami ສະຫຼຸບຮ້ານມື້ນີ້.'],['ພາບລວມຮ້ານ','ເບິ່ງຊ່ອງທາງອໍເດີແລະເລກໂຕະ ແລ້ວເຮັດຂັ້ນຕໍ່ໄປ.'],['ຂໍ້ມູນການດຳເນີນງານ','ເບິ່ງຈຳນວນອໍເດີ ແລະເຂົ້າຂໍ້ມູນສາງ ພະນັກງານ ຫຼືພາສີ.'],['ພະນັກງານແລະສິດ','ຕັ້ງສິດເບິ່ງແລະເຮັດວຽກຂອງໜ້າຮ້ານແລະຄົວ. ຂະຫຍາຍເພື່ອເລື່ອນເບິ່ງທັງໝົດ.'],
 ['ໜ້າຮ້ານຮັບແລະເສີບ','ກວດໂຕະແລະອາຫານ ແລ້ວເສີບອາຫານທີ່ພ້ອມ.'],['ຄົວແຈ້ງວ່າພ້ອມ','ແຕ່ງອໍເດີທີ່ຮັບແລ້ວ ແລະແຈ້ງໜ້າຮ້ານ.'],['ເມນູພະນັກງານ','ເບິ່ງເມນູແລະສະຖານະຂາຍຕາມສິດຂອງຕົນ.']]],
 hi:['ऐप स्क्रीन गैलरी','मेहमान से मालिक तक,\nअसली स्क्रीन देखें।','Rami से बातचीत, ऑर्डर और कर्मचारी अनुमतियाँ देखें। भूमिका चुनें और तस्वीर खोलकर करीब से देखें।','Jumo डेमो की वास्तविक कोरियाई स्क्रीन। शीर्षक और विवरण चुनी भाषा में बदलते हैं। वास्तविक AI और भुगतान नहीं जुड़े हैं।','बड़ा करें','बंद करें','पिछली स्क्रीन','अगली स्क्रीन','तस्वीर सहेजें','ऐप आज़माएँ','ऐप चुनें',['मेहमान ऐप','मालिक ऐप','कर्मचारी ऐप'],['QR से आएँ, भाषा चुनें, Rami से बात करें और ऑर्डर दें।','मैनेजर Rami से बात करें, ऑर्डर देखें और कर्मचारी अनुमतियाँ सँभालें।','हॉल कर्मचारी ऑर्डर लेते और परोसते हैं; रसोई खाना बनाकर तैयार बताती है।'],[
 ['QR प्रवेश और स्वागत','Rami स्वागत करती है और भाषा चुनने में मदद करती है।'],['तस्वीरों से मेन्यू चुनें','तस्वीर, विवरण और दाम देखकर पसंद का व्यंजन जोड़ें।'],['Rami से पूछें','तैयार बातचीत में मेन्यू सुझाव और सामग्री की जानकारी देखें।'],['ऑर्डर और तैयारी','मेज़ नंबर, ऑर्डर और तैयारी की स्थिति एक जगह देखें।'],
 ['दुकान के मैनेजर से बात','Rami से आज की दुकान का सारांश माँगें।'],['दुकान का डैशबोर्ड','ऑर्डर का स्रोत और मेज़ नंबर देखें, फिर अगला काम करें।'],['कामकाज की जानकारी','ऑर्डर गिनती देखें और सामग्री, कर्मचारी या कर रिकॉर्ड खोलें।'],['कर्मचारी और अनुमतियाँ','हॉल और रसोई को देखने व काम करने की अनुमति दें। पूरा पेज देखने के लिए तस्वीर बड़ी करें।'],
 ['हॉल में ऑर्डर और सेवा','मेज़ और व्यंजन जाँचें, फिर तैयार खाना परोसें।'],['रसोई से तैयार होने की सूचना','स्वीकृत ऑर्डर पकाएँ और हॉल को तैयार स्थिति बताएँ।'],['कर्मचारी का मेन्यू','अपनी भूमिका के अनुसार मेन्यू और उपलब्धता देखें।']]]
};
export const GALLERY_COPY=Object.fromEntries(Object.entries(rows).map(([lang,row])=>[lang,Object.fromEntries(keys.map((key,i)=>[key,row[i]]))]));
const roles=['guest','owner','staff'];
const roleIcons=['chat','dashboard','profile'];
let selectedRole='guest';
export const galleryChapter=lang=>({id:'ui-gallery',title:(GALLERY_COPY[lang]||GALLERY_COPY.en).nav});
const imageTag=(screen,title,extra='')=>`<img src="${screen.src}" width="${screen.width}" height="${screen.height}" alt="${esc(title)}" ${extra}>`;

export function gallerySection(lang,number){
 const c=GALLERY_COPY[lang]||GALLERY_COPY.en;
 return `<section class="book-chapter chapter ui-gallery" id="ui-gallery" aria-labelledby="heading-ui-gallery"><div class="chapter-head"><span class="chapter-number">${String(number).padStart(2,'0')}</span><p>${esc(c.nav)}</p></div><div class="ui-gallery-heading"><div><h2 id="heading-ui-gallery">${esc(c.title).replace(/\n/g,'<br>')}</h2><p>${esc(c.intro)}</p></div><img src="assets/one-shop/poses/greeting.webp" alt="Rami" width="112" height="112" loading="lazy"></div><div class="ui-gallery-filters" role="group" aria-label="${esc(c.rolesLabel)}">${roles.map((role,i)=>`<button type="button" data-gallery-role="${role}" aria-pressed="${role===selectedRole}" aria-controls="gallery-panel-${role}">${icon(roleIcons[i])}<span>${esc(c.roles[i])}</span><b>${GALLERY_SCREENS.filter(s=>s.role===role).length}</b></button>`).join('')}</div>${roles.map((role,r)=>`<div class="ui-gallery-panel" id="gallery-panel-${role}" ${role===selectedRole?'':'hidden'}><p class="ui-gallery-role-summary">${esc(c.summaries[r])}</p><div class="ui-gallery-grid">${GALLERY_SCREENS.filter(s=>s.role===role).map((screen,i)=>{const [title,body]=c.screens[GALLERY_SCREENS.indexOf(screen)];return `<article class="ui-screen-card"><button class="ui-screen-image" type="button" data-gallery-open="${screen.id}" aria-label="${esc(title)} · ${esc(c.open)}">${imageTag(screen,title,'loading="lazy" decoding="async"')}<span class="ui-screen-enlarge">${icon('search')}${esc(c.open)}</span></button><div class="ui-screen-caption"><span class="ui-screen-step">${String(i+1).padStart(2,'0')}</span><h3>${esc(title)}</h3><p>${esc(body)}</p></div></article>`;}).join('')}</div></div>`).join('')}<div class="ui-gallery-footer"><p>${esc(c.note)}</p><a class="button secondary" href="#apps">${esc(c.tryApps)} ${icon('arrow')}</a></div><dialog class="ui-gallery-dialog" aria-labelledby="gallery-viewer-title" aria-describedby="gallery-viewer-caption"><div class="ui-viewer-header"><div><p id="gallery-viewer-role"></p><h3 id="gallery-viewer-title"></h3></div><button type="button" class="icon-button" data-gallery-close aria-label="${esc(c.close)}">${icon('close')}</button></div><div class="ui-viewer-scroll" tabindex="0" aria-label="${esc(c.open)}"><img id="gallery-viewer-image" alt=""></div><p id="gallery-viewer-caption"></p><div class="ui-viewer-controls"><button type="button" class="icon-button ui-viewer-previous" data-gallery-previous aria-label="${esc(c.previous)}">${icon('arrow')}</button><span id="gallery-viewer-count" role="status" aria-live="polite"></span><button type="button" class="icon-button" data-gallery-next aria-label="${esc(c.next)}">${icon('arrow')}</button><a data-gallery-download download>${esc(c.download)}</a></div></dialog></section>`;
}

export function bindGallery(root,lang){
 if(!root)return()=>{};
 const c=GALLERY_COPY[lang]||GALLERY_COPY.en,dialog=root.querySelector('dialog'),scroll=root.querySelector('.ui-viewer-scroll');
 let current=null,opener=null;
 const list=()=>GALLERY_SCREENS.filter(s=>s.role===current?.role);
 const show=screen=>{
  current=screen;const index=GALLERY_SCREENS.indexOf(screen),[title,caption]=c.screens[index],image=dialog.querySelector('img');
  image.src=screen.src;image.alt=title;image.width=screen.width;image.height=screen.height;
  dialog.querySelector('#gallery-viewer-title').textContent=title;
  dialog.querySelector('#gallery-viewer-role').textContent=c.roles[roles.indexOf(screen.role)];
  dialog.querySelector('#gallery-viewer-caption').textContent=caption;
  dialog.querySelector('#gallery-viewer-count').textContent=`${list().indexOf(screen)+1} / ${list().length}`;
  const download=dialog.querySelector('[data-gallery-download]');download.href=screen.src;download.download=`one-shop-ai-${screen.id}.webp`;
  scroll.scrollTop=0;
 };
 const step=delta=>{const screens=list();show(screens[(screens.indexOf(current)+delta+screens.length)%screens.length]);};
 const click=e=>{
  const role=e.target.closest('[data-gallery-role]');
  if(role){selectedRole=role.dataset.galleryRole;root.querySelectorAll('[data-gallery-role]').forEach(el=>el.setAttribute('aria-pressed',String(el===role)));roles.forEach(r=>{root.querySelector(`#gallery-panel-${r}`).hidden=r!==selectedRole;});return;}
  const open=e.target.closest('[data-gallery-open]');
  if(open){opener=open;show(GALLERY_SCREENS.find(s=>s.id===open.dataset.galleryOpen));dialog.showModal();document.body.classList.add('ui-gallery-modal');return;}
  if(e.target.closest('[data-gallery-close]'))dialog.close();
  if(e.target.closest('[data-gallery-previous]'))step(-1);
  if(e.target.closest('[data-gallery-next]'))step(1);
  if(e.target===dialog){const rect=dialog.getBoundingClientRect();if(e.clientX<rect.left||e.clientX>rect.right||e.clientY<rect.top||e.clientY>rect.bottom)dialog.close();}
 };
 const key=e=>{if(!dialog.open)return;if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();step(e.key==='ArrowLeft'?-1:1);}};
 const closed=()=>{document.body.classList.remove('ui-gallery-modal');opener?.focus({preventScroll:true});};
 root.addEventListener('click',click);dialog.addEventListener('keydown',key);dialog.addEventListener('close',closed);
 return()=>{if(dialog.open)dialog.close();root.removeEventListener('click',click);dialog.removeEventListener('keydown',key);dialog.removeEventListener('close',closed);document.body.classList.remove('ui-gallery-modal');};
}
