// Offline UI and fixed sample translations only. User input and source records
// marked data-original are preserved; no stored operational data is rewritten.
export const LANGUAGES = Object.freeze([
  Object.freeze({code: 'ko', name: '한국어', label: '한국어', locale: 'ko-KR'}),
  Object.freeze({code: 'en', name: 'English', label: 'English', locale: 'en-US'}),
  Object.freeze({code: 'vi', name: 'Tiếng Việt', label: 'Tiếng Việt', locale: 'vi-VN'})
]);

const rows = [
  ['one shop ai · 플랫폼 운영 어드민 상세 데모', 'one shop ai · platform admin demo', 'one shop ai · bản demo quản trị nền tảng'],
  ['본문으로 이동', 'Skip to content', 'Đến nội dung chính'],
  ['라미', 'Rami', 'Rami'],
  ['생각하는 라미', 'Rami thinking', 'Rami đang suy nghĩ'],
  ['원샵 글로벌 운영', 'Global operations', 'Vận hành toàn cầu'],
  ['상세 운영 데모 · v0.2', 'Interactive admin demo · v0.2', 'Demo quản trị chi tiết · v0.2'],
  ['관리자 메뉴', 'Admin navigation', 'Menu quản trị'],
  ['상세 업무 시나리오 ↗', 'Detailed workflows ↗', 'Quy trình nghiệp vụ chi tiết ↗'],
  ['아이작스튜디오 × 원컴퍼니 재단', 'Isaac Studio × One Company Foundation', 'Isaac Studio × Quỹ One Company'],
  ['관리 메뉴 열기', 'Open navigation', 'Mở menu quản trị'],
  ['관리 메뉴 닫기', 'Close navigation', 'Đóng menu quản trị'],
  ['플랫폼 운영', 'Platform operations', 'Vận hành nền tảng'],
  ['샵 · 주문 · 사건 검색', 'Search shops, orders and cases', 'Tìm quán, đơn hàng và yêu cầu hỗ trợ'],
  ['데모 역할', 'Demo role', 'Vai trò demo'],
  ['가상 데이터로 직접 운영해 보세요.', 'Explore admin workflows with fictional data.', 'Thử vận hành với dữ liệu giả lập.'],
  ['이 브라우저에 저장됩니다. 실제 AI·결제·메일은 연결하지 않았습니다.', 'Saved in this browser. Live AI, payments and email are not connected.', 'Dữ liệu được lưu trong trình duyệt này. Chưa kết nối AI thật, thanh toán hay email.'],
  ['로컬 저장 준비', 'Ready to save locally', 'Sẵn sàng lưu trên thiết bị'],
  ['기기 저장 실패', 'Could not save on this device', 'Không thể lưu trên thiết bị'],
  ['국가 범위', 'Country scope', 'Phạm vi quốc gia'],
  ['허용된 전체 국가', 'All permitted countries', 'Tất cả quốc gia được phép'],
  ['베트남', 'Vietnam', 'Việt Nam'],
  ['한국', 'South Korea', 'Hàn Quốc'],
  ['인도네시아', 'Indonesia', 'Indonesia'],
  ['한국어', 'Korean', 'Tiếng Hàn'],
  ['영어', 'English', 'Tiếng Anh'],
  ['베트남어', 'Vietnamese', 'Tiếng Việt'],
  ['중국어', 'Chinese', 'Tiếng Trung'],
  ['일본어', 'Japanese', 'Tiếng Nhật'],
  ['크메르어', 'Khmer', 'Tiếng Khmer'],
  ['인도네시아어', 'Indonesian', 'Tiếng Indonesia'],
  ['라오어', 'Lao', 'Tiếng Lào'],
  ['힌디어', 'Hindi', 'Tiếng Hindi'],
  ['언어', 'Language', 'Ngôn ngữ'],
  ['언어 선택', 'Choose language', 'Chọn ngôn ngữ'],
  ['화면 새로고침', 'Refresh view', 'Làm mới màn hình'],
  ['상세 운영 화면을 불러오는 중입니다.', 'Loading the admin workspace.', 'Đang tải màn hình quản trị chi tiết.'],
  ['가상 운영 데이터 · 2026.10.31', 'Fictional operations data · 2026-10-31', 'Dữ liệu vận hành giả lập · 31/10/2026'],
  ['데모 데이터 초기화', 'Reset demo data', 'Đặt lại dữ liệu demo'],
  ['상세 닫기', 'Close details', 'Đóng chi tiết'],
  ['운영', 'Operations', 'Vận hành'],
  ['운영 현황', 'Operations overview', 'Tổng quan vận hành'],
  ['샵·조직 관리', 'Shops and organizations', 'Quán và tổ chức'],
  ['주문·예약 진단', 'Order and reservation diagnostics', 'Kiểm tra đơn hàng và đặt bàn'],
  ['등록·게시 검토', 'Onboarding and publishing', 'Duyệt đăng ký và công khai quán'],
  ['지원과 승인', 'Support and approvals', 'Hỗ trợ và phê duyệt'],
  ['고객 지원', 'Customer support', 'Hỗ trợ khách hàng'],
  ['운영 승인함', 'Approval queue', 'Danh sách chờ phê duyệt'],
  ['수익과 서비스', 'Revenue and service', 'Doanh thu và dịch vụ'],
  ['구독·청구·환불', 'Subscriptions, billing and refunds', 'Gói dịch vụ, hóa đơn và hoàn tiền'],
  ['라미·사용량', 'Rami and usage', 'Rami và mức sử dụng'],
  ['운영자·샵 직원', 'Operators and shop staff', 'Nhân sự nền tảng và nhân viên quán'],
  ['확장과 품질', 'Expansion and quality', 'Mở rộng và chất lượng'],
  ['국가·파트너', 'Countries and partners', 'Quốc gia và đối tác'],
  ['콘텐츠·번역', 'Content and translations', 'Nội dung và bản dịch'],
  ['연동·장애 대응', 'Integrations and incidents', 'Tích hợp và xử lý sự cố'],
  ['샵 공지', 'Shop announcements', 'Thông báo cho quán'],
  ['통제와 설계', 'Governance and planning', 'Kiểm soát và kế hoạch'],
  ['감사·처리 기록', 'Audit and activity log', 'Nhật ký kiểm tra và xử lý'],
  ['개발기획 자료', 'Development plans', 'Tài liệu kế hoạch phát triển'],
  ['오늘 처리할 일과 플랫폼의 상태를 한곳에서 확인합니다.', 'See today’s priorities and platform health in one place.', 'Xem việc cần xử lý hôm nay và tình trạng nền tảng tại một nơi.'],
  ['샵별 공개·접수·구독 상태와 상세 운영 기록을 살펴보세요.', 'Review each shop’s visibility, intake, subscription and operating history.', 'Theo dõi trạng thái công khai, nhận đơn, gói dịch vụ và lịch sử vận hành của từng quán.'],
  ['손님 요청부터 샵 처리까지 전달 흐름을 확인합니다.', 'Trace requests from the guest through shop fulfillment.', 'Theo dõi yêu cầu từ khách đến khi quán xử lý.'],
  ['샵 준비 항목을 검토하고 공개 승인을 요청합니다.', 'Review onboarding checks and request permission to publish.', 'Kiểm tra việc chuẩn bị quán và gửi yêu cầu duyệt công khai.'],
  ['샵의 문의를 배정하고 답변과 해결 과정을 기록합니다.', 'Assign shop cases and record replies and resolutions.', 'Phân công yêu cầu của quán, lưu phản hồi và quá trình giải quyết.'],
  ['변경 이유와 영향을 확인하고 다른 담당자가 승인합니다.', 'A separate reviewer checks the reason and impact before approving a change.', 'Người duyệt độc lập kiểm tra lý do và ảnh hưởng trước khi phê duyệt thay đổi.'],
  ['원 통화별 청구와 가상 환불 원장을 확인합니다.', 'Review billing and simulated refunds in their original currencies.', 'Xem hóa đơn và sổ hoàn tiền giả lập theo đúng loại tiền gốc.'],
  ['샵별 시나리오 사용량과 할당량을 관리합니다. 실제 AI는 미연결입니다.', 'Manage sample usage and allowances by shop. Live AI is not connected.', 'Quản lý mức sử dụng và hạn mức giả lập theo quán. Chưa kết nối AI thật.'],
  ['본사 운영자와 샵 직원을 구분해 접근 범위를 관리합니다.', 'Manage platform operators and shop staff with separate access scopes.', 'Quản lý riêng phạm vi truy cập của nhân sự nền tảng và nhân viên quán.'],
  ['국가별 출시 조건과 현지 파트너의 담당 샵을 확인합니다.', 'Review country launch requirements and local partner assignments.', 'Kiểm tra điều kiện triển khai từng quốc gia và quán được giao cho đối tác địa phương.'],
  ['9개 언어의 안내 문구를 검수하고 버전별로 게시합니다.', 'Review prepared guidance in nine languages and publish approved versions.', 'Duyệt nội dung hướng dẫn ở chín ngôn ngữ và công bố theo phiên bản.'],
  ['실패한 작업과 영향을 받은 샵을 연결해 살펴봅니다.', 'Connect failed jobs with the shops they affect.', 'Đối chiếu tác vụ thất bại với các quán bị ảnh hưởng.'],
  ['대상 국가와 전달 경로를 골라 가상 공지를 준비합니다.', 'Choose a country and channel to prepare a demo announcement.', 'Chọn quốc gia và kênh để soạn thông báo giả lập.'],
  ['누가 무엇을 신청하고 처리했는지 추적합니다.', 'Trace who requested, reviewed and carried out each action.', 'Theo dõi ai gửi yêu cầu, phê duyệt và thực hiện từng thao tác.'],
  ['현재 데모의 범위와 실제 운영을 위한 개발 기준입니다.', 'Review the demo scope and requirements for a live platform.', 'Xem phạm vi demo và các điều kiện cần phát triển trước khi vận hành thật.'],
  ['공개 중', 'Published', 'Đã công khai'], ['초안', 'Draft', 'Bản nháp'], ['검토 중', 'Under review', 'Đang duyệt'],
  ['접수 중', 'Accepting orders', 'Đang nhận đơn'], ['일시 중지', 'Paused', 'Tạm dừng'], ['접수 중단', 'Intake closed', 'Ngừng nhận đơn'],
  ['이용 중', 'Active', 'Đang sử dụng'], ['체험 중', 'Trial', 'Đang dùng thử'], ['미납', 'Past due', 'Quá hạn thanh toán'],
  ['대기', 'Pending', 'Đang chờ'], ['승인·적용', 'Approved and applied', 'Đã duyệt và áp dụng'], ['거절', 'Rejected', 'Đã từ chối'],
  ['재검토 필요', 'Review again', 'Cần duyệt lại'], ['만료', 'Expired', 'Đã hết hạn'], ['가상 수금', 'Simulated collection', 'Thu tiền giả lập'],
  ['가상 환불', 'Simulated refund', 'Hoàn tiền giả lập'], ['홀 접수', 'Accepted by service staff', 'Phục vụ đã nhận'], ['조리 중', 'Preparing', 'Đang chế biến'],
  ['준비 완료', 'Ready', 'Đã sẵn sàng'], ['전달 완료', 'Served', 'Đã phục vụ'], ['취소', 'Cancel', 'Hủy'],
  ['예약 요청', 'Reservation requested', 'Yêu cầu đặt bàn'], ['예약 확정', 'Reservation confirmed', 'Đã xác nhận đặt bàn'],
  ['조사 중', 'Investigating', 'Đang kiểm tra'], ['응답 대기', 'Awaiting a reply', 'Đang chờ phản hồi'], ['해결', 'Resolved', 'Đã giải quyết'],
  ['정상', 'Healthy', 'Bình thường'], ['주의', 'Warning', 'Cần chú ý'], ['중단', 'Offline', 'Ngắt kết nối'], ['실패', 'Failed', 'Thất bại'],
  ['재시도 대기', 'Queued for retry', 'Chờ thử lại'], ['완료', 'Completed', 'Hoàn tất'], ['초대 대기', 'Invitation pending', 'Chờ nhận lời mời'],
  ['사용 중지', 'Suspended', 'Đã tạm khóa'], ['복구 관찰', 'Monitoring recovery', 'Theo dõi sau khắc phục'], ['파일럿', 'Pilot', 'Thử nghiệm thực tế'],
  ['준비 예정', 'Planned', 'Dự kiến chuẩn bị'], ['확인 완료', 'Checked', 'Đã kiểm tra'], ['높음', 'High', 'Cao'], ['보통', 'Medium', 'Trung bình'], ['낮음', 'Low', 'Thấp'],
  ['라미 시작', 'Rami Start', 'Rami Khởi đầu'], ['라미 파트너', 'Rami Partner', 'Rami Đồng hành'], ['라미 프로', 'Rami Pro', 'Rami Pro'],
  ['가상 처리 완료', 'Simulation complete', 'Đã xử lý giả lập'], ['미배정', 'Unassigned', 'Chưa phân công'],
  ['신규', 'New', 'Mới'], ['활성', 'Active', 'Đang hoạt động'], ['회수됨', 'Revoked', 'Đã thu hồi'], ['청구 예정', 'Invoice open', 'Hóa đơn chờ thanh toán'],
  ['시나리오', 'Scenario', 'Kịch bản'], ['미설정', 'Not configured', 'Chưa thiết lập'], ['시나리오 데모', 'Scripted demo', 'Demo theo kịch bản'],
  ['신규 접수 변경', 'Change order intake', 'Thay đổi trạng thái nhận đơn'], ['샵 공개 변경', 'Change shop visibility', 'Thay đổi trạng thái công khai quán'],
  ['구독 플랜 변경', 'Change subscription plan', 'Đổi gói dịch vụ'], ['AI 할당량 변경', 'Change AI allowance', 'Thay đổi hạn mức AI'],
  ['운영자 권한 변경', 'Change operator access', 'Thay đổi quyền nhân sự nền tảng'], ['번역 게시', 'Publish translation', 'Công bố bản dịch'],
  ['국가 파일럿 활성화', 'Activate country pilot', 'Kích hoạt thử nghiệm tại quốc gia'],
  ['본사 운영', 'Head office operations', 'Vận hành trụ sở'], ['운영 승인', 'Operations reviewer', 'Duyệt vận hành'],
  ['재무 신청', 'Finance requester', 'Người đề nghị tài chính'], ['재무 승인', 'Finance reviewer', 'Người duyệt tài chính'],
  ['기술 운영', 'Technical operations', 'Vận hành kỹ thuật'], ['국가 파트너', 'Country partner', 'Đối tác quốc gia'],
  ['보안·권한', 'Security and access', 'Bảo mật và phân quyền'], ['감사 읽기', 'Read-only auditor', 'Kiểm tra chỉ đọc'],
  ['본사 운영 · 민', 'Operations · Min', 'Vận hành · Min'], ['운영 승인 · 진', 'Operations reviewer · Jin', 'Duyệt vận hành · Jin'],
  ['고객 지원 · 하나', 'Support · Hana', 'Hỗ trợ · Hana'], ['재무 신청 · 수', 'Finance requester · Su', 'Đề nghị tài chính · Su'],
  ['재무 승인 · 리드', 'Finance reviewer · Lead', 'Duyệt tài chính · Lead'], ['기술 운영 · 준', 'Technical operations · Jun', 'Kỹ thuật · Jun'],
  ['베트남 파트너 · 린', 'Vietnam partner · Linh', 'Đối tác Việt Nam · Linh'], ['보안·권한 · 윤', 'Security · Yun', 'Bảo mật · Yun'],
  ['운영 범위의 샵', 'Shops in scope', 'Quán trong phạm vi'], ['진행 중인 주문', 'Orders in progress', 'Đơn đang xử lý'],
  ['지원이 필요한 문의', 'Cases needing support', 'Yêu cầu cần hỗ trợ'], ['검토 중인 변경', 'Changes awaiting review', 'Thay đổi đang chờ duyệt'],
  ['샵의 주문은 유지하면서, 필요한 지원과 운영 변경을 이어가세요.', 'Keep existing orders moving while handling support and operational changes.', 'Tiếp tục xử lý đơn hiện có trong khi hỗ trợ quán và thực hiện thay đổi vận hành.'],
  ['지원 사건 만들기', 'Create support case', 'Tạo yêu cầu hỗ trợ'], ['접수·조리·준비 상태를 함께 확인', 'Track acceptance, preparation and readiness', 'Theo dõi nhận đơn, chế biến và sẵn sàng'],
  ['높은 우선순위', 'High priority', 'Ưu tiên cao'], ['다른 담당자의 승인이 필요해요', 'A separate reviewer must approve', 'Cần một người khác phê duyệt'],
  ['최근 주문 발생 분포', 'Recent order distribution', 'Phân bố đơn hàng gần đây'], ['가상 주문 수 · 기준 시각 이전 14시간', 'Sample orders · 14 hours before the reference time', 'Đơn giả lập · 14 giờ trước thời điểm tham chiếu'],
  ['가상 주문 분포. 아래 자료표에서 같은 값을 확인할 수 있습니다.', 'Sample order distribution. The same values are available in the data table below.', 'Biểu đồ đơn giả lập. Bảng bên dưới cung cấp cùng các số liệu.'],
  ['차트 자료 보기', 'View chart data', 'Xem dữ liệu biểu đồ'], ['기준 시각으로부터 이전', 'Time before reference', 'Thời gian trước mốc tham chiếu'], ['주문 수', 'Orders', 'Số đơn'],
  ['주문 진단', 'Inspect order', 'Kiểm tra đơn'], ['상태를 바꾸지 않고 전달 흐름을 살펴봅니다.', 'Inspect the handoff without changing order status.', 'Kiểm tra luồng chuyển đơn mà không thay đổi trạng thái.'],
  ['우선 확인할 문의', 'Priority cases', 'Yêu cầu cần ưu tiên'], ['대기 중인 문의가 없습니다.', 'No cases are waiting.', 'Không có yêu cầu đang chờ.'], ['전체 보기', 'View all', 'Xem tất cả'],
  ['샵 준비 진행', 'Onboarding progress', 'Tiến độ chuẩn bị quán'], ['모든 샵이 공개 중입니다.', 'All shops are published.', 'Tất cả quán đã công khai.'], ['검토하기', 'Review', 'Xem xét'],
  ['연동과 장애', 'Integrations and incidents', 'Tích hợp và sự cố'], ['현재 범위의 장애가 없습니다.', 'No incidents in this scope.', 'Không có sự cố trong phạm vi này.'], ['상태 보기', 'View status', 'Xem trạng thái'],
  ['청구 확인', 'Billing review', 'Kiểm tra hóa đơn'], ['청구 보기', 'View billing', 'Xem hóa đơn'],
  ['국가가 다른 금액은 합산하지 않습니다. 샘플 청구이며 실제 매출이 아닙니다.', 'Amounts in different currencies are kept separate. These sample invoices are not real revenue.', 'Không cộng gộp các loại tiền khác nhau. Hóa đơn mẫu không phải doanh thu thực tế.'],
  ['이 범위에 해당하는 항목이 없습니다.', 'No records in this scope.', 'Không có mục nào trong phạm vi này.'], ['검색어나 필터를 바꿔보세요.', 'Try a different search or filter.', 'Hãy thử từ khóa hoặc bộ lọc khác.'],
  ['목록 검색', 'Search this list', 'Tìm trong danh sách'], ['상태 필터', 'Filter by status', 'Lọc theo trạng thái'], ['모든 상태', 'All statuses', 'Tất cả trạng thái'],
  ['현재 페이지 CSV', 'Export this page as CSV', 'Xuất trang này ra CSV'], ['이전 페이지', 'Previous page', 'Trang trước'], ['다음 페이지', 'Next page', 'Trang sau'],
  ['샵 이름, ID, 조직, 도시 검색', 'Search shop, ID, organization or city', 'Tìm tên quán, ID, tổ chức hoặc thành phố'],
  ['샵 / 조직', 'Shop / organization', 'Quán / tổ chức'], ['지역', 'Location', 'Khu vực'], ['공개 / 접수', 'Visibility / intake', 'Công khai / nhận đơn'],
  ['구독 플랜', 'Subscription plan', 'Gói dịch vụ'], ['사용량', 'Usage', 'Mức sử dụng'], ['상세', 'Details', 'Chi tiết'], ['샵 열기', 'Open shop', 'Mở quán'],
  ['샵 개요', 'Shop overview', 'Tổng quan quán'], ['준비·게시', 'Onboarding and publishing', 'Chuẩn bị và công khai'], ['메뉴 8', 'Menu · 8 items', 'Thực đơn · 8 món'],
  ['주문·예약', 'Orders and reservations', 'Đơn hàng và đặt bàn'], ['샵 직원', 'Shop staff', 'Nhân viên quán'], ['구독·청구', 'Subscription and billing', 'Gói dịch vụ và hóa đơn'],
  ['지원 사건', 'Support cases', 'Yêu cầu hỗ trợ'], ['변경 이력', 'Change history', 'Lịch sử thay đổi'], ['샵 정보', 'Shop information', 'Thông tin quán'],
  ['소유 조직', 'Owning organization', 'Tổ chức sở hữu'], ['조직 ID', 'Organization ID', 'ID tổ chức'], ['업종', 'Business type', 'Loại hình kinh doanh'],
  ['국가 / 도시', 'Country / city', 'Quốc gia / thành phố'], ['표시 언어', 'Display language', 'Ngôn ngữ hiển thị'], ['통화', 'Currency', 'Tiền tệ'], ['현지 시간대', 'Local time zone', 'Múi giờ địa phương'],
  ['영업시간', 'Opening hours', 'Giờ mở cửa'], ['17:00–23:00 · 샘플', '17:00–23:00 · sample', '17:00–23:00 · ví dụ'],
  ['가상 오너', 'Fictional owner', 'Chủ quán giả lập'], ['연락처', 'Contact', 'Liên hệ'], ['파트너', 'Partner', 'Đối tác'], ['본사 직접 지원', 'Direct head office support', 'Trụ sở hỗ trợ trực tiếp'],
  ['정보 버전', 'Information version', 'Phiên bản thông tin'], ['공개 정보 수정', 'Edit public information', 'Sửa thông tin công khai'], ['접수 변경 신청', 'Request intake change', 'Đề nghị đổi trạng thái nhận đơn'],
  ['서로 독립된 운영 상태', 'Separate operating states', 'Các trạng thái vận hành độc lập'], ['공개', 'Published', 'Công khai'], ['신규 접수', 'New order intake', 'Nhận đơn mới'], ['구독', 'Subscription', 'Gói dịch vụ'],
  ['미납·접수 중지는 별개입니다. 기존 주문과 예약은 지우거나 강제로 변경하지 않습니다.', 'Past-due billing and paused intake are separate. Existing orders and reservations remain intact.', 'Quá hạn thanh toán và tạm dừng nhận đơn là hai trạng thái riêng. Không xóa hay ép đổi đơn hàng, đặt bàn hiện có.'],
  ['바로 확인하기', 'Quick checks', 'Kiểm tra nhanh'], ['가상 주문', 'Sample orders', 'Đơn giả lập'], ['가상 예약', 'Sample reservations', 'Đặt bàn giả lập'],
  ['열린 지원 사건', 'Open support cases', 'Yêu cầu hỗ trợ chưa đóng'], ['메뉴 항목', 'Menu items', 'Món trong thực đơn'], ['연동 확인', 'Check integrations', 'Kiểm tra tích hợp'],
  ['오너가 등록한 메뉴', 'Menu submitted by the owner', 'Thực đơn do chủ quán đăng'], ['메뉴 / 분류', 'Menu item / category', 'Món / danh mục'], ['가격', 'Price', 'Giá'], ['재료', 'Ingredients', 'Nguyên liệu'],
  ['알레르기 / 판매', 'Allergens / availability', 'Dị ứng / tình trạng bán'], ['판매 중', 'Available', 'Đang bán'], ['일시 품절', 'Temporarily sold out', 'Tạm hết món'],
  ['메뉴 수정 검토 문의', 'Open a menu review case', 'Gửi yêu cầu xem xét sửa thực đơn'], ['플랫폼에서 오너의 메뉴·가격 원본을 바로 덮어쓰지 않습니다.', 'Platform staff cannot directly overwrite the owner’s original menu or prices.', 'Nhân sự nền tảng không ghi đè trực tiếp thực đơn hay giá gốc của chủ quán.'],
  ['주문 전달 기록', 'Order handoff history', 'Lịch sử chuyển đơn'], ['주문', 'Order', 'Đơn hàng'], ['접속 경로', 'Entry channel', 'Kênh truy cập'], ['상태', 'Status', 'Trạng thái'],
  ['금액', 'Amount', 'Số tiền'], ['열기', 'Open', 'Mở'], ['온라인 배달', 'Online delivery', 'Giao hàng trực tuyến'], ['진단', 'Inspect', 'Kiểm tra'],
  ['예약 기록', 'Reservation history', 'Lịch sử đặt bàn'], ['예약', 'Reservation', 'Đặt bàn'], ['예약 일시', 'Reservation date and time', 'Ngày giờ đặt bàn'], ['인원', 'Party size', 'Số khách'],
  ['샵 오너·홀·주방 직원', 'Shop owner, service and kitchen team', 'Chủ quán, phục vụ và bếp'], ['직원', 'Staff member', 'Nhân viên'], ['샵 역할', 'Shop role', 'Vai trò tại quán'],
  ['권한', 'Permissions', 'Quyền hạn'], ['최근 접속', 'Last seen', 'Truy cập gần nhất'], ['권한 검토 문의', 'Open an access review case', 'Gửi yêu cầu xem xét quyền'],
  ['샵 직원의 등록·삭제는 오너의 권한입니다. 플랫폼 운영자 초대와 구분합니다.', 'Shop owners manage their staff. This is separate from inviting platform operators.', 'Chủ quán quản lý việc thêm, xóa nhân viên quán. Đây là quy trình riêng với mời nhân sự nền tảng.'],
  ['구독 계약 · 가상', 'Subscription contract · simulated', 'Hợp đồng gói dịch vụ · giả lập'], ['플랜', 'Plan', 'Gói dịch vụ'], ['월 요금 예시', 'Sample monthly fee', 'Phí tháng minh họa'],
  ['국가별 가격 미확정', 'Country pricing not set', 'Chưa chốt giá cho quốc gia'], ['시나리오 할당', 'Scenario allowance', 'Hạn mức kịch bản'], ['현재 사용', 'Current usage', 'Đã sử dụng'], ['계약 버전', 'Contract version', 'Phiên bản hợp đồng'],
  ['플랜 변경 신청', 'Request plan change', 'Đề nghị đổi gói'], ['청구서', 'Invoice', 'Hóa đơn'], ['청구', 'Billing', 'Hóa đơn'], ['이 샵의 지원 사건', 'Support cases for this shop', 'Yêu cầu hỗ trợ của quán này'],
  ['사건', 'Case', 'Yêu cầu hỗ trợ'], ['담당자', 'Assignee', 'Người phụ trách'], ['최근 변경', 'Last updated', 'Cập nhật gần nhất'], ['샵 처리 이력', 'Shop activity history', 'Lịch sử xử lý của quán'],
  ['아직 처리한 이력이 없습니다.', 'No activity recorded yet.', 'Chưa có lịch sử xử lý.'], ['정보 수정 또는 승인 요청을 진행해 보세요.', 'Try editing information or requesting approval.', 'Hãy thử sửa thông tin hoặc gửi yêu cầu phê duyệt.'],
  ['샵 목록으로', 'Back to shops', 'Về danh sách quán'], ['샵 상세', 'Shop details', 'Chi tiết quán'], ['탭을 선택해 주세요.', 'Choose a tab.', 'Vui lòng chọn một thẻ.'],
  ['번호, 샵 이름, 테이블 검색', 'Search number, shop or table', 'Tìm mã, tên quán hoặc bàn'], ['예약 / 샵', 'Reservation / shop', 'Đặt bàn / quán'], ['인원 / 언어', 'Guests / language', 'Số khách / ngôn ngữ'],
  ['주문 / 샵', 'Order / shop', 'Đơn hàng / quán'], ['주문 경로', 'Order channel', 'Kênh đặt hàng'], ['메뉴 / 금액', 'Items / amount', 'Món / số tiền'], ['QR 접속', 'QR entry', 'Truy cập bằng QR'],
  ['예약 진단', 'Inspect reservation', 'Kiểm tra đặt bàn'], ['샵 준비 체크리스트', 'Shop onboarding checklist', 'Danh sách chuẩn bị quán'], ['검토', 'Review', 'Xem xét'], ['공개 전 최종 확인', 'Final checks before publishing', 'Kiểm tra cuối trước khi công khai'],
  ['준비 상태', 'Readiness', 'Tình trạng chuẩn bị'], ['공개 상태', 'Visibility', 'Trạng thái công khai'], ['샵 정보 버전', 'Shop information version', 'Phiên bản thông tin quán'], ['샵 공개 승인 신청', 'Request approval to publish', 'Đề nghị duyệt công khai quán'],
  ['보완이 필요하다면', 'If more information is needed', 'Khi cần bổ sung thông tin'], ['보완 요청 사건 만들기', 'Create a follow-up case', 'Tạo yêu cầu bổ sung'],
  ['샵 이름, 국가, 도시 검색', 'Search shop, country or city', 'Tìm quán, quốc gia hoặc thành phố'], ['준비 중인 샵', 'Shops being prepared', 'Quán đang chuẩn bị'], ['준비 항목', 'Onboarding checks', 'Hạng mục chuẩn bị'], ['준비 검토', 'Review onboarding', 'Xem việc chuẩn bị'],
  ['사건 번호, 제목, 샵, 담당자 검색', 'Search case ID, title, shop or assignee', 'Tìm mã yêu cầu, tiêu đề, quán hoặc người phụ trách'], ['사건 / 샵', 'Case / shop', 'Yêu cầu / quán'], ['우선순위', 'Priority', 'Mức ưu tiên'], ['새 지원 사건', 'New support case', 'Yêu cầu hỗ trợ mới'],
  ['지원 사건 목록', 'Back to support cases', 'Về danh sách yêu cầu hỗ trợ'], ['없음', 'None', 'Không có'], ['대화와 처리 메모', 'Conversation and case notes', 'Trao đổi và ghi chú xử lý'],
  ['내부 메모', 'Internal note', 'Ghi chú nội bộ'], ['샵 공개 답변 · 가상', 'Reply to shop · simulated', 'Phản hồi cho quán · giả lập'], ['메모 공개 범위', 'Note visibility', 'Phạm vi hiển thị ghi chú'],
  ['메모 / 답변 내용', 'Note or reply', 'Nội dung ghi chú / phản hồi'], ['기록 남기기', 'Add to case', 'Lưu vào yêu cầu'], ['사건 정보', 'Case information', 'Thông tin yêu cầu'],
  ['분류', 'Category', 'Phân loại'], ['생성 시각', 'Created at', 'Thời gian tạo'], ['연결 자료', 'Related record', 'Hồ sơ liên quan'], ['담당·상태 변경', 'Change assignee or status', 'Đổi người phụ trách hoặc trạng thái'],
  ['요청자', 'Requester', 'Người đề nghị'], ['기한', 'Deadline', 'Hạn xử lý'], ['신청 / 대상', 'Request / target', 'Yêu cầu / đối tượng'],
  ['청구 번호, 샵 이름, 기간 검색', 'Search invoice, shop or period', 'Tìm mã hóa đơn, quán hoặc kỳ'], ['청구서 / 샵', 'Invoice / shop', 'Hóa đơn / quán'], ['기간', 'Period', 'Kỳ'], ['원 금액', 'Original amount', 'Số tiền gốc'], ['청구 상세', 'Invoice details', 'Chi tiết hóa đơn'],
  ['가상 환불 원장', 'Simulated refund ledger', 'Sổ hoàn tiền giả lập'], ['환불 ID / 원 청구', 'Refund ID / original invoice', 'Mã hoàn tiền / hóa đơn gốc'], ['처리 상태', 'Processing status', 'Trạng thái xử lý'], ['연결 승인', 'Related approval', 'Phê duyệt liên quan'],
  ['샵 이름, 국가, 플랜 검색', 'Search shop, country or plan', 'Tìm quán, quốc gia hoặc gói'], ['샵 / 정책', 'Shop / policy', 'Quán / chính sách'], ['사용량 / 할당량', 'Usage / allowance', 'Đã dùng / hạn mức'], ['사용률', 'Utilization', 'Tỷ lệ sử dụng'], ['설정', 'Settings', 'Thiết lập'], ['할당량 신청', 'Request allowance change', 'Đề nghị đổi hạn mức'],
  ['출시 전 검증할 비용 정책', 'Cost policies to validate before launch', 'Chính sách chi phí cần kiểm chứng trước triển khai'], ['샵 질문에만 응답', 'Answer shop-related questions only', 'Chỉ trả lời câu hỏi về quán'], ['정형 주문은 계속', 'Keep standard ordering available', 'Tiếp tục nhận đơn theo biểu mẫu'], ['변경은 기록과 승인', 'Record and approve changes', 'Ghi nhận và phê duyệt thay đổi'],
  ['플랫폼 운영자', 'Platform operators', 'Nhân sự nền tảng'], ['직원, 샵, 역할 검색', 'Search staff, shop or role', 'Tìm nhân viên, quán hoặc vai trò'], ['직원 / 샵', 'Staff / shop', 'Nhân viên / quán'], ['확인', 'Check', 'Kiểm tra'], ['샵 명부', 'Shop staff list', 'Danh sách nhân viên quán'],
  ['운영자 이름, 역할, 국가 검색', 'Search operator, role or country', 'Tìm nhân sự, vai trò hoặc quốc gia'], ['운영 역할', 'Platform role', 'Vai trò nền tảng'], ['허용 범위', 'Allowed scope', 'Phạm vi được phép'], ['세션', 'Sessions', 'Phiên truy cập'], ['상태 / 상세', 'Status / details', 'Trạng thái / chi tiết'], ['국가 내 전체 샵', 'All shops in the permitted countries', 'Tất cả quán trong quốc gia được phép'], ['관리', 'Manage', 'Quản lý'], ['운영자 초대', 'Invite operator', 'Mời nhân sự nền tảng'],
  ['출시 단계', 'Launch stage', 'Giai đoạn triển khai'], ['대표 시간대', 'Default time zone', 'Múi giờ mặc định'], ['샵 수', 'Shop count', 'Số quán'], ['전체 출시 검토', 'Full launch review', 'Xem toàn bộ điều kiện triển khai'], ['현지 파트너 담당 범위', 'Local partner assignments', 'Phạm vi của đối tác địa phương'], ['국가', 'Country', 'Quốc gia'], ['할당된 샵', 'Assigned shops', 'Quán được phân công'], ['운영 원칙', 'Operating rules', 'Nguyên tắc vận hành'],
  ['국가·파트너 목록', 'Back to countries and partners', 'Về quốc gia và đối tác'], ['국가 검수도 전부 가상 시연입니다.', 'Country reviews are simulated too.', 'Việc kiểm tra quốc gia cũng hoàn toàn là giả lập.'], ['파일럿 활성화 승인', 'Country pilot approval', 'Phê duyệt kích hoạt thử nghiệm'], ['현재 단계', 'Current stage', 'Giai đoạn hiện tại'], ['확인 근거', 'Supporting evidence', 'Căn cứ kiểm tra'], ['기존 주문', 'Existing orders', 'Đơn hàng hiện có'], ['원본 유지', 'Keep original records', 'Giữ nguyên hồ sơ gốc'], ['승인 담당', 'Reviewer', 'Người duyệt'], ['파일럿 활성화 신청', 'Request pilot activation', 'Đề nghị kích hoạt thử nghiệm'], ['근거 검토', 'Review evidence', 'Xem căn cứ'],
  ['문구 키, 언어, 원문 검색', 'Search key, language or source text', 'Tìm khóa nội dung, ngôn ngữ hoặc bản gốc'], ['문구 / 언어', 'String / language', 'Nội dung / ngôn ngữ'], ['한국어 원문', 'Korean source', 'Bản gốc tiếng Hàn'], ['번역 예시', 'Sample translation', 'Bản dịch minh họa'], ['버전 / 상태', 'Version / status', 'Phiên bản / trạng thái'], ['편집', 'Edit', 'Chỉnh sửa'], ['검수', 'Review translation', 'Duyệt bản dịch'],
  ['연동·장애 목록', 'Back to integrations and incidents', 'Về tích hợp và sự cố'], ['대응 타임라인', 'Response timeline', 'Dòng thời gian xử lý'], ['영향받은 샵', 'Affected shops', 'Quán bị ảnh hưởng'], ['대응 상태 기록', 'Record incident status', 'Ghi nhận trạng thái xử lý'], ['대응 기록', 'Response history', 'Lịch sử xử lý'],
  ['연동, 제공자, 샵 검색', 'Search integration, provider or shop', 'Tìm tích hợp, nhà cung cấp hoặc quán'], ['연동 / 제공자', 'Integration / provider', 'Tích hợp / nhà cung cấp'], ['대상', 'Target', 'Đối tượng'], ['마지막 동기화', 'Last sync', 'Đồng bộ gần nhất'], ['진단 상세', 'Diagnostic details', 'Chi tiết kiểm tra'], ['실패 작업과 재시도', 'Failed jobs and retries', 'Tác vụ thất bại và thử lại'], ['작업 / 샵', 'Job / shop', 'Tác vụ / quán'], ['실패 사유', 'Failure reason', 'Lý do thất bại'], ['시도 / 상태', 'Attempts / status', 'Lần thử / trạng thái'], ['처리', 'Action', 'Xử lý'], ['재시도 신청', 'Request retry', 'Đề nghị thử lại'],
  ['공지 제목, 내용 검색', 'Search announcement title or body', 'Tìm tiêu đề hoặc nội dung thông báo'], ['공지', 'Announcement', 'Thông báo'], ['대상 / 채널', 'Audience / channel', 'Đối tượng / kênh'], ['버전', 'Version', 'Phiên bản'], ['전체 허용 국가', 'All permitted countries', 'Tất cả quốc gia được phép'], ['내용 확인', 'View content', 'Xem nội dung'], ['공지 작성', 'Write announcement', 'Soạn thông báo'],
  ['처리자, 작업, 대상, 결과 검색', 'Search actor, action, target or result', 'Tìm người xử lý, thao tác, đối tượng hoặc kết quả'], ['성공', 'Success', 'Thành công'], ['승인', 'Approved', 'Đã duyệt'], ['시간 / 처리자', 'Time / actor', 'Thời gian / người xử lý'], ['작업', 'Action', 'Thao tác'], ['요약', 'Summary', 'Tóm tắt'], ['결과', 'Result', 'Kết quả'], ['플랫폼', 'Platform', 'Nền tảng'],
  ['지금 직접 해볼 수 있는 일', 'What you can try now', 'Những việc có thể thử ngay'], ['실제 운영 전 필요한 개발', 'Work required before going live', 'Hạng mục cần phát triển trước khi vận hành thật'], ['개발 문서', 'Development documents', 'Tài liệu phát triển'], ['문서', 'Document', 'Tài liệu'], ['목적', 'Purpose', 'Mục đích'],
  ['범위와 운영 원칙', 'Scope and operating principles', 'Phạm vi và nguyên tắc vận hành'], ['화면별 작업과 책임', 'Screen workflows and responsibilities', 'Nghiệp vụ và trách nhiệm theo màn hình'], ['권한과 운영 통제', 'Permissions and governance', 'Phân quyền và kiểm soát vận hành'], ['데이터·API·국가 확장', 'Data, APIs and global expansion', 'Dữ liệu, API và mở rộng quốc gia'], ['개발 순서와 출시 조건', 'Delivery sequence and launch gates', 'Thứ tự phát triển và điều kiện triển khai'], ['연결된 상세 업무와 검수', 'Detailed end-to-end workflows and review', 'Quy trình chi tiết liên kết và kiểm tra'],
  ['제목', 'Title', 'Tiêu đề'], ['요청 내용 · 내부 메모', 'Request details · internal note', 'Nội dung yêu cầu · ghi chú nội bộ'], ['사건 만들기', 'Create case', 'Tạo yêu cầu'], ['연결 지원 사건', 'Related support case', 'Yêu cầu hỗ trợ liên quan'], ['연결하지 않음', 'No linked case', 'Không liên kết'], ['변경 사유', 'Reason for change', 'Lý do thay đổi'], ['검토 요청하기', 'Request review', 'Gửi đề nghị xét duyệt'],
  ['예약 전달 진단', 'Reservation handoff diagnostics', 'Kiểm tra chuyển đặt bàn'], ['주문 전달 진단', 'Order handoff diagnostics', 'Kiểm tra chuyển đơn hàng'], ['손님', 'Guest', 'Khách'], ['손님 언어', 'Guest language', 'Ngôn ngữ của khách'], ['요청 시각', 'Requested at', 'Thời gian yêu cầu'], ['요청 금액', 'Requested amount', 'Số tiền yêu cầu'], ['결제', 'Payment', 'Thanh toán'], ['미연결 · 미결제', 'Not connected · unpaid', 'Chưa kết nối · chưa thanh toán'],
  ['테이블 주문 · 미수집', 'Table order · not collected', 'Đơn tại bàn · không thu thập'], ['배달 주소', 'Delivery address', 'Địa chỉ giao hàng'], ['테이블 주문 · 해당 없음', 'Table order · not applicable', 'Đơn tại bàn · không áp dụng'], ['메뉴', 'Menu', 'Thực đơn'], ['수량', 'Quantity', 'Số lượng'], ['단가', 'Unit price', 'Đơn giá'], ['손님 원문', 'Guest’s original message', 'Nguyên văn của khách'], ['한국어 안내 · 준비된 문구', 'Korean guidance · prepared text', 'Hướng dẫn tiếng Hàn · nội dung soạn sẵn'], ['예약 메모', 'Reservation note', 'Ghi chú đặt bàn'], ['전달 타임라인', 'Handoff timeline', 'Dòng thời gian chuyển tiếp'], ['관련 문의 만들기', 'Create related case', 'Tạo yêu cầu liên quan'],
  ['청구서 상세 · 가상', 'Invoice details · simulated', 'Chi tiết hóa đơn · giả lập'], ['대상 샵', 'Shop', 'Quán liên quan'], ['청구 기간', 'Billing period', 'Kỳ thanh toán'], ['원 청구 금액', 'Original invoice amount', 'Số tiền hóa đơn gốc'], ['이미 가상 환불', 'Already refunded in demo', 'Đã hoàn tiền giả lập'], ['환불 가능 잔액', 'Refundable balance', 'Số dư có thể hoàn'], ['납기 / 가상 수금', 'Due date / simulated collection', 'Hạn thanh toán / thu tiền giả lập'], ['청구 항목', 'Invoice line', 'Khoản mục hóa đơn'], ['청구 이벤트', 'Invoice events', 'Diễn biến hóa đơn'], ['가상 환불 신청', 'Request simulated refund', 'Đề nghị hoàn tiền giả lập'], ['샵 계약', 'Shop contract', 'Hợp đồng của quán'], ['실결제·실제 수금 미연결', 'Live payments and collections are not connected', 'Chưa kết nối thanh toán và thu tiền thật'],
  ['검수된 문구 게시', 'Publish reviewed text', 'Công bố nội dung đã duyệt'], ['국가 전체', 'All shops in country scope', 'Tất cả quán trong phạm vi quốc gia'], ['신청자', 'Requested by', 'Người đề nghị'], ['신청 시각', 'Requested at', 'Thời gian đề nghị'], ['검토 기한', 'Review deadline', 'Hạn xét duyệt'], ['연결 사건', 'Linked case', 'Yêu cầu liên kết'], ['요청 사유', 'Request reason', 'Lý do đề nghị'], ['검토 결과', 'Review decision', 'Kết quả xét duyệt'], ['승인하고 가상 적용', 'Approve and simulate', 'Duyệt và áp dụng giả lập'], ['사유를 남기고 거절', 'Reject with a reason', 'Từ chối và ghi lý do'], ['검토 사유', 'Review reason', 'Lý do xét duyệt'], ['닫기', 'Close', 'Đóng'], ['검토 결과 저장', 'Save decision', 'Lưu kết quả xét duyệt'], ['검토자', 'Reviewed by', 'Người duyệt'], ['검토 시각', 'Reviewed at', 'Thời gian duyệt'], ['독립 승인 · 동일인 승인 불가', 'Independent approval · no self-approval', 'Phê duyệt độc lập · không tự duyệt'],
  ['플랫폼 운영자 상세', 'Platform operator details', 'Chi tiết nhân sự nền tảng'], ['이름', 'Name', 'Tên'], ['이메일 · 가상', 'Email · fictional', 'Email · giả lập'], ['역할', 'Role', 'Vai trò'], ['허용 국가', 'Permitted countries', 'Quốc gia được phép'], ['샵 범위', 'Shop scope', 'Phạm vi quán'], ['허용 국가의 전체 샵', 'All shops in permitted countries', 'Tất cả quán tại quốc gia được phép'], ['접속 세션 · 가상', 'Sessions · simulated', 'Phiên truy cập · giả lập'], ['기기 / 세션', 'Device / session', 'Thiết bị / phiên'], ['마지막 접속', 'Last seen', 'Truy cập gần nhất'], ['회수', 'Revoke', 'Thu hồi'], ['권한 변경 신청', 'Request access change', 'Đề nghị đổi quyền'], ['샵 직원과 별도 관리', 'Managed separately from shop staff', 'Quản lý riêng với nhân viên quán'],
  ['안내 문구 검수', 'Review guidance text', 'Duyệt nội dung hướng dẫn'], ['문구 키', 'String key', 'Khóa nội dung'], ['현재 상태', 'Current status', 'Trạng thái hiện tại'], ['초안 편집', 'Edit draft', 'Sửa bản nháp'], ['번역 게시 신청', 'Request translation publishing', 'Đề nghị công bố bản dịch'], ['준비된 문구 · 실제 AI 통역 미연결', 'Prepared text · live AI translation is not connected', 'Nội dung soạn sẵn · chưa kết nối phiên dịch AI thật'],
  ['대상 국가', 'Target country', 'Quốc gia nhận thông báo'], ['전달 화면', 'Destination screen', 'Màn hình nhận thông báo'], ['초안 수정', 'Edit draft', 'Sửa bản nháp'], ['가상 게시', 'Publish in demo', 'Công bố giả lập'], ['공지 초안 수정', 'Edit announcement draft', 'Sửa bản nháp thông báo'], ['샵 공지 작성', 'Write shop announcement', 'Soạn thông báo cho quán'], ['표시 대상', 'Audience', 'Đối tượng hiển thị'], ['오너 앱', 'Owner app', 'Ứng dụng chủ quán'], ['직원 앱', 'Staff app', 'Ứng dụng nhân viên'], ['손님 앱', 'Guest app', 'Ứng dụng khách'], ['공지 내용', 'Announcement body', 'Nội dung thông báo'], ['초안 저장', 'Save draft', 'Lưu bản nháp'],
  ['어떤 기록을 찾으세요?', 'What would you like to find?', 'Bạn muốn tìm hồ sơ nào?'], ['샵 이름, 주문 번호, 문의 제목', 'Shop name, order number or case title', 'Tên quán, mã đơn hàng hoặc tiêu đề hỗ trợ'], ['예: 주모, ORD, 예약', 'Try: Jumo, ORD, reservation', 'Ví dụ: Jumo, ORD, đặt bàn'], ['전체 검색', 'Global search', 'Tìm kiếm tổng hợp'], ['검색 결과가 없습니다.', 'No results found.', 'Không tìm thấy kết quả.'],
  ['지원 사건 담당·상태 변경', 'Update case assignee and status', 'Đổi người phụ trách và trạng thái yêu cầu'], ['변경 메모', 'Change note', 'Ghi chú thay đổi'], ['샵 공개 정보 수정', 'Edit public shop information', 'Sửa thông tin công khai của quán'], ['상호', 'Shop name', 'Tên quán'], ['도시', 'City', 'Thành phố'], ['기본 언어', 'Default language', 'Ngôn ngữ mặc định'], ['수정 사유', 'Reason for edit', 'Lý do chỉnh sửa'], ['정보 저장', 'Save information', 'Lưu thông tin'], ['확인 담당', 'Checked by', 'Người kiểm tra'], ['확인한 근거 · 실제 검증 자료 아님', 'Supporting evidence · not real verification', 'Căn cứ kiểm tra · không phải chứng cứ xác minh thật'], ['검토 저장', 'Save review', 'Lưu kết quả kiểm tra'], ['가상 확인 근거', 'Sample supporting evidence', 'Căn cứ kiểm tra giả lập'], ['신규 접수 상태', 'New order intake status', 'Trạng thái nhận đơn mới'], ['변경할 플랜', 'New plan', 'Gói muốn đổi'],
  ['플랫폼 운영자 초대 · 가상', 'Invite platform operator · simulated', 'Mời nhân sự nền tảng · giả lập'], ['가상 이메일', 'Fictional email', 'Email giả lập'], ['허용 국가 · 쉼표로 구분', 'Permitted countries · comma-separated', 'Quốc gia được phép · cách nhau bằng dấu phẩy'], ['담당 샵 · 비우면 허용 국가 전체', 'Assigned shops · leave blank for all permitted countries', 'Quán phụ trách · để trống để chọn toàn bộ quốc gia được phép'], ['예: VN-001,VN-002', 'Example: VN-001,VN-002', 'Ví dụ: VN-001,VN-002'], ['가상 초대 저장', 'Save simulated invitation', 'Lưu lời mời giả lập'], ['변경할 역할', 'New role', 'Vai trò muốn đổi'], ['허용 국가 · 쉼표 구분', 'Permitted countries · comma-separated', 'Quốc gia được phép · cách nhau bằng dấu phẩy'],
  ['가상 세션 회수', 'Revoke simulated session', 'Thu hồi phiên giả lập'], ['회수 사유', 'Reason for revocation', 'Lý do thu hồi'], ['세션 회수', 'Revoke session', 'Thu hồi phiên'], ['실패 작업 재시도 대기', 'Queue failed job for retry', 'Đưa tác vụ thất bại vào hàng chờ thử lại'], ['유지할 작업 번호', 'Operation ID to retain', 'Mã tác vụ cần giữ nguyên'], ['재시도 사유', 'Reason for retry', 'Lý do thử lại'], ['대기열에 넣기', 'Add to queue', 'Thêm vào hàng chờ'], ['장애 대응 상태 기록', 'Record incident response', 'Ghi nhận xử lý sự cố'], ['확인 결과와 다음 조치', 'Findings and next steps', 'Kết quả kiểm tra và bước tiếp theo'], ['대응 기록 저장', 'Save response', 'Lưu xử lý'], ['연동 진단 상세', 'Integration diagnostic details', 'Chi tiết kiểm tra tích hợp'], ['연동', 'Integration', 'Tích hợp'], ['제공자', 'Provider', 'Nhà cung cấp'], ['지연 예시', 'Sample latency', 'Độ trễ minh họa'], ['관련 작업', 'Related jobs', 'Tác vụ liên quan'], ['시도', 'Attempts', 'Lần thử'], ['재시도', 'Retry', 'Thử lại'], ['번역 문구', 'Translated text', 'Nội dung bản dịch'], ['공지 가상 게시', 'Publish announcement in demo', 'Công bố thông báo giả lập'], ['게시 사유', 'Reason for publishing', 'Lý do công bố'],
  ['상세 운영 데모', 'Interactive admin demo', 'Demo quản trị chi tiết'], ['가상 처리 · 이 브라우저에 저장', 'Simulated action · saved in this browser', 'Thao tác giả lập · lưu trong trình duyệt này'], ['저장하기', 'Save', 'Lưu'], ['접근 범위를 확인해 주세요.', 'Check your access scope.', 'Vui lòng kiểm tra phạm vi truy cập.'], ['운영 현황으로', 'Back to overview', 'Về tổng quan'], ['기획 시안', 'Design prototype', 'Bản thiết kế mẫu'], ['샘플', 'Sample', 'Mẫu'],
  ['operations', 'Operations', 'Vận hành'], ['operations_approver', 'Operations reviewer', 'Duyệt vận hành'], ['support', 'Support', 'Hỗ trợ'], ['finance', 'Finance requester', 'Đề nghị tài chính'], ['finance_approver', 'Finance reviewer', 'Duyệt tài chính'], ['technical', 'Technical operations', 'Kỹ thuật'], ['partner', 'Country partner', 'Đối tác quốc gia'], ['security', 'Security', 'Bảo mật'], ['auditor', 'Read-only auditor', 'Kiểm tra chỉ đọc'], ['floor', 'Service staff', 'Nhân viên phục vụ'], ['kitchen', 'Kitchen staff', 'Nhân viên bếp'], ['owner', 'Owner', 'Chủ quán'], ['staff', 'Staff', 'Nhân viên'], ['guest', 'Guest', 'Khách'],
  ['ordersView', 'View orders', 'Xem đơn hàng'], ['ordersAccept', 'Accept orders', 'Nhận đơn'], ['ordersPrepare', 'Prepare orders', 'Chế biến đơn'], ['ordersServe', 'Serve orders', 'Phục vụ món'], ['bookingsView', 'View reservations', 'Xem đặt bàn'], ['bookingsManage', 'Manage reservations', 'Quản lý đặt bàn'], ['requestsView', 'View guest requests', 'Xem yêu cầu của khách'], ['deliveryView', 'View delivery details', 'Xem thông tin giao hàng'], ['menuView', 'View menu', 'Xem thực đơn'], ['menuEdit', 'Edit menu', 'Sửa thực đơn'], ['salesView', 'View sales', 'Xem doanh số'], ['settingsView', 'View settings', 'Xem thiết lập'], ['settingsEdit', 'Edit settings', 'Sửa thiết lập']
];

rows.push(
  ['업무·SLA', 'Work and SLA', 'Công việc và SLA'],
  ['문의 기한과 담당 업무를 확인하고 해결까지 이어갑니다.', 'Track case deadlines and assignments through to resolution.', 'Theo dõi thời hạn, người phụ trách và xử lý yêu cầu đến khi hoàn tất.'],
  ['정책·요금 관리', 'Policies and pricing', 'Chính sách và giá dịch vụ'],
  ['국가별 체험·포함량·예산 정책을 검토하고 새 버전을 승인합니다.', 'Review country trial, allowance and budget policies, then approve a new version.', 'Xem chính sách dùng thử, hạn mức và ngân sách theo quốc gia, rồi duyệt phiên bản mới.'],
  ['운영 리포트', 'Operations reports', 'Báo cáo vận hành'],
  ['기간과 국가별 주문·지원·가상 청구 지표를 구분해 확인합니다.', 'Review orders, support and simulated billing separately by period and country.', 'Xem riêng chỉ số đơn hàng, hỗ trợ và hóa đơn giả lập theo kỳ và quốc gia.'],
  ['알림 센터', 'Notification center', 'Trung tâm thông báo'],
  ['내게 전달된 변경과 승인 알림을 읽고 관련 업무로 이동합니다.', 'Read your change and approval notifications, then open the related task.', 'Đọc thông báo thay đổi, phê duyệt dành cho bạn và mở công việc liên quan.'],
  ['데모 사용 안내', 'Demo guide', 'Hướng dẫn demo'],
  ['역할별 시연 순서와 실제 서비스 연결 범위를 확인합니다.', 'See the demo steps for each role and what still needs a live integration.', 'Xem các bước demo theo vai trò và phạm vi cần kết nối dịch vụ thật.'],
  ['프로덕션북으로', 'Open project book', 'Mở sách dự án'],
  ['상세 운영 데모 · v0.3', 'Interactive admin demo · v0.3', 'Demo quản trị chi tiết · v0.3'],
  ['데모 사용 안내 ↗', 'Demo guide ↗', 'Hướng dẫn demo ↗'],
  ['샵의 준비 조건과 근거를 먼저 확인합니다.', 'Check the shop’s readiness and supporting evidence first.', 'Kiểm tra điều kiện chuẩn bị và căn cứ của quán trước.'],
  ['브라우저 저장 공간이 부족합니다. 현재 화면에서만 유지됩니다.', 'Browser storage is full. Your changes will remain in this view only.', 'Bộ nhớ trình duyệt đã đầy. Thay đổi chỉ được giữ trong màn hình hiện tại.'],
  ['다른 탭에서 변경됐습니다. 창을 닫고 화면을 새로고침한 뒤 다시 확인해 주세요.', 'Another tab changed the data. Close this dialog, refresh the view and review it again.', 'Dữ liệu đã thay đổi ở thẻ khác. Hãy đóng hộp thoại, làm mới màn hình rồi kiểm tra lại.'],
  ['현재 데모 역할에서는 이 상세 정보를 열 수 없습니다.', 'This demo role cannot open these details.', 'Vai trò demo hiện tại không được mở chi tiết này.'],
  ['이 가상 역할의 활성 세션이 회수됐습니다. 다른 역할로 바꾸거나 데모를 초기화해 주세요.', 'This role’s simulated sessions have been revoked. Choose another role or reset the demo.', 'Phiên giả lập đang hoạt động của vai trò này đã bị thu hồi. Hãy chọn vai trò khác hoặc đặt lại demo.'],
  ['담당 범위에 포함된 샵만 볼 수 있습니다. 국가 필터도 확인해 주세요.', 'You can only view assigned shops. Check the country filter as well.', 'Bạn chỉ được xem quán trong phạm vi phụ trách. Hãy kiểm tra cả bộ lọc quốc gia.'],
  ['진단 화면입니다. 주문 접수·조리 완료·예약 변경은 샵의 홀·주방·오너 앱에서 처리합니다. 결제는 미연결입니다.', 'This is a diagnostic view. Acceptance, preparation and reservation changes belong in the shop’s service, kitchen and owner apps. Payments are not connected.', 'Đây là màn hình kiểm tra. Nhận đơn, hoàn tất chế biến và đổi đặt bàn được thực hiện tại ứng dụng phục vụ, bếp hoặc chủ quán. Chưa kết nối thanh toán.'],
  ['확인한 증거와 메뉴 버전을 기준으로 다른 담당자가 공개를 승인합니다.', 'A separate reviewer approves publishing against the checked evidence and menu version.', 'Người duyệt độc lập dựa vào căn cứ đã kiểm tra và phiên bản thực đơn để duyệt công khai.'],
  ['공개 승인으로 주문 접수를 자동으로 켜지 않습니다. 실제 계정·국가 출시 검증을 통과했다는 뜻도 아닙니다.', 'Publishing approval does not automatically enable order intake or confirm that live identity and country launch checks have passed.', 'Duyệt công khai không tự bật nhận đơn và cũng không có nghĩa là đã xác minh tài khoản thật hay đủ điều kiện triển khai quốc gia.'],
  ['오너에게 필요한 정보를 명확하게 남기고, 같은 사건에서 보완 과정을 확인하세요.', 'Tell the owner exactly what is needed and track the follow-up in the same case.', 'Ghi rõ thông tin cần chủ quán bổ sung và theo dõi ngay trong cùng yêu cầu hỗ trợ.'],
  ['지원 대화는 운영·고객지원·기술 담당과 배정된 파트너만 확인합니다.', 'Support conversations are limited to operations, support, technical staff and assigned partners.', 'Chỉ nhân sự vận hành, hỗ trợ, kỹ thuật và đối tác được phân công mới xem được trao đổi hỗ trợ.'],
  ['샵 공개 답변은 이 데모 안에서만 기록됩니다. 실제 이메일·앱 알림은 전송하지 않습니다.', 'Replies to the shop are saved only in this demo. No real email or app notification is sent.', 'Phản hồi cho quán chỉ được lưu trong demo. Không gửi email hay thông báo ứng dụng thật.'],
  ['내부 메모는 샵에 보이지 않습니다.', 'Internal notes are not visible to the shop.', 'Quán không nhìn thấy ghi chú nội bộ.'],
  ['신청과 승인을 나누면 실수를 한 번 더 막을 수 있어요.', 'A separate reviewer adds another check before a change is applied.', 'Tách người đề nghị và người duyệt giúp kiểm tra thêm trước khi áp dụng thay đổi.'],
  ['본인이 신청한 변경은 승인할 수 없습니다. 위의 데모 역할을 바꿔 승인 과정을 확인하세요.', 'You cannot approve your own request. Switch the demo role above to try the review step.', 'Bạn không thể tự duyệt yêu cầu của mình. Đổi vai trò demo phía trên để thử bước xét duyệt.'],
  ['신청 번호, 종류, 대상, 요청자 검색', 'Search request ID, type, target or requester', 'Tìm mã đề nghị, loại, đối tượng hoặc người gửi'],
  ['실제 돈을 이동하지 않습니다. 원 청구 금액은 보존합니다.', 'No real money moves. The original invoice amount is preserved.', 'Không chuyển tiền thật. Số tiền hóa đơn gốc được giữ nguyên.'],
  ['실제 모델은 연결하지 않았어요.', 'No live model is connected.', 'Chưa kết nối mô hình AI thật.'],
  ['아래 숫자는 요금제와 비용 통제를 설명하기 위한 가상 시나리오 사용량입니다.', 'The usage below is fictional and demonstrates plan allowances and cost controls.', 'Các số liệu bên dưới là giả lập để minh họa hạn mức gói dịch vụ và cách kiểm soát chi phí.'],
  ['메뉴·예약·영업 정보 범위를 벗어나면 안내로 돌려요.', 'Questions outside menus, reservations and shop information receive a limited response.', 'Câu hỏi ngoài thực đơn, đặt bàn và thông tin quán sẽ được hướng dẫn về đúng phạm vi.'],
  ['생성 예산과 주문 전달 권한을 구분합니다.', 'Generation budgets and order fulfillment rights are separate.', 'Ngân sách tạo nội dung và quyền xử lý đơn hàng được quản lý riêng.'],
  ['할당량 변경 전 영향과 요청 사유를 확인합니다.', 'Check the impact and reason before changing an allowance.', 'Kiểm tra ảnh hưởng và lý do trước khi thay đổi hạn mức.'],
  ['샵 직원의 권한은 각 샵 오너가 관리합니다. 본사에서 권한을 직접 바꾸지 않고, 샵별 지원 사건을 연결합니다.', 'Each shop owner manages staff access. Head office opens a support case rather than directly changing shop staff permissions.', 'Chủ quán quản lý quyền của nhân viên quán. Trụ sở tạo yêu cầu hỗ trợ thay vì sửa trực tiếp quyền của nhân viên.'],
  ['현재 역할은 플랫폼 운영자 명부를 열 수 없습니다. 샵 상세의 직원 탭은 따로 확인할 수 있습니다.', 'This role cannot open the platform operator directory. Shop staff can be checked in the shop’s staff tab.', 'Vai trò này không được mở danh sách nhân sự nền tảng. Có thể kiểm tra nhân viên quán ở thẻ nhân viên trong chi tiết quán.'],
  ['배정된 샵만 · 환불·본사 권한 승인 제외', 'Assigned shops only · no refund or head office access approvals', 'Chỉ quán được giao · không duyệt hoàn tiền hoặc quyền trụ sở'],
  ['샘플 근거를 확인 완료로 바꾸고 독립 승인을 거쳐 파일럿을 여는 로직입니다. 실제 법무·개인정보·세금 검증이 완료됐다는 의미는 아닙니다.', 'The demo marks sample evidence as checked and uses independent approval to open a pilot. It does not represent completed legal, privacy or tax review.', 'Demo đánh dấu căn cứ mẫu đã kiểm tra và dùng phê duyệt độc lập để mở thử nghiệm. Điều này không có nghĩa đã hoàn tất kiểm tra pháp lý, dữ liệu cá nhân hay thuế.'],
  ['국가의 필수 검토와 샵 준비 확인이 끝나야, 샵의 공개·접수 재개 승인도 적용할 수 있습니다.', 'Country launch checks and shop onboarding must be complete before publishing or reopening intake can be approved.', 'Phải hoàn tất điều kiện quốc gia và việc chuẩn bị quán trước khi duyệt công khai hoặc mở lại nhận đơn.'],
  ['한국어 원문과 9개 언어의 준비된 번역 예시입니다. 저장은 초안이며, 게시는 별도 승인을 거칩니다.', 'These are Korean source strings and prepared examples in nine languages. Saving creates a draft; publishing requires separate approval.', 'Đây là nội dung gốc tiếng Hàn và bản dịch mẫu ở chín ngôn ngữ. Lưu sẽ tạo bản nháp; công bố cần phê duyệt riêng.'],
  ['데모 장애 상태를 변경해도 실제 서비스·작업을 호출하지 않습니다.', 'Changing a demo incident does not call a live service or job.', 'Đổi trạng thái sự cố demo không gọi dịch vụ hay tác vụ thật.'],
  ['재시도는 가상 대기열에 넣습니다. 성공한 것처럼 바꾸지 않습니다.', 'A retry is queued in the demo. It is not marked as successful.', 'Thử lại được đưa vào hàng chờ giả lập, không tự đánh dấu thành công.'],
  ['신청·승인·변경·내보내기를 따라가세요.', 'Trace requests, approvals, changes and exports.', 'Theo dõi đề nghị, phê duyệt, thay đổi và xuất dữ liệu.'],
  ['이 기록은 브라우저에 저장하는 데모입니다. 운영 서버의 변경 불가능한 감사 로그를 대신하지 않습니다.', 'This demo log is stored in the browser. It is not a substitute for an immutable server audit log.', 'Nhật ký demo được lưu trong trình duyệt, không thay thế nhật ký kiểm tra bất biến trên máy chủ vận hành.'],
  ['샵 18개의 메뉴·직원·주문·예약·지원 이력 탐색', 'Explore menus, staff, orders, reservations and cases across 18 sample shops', 'Xem thực đơn, nhân viên, đơn hàng, đặt bàn và lịch sử hỗ trợ của 18 quán mẫu'],
  ['문의 생성, 담당 배정, 내부 메모와 샵 공개 답변 기록', 'Create cases, assign owners, and record internal notes and replies to shops', 'Tạo yêu cầu, phân công và ghi chú nội bộ hoặc phản hồi cho quán'],
  ['샵 정보·준비 체크·공개와 접수 변경 신청', 'Edit shop information, review checks and request visibility or intake changes', 'Sửa thông tin quán, kiểm tra chuẩn bị và đề nghị đổi công khai hoặc nhận đơn'],
  ['별도 담당자 승인, 가상 환불, 번역 게시', 'Try independent approvals, simulated refunds and translation publishing', 'Thử phê duyệt độc lập, hoàn tiền giả lập và công bố bản dịch'],
  ['본사 운영자 초대와 세션 회수, 권한 변경 승인', 'Invite platform operators, revoke sessions and approve access changes', 'Mời nhân sự nền tảng, thu hồi phiên và duyệt thay đổi quyền'],
  ['실패 작업 재시도 대기, 장애 대응 기록, 공지 초안', 'Queue failed jobs, record incident responses and draft announcements', 'Xếp hàng thử lại tác vụ, ghi nhận xử lý sự cố và soạn thông báo'],
  ['브라우저 새로고침 유지, 역할·국가 범위, 처리 기록', 'Keep demo changes after refresh and test role, country scope and activity logs', 'Giữ thay đổi sau khi làm mới, thử phạm vi vai trò, quốc gia và nhật ký xử lý'],
  ['서버 인증·MFA·조직별 권한과 데이터 접근 통제', 'Server authentication, MFA, organization permissions and data access controls', 'Xác thực máy chủ, MFA, quyền theo tổ chức và kiểm soát truy cập dữ liệu'],
  ['실제 샵 서버와 이벤트·대기열 연결, 재시도·멱등 처리', 'Live shop APIs, durable events and queues, retries and idempotency', 'Kết nối máy chủ quán, sự kiện và hàng chờ bền vững, thử lại và chống xử lý trùng'],
  ['변경 불가능한 감사 저장과 개인정보 접근 승인', 'Immutable audit storage and approved access to personal data', 'Lưu nhật ký kiểm tra bất biến và duyệt truy cập dữ liệu cá nhân'],
  ['국가별 계약·세금·결제사·환불 정책 검증', 'Validate country contracts, taxes, payment providers and refund policies', 'Kiểm chứng hợp đồng, thuế, đơn vị thanh toán và chính sách hoàn tiền theo quốc gia'],
  ['실제 AI 비용 계량과 사용량·청구 원장 분리', 'Measure real AI costs and separate usage from billing ledgers', 'Đo chi phí AI thật và tách sổ sử dụng khỏi sổ thanh toán'],
  ['모니터링, 백업 복구, 국가별 출시 승인', 'Monitoring, backup restoration and country launch approvals', 'Giám sát, khôi phục sao lưu và phê duyệt triển khai từng quốc gia'],
  ['현재 역할 선택은 시연 장치입니다. 실제 로그인·권한 보안을 구현한 상태로 배포하면 안 됩니다.', 'Role switching is a demo control, not live authentication or authorization. It must not be presented as production security.', 'Đổi vai trò chỉ là công cụ demo, không phải xác thực hay phân quyền thật. Không được giới thiệu như bảo mật cho hệ thống vận hành.'],
  ['현재 역할에는 문의 생성 권한이 없습니다.', 'This role cannot create support cases.', 'Vai trò này không có quyền tạo yêu cầu hỗ trợ.'],
  ['가상 문의를 저장합니다. 실제 메일이나 앱 알림은 보내지 않습니다.', 'Saves a fictional case. No real email or app notification is sent.', 'Lưu yêu cầu giả lập. Không gửi email hay thông báo ứng dụng thật.'],
  ['현재 범위에서 진단할 수 없습니다.', 'Diagnostics are not available in this scope.', 'Không thể kiểm tra trong phạm vi hiện tại.'],
  ['주문·예약 상태를 본사에서 강제로 바꾸지 않습니다. 조리 중 변경·취소 승인은 샵 오너의 권한입니다. 연락처와 주소는 마스킹된 가상 자료만 표시합니다.', 'Head office cannot force order or reservation status changes. The shop owner approves changes or cancellation during preparation. Only masked fictional contact details are shown.', 'Trụ sở không ép đổi trạng thái đơn hay đặt bàn. Chủ quán duyệt thay đổi hoặc hủy khi đã chế biến. Chỉ hiển thị liên hệ và địa chỉ giả lập đã che.'],
  ['현재 범위에서 청구를 열 수 없습니다.', 'This invoice is outside your access scope.', 'Hóa đơn này nằm ngoài phạm vi truy cập của bạn.'],
  ['원 청구 금액을 보존하고 환불을 별도 원장에 남깁니다. 미납·미수금 청구는 환불할 수 없습니다. 가상 환불을 신청하려면 ‘재무 신청 · 수’를 선택하세요.', 'The original invoice stays unchanged; refunds use a separate ledger. Unpaid invoices cannot be refunded. Choose “Finance requester · Su” to request a simulated refund.', 'Giữ nguyên số tiền hóa đơn gốc và ghi hoàn tiền ở sổ riêng. Không hoàn tiền hóa đơn chưa thu. Chọn “Đề nghị tài chính · Su” để gửi đề nghị hoàn tiền giả lập.'],
  ['현재 범위에 없는 요청입니다.', 'This request is outside your scope.', 'Yêu cầu này ngoài phạm vi của bạn.'],
  ['대상을 찾을 수 없습니다.', 'The target record was not found.', 'Không tìm thấy hồ sơ đích.'],
  ['청구 상세는 재무 또는 본사 운영 역할로 확인해 주세요.', 'Use a finance or head office operations role to view billing details.', 'Hãy chọn vai trò tài chính hoặc vận hành trụ sở để xem chi tiết hóa đơn.'],
  ['본인이 신청한 요청입니다. 다른 승인 역할로 전환해 주세요.', 'You submitted this request. Switch to a separate reviewer role.', 'Đây là yêu cầu bạn đã gửi. Hãy đổi sang vai trò người duyệt độc lập.'],
  ['승인 시 현재 권한·대상 버전·기한을 다시 검사하고 로컬 자료에 적용합니다.', 'Approval rechecks permissions, target version and deadline before updating local data.', 'Khi duyệt, hệ thống kiểm tra lại quyền, phiên bản đối tượng và thời hạn trước khi cập nhật dữ liệu cục bộ.'],
  ['현재 역할에는 이 종류의 승인 권한이 없습니다.', 'This role cannot approve this type of request.', 'Vai trò này không có quyền duyệt loại yêu cầu này.'],
  ['처리가 완료됐습니다.', 'Processing is complete.', 'Đã xử lý xong.'],
  ['해당 계정의 전체 범위를 확인할 권한이 없습니다.', 'You do not have access to this account’s full scope.', 'Bạn không có quyền xem toàn bộ phạm vi của tài khoản này.'],
  ['가상 세션 회수는 이 로컬 역할의 사용을 막습니다. 실제 로그인·MFA·접속 세션을 구현한 것은 아닙니다. 권한 변경 승인 시 기존 가상 세션도 회수합니다.', 'Revocation disables a local demo session. It is not a live login, MFA or session system. Approved access changes revoke existing simulated sessions too.', 'Thu hồi sẽ chặn phiên demo cục bộ, không phải hệ thống đăng nhập, MFA hay phiên truy cập thật. Khi duyệt đổi quyền, các phiên giả lập hiện có cũng bị thu hồi.'],
  ['게시 상태는 데모 안에만 저장됩니다. 실제 이메일·문자·푸시·앱 공지를 전송하지 않습니다.', 'Publication status is saved only in this demo. No real email, SMS, push or app announcement is sent.', 'Trạng thái công bố chỉ lưu trong demo. Không gửi email, SMS, thông báo đẩy hay thông báo ứng dụng thật.'],
  ['공지 저장·게시는 가상 처리입니다. 외부 전송은 없습니다.', 'Saving and publishing are simulated. Nothing is sent externally.', 'Lưu và công bố là giả lập. Không gửi ra bên ngoài.'],
  ['현재 역할과 국가 범위 안에서 찾습니다. 개인정보로 검색하지 않습니다.', 'Search stays within your role and country scope. Personal data is not searchable.', 'Chỉ tìm trong phạm vi vai trò và quốc gia được phép. Không tìm theo dữ liệu cá nhân.'],
  ['샵 이름이나 기록 번호를 입력해 주세요.', 'Enter a shop name or record ID.', 'Nhập tên quán hoặc mã hồ sơ.'],
  ['실제 출시 검증이 아닌 로컬 업무 시연 자료입니다.', 'These are local workflow examples, not verified launch evidence.', 'Đây là dữ liệu minh họa nghiệp vụ cục bộ, không phải căn cứ xác minh triển khai thật.'],
  ['가상 파일럿 활성화를 요청합니다.', 'Requesting activation of a simulated pilot.', 'Đề nghị kích hoạt thử nghiệm giả lập.'],
  ['실제 국가별 판매 허가는 아니며 샵 공개 승인은 별도로 진행합니다.', 'This is not permission to sell in the country. Shop publishing needs a separate approval.', 'Đây không phải giấy phép bán dịch vụ tại quốc gia. Công khai quán cần phê duyệt riêng.'],
  ['국가·통화·소유 조직은 여기서 바꿀 수 없습니다. 오너 확인을 받은 공개 정보만 수정하는 가상 흐름입니다.', 'Country, currency and owning organization cannot be changed here. This simulates editing public information confirmed by the owner.', 'Không đổi quốc gia, tiền tệ hay tổ chức sở hữu ở đây. Quy trình giả lập chỉ sửa thông tin công khai đã được chủ quán xác nhận.'],
  ['실제 국가별 출시 확인과는 별개인 가상 샵 준비 체크입니다.', 'This is a fictional shop checklist, separate from actual country launch verification.', 'Đây là kiểm tra chuẩn bị quán giả lập, tách biệt với xác minh triển khai quốc gia thật.'],
  ['접수를 다시 열 때는 국가와 샵의 준비 조건을 모두 확인합니다. 기존 주문은 유지합니다.', 'Reopening intake checks both country and shop readiness. Existing orders stay intact.', 'Mở lại nhận đơn cần kiểm tra điều kiện của cả quốc gia và quán. Đơn hiện có được giữ nguyên.'],
  ['국가와 샵의 준비 조건이 갖춰지기 전에는 공개 적용을 차단합니다.', 'Publishing is blocked until country and shop readiness checks are complete.', 'Chặn công khai cho đến khi đủ điều kiện chuẩn bị quốc gia và quán.'],
  ['과거 청구 원금은 바꾸지 않습니다. 국가별 가격은 기획용 예시입니다.', 'Historical invoice amounts do not change. Country prices are planning examples.', 'Không đổi số tiền gốc của hóa đơn cũ. Giá theo quốc gia chỉ là ví dụ cho kế hoạch.'],
  ['실제 모델을 켜거나 비용을 청구하지 않습니다.', 'No live model is enabled and no charges are made.', 'Không bật mô hình thật và không thu phí.'],
  ['실제 환불은 실행하지 않습니다. 재무 승인 · 리드가 별도로 확인합니다.', 'No real refund is issued. Finance reviewer · Lead must review it separately.', 'Không thực hiện hoàn tiền thật. Vai trò Duyệt tài chính · Lead cần xét riêng.'],
  ['국가 파트너는 담당 샵을 지정해야 합니다. 초대 메일 발송·실제 계정 활성화는 하지 않습니다.', 'Country partners need explicit shop assignments. No invitation email is sent and no live account is activated.', 'Đối tác quốc gia phải được chỉ định quán phụ trách. Không gửi email mời hoặc kích hoạt tài khoản thật.'],
  ['권한 변경이 승인되면 해당 운영자의 가상 세션을 모두 회수합니다. 자기 권한 변경은 신청하거나 승인할 수 없습니다.', 'Approving an access change revokes all of that operator’s simulated sessions. You cannot request or approve changes to your own access.', 'Khi duyệt đổi quyền, mọi phiên giả lập của nhân sự đó bị thu hồi. Không được tự đề nghị hoặc tự duyệt đổi quyền của mình.'],
  ['동일한 작업 번호를 유지해 가상 재시도 대기에 넣습니다. 외부 연동 호출이나 성공 확정은 하지 않습니다.', 'Retains the operation ID and queues a simulated retry. No external call is made and success is not assumed.', 'Giữ nguyên mã tác vụ và đưa vào hàng chờ thử lại giả lập. Không gọi tích hợp ngoài hoặc tự xác nhận thành công.'],
  ['조사 → 복구 관찰 → 해결 순서로 확인합니다. 해결한 사건은 재조사로 다시 열 수 있습니다.', 'Progress from investigation to recovery monitoring, then resolution. A resolved incident can be reopened for investigation.', 'Theo thứ tự kiểm tra → theo dõi khắc phục → giải quyết. Sự cố đã giải quyết có thể mở lại để kiểm tra.'],
  ['제공자와 지연은 가상 값입니다. 실제 POS·메일·결제 서버는 연결하지 않았습니다.', 'Providers and latency values are fictional. No live POS, email or payment server is connected.', 'Nhà cung cấp và độ trễ đều là giả lập. Chưa kết nối máy chủ POS, email hay thanh toán thật.'],
  ['저장하면 초안이 됩니다. 게시하려면 다른 담당자의 승인이 필요합니다.', 'Saving creates a draft. A separate reviewer must approve publication.', 'Lưu sẽ tạo bản nháp. Cần người duyệt độc lập trước khi công bố.'],
  ['실제 공지·메일·푸시는 발송하지 않습니다.', 'No real announcement, email or push notification is sent.', 'Không gửi thông báo, email hay thông báo đẩy thật.'],
  ['저장된 로컬 자료를 다시 불러왔습니다.', 'Reloaded the saved local data.', 'Đã tải lại dữ liệu cục bộ đã lưu.'],
  ['확인하려면 초기화를 입력하세요.', 'Type “초기화” to confirm.', 'Nhập “초기화” để xác nhận.'],
  ['초기화를 입력해 주세요.', 'Enter the exact confirmation word “초기화”.', 'Vui lòng nhập đúng từ xác nhận “초기화”.'],
  ['가상 데이터와 처리 기록을 초기화했습니다.', 'Demo data and activity history have been reset.', 'Đã đặt lại dữ liệu và lịch sử xử lý giả lập.'],
  ['데모 초기화', 'Reset demo', 'Đặt lại demo'],
  ['이 브라우저에서 만든 가상 문의·승인·처리 기록만 지워집니다. 원샵의 실제 앱과 주문에는 영향이 없습니다.', 'Only fictional cases, approvals and activity created in this browser are removed. Live one shop ai apps and orders are unaffected.', 'Chỉ xóa yêu cầu, phê duyệt và lịch sử giả lập trong trình duyệt này. Không ảnh hưởng ứng dụng hay đơn hàng thật của one shop ai.'],
  ['가상 자료에 저장했습니다.', 'Saved to demo data.', 'Đã lưu vào dữ liệu giả lập.'],
  ['계정 범위 또는 데모 자료가 바뀌어 열린 상세를 닫고 접근 범위를 다시 확인했습니다.', 'The account scope or demo data changed. Open details were closed and access was checked again.', 'Phạm vi tài khoản hoặc dữ liệu demo đã thay đổi. Đã đóng chi tiết đang mở và kiểm tra lại quyền truy cập.'],
  ['다른 탭에서 자료가 바뀌었습니다. 작성 중인 내용을 확인한 뒤 새로고침해 주세요.', 'Data changed in another tab. Review your draft, then refresh the view.', 'Dữ liệu đã đổi ở thẻ khác. Hãy kiểm tra nội dung đang viết rồi làm mới màn hình.'],
  ['다른 탭의 로컬 변경을 반영했습니다.', 'Applied local changes from another tab.', 'Đã cập nhật thay đổi cục bộ từ thẻ khác.'],
  ['저장된 체험 자료를 확인해 주세요.', 'Check the saved demo data.', 'Vui lòng kiểm tra dữ liệu demo đã lưu.'],
  ['아래 ‘데모 데이터 초기화’로 가상 자료를 다시 시작할 수 있습니다.', 'Use “Reset demo data” below to start again.', 'Chọn “Đặt lại dữ liệu demo” bên dưới để bắt đầu lại.']
);

rows.push(
  ['입력', 'Input', 'Dữ liệu nhập'], ['저장 데이터', 'Saved data', 'Dữ liệu đã lưu'], ['명령', 'Command', 'Lệnh'], ['작업 종류', 'Action type', 'Loại thao tác'], ['요청 식별자', 'Request ID', 'Mã yêu cầu'], ['명령 내용', 'Command payload', 'Nội dung lệnh'], ['변경 내용', 'Change details', 'Nội dung thay đổi'], ['권한 범위', 'Access scope', 'Phạm vi quyền'], ['승인 종류', 'Approval type', 'Loại phê duyệt'], ['변경 대상', 'Change target', 'Đối tượng thay đổi'], ['국가 활성화 상태', 'Country activation status', 'Trạng thái kích hoạt quốc gia'], ['접수 상태', 'Intake status', 'Trạng thái nhận đơn'], ['환불 금액', 'Refund amount', 'Số tiền hoàn'], ['AI 한도', 'AI allowance', 'Hạn mức AI'], ['요청 내용', 'Request details', 'Nội dung yêu cầu'], ['관련 자료', 'Related record', 'Hồ sơ liên quan'], ['관련 지원 요청', 'Related support case', 'Yêu cầu hỗ trợ liên quan'], ['지원 상태', 'Case status', 'Trạng thái hỗ trợ'], ['처리 메모', 'Case note', 'Ghi chú xử lý'], ['공개 정보', 'Public information', 'Thông tin công khai'], ['확인 상태', 'Check status', 'Trạng thái kiểm tra'], ['국가 확인 상태', 'Country check status', 'Trạng thái kiểm tra quốc gia'], ['국가 확인 근거', 'Country review evidence', 'Căn cứ kiểm tra quốc gia'], ['관리자 계정', 'Administrator account', 'Tài khoản quản trị'], ['이메일', 'Email', 'Email'], ['장애', 'Incident', 'Sự cố'], ['장애 상태', 'Incident status', 'Trạng thái sự cố'], ['장애 처리 메모', 'Incident response note', 'Ghi chú xử lý sự cố'], ['번역', 'Translation', 'Bản dịch'], ['공지 제목', 'Announcement title', 'Tiêu đề thông báo'], ['공지 본문', 'Announcement body', 'Nội dung thông báo'], ['공지 채널', 'Announcement channel', 'Kênh thông báo'], ['내보내기 행 수', 'Export row count', 'Số dòng xuất dữ liệu'], ['연동 작업', 'Integration job', 'Tác vụ tích hợp'], ['승인 요청', 'Approval request', 'Đề nghị phê duyệt'], ['지원 요청', 'Support case', 'Yêu cầu hỗ trợ'], ['샵', 'Shop', 'Quán'],
  ['지원하는 기본 언어를 선택하세요.', 'Choose a supported default language.', 'Chọn một ngôn ngữ mặc định được hỗ trợ.'],
  ['기본 언어 태그를 확인하세요.', 'Check the default language tag.', 'Kiểm tra mã ngôn ngữ mặc định.'],
  ['다른 담당자가 내용을 바꿨습니다. 최신 내용으로 다시 확인하세요.', 'Another operator changed this record. Review the latest version.', 'Một người khác đã sửa hồ sơ. Vui lòng kiểm tra phiên bản mới nhất.'],
  ['이 샵의 지원 업무를 처리할 수 있는 활성 담당자를 선택하세요.', 'Choose an active assignee with permission to handle this shop’s cases.', 'Chọn người đang hoạt động và có quyền xử lý hỗ trợ cho quán này.'],
  ['입력 구조가 너무 깊습니다.', 'The input is nested too deeply.', 'Cấu trúc dữ liệu nhập lồng nhau quá sâu.'],
  ['저장할 수 없는 입력값입니다.', 'This value cannot be saved.', 'Không thể lưu giá trị này.'],
  ['현재 담당자와 범위에서 이 작업을 할 수 없습니다.', 'Your current role and scope do not allow this action.', 'Vai trò và phạm vi hiện tại không cho phép thao tác này.'],
  ['전체 국가 작업 권한이 없습니다.', 'You do not have permission to act across all countries.', 'Bạn không có quyền thao tác trên tất cả quốc gia.'],
  ['이 국가의 작업 권한이 없습니다.', 'You do not have permission to act in this country.', 'Bạn không có quyền thao tác tại quốc gia này.'],
  ['대상 계정의 전체 범위를 관리할 권한이 없습니다.', 'You cannot manage the target account’s entire scope.', 'Bạn không có quyền quản lý toàn bộ phạm vi của tài khoản đích.'],
  ['국가 프로필을 찾을 수 없습니다.', 'Country profile not found.', 'Không tìm thấy hồ sơ quốc gia.'],
  ['이 승인 종류는 샵 한 곳의 변경이 아닙니다.', 'This approval type is not scoped to one shop.', 'Loại phê duyệt này không giới hạn ở một quán.'],
  ['변경 대상과 샵 범위가 일치하지 않습니다.', 'The target record does not match the shop scope.', 'Đối tượng thay đổi không khớp phạm vi quán.'],
  ['국가를 중복 없이 선택하세요.', 'Select countries without duplicates.', 'Chọn quốc gia, không chọn trùng.'],
  ['등록된 국가만 선택할 수 있습니다.', 'Only registered countries can be selected.', 'Chỉ chọn được quốc gia đã đăng ký.'],
  ['샵 범위를 지정하세요.', 'Specify a shop scope.', 'Chỉ định phạm vi quán.'],
  ['샵과 국가의 범위가 일치하지 않습니다.', 'The shop and country scopes do not match.', 'Phạm vi quán và quốc gia không khớp.'],
  ['국가 파트너는 담당 샵을 지정해야 합니다.', 'A country partner must have assigned shops.', 'Phải chỉ định quán phụ trách cho đối tác quốc gia.'],
  ['요금제를 선택하세요.', 'Choose a subscription plan.', 'Chọn một gói dịch vụ.'],
  ['해당 국가의 현지 요금안이 아직 준비되지 않았습니다.', 'Local pricing for this country is not ready yet.', 'Chưa có phương án giá địa phương cho quốc gia này.'],
  ['수납된 가상 청구에만 환불 시뮬레이션을 할 수 있습니다.', 'Only collected sample invoices can be used for refund simulation.', 'Chỉ mô phỏng hoàn tiền với hóa đơn mẫu đã thu.'],
  ['환불 가능한 가상 잔액을 초과했습니다.', 'The amount exceeds the simulated refundable balance.', 'Số tiền vượt quá số dư có thể hoàn giả lập.'],
  ['새 한도는 현재 사용량보다 커야 합니다.', 'The new allowance must exceed current usage.', 'Hạn mức mới phải lớn hơn lượng đã sử dụng.'],
  ['판매 가능한 메뉴와 가격을 먼저 확인하세요.', 'Check that at least one menu item is available at a valid price.', 'Trước tiên hãy kiểm tra có món đang bán với giá hợp lệ.'],
  ['샵 준비 확인과 근거가 모두 필요합니다.', 'Every shop onboarding check needs supporting evidence.', 'Mọi mục chuẩn bị quán đều cần được kiểm tra và có căn cứ.'],
  ['해당 국가의 파일럿 출시 조건과 근거를 먼저 확인하세요.', 'Check the country pilot requirements and supporting evidence first.', 'Trước tiên hãy kiểm tra điều kiện thử nghiệm tại quốc gia và căn cứ đi kèm.'],
  ['장애의 전체 샵 범위에 대한 권한이 필요합니다.', 'You need access to every shop affected by this incident.', 'Bạn cần quyền đối với tất cả quán bị ảnh hưởng bởi sự cố này.'],
  ['내보내기 대상을 확인하세요.', 'Check the export resource.', 'Kiểm tra đối tượng cần xuất dữ liệu.'],
  ['지원하지 않는 작업입니다.', 'This action is not supported.', 'Thao tác này chưa được hỗ trợ.'],
  ['다른 버전의 체험 자료입니다. 초기화가 필요합니다.', 'This demo data uses a different version. Reset it to continue.', 'Dữ liệu demo thuộc phiên bản khác. Cần đặt lại để tiếp tục.'],
  ['저장된 체험 자료를 읽을 수 없습니다. 초기화가 필요합니다.', 'The saved demo data cannot be read. Reset it to continue.', 'Không đọc được dữ liệu demo đã lưu. Cần đặt lại để tiếp tục.'],
  ['활성 관리자 역할을 선택하세요. 실제 로그인은 아닌 로컬 권한 시뮬레이션입니다.', 'Choose an active demo administrator. This is a local access simulation, not a real login.', 'Chọn vai trò quản trị demo đang hoạt động. Đây là giả lập quyền cục bộ, không phải đăng nhập thật.'],
  ['요청 식별자에 공백을 사용할 수 없습니다.', 'Request IDs cannot contain spaces.', 'Mã yêu cầu không được có khoảng trắng.'],
  ['명령 내용이 너무 큽니다.', 'The command payload is too large.', 'Nội dung lệnh quá lớn.'],
  ['같은 요청 번호로 다른 내용을 실행할 수 없습니다.', 'A request ID cannot be reused for a different action.', 'Không dùng lại cùng mã yêu cầu cho nội dung khác.'],
  ['관련 자료 종류가 올바르지 않습니다.', 'The related record type is invalid.', 'Loại hồ sơ liên quan không hợp lệ.'],
  ['다른 샵의 자료를 연결할 수 없습니다.', 'You cannot link another shop’s record.', 'Không thể liên kết hồ sơ của quán khác.'],
  ['관련 자료 종류를 먼저 선택하세요.', 'Select the related record type first.', 'Chọn loại hồ sơ liên quan trước.'],
  ['바꿀 내용이나 메모를 입력하세요.', 'Enter a change or a note.', 'Nhập nội dung thay đổi hoặc ghi chú.'],
  ['이 화면에서는 상호·도시·언어·영업시간만 바꿀 수 있습니다.', 'Only shop name, city, language and opening hours can be changed here.', 'Màn hình này chỉ cho sửa tên quán, thành phố, ngôn ngữ và giờ mở cửa.'],
  ['샵 준비 확인 항목이 없습니다.', 'Shop onboarding check not found.', 'Không tìm thấy mục kiểm tra chuẩn bị quán.'],
  ['국가 출시 확인 항목이 없습니다.', 'Country launch check not found.', 'Không tìm thấy mục kiểm tra triển khai quốc gia.'],
  ['자기 계정의 권한 변경을 요청할 수 없습니다.', 'You cannot request changes to your own access.', 'Bạn không thể đề nghị đổi quyền của chính mình.'],
  ['다른 샵의 지원 요청을 연결할 수 없습니다.', 'You cannot link a support case from another shop.', 'Không thể liên kết yêu cầu hỗ trợ của quán khác.'],
  ['관련 지원 요청을 볼 수 없습니다.', 'You cannot view the related support case.', 'Bạn không có quyền xem yêu cầu hỗ trợ liên quan.'],
  ['이미 처리된 승인 요청입니다.', 'This approval request has already been processed.', 'Đề nghị phê duyệt này đã được xử lý.'],
  ['신청자와 같은 계정은 승인하거나 거절할 수 없습니다.', 'The requester cannot approve or reject their own request.', 'Người gửi không được tự duyệt hoặc từ chối yêu cầu của mình.'],
  ['자기 계정의 권한 변경을 승인할 수 없습니다.', 'You cannot approve changes to your own access.', 'Bạn không thể duyệt thay đổi quyền của chính mình.'],
  ['승인 기한이 지났습니다. 최신 내용으로 다시 신청하세요.', 'The approval deadline has passed. Submit a new request using the latest information.', 'Đã quá hạn phê duyệt. Hãy gửi đề nghị mới theo thông tin hiện tại.'],
  ['대상 내용이 바뀌었습니다. 최신 버전으로 다시 검토하세요.', 'The target has changed. Review the latest version again.', 'Nội dung đối tượng đã thay đổi. Hãy kiểm tra lại phiên bản mới nhất.'],
  ['모든 국가 출시 항목의 확인 근거가 필요합니다.', 'All country launch checks need supporting evidence.', 'Tất cả mục kiểm tra triển khai quốc gia đều cần căn cứ.'],
  ['공개된 샵만 접수를 열 수 있습니다.', 'Only a published shop can open order intake.', 'Chỉ quán đã công khai mới được mở nhận đơn.'],
  ['빈 번역을 게시할 수 없습니다.', 'An empty translation cannot be published.', 'Không thể công bố bản dịch trống.'],
  ['승인 내용을 로컬 체험 자료에 반영했습니다. 운영 서버·AI·실제 결제는 실행하지 않았습니다.', 'The approved change was applied to local demo data. No live server, AI or payment action was run.', 'Đã áp dụng thay đổi được duyệt vào dữ liệu demo cục bộ. Không thực hiện thao tác máy chủ, AI hay thanh toán thật.'],
  ['이메일 형식을 확인하세요.', 'Check the email format.', 'Kiểm tra định dạng email.'],
  ['이미 등록된 이메일입니다.', 'This email is already registered.', 'Email này đã được đăng ký.'],
  ['대상 세션이 없습니다.', 'Session not found.', 'Không tìm thấy phiên truy cập.'],
  ['이미 회수된 세션입니다.', 'This session has already been revoked.', 'Phiên này đã bị thu hồi.'],
  ['실패한 작업만 재시도 대기에 넣을 수 있습니다.', 'Only failed jobs can be queued for retry.', 'Chỉ tác vụ thất bại mới được đưa vào hàng chờ thử lại.'],
  ['재시도 한도에 도달했습니다. 원인을 먼저 확인하세요.', 'The retry limit has been reached. Check the cause first.', 'Đã đạt giới hạn thử lại. Hãy kiểm tra nguyên nhân trước.'],
  ['현재 장애 상태에서 허용되지 않는 단계입니다.', 'This transition is not allowed from the current incident status.', 'Không được chuyển sang bước này từ trạng thái sự cố hiện tại.'],
  ['초안만 게시 시뮬레이션을 할 수 있습니다.', 'Only drafts can be published in the simulation.', 'Chỉ bản nháp mới có thể được công bố giả lập.'],
  ['개인정보·본문·비밀값을 제외한 허용 필드만 내보낼 수 있습니다.', 'Only approved fields can be exported; personal data, message bodies and secrets are excluded.', 'Chỉ xuất được trường cho phép; loại trừ dữ liệu cá nhân, nội dung trao đổi và giá trị bí mật.'],
  ['현재 권한 범위보다 많은 행을 기록할 수 없습니다.', 'The export count exceeds your current access scope.', 'Số dòng xuất vượt phạm vi quyền hiện tại.'],
  ['로컬 지원 요청을 만들었습니다.', 'Created a local support case.', 'Đã tạo yêu cầu hỗ trợ cục bộ.'],
  ['지원 처리 내역을 저장했습니다.', 'Saved the case activity.', 'Đã lưu nội dung xử lý hỗ trợ.'],
  ['샵 공개 정보를 로컬에 저장했습니다.', 'Saved the shop’s public information locally.', 'Đã lưu thông tin công khai của quán trên thiết bị.'],
  ['준비 상태와 확인 근거를 저장했습니다.', 'Saved the onboarding status and evidence.', 'Đã lưu trạng thái chuẩn bị và căn cứ kiểm tra.'],
  ['국가 출시 확인 근거를 로컬에 저장했습니다. 실제 승인이나 법적 검증은 아닙니다.', 'Saved sample country launch evidence locally. This is not real approval or legal verification.', 'Đã lưu căn cứ triển khai quốc gia mẫu trên thiết bị. Đây không phải phê duyệt hay xác minh pháp lý thật.'],
  ['다른 담당자의 검토를 요청했습니다.', 'Requested an independent review.', 'Đã gửi đề nghị cho người duyệt độc lập.'],
  ['가상 초대를 저장했습니다. 메일 발송이나 실제 권한 활성화는 하지 않았습니다.', 'Saved the simulated invitation. No email was sent and no live access was activated.', 'Đã lưu lời mời giả lập. Không gửi email hoặc kích hoạt quyền thật.'],
  ['선택한 가상 세션을 회수했습니다.', 'Revoked the selected simulated session.', 'Đã thu hồi phiên giả lập đã chọn.'],
  ['같은 작업 번호로 재시도 대기에 넣었습니다. 외부 API는 호출하지 않았습니다.', 'Queued a retry with the same operation ID. No external API was called.', 'Đã xếp hàng thử lại với cùng mã tác vụ. Không gọi API bên ngoài.'],
  ['장애 처리 메모와 상태를 저장했습니다.', 'Saved the incident note and status.', 'Đã lưu ghi chú và trạng thái xử lý sự cố.'],
  ['번역 초안을 저장했습니다. 게시에는 독립 승인이 필요합니다.', 'Saved the translation draft. Publishing requires independent approval.', 'Đã lưu bản nháp dịch. Cần phê duyệt độc lập trước khi công bố.'],
  ['로컬 공지 초안을 저장했습니다.', 'Saved the announcement draft locally.', 'Đã lưu bản nháp thông báo trên thiết bị.'],
  ['로컬 게시 상태로 바꿨습니다. 외부 게시·메일 발송은 하지 않았습니다.', 'Marked as published in the local demo. Nothing was published externally and no email was sent.', 'Đã chuyển sang công bố trong demo cục bộ. Không công bố bên ngoài hoặc gửi email.'],
  ['현재 권한 범위의 로컬 CSV 내보내기를 기록했습니다. 외부 전송은 하지 않았습니다.', 'Recorded a local CSV export within your scope. No external transfer was made.', 'Đã ghi nhận xuất CSV cục bộ trong phạm vi của bạn. Không truyền dữ liệu ra bên ngoài.'],
  ['가상 관리자 초대 · 발송/활성화 안 함', 'Simulated administrator invitation · no delivery or activation', 'Mời quản trị giả lập · không gửi hoặc kích hoạt'],
  ['가상 관리자 세션 회수', 'Revoke simulated administrator session', 'Thu hồi phiên quản trị giả lập'],
  ['연동 재시도 대기 · 기존 operationId 유지', 'Integration retry queued · original operationId retained', 'Chờ thử lại tích hợp · giữ nguyên operationId'],
  ['공지 게시 시뮬레이션 · 실제 발송 없음', 'Announcement publication simulated · no real delivery', 'Giả lập công bố thông báo · không gửi thật']
);

rows.push(
  ['카페', 'Café', 'Quán cà phê'], ['식당', 'Restaurant', 'Quán ăn'], ['레스토랑', 'Restaurant', 'Nhà hàng'], ['한식 주점', 'Korean dining bar', 'Quán ăn và đồ uống Hàn Quốc'],
  ['다낭', 'Da Nang', 'Đà Nẵng'], ['하노이', 'Hanoi', 'Hà Nội'], ['호치민', 'Ho Chi Minh City', 'TP. Hồ Chí Minh'], ['호이안', 'Hoi An', 'Hội An'], ['후에', 'Hue', 'Huế'], ['냐짱', 'Nha Trang', 'Nha Trang'], ['달랏', 'Da Lat', 'Đà Lạt'], ['푸꾸옥', 'Phu Quoc', 'Phú Quốc'], ['서울', 'Seoul', 'Seoul'], ['제주', 'Jeju', 'Jeju'], ['부산', 'Busan', 'Busan'], ['강릉', 'Gangneung', 'Gangneung'], ['경주', 'Gyeongju', 'Gyeongju'], ['발리', 'Bali', 'Bali'], ['우붓', 'Ubud', 'Ubud'], ['자카르타', 'Jakarta', 'Jakarta'],
  ['아메리카노', 'Americano', 'Cà phê Americano'], ['카페라테', 'Caffè latte', 'Cà phê latte'], ['코코넛 커피', 'Coconut coffee', 'Cà phê dừa'], ['망고 요거트', 'Mango yogurt', 'Sữa chua xoài'], ['버터 크루아상', 'Butter croissant', 'Bánh croissant bơ'], ['바나나 브레드', 'Banana bread', 'Bánh chuối'], ['딸기 치즈 케이크', 'Strawberry cheesecake', 'Bánh phô mai dâu tây'], ['자스민 티', 'Jasmine tea', 'Trà lài'],
  ['불고기 덮밥', 'Bulgogi rice bowl', 'Cơm bò bulgogi'], ['바삭 감자전', 'Crispy potato pancake', 'Bánh khoai tây chiên giòn'], ['김치전', 'Kimchi pancake', 'Bánh xèo kimchi'], ['닭구이 플레이트', 'Grilled chicken plate', 'Đĩa gà nướng'], ['버섯 채소 비빔밥', 'Mushroom and vegetable bibimbap', 'Cơm trộn nấm và rau củ'], ['해물 떡볶이', 'Seafood tteokbokki', 'Bánh gạo cay hải sản'], ['유자 에이드', 'Yuzu soda', 'Soda yuzu'], ['제철 과일 접시', 'Seasonal fruit plate', 'Đĩa trái cây theo mùa'],
  ['커피', 'Coffee', 'Cà phê'], ['시그니처', 'Signature', 'Đặc trưng'], ['음료', 'Drinks', 'Đồ uống'], ['베이커리', 'Bakery', 'Bánh nướng'], ['디저트', 'Desserts', 'Tráng miệng'], ['차', 'Tea', 'Trà'], ['식사', 'Meals', 'Món ăn'], ['안주', 'Sharing plates', 'Món nhắm'], ['메인', 'Main dishes', 'Món chính'],
  ['커피 원두, 물', 'Coffee beans, water', 'Hạt cà phê, nước'], ['커피 원두, 우유', 'Coffee beans, milk', 'Hạt cà phê, sữa'], ['커피 원두, 코코넛 크림, 우유', 'Coffee beans, coconut cream, milk', 'Hạt cà phê, kem dừa, sữa'], ['망고, 요거트, 얼음', 'Mango, yogurt, ice', 'Xoài, sữa chua, đá'], ['밀가루, 버터, 달걀', 'Wheat flour, butter, egg', 'Bột mì, bơ, trứng'], ['바나나, 밀가루, 달걀, 호두', 'Banana, wheat flour, egg, walnut', 'Chuối, bột mì, trứng, óc chó'], ['딸기, 크림치즈, 밀가루', 'Strawberry, cream cheese, wheat flour', 'Dâu tây, phô mai kem, bột mì'], ['자스민 찻잎, 물', 'Jasmine tea leaves, water', 'Lá trà lài, nước'],
  ['쌀, 소고기, 양파, 간장', 'Rice, beef, onion, soy sauce', 'Gạo, thịt bò, hành tây, nước tương'], ['감자, 전분, 식용유', 'Potato, starch, cooking oil', 'Khoai tây, tinh bột, dầu ăn'], ['김치, 밀가루, 대파', 'Kimchi, wheat flour, spring onion', 'Kimchi, bột mì, hành lá'], ['닭고기, 양파, 간장', 'Chicken, onion, soy sauce', 'Thịt gà, hành tây, nước tương'], ['쌀, 버섯, 당근, 시금치, 참기름', 'Rice, mushrooms, carrot, spinach, sesame oil', 'Gạo, nấm, cà rốt, cải bó xôi, dầu mè'], ['쌀떡, 오징어, 새우, 고추장', 'Rice cakes, squid, shrimp, gochujang', 'Bánh gạo, mực, tôm, tương ớt gochujang'], ['유자청, 탄산수', 'Yuzu preserve, sparkling water', 'Mứt yuzu, nước có ga'], ['망고, 수박, 파인애플', 'Mango, watermelon, pineapple', 'Xoài, dưa hấu, dứa'],
  ['우유', 'Milk', 'Sữa'], ['밀, 우유, 달걀', 'Wheat, milk, egg', 'Lúa mì, sữa, trứng'], ['밀, 달걀, 호두', 'Wheat, egg, walnut', 'Lúa mì, trứng, óc chó'], ['우유, 밀, 달걀', 'Milk, wheat, egg', 'Sữa, lúa mì, trứng'], ['대두, 밀', 'Soy, wheat', 'Đậu nành, lúa mì'], ['밀, 대두', 'Wheat, soy', 'Lúa mì, đậu nành'], ['참깨, 대두', 'Sesame, soy', 'Mè, đậu nành'], ['갑각류, 오징어, 대두', 'Crustaceans, squid, soy', 'Giáp xác, mực, đậu nành'], ['조리 환경 확인 필요', 'Check preparation conditions with staff', 'Cần hỏi nhân viên về điều kiện chế biến'], ['계절별 재료 확인 필요', 'Check current seasonal ingredients', 'Cần kiểm tra nguyên liệu theo mùa'],
  ['오너 계정과 소속 확인', 'Verify owner identity and membership', 'Xác minh tài khoản và tư cách chủ quán'], ['샵 정보·영업시간 확인', 'Check shop information and opening hours', 'Kiểm tra thông tin quán và giờ mở cửa'], ['메뉴·가격·알레르기 검토', 'Review menu, prices and allergens', 'Xem thực đơn, giá và thông tin dị ứng'], ['현지 언어 메뉴 검수', 'Review menu in the local language', 'Duyệt thực đơn bằng ngôn ngữ địa phương'], ['QR·테이블 접속 점검', 'Test QR and table entry', 'Kiểm tra truy cập QR và bàn'], ['홀·주방·예약 전달 점검', 'Check service, kitchen and reservation handoffs', 'Kiểm tra chuyển tiếp phục vụ, bếp và đặt bàn'], ['국가 정책·지원 범위 확인', 'Check country policies and support scope', 'Kiểm tra chính sách quốc gia và phạm vi hỗ trợ'],
  ['샵 오너', 'Shop owner', 'Chủ quán'], ['콘텐츠 운영', 'Content operations', 'Vận hành nội dung'], ['현지 검수자', 'Local reviewer', 'Người kiểm tra địa phương'], ['운영 담당', 'Operations specialist', 'Nhân sự vận hành'], ['출시 담당', 'Launch coordinator', 'Người phụ trách triển khai'], ['언어 검수', 'Language review', 'Kiểm tra ngôn ngữ'], ['신원 담당', 'Identity specialist', 'Người phụ trách xác minh'], ['사업·법무', 'Business and legal', 'Kinh doanh và pháp lý'], ['개인정보 담당', 'Privacy specialist', 'Người phụ trách dữ liệu cá nhân'], ['재무 담당', 'Finance specialist', 'Người phụ trách tài chính'], ['상품 담당', 'Product specialist', 'Người phụ trách sản phẩm'], ['지원 책임자', 'Support lead', 'Trưởng nhóm hỗ trợ'], ['기술 책임자', 'Technical lead', 'Trưởng nhóm kỹ thuật'],
  ['가상 운영 중', 'Simulated operations', 'Đang vận hành giả lập'], ['가상 개설 검토', 'Simulated onboarding review', 'Duyệt mở quán giả lập'], ['가상 등록 초안', 'Simulated registration draft', 'Bản nháp đăng ký giả lập'], ['가상 검토 대기 · 실제 자료 없음', 'Sample review pending · no real evidence', 'Chờ kiểm tra giả lập · chưa có tài liệu thật'], ['실제 확인 전 · 가상 대기 항목', 'Not verified · sample pending check', 'Chưa xác minh thật · mục chờ giả lập'],
  ['가상 손님', 'Fictional guest', 'Khách giả lập'], ['가상 홀 직원', 'Fictional service staff', 'Nhân viên phục vụ giả lập'], ['가상 주방 직원', 'Fictional kitchen staff', 'Nhân viên bếp giả lập'], ['가상 샵 오너', 'Fictional shop owner', 'Chủ quán giả lập'], ['가상 운영 담당', 'Fictional operations specialist', 'Nhân sự vận hành giả lập'], ['가상 지원 담당', 'Fictional support specialist', 'Nhân sự hỗ trợ giả lập'], ['가상 모니터링', 'Sample monitoring', 'Giám sát giả lập'], ['가상 출시 담당', 'Fictional launch coordinator', 'Nhân sự triển khai giả lập'], ['가상 청구 시스템', 'Simulated billing system', 'Hệ thống hóa đơn giả lập'], ['가상 재무 담당', 'Fictional finance specialist', 'Nhân sự tài chính giả lập'], ['가상 시스템', 'Simulated system', 'Hệ thống giả lập'],
  ['메뉴·수량 확인 후 요청', 'Request submitted after confirming items and quantities', 'Gửi yêu cầu sau khi xác nhận món và số lượng'], ['주문 접수', 'Order accepted', 'Đã nhận đơn'], ['조리 시작', 'Preparation started', 'Bắt đầu chế biến'], ['준비 완료 · 손님 알림 예시', 'Food ready · sample guest notification', 'Món sẵn sàng · thông báo mẫu cho khách'], ['손님 전달 완료', 'Delivered to guest', 'Đã phục vụ khách'], ['사유 확인 후 취소 승인 · 실제 환불 없음', 'Cancellation approved after review · no real refund', 'Duyệt hủy sau khi kiểm tra lý do · không hoàn tiền thật'], ['현장 주문 · 연락처 미수집', 'In-person order · contact not collected', 'Đơn tại quán · không thu thập liên hệ'], ['테이블 주문', 'Table order', 'Đơn tại bàn'],
  ['창가 자리 요청 · 가상 메모', 'Window seat requested · sample note', 'Xin chỗ ngồi gần cửa sổ · ghi chú mẫu'], ['견과류 관련 안내 요청 · 직원 확인 필요', 'Nut-allergy information requested · staff confirmation needed', 'Hỏi thông tin về hạt · cần nhân viên xác nhận'], ['유아 의자 문의 · 가상 메모', 'High chair requested · sample note', 'Hỏi ghế cho trẻ nhỏ · ghi chú mẫu'],
  ['청구서 예시 생성 · 실제 청구 아님', 'Sample invoice created · not a real bill', 'Tạo hóa đơn mẫu · không phải hóa đơn thật'], ['수납 상태 예시 · 실제 결제 없음', 'Sample collection status · no real payment', 'Trạng thái thu tiền minh họa · không thanh toán thật'], ['미납 안내 검토 예시 · 기존 주문 처리 권리 유지', 'Sample past-due review · existing order rights retained', 'Ví dụ xem xét quá hạn · giữ quyền xử lý đơn hiện có'], ['수납 확인 대기 예시', 'Sample collection pending confirmation', 'Ví dụ chờ xác nhận thu tiền'],
  ['가상 업무용 데스크톱', 'Fictional work desktop', 'Máy tính làm việc giả lập'], ['가상 업무용 휴대폰', 'Fictional work phone', 'Điện thoại làm việc giả lập'], ['가상 이전 업무 기기', 'Fictional former work device', 'Thiết bị làm việc cũ giả lập'], ['가상 알림 어댑터', 'Simulated notification adapter', 'Bộ kết nối thông báo giả lập'], ['가상 POS 어댑터', 'Simulated POS adapter', 'Bộ kết nối POS giả lập'], ['가상 메뉴 어댑터', 'Simulated menu adapter', 'Bộ kết nối thực đơn giả lập'],
  ['가상 ACK_TIMEOUT · 수신 확인 대기', 'Simulated ACK_TIMEOUT · awaiting acknowledgement', 'ACK_TIMEOUT giả lập · chờ xác nhận nhận dữ liệu'], ['가상 PROVIDER_UNAVAILABLE · 외부 연결 예시 중단', 'Simulated PROVIDER_UNAVAILABLE · sample connection offline', 'PROVIDER_UNAVAILABLE giả lập · kết nối mẫu gián đoạn'], ['가상 VERSION_CONFLICT · 메뉴 버전 재검토 필요', 'Simulated VERSION_CONFLICT · review menu version', 'VERSION_CONFLICT giả lập · cần kiểm tra lại phiên bản thực đơn'],
  ['이 내용은 상세 기능을 검토하기 위한 가상 문의입니다. 실제 고객 정보나 첨부 자료는 없습니다.', 'This fictional case is for reviewing detailed workflows. It contains no real customer information or attachments.', 'Yêu cầu giả lập này dùng để xem quy trình chi tiết, không chứa thông tin khách hàng hay tệp đính kèm thật.'],
  ['청구 상태와 기존 주문 이행 권한을 분리해 확인합니다. 실제 결제·독촉 메일은 보내지 않습니다.', 'Check billing separately from the right to fulfill existing orders. No live payment or reminder email is sent.', 'Kiểm tra hóa đơn riêng với quyền hoàn tất đơn hiện có. Không thực hiện thanh toán hoặc gửi email nhắc nợ thật.'],
  ['관련 샵과 업무 기록 예시를 확인했습니다. 변경이 필요하면 별도 승인 요청을 연결합니다.', 'The sample shop and activity records have been reviewed. Any change needs a separate approval request.', 'Đã kiểm tra quán và hồ sơ nghiệp vụ mẫu. Nếu cần thay đổi, sẽ liên kết đề nghị phê duyệt riêng.'],
  ['가상 검토를 마쳤습니다. 이 시안에서는 실제 시스템에 적용하지 않습니다.', 'The simulated review is complete. This prototype does not change the live system.', 'Đã hoàn tất kiểm tra giả lập. Bản mẫu này không áp dụng vào hệ thống thật.'],
  ['현재 내용을 확인 중입니다. 확인한 결과는 이 문의에서 안내드리겠습니다. [가상 안내]', 'We are reviewing this case and will post the findings here. [simulated reply]', 'Chúng tôi đang kiểm tra và sẽ phản hồi kết quả tại yêu cầu này. [phản hồi giả lập]'],
  ['가상 주문 전달 지연 점검', 'Simulated order handoff delay', 'Kiểm tra chậm chuyển đơn giả lập'], ['가상 한국 알림 재시도 증가', 'Simulated increase in Korean notification retries', 'Tăng số lần thử lại thông báo tại Hàn Quốc · giả lập'], ['가상 메뉴 버전 불일치 해결', 'Simulated menu version conflict resolved', 'Đã giải quyết lệch phiên bản thực đơn · giả lập'], ['가상 인도네시아 연결 검토', 'Simulated Indonesia integration review', 'Kiểm tra tích hợp Indonesia · giả lập'],
  ['주문 수신 확인 지연 예시 감지', 'Sample order acknowledgement delay detected', 'Phát hiện ví dụ chậm xác nhận nhận đơn'], ['가상 장애 조사 시작 · 실제 외부 장애 아님', 'Simulated investigation started · no real provider outage', 'Bắt đầu điều tra giả lập · không phải sự cố nhà cung cấp thật'], ['기존 주문 이행을 유지하며 신규 접수 영향 검토', 'Reviewing new intake impact while keeping existing orders moving', 'Xem ảnh hưởng đến nhận đơn mới và vẫn xử lý đơn hiện có'], ['알림 지연 예시 감지', 'Sample notification delay detected', 'Phát hiện ví dụ chậm thông báo'], ['가상 재시도 완료 · 재발 여부 관찰', 'Simulated retry complete · monitoring for recurrence', 'Đã thử lại giả lập · theo dõi tái diễn'], ['메뉴 캐시 표시 문의 접수', 'Received sample menu cache display case', 'Nhận yêu cầu mẫu về hiển thị thực đơn đã lưu'], ['표시 버전 검토 예시', 'Sample display version review', 'Ví dụ kiểm tra phiên bản hiển thị'], ['가상 해결 확인 · 실제 캐시 변경 없음', 'Simulated resolution confirmed · no live cache changes', 'Xác nhận giải quyết giả lập · không đổi bộ nhớ đệm thật'], ['출시 전 연결 검토 항목 등록 · 실제 장애 아님', 'Pre-launch integration check recorded · not a real incident', 'Ghi nhận kiểm tra tích hợp trước triển khai · không phải sự cố thật'],
  ['가상 접수 지연 안내', 'Sample intake delay notice', 'Thông báo chậm nhận đơn giả lập'], ['가상 메뉴 검수 안내', 'Sample menu review notice', 'Thông báo duyệt thực đơn giả lập'], ['가상 주방 알림 점검', 'Sample kitchen notification check', 'Kiểm tra thông báo bếp giả lập'], ['가상 구독 내역 확인', 'Sample subscription review', 'Kiểm tra gói dịch vụ giả lập'], ['가상 현지 운영 준비', 'Sample local operations preparation', 'Chuẩn bị vận hành địa phương giả lập'], ['가상 다국어 메뉴 도움말', 'Sample multilingual menu help', 'Trợ giúp thực đơn đa ngôn ngữ giả lập'],
  ['주모 다낭의 주문 전달 경로를 확인하는 상황 예시입니다. 기존 주문은 담당 직원이 계속 처리하며 실제 메시지는 발송하지 않습니다.', 'This scenario reviews the order handoff at Jumo Da Nang. Staff continue existing orders. No real message is sent.', 'Tình huống mẫu kiểm tra chuyển đơn tại Jumo Đà Nẵng. Nhân viên tiếp tục xử lý đơn hiện có. Không gửi tin nhắn thật.'],
  ['메뉴판 사진과 표시 가격을 다시 확인해 주세요. 승인 전 메뉴는 공개하지 않는 흐름을 검토합니다. [가상 공지]', 'Please review the menu photo and displayed prices. This scenario keeps unapproved menus unpublished. [sample announcement]', 'Vui lòng kiểm tra lại ảnh thực đơn và giá hiển thị. Tình huống này không công khai thực đơn chưa duyệt. [thông báo giả lập]'],
  ['준비 완료 알림이 늦을 때 주문함을 새로 확인하는 안내 예시입니다. 실제 장애나 점검 일정이 아닙니다.', 'Sample guidance for checking the order inbox when a ready notification is delayed. This is not a real outage or maintenance notice.', 'Hướng dẫn mẫu kiểm tra lại danh sách đơn khi thông báo món sẵn sàng bị chậm. Đây không phải sự cố hay lịch bảo trì thật.'],
  ['이번 달 구독 청구 예시를 확인하는 안내입니다. 이 시안에서는 실제 청구, 결제, 자동 독촉을 실행하지 않습니다.', 'Sample guidance for reviewing this month’s subscription invoice. No real billing, payment or automated reminder is performed.', 'Hướng dẫn mẫu kiểm tra hóa đơn gói dịch vụ tháng này. Không lập hóa đơn, thanh toán hoặc nhắc nợ tự động thật.'],
  ['인도네시아 출시 조건을 검토하기 위한 초안입니다. 서비스 판매나 국가 출시가 승인된 것은 아닙니다.', 'This draft reviews Indonesia launch requirements. It does not approve service sales or a country launch.', 'Bản nháp này dùng để xem điều kiện triển khai tại Indonesia, không phải phê duyệt bán dịch vụ hay triển khai quốc gia.'],
  ['손님 언어와 샵 운영 언어를 각각 선택하는 도움말 예시입니다. 표시된 고객·샵·사용량은 전부 가상 데이터입니다.', 'Sample help for choosing guest and shop languages separately. All guests, shops and usage shown are fictional.', 'Hướng dẫn mẫu chọn riêng ngôn ngữ khách và ngôn ngữ vận hành quán. Mọi khách, quán và số liệu sử dụng hiển thị đều là giả lập.'],
  ['운영 범위와 현지 담당', 'Operating scope and local owner', 'Phạm vi vận hành và người phụ trách địa phương'], ['메뉴·안내 현지 언어 검수', 'Local language review for menus and guidance', 'Duyệt ngôn ngữ địa phương cho thực đơn và hướng dẫn'], ['오너·직원 계정과 복구', 'Owner and staff accounts and recovery', 'Tài khoản chủ quán, nhân viên và khôi phục'], ['판매 법인·약관·종료 조건', 'Selling entity, terms and termination', 'Pháp nhân bán dịch vụ, điều khoản và chấm dứt'], ['개인정보·보존·국외 이전', 'Personal data, retention and cross-border transfers', 'Dữ liệu cá nhân, lưu giữ và chuyển ra nước ngoài'], ['구독 통화·청구·미납 정책', 'Subscription currency, billing and overdue policy', 'Tiền tệ gói dịch vụ, hóa đơn và chính sách quá hạn'], ['실결제 미제공 범위 안내', 'Disclosure that live payments are not provided', 'Thông báo phạm vi không cung cấp thanh toán thật'], ['현지 지원·사고 대응', 'Local support and incident response', 'Hỗ trợ địa phương và ứng phó sự cố'], ['복원·부하·권한 격리', 'Restoration, load testing and access isolation', 'Khôi phục, kiểm thử tải và cách ly quyền truy cập']
);

const sampleCaseTitles = [
  ['주문 전달 확인 지연', 'Delayed order acknowledgement', 'Chậm xác nhận chuyển đơn'], ['메뉴판 가격 확인 요청', 'Menu price confirmation', 'Yêu cầu xác nhận giá thực đơn'], ['구독 안내와 기존 주문 처리 확인', 'Subscription guidance and existing order handling', 'Hướng dẫn gói dịch vụ và xử lý đơn hiện có'], ['베트남어 메뉴 문구 검토', 'Vietnamese menu wording review', 'Duyệt nội dung thực đơn tiếng Việt'], ['접수 일시 중지 후 예약 이행 확인', 'Reservation fulfillment after intake is paused', 'Thực hiện đặt bàn sau khi tạm dừng nhận đơn'], ['예약 시간 변경 문의', 'Reservation time change', 'Hỏi đổi giờ đặt bàn'], ['오너 초대 수락 안내', 'Owner invitation acceptance guidance', 'Hướng dẫn chủ quán nhận lời mời'], ['미납 상태의 기존 주문 전달 확인', 'Existing order handoff while billing is overdue', 'Kiểm tra chuyển đơn hiện có khi thanh toán quá hạn'], ['사용량 90% 안내 검토', 'Review usage alert at 90%', 'Xem thông báo đã dùng 90%'], ['새 메뉴 알레르기 표기 요청', 'Allergen labels for a new menu item', 'Yêu cầu ghi thông tin dị ứng cho món mới'], ['국가 출시 검토 자료 준비', 'Prepare country launch review materials', 'Chuẩn bị tài liệu xét triển khai quốc gia'], ['주방 준비 완료 알림 재확인', 'Check kitchen-ready notification', 'Kiểm tra lại thông báo bếp đã xong'], ['동일 주문 중복 표시 문의', 'Duplicate display of one order', 'Hỏi về hiển thị trùng cùng một đơn'], ['구독 청구 내역 확인', 'Review subscription invoice details', 'Kiểm tra chi tiết hóa đơn gói dịch vụ'], ['QR 공개 전 최종 점검', 'Final QR checks before publishing', 'Kiểm tra QR lần cuối trước khi công khai']
];
for (const [source, en, vi] of sampleCaseTitles) rows.push([`${source} [가상]`, `${en} [fictional]`, `${vi} [giả lập]`]);

rows.push(
  ['운영 통제', 'Operational controls', 'Kiểm soát vận hành'], ['플랫폼 운영 어드민 상세 데모', 'Platform administration demo', 'Bản demo quản trị nền tảng'],
  ['기록 범위', 'Record visibility', 'Phạm vi hồ sơ'], ['메모 또는 답변', 'Note or reply', 'Ghi chú hoặc phản hồi'], ['관련 항목', 'Related record', 'Mục liên quan'], ['생성', 'Created', 'Ngày tạo'], ['담당자·상태 변경', 'Change assignee or status', 'Đổi người phụ trách hoặc trạng thái'], ['샵 이력', 'Shop history', 'Lịch sử quán'],
  ['기록', 'Record', 'Hồ sơ'], ['기록 상세', 'View record', 'Xem hồ sơ'], ['처리 기록 상세', 'Activity record details', 'Chi tiết hồ sơ xử lý'], ['기록 ID', 'Record ID', 'Mã hồ sơ'], ['처리자', 'Handled by', 'Người xử lý'], ['처리 시각', 'Handled at', 'Thời gian xử lý'], ['업무 종류', 'Activity type', 'Loại nghiệp vụ'], ['국가·샵', 'Country and shop', 'Quốc gia và quán'], ['처리 요약', 'Activity summary', 'Tóm tắt xử lý'], ['변경 전', 'Before', 'Trước thay đổi'], ['변경 후', 'After', 'Sau thay đổi'],
  ['이 기록에는 변경 전 값이 포함되지 않았습니다.', 'This record does not include the previous values.', 'Hồ sơ này không có giá trị trước thay đổi.'], ['연결된 업무의 현재 상태를 확인해 주세요.', 'Check the current status of the linked activity.', 'Hãy kiểm tra trạng thái hiện tại của nghiệp vụ liên quan.'], ['브라우저에 저장된 가상 처리 기록입니다. 실제 운영의 불변 감사 원장은 아닙니다.', 'This simulated activity record is saved in this browser. It is not an immutable production audit log.', 'Đây là hồ sơ xử lý giả lập lưu trong trình duyệt, không phải nhật ký kiểm toán bất biến của hệ thống thật.'],
  ['역할별로 직접 운영해 보세요.', 'Try the workflows for each role.', 'Trải nghiệm quy trình theo từng vai trò.'], ['전체 데모 사용 안내', 'Full demo guide', 'Hướng dẫn demo đầy đủ'], ['안내와 실제 연결 범위', 'Demo guide and connection limits', 'Hướng dẫn và phạm vi kết nối'], ['실제 운영자 인증·서버 권한·AI·결제·메일·POS는 연결하지 않았습니다. 실제 개인정보를 입력하지 마세요.', 'Real administrator authentication, server permissions, AI, payments, email and POS are not connected. Do not enter real personal data.', 'Chưa kết nối xác thực quản trị viên, quyền trên máy chủ, AI, thanh toán, email hoặc POS thật. Vui lòng không nhập dữ liệu cá nhân thật.'],
  ['직원·권한', 'Staff and access', 'Nhân viên và quyền truy cập'], ['샵 준비', 'Shop setup', 'Chuẩn bị quán'], ['현재 범위에 없는 기록입니다.', 'This record is outside your access scope.', 'Hồ sơ này nằm ngoài phạm vi truy cập của bạn.'],
  ['오너 메뉴 수정 검토 요청', 'Request review of an owner’s menu change', 'Đề nghị xem xét chỉnh sửa thực đơn của chủ quán'], ['수정이 필요한 메뉴와 사유를 오너에게 확인합니다. 원본 메뉴를 본사에서 덮어쓰지 않습니다.', 'Confirm the items and reasons for change with the owner. Head office does not overwrite the original menu.', 'Xác nhận món cần sửa và lý do với chủ quán. Trụ sở không ghi đè thực đơn gốc.'], ['샵 직원 권한 검토 요청', 'Request a shop staff access review', 'Đề nghị xem xét quyền nhân viên quán'], ['샵 오너에게 홀·주방 직원의 권한 범위와 변경 동의를 확인합니다.', 'Confirm service and kitchen staff access and consent to changes with the shop owner.', 'Xác nhận với chủ quán về quyền của nhân viên phục vụ, bếp và sự đồng ý thay đổi.'], ['샵 준비 정보 보완 요청', 'Request missing shop setup information', 'Yêu cầu bổ sung thông tin chuẩn bị quán'], ['미확인 항목과 보완할 증거를 정리해 주세요.', 'List the unchecked items and the evidence still needed.', 'Hãy liệt kê các mục chưa xác nhận và bằng chứng cần bổ sung.'], ['주문 원본을 바꾸지 않고 전달 지연과 알림 상태를 확인합니다.', 'Check handoff delays and notification status without changing the original order.', 'Kiểm tra độ trễ chuyển đơn và trạng thái thông báo mà không đổi đơn gốc.'], ['예약 날짜·시간·인원을 샵 오너와 확인합니다.', 'Confirm the reservation date, time and party size with the shop owner.', 'Xác nhận ngày, giờ và số khách đặt bàn với chủ quán.'],
  ['확인 문구', 'Confirmation phrase', 'Cụm từ xác nhận'], ['확인 문구를 그대로 입력해 주세요.', 'Enter the confirmation phrase exactly as shown.', 'Nhập đúng cụm từ xác nhận như hiển thị.'], ['기록하고 저장', 'Record and save', 'Ghi nhận và lưu'],
  ['본사 운영 → 업무·SLA → 담당 업무와 문의 기한', 'Head office operations → Work & SLA → Assignments and case deadlines', 'Vận hành trụ sở → Công việc & SLA → Nhiệm vụ và hạn hỗ trợ'], ['본사 운영 → 정책·요금 관리 → 초안 저장과 검토 요청', 'Head office operations → Policies & pricing → Save a draft and request review', 'Vận hành trụ sở → Chính sách & giá → Lưu bản nháp và đề nghị duyệt'], ['운영 승인 → 정책·요금 관리 → 다른 담당자의 요청 검토', 'Operations approval → Policies & pricing → Review another colleague’s request', 'Phê duyệt vận hành → Chính sách & giá → Duyệt đề nghị của người khác'], ['재무 신청 → 청구서 상세 → 가상 환불 신청', 'Finance requests → Invoice details → Request a simulated refund', 'Đề nghị tài chính → Chi tiết hóa đơn → Đề nghị hoàn tiền giả lập'], ['재무 승인 → 운영 승인함 → 원 청구와 잔액 검토', 'Finance approval → Approval inbox → Check the original invoice and balance', 'Phê duyệt tài chính → Hộp phê duyệt → Kiểm tra hóa đơn gốc và số dư'], ['알림 센터 → 내 알림 읽음 처리와 연결된 업무', 'Notification center → Mark your notifications as read and open linked work', 'Trung tâm thông báo → Đánh dấu đã đọc và mở công việc liên quan'],
  ['이 관리자 화면은 한국어·영어·베트남어를 지원합니다. 새로고침해도 같은 브라우저의 가상 작업은 유지됩니다.', 'This admin supports Korean, English and Vietnamese. Simulated work stays in the same browser after a refresh.', 'Trang quản trị hỗ trợ tiếng Hàn, tiếng Anh và tiếng Việt. Công việc giả lập vẫn được giữ trong cùng trình duyệt sau khi tải lại.'], ['메모와 손님 원문은 입력한 내용을 보존하며, 화면 언어를 바꿔도 원본 기록을 덮어쓰지 않습니다.', 'Notes and original guest messages stay as entered. Changing the interface language does not overwrite the source records.', 'Ghi chú và tin nhắn gốc của khách được giữ nguyên như đã nhập. Đổi ngôn ngữ giao diện không ghi đè hồ sơ gốc.'],
  ['라미 시작 월 구독료 [가상 청구]', 'Rami Start monthly subscription [sample invoice]', 'Phí gói Rami Khởi đầu hằng tháng [hóa đơn giả lập]'], ['라미 파트너 월 구독료 [가상 청구]', 'Rami Partner monthly subscription [sample invoice]', 'Phí gói Rami Đồng hành hằng tháng [hóa đơn giả lập]'], ['라미 프로 월 구독료 [가상 청구]', 'Rami Pro monthly subscription [sample invoice]', 'Phí gói Rami Pro hằng tháng [hóa đơn giả lập]']
);

rows.push(
  ['입력 구조를 확인하세요.', 'Check the input structure.', 'Kiểm tra cấu trúc dữ liệu nhập.'], ['대상 자료를 찾을 수 없습니다.', 'The requested record was not found.', 'Không tìm thấy hồ sơ cần xử lý.'], ['다른 담당자가 내용을 변경했습니다. 최신 상태로 다시 확인하세요.', 'Another operator changed this record. Review the latest version and try again.', 'Người khác đã sửa nội dung. Hãy kiểm tra phiên bản mới nhất rồi thử lại.'], ['저장할 수 없는 입력입니다.', 'This input cannot be saved.', 'Không thể lưu dữ liệu nhập này.'], ['가상 담당자', 'Fictional operator', 'Nhân sự giả lập'],
  ['현재 역할과 담당 범위에서 이 작업을 할 수 없습니다.', 'Your current role and assigned scope do not allow this action.', 'Vai trò và phạm vi được giao không cho phép thao tác này.'], ['이 국가의 정책을 관리할 권한이 없습니다.', 'You do not have permission to manage this country’s policies.', 'Bạn không có quyền quản lý chính sách của quốc gia này.'], ['이 샵의 업무를 처리할 수 있는 활성 담당자를 선택하세요.', 'Choose an active operator who can handle work for this shop.', 'Chọn nhân sự đang hoạt động và có quyền xử lý công việc của quán này.'], ['현재 체험 자료 버전을 확인하세요. 기존 자료를 자동 초기화하지 않습니다.', 'Check the current demo data version. Existing data will not be reset automatically.', 'Kiểm tra phiên bản dữ liệu demo. Dữ liệu hiện có sẽ không tự động bị đặt lại.'], ['업무 체험 저장 자료를 읽을 수 없습니다.', 'The saved workflow demo data could not be read.', 'Không thể đọc dữ liệu demo nghiệp vụ đã lưu.'],
  ['영향 범위와 담당 샵 확인', 'Check the impact and assigned shops', 'Kiểm tra ảnh hưởng và các quán được giao'], ['가상 확인 근거 기록', 'Record sample verification evidence', 'Ghi nhận bằng chứng xác nhận giả lập'], ['후속 처리 담당자 확인', 'Confirm the follow-up owner', 'Xác nhận người phụ trách bước tiếp theo'], ['상세 업무 흐름을 확인하기 위한 가상 작업입니다.', 'This sample task demonstrates the detailed workflow.', 'Đây là công việc giả lập để xem quy trình nghiệp vụ chi tiết.'], ['국가별 정책 검토 흐름을 위한 가상 자료입니다.', 'This sample record demonstrates country policy review.', 'Đây là dữ liệu giả lập cho quy trình xét chính sách theo quốc gia.'],
  ['관리자 업무 체험이 준비됐어요.', 'Your admin demo is ready.', 'Bản demo quản trị đã sẵn sàng.'], ['가상 업무·국가 정책·보고서·개인 알림을 살펴보세요. 실제 시스템은 연결하지 않습니다.', 'Explore sample tasks, country policies, reports and personal notifications. Live systems are not connected.', 'Khám phá công việc, chính sách quốc gia, báo cáo và thông báo cá nhân giả lập. Chưa kết nối hệ thống thật.'],
  ['시작일', 'Start date', 'Ngày bắt đầu'], ['종료일', 'End date', 'Ngày kết thúc'], ['시작일은 종료일보다 늦을 수 없습니다.', 'The start date cannot be after the end date.', 'Ngày bắt đầu không được sau ngày kết thúc.'], ['국가 필터를 확인하세요.', 'Check the country filter.', 'Kiểm tra bộ lọc quốc gia.'], ['기술 담당자는 본인에게 배정된 작업만 처리할 수 있습니다.', 'Technical operators can update only tasks assigned to them.', 'Nhân sự kỹ thuật chỉ được xử lý công việc được giao cho mình.'],
  ['지원 요청에 새 처리 내역이 있어요.', 'There is an update to a support case.', 'Yêu cầu hỗ trợ có cập nhật mới.'], ['권한이 있는 지원 요청 화면에서 확인하세요.', 'Open the support case if your access allows it.', 'Xem trong yêu cầu hỗ trợ thuộc quyền truy cập của bạn.'], ['담당 업무가 업데이트됐어요.', 'An assigned task has been updated.', 'Công việc được giao đã được cập nhật.'], ['체크 항목과 기한을 업무 화면에서 확인하세요.', 'Check the checklist and deadline in the task workspace.', 'Kiểm tra danh sách xác nhận và hạn xử lý trong mục công việc.'], ['국가 정책 검토가 업데이트됐어요.', 'A country policy review has been updated.', 'Việc xét chính sách quốc gia có cập nhật.'], ['실제 청구에 적용하지 않는 정책 시뮬레이션입니다.', 'This policy simulation does not affect live billing.', 'Chính sách giả lập này không áp dụng vào hóa đơn thật.'], ['검토 요청의 처리 상태가 바뀌었어요.', 'A review request has a new status.', 'Trạng thái đề nghị xét duyệt đã thay đổi.'], ['권한이 있는 승인 화면에서 최신 결과를 확인하세요.', 'Check the latest result in the approvals you can access.', 'Xem kết quả mới nhất trong mục phê duyệt thuộc quyền truy cập.'],
  ['가상 청구 검토 상태가 바뀌었어요.', 'A sample billing review has a new status.', 'Trạng thái xét hóa đơn giả lập đã thay đổi.'], ['실제 결제나 환불은 실행하지 않았습니다.', 'No live payment or refund was made.', 'Không thực hiện thanh toán hay hoàn tiền thật.'], ['관리자 권한 검토가 업데이트됐어요.', 'An administrator access review has been updated.', 'Việc xét quyền quản trị viên có cập nhật.'], ['필요한 경우 가상 세션이 회수되며 실제 계정은 변경하지 않습니다.', 'Simulated sessions may be revoked. Real accounts are not changed.', 'Phiên giả lập có thể bị thu hồi khi cần; tài khoản thật không thay đổi.'], ['샵 운영 검토가 업데이트됐어요.', 'A shop operations review has been updated.', 'Việc xét vận hành quán có cập nhật.'], ['현재 권한 범위의 샵 화면에서 결과를 확인하세요.', 'View the result in a shop within your access scope.', 'Xem kết quả tại quán thuộc phạm vi quyền truy cập của bạn.'], ['기술 운영 작업이 업데이트됐어요.', 'A technical operations task has been updated.', 'Công việc vận hành kỹ thuật có cập nhật.'], ['실제 외부 시스템 작업은 실행하지 않았습니다.', 'No live external system action was performed.', 'Không thực hiện thao tác trên hệ thống bên ngoài thật.'],
  ['기준 시간을 확인하세요.', 'Check the reference time.', 'Kiểm tra thời điểm tham chiếu.'], ['활성 관리자 역할이 필요합니다. 실제 로그인은 아닌 권한 체험입니다.', 'An active admin role is required. This demonstrates access rules, not real login.', 'Cần vai trò quản trị viên đang hoạt động. Đây là trải nghiệm phân quyền, không phải đăng nhập thật.'], ['요청 식별자에 공백을 넣을 수 없습니다.', 'The request ID cannot contain spaces.', 'Mã yêu cầu không được chứa khoảng trắng.'], ['입력 내용이 너무 큽니다.', 'The input is too large.', 'Nội dung nhập quá lớn.'],
  ['업무 제목', 'Task title', 'Tên công việc'], ['업무 기한', 'Task deadline', 'Hạn công việc'], ['새 업무 기한은 현재보다 나중이어야 합니다.', 'The new task deadline must be in the future.', 'Hạn công việc mới phải sau thời điểm hiện tại.'], ['같은 샵의 지원 요청만 연결할 수 있습니다.', 'Only support cases for the same shop can be linked.', 'Chỉ có thể liên kết yêu cầu hỗ trợ của cùng một quán.'], ['확인 항목을 1~20개 입력하세요.', 'Enter between 1 and 20 checklist items.', 'Nhập từ 1 đến 20 mục xác nhận.'], ['확인 항목', 'Checklist item', 'Mục xác nhận'], ['같은 확인 항목을 중복 등록할 수 없습니다.', 'Duplicate checklist items are not allowed.', 'Không được đăng ký trùng mục xác nhận.'], ['가상 업무 생성 · 담당/기한/확인 항목', 'Sample task created · assignee, deadline and checklist', 'Tạo công việc giả lập · người phụ trách, hạn và danh sách xác nhận'], ['가상 업무를 만들었습니다.', 'The sample task was created.', 'Đã tạo công việc giả lập.'],
  ['업무 상태', 'Task status', 'Trạng thái công việc'], ['확인 항목 값을 확인하세요.', 'Check the checklist values.', 'Kiểm tra giá trị các mục xác nhận.'], ['확인 상태는 완료/미완료로 선택하세요.', 'Choose completed or incomplete for each check.', 'Chọn hoàn tất hoặc chưa hoàn tất cho từng mục.'], ['등록된 업무 확인 항목만 바꿀 수 있습니다.', 'Only registered checklist items can be changed.', 'Chỉ được sửa mục xác nhận đã đăng ký của công việc.'], ['모든 확인 항목을 마친 뒤 업무를 완료하세요.', 'Complete every checklist item before finishing the task.', 'Hoàn tất mọi mục xác nhận trước khi kết thúc công việc.'], ['가상 업무 상태·확인 항목 갱신', 'Sample task status and checklist updated', 'Cập nhật trạng thái và danh sách xác nhận giả lập'], ['업무 처리와 메모를 저장했습니다.', 'Task progress and notes were saved.', 'Đã lưu tiến độ xử lý và ghi chú công việc.'],
  ['기한 변경 사유', 'Reason for changing the deadline', 'Lý do đổi hạn'], ['에스컬레이션 상태를 확인하세요.', 'Check the escalation status.', 'Kiểm tra trạng thái chuyển cấp xử lý.'], ['지원 처리 기한', 'Support resolution deadline', 'Hạn xử lý hỗ trợ'], ['처리 기한은 문의 접수보다 빠를 수 없습니다.', 'The resolution deadline cannot be earlier than case creation.', 'Hạn xử lý không được trước thời điểm tiếp nhận yêu cầu.'], ['지원 처리 기한·에스컬레이션 갱신', 'Support deadline and escalation updated', 'Cập nhật hạn hỗ trợ và chuyển cấp xử lý'], ['지원 처리 기한과 내부 근거를 저장했습니다.', 'The support deadline and internal justification were saved.', 'Đã lưu hạn xử lý hỗ trợ và căn cứ nội bộ.'],
  ['정책 이름', 'Policy name', 'Tên chính sách'], ['체험 기간', 'Trial period', 'Thời gian dùng thử'], ['포함 답변 횟수', 'Included responses', 'Số lượt trả lời được bao gồm'], ['사용량 경고 비율', 'Usage warning threshold', 'Ngưỡng cảnh báo sử dụng'], ['적용 예정일', 'Planned effective date', 'Ngày dự kiến áp dụng'], ['한도 도달 시 새 AI 생성 중지 여부를 선택하세요.', 'Choose whether to stop new AI responses at the limit.', 'Chọn có dừng tạo câu trả lời AI mới khi đạt hạn mức hay không.'], ['정책 적용 예정일은 미래여야 합니다.', 'The planned effective date must be in the future.', 'Ngày dự kiến áp dụng chính sách phải ở tương lai.'], ['정책 변경 사유', 'Reason for the policy change', 'Lý do đổi chính sách'], ['정책의 국가를 바꾸지 말고 새 국가 초안을 만드세요.', 'Create a new country draft instead of changing this policy’s country.', 'Hãy tạo bản nháp cho quốc gia mới thay vì đổi quốc gia của chính sách này.'], ['검토 중인 정책은 수정할 수 없습니다. 검토 종료 후 새 버전으로 저장하세요.', 'Policies under review cannot be edited. Save a new version after the review ends.', 'Không được sửa chính sách đang được duyệt. Hãy lưu phiên bản mới sau khi kết thúc xét duyệt.'],
  ['국가 사용량 정책 초안 저장 · 실제 청구 미적용', 'Country usage policy draft saved · no live billing changes', 'Lưu bản nháp chính sách sử dụng quốc gia · không đổi hóa đơn thật'], ['정책 초안을 저장했습니다. 실제 구독·청구·AI 동작은 바꾸지 않았습니다.', 'The policy draft was saved. Live subscriptions, billing and AI behavior were not changed.', 'Đã lưu bản nháp chính sách. Không đổi gói dịch vụ, hóa đơn hay hoạt động AI thật.'], ['초안만 검토 요청할 수 있습니다.', 'Only drafts can be submitted for review.', 'Chỉ có thể gửi bản nháp để xét duyệt.'], ['적용 예정일을 미래로 고친 뒤 요청하세요.', 'Move the effective date into the future before requesting review.', 'Sửa ngày áp dụng sang tương lai trước khi đề nghị duyệt.'], ['국가 정책 독립 검토 요청', 'Independent country policy review requested', 'Đề nghị duyệt độc lập chính sách quốc gia'], ['다른 담당자의 정책 검토를 요청했습니다.', 'A separate reviewer has been asked to review the policy.', 'Đã đề nghị người khác xét duyệt chính sách.'], ['검토 대기 정책만 처리할 수 있습니다.', 'Only policies awaiting review can be processed.', 'Chỉ được xử lý chính sách đang chờ duyệt.'], ['신청하거나 작성한 본인은 정책을 승인·거절할 수 없습니다.', 'The requester or draft author cannot approve or reject this policy.', 'Người gửi yêu cầu hoặc soạn bản nháp không được duyệt hay từ chối chính sách này.'], ['신청자의 현재 정책 권한이 회수됐습니다.', 'The requester’s policy permission has been revoked.', 'Quyền chính sách của người gửi yêu cầu đã bị thu hồi.'],
  ['가상 정책을 승인했습니다. 실제 청구·답변 횟수는 변경하지 않습니다.', 'The sample policy was approved. Live billing and response allowances are unchanged.', 'Đã duyệt chính sách giả lập. Không đổi hóa đơn hay hạn mức trả lời thật.'], ['국가 조건이나 정책이 바뀌어 새 검토가 필요합니다.', 'Country requirements or policy details changed. A new review is needed.', 'Điều kiện quốc gia hoặc chính sách đã thay đổi. Cần xét duyệt lại.'], ['검토 기한 또는 적용 예정일이 지났습니다.', 'The review deadline or planned effective date has passed.', 'Đã qua hạn xét duyệt hoặc ngày dự kiến áp dụng.'], ['정책 초안 검토를 거절했습니다.', 'The policy draft was rejected.', 'Đã từ chối bản nháp chính sách.'],
  ['읽음 처리할 알림을 1~200개 선택하세요.', 'Select between 1 and 200 notifications to mark as read.', 'Chọn từ 1 đến 200 thông báo để đánh dấu đã đọc.'], ['본인이 현재 볼 수 있는 알림만 읽음 처리할 수 있습니다.', 'You can mark only your currently accessible notifications as read.', 'Chỉ được đánh dấu đã đọc thông báo hiện thuộc quyền truy cập của bạn.'], ['선택한 본인 알림을 읽음 처리했습니다.', 'Your selected notifications were marked as read.', 'Đã đánh dấu các thông báo đã chọn của bạn là đã đọc.'], ['현재 권한·기간의 가상 집계 CSV · 개인정보/원문 제외', 'Sample aggregate CSV for the current scope and period · personal data and source messages excluded', 'CSV tổng hợp giả lập theo quyền và khoảng thời gian hiện tại · không có dữ liệu cá nhân hay tin nhắn gốc'], ['허용 범위의 집계 내보내기를 기록했습니다. 외부 전송은 하지 않았습니다.', 'The permitted aggregate export was recorded. No external transmission was made.', 'Đã ghi nhận xuất số liệu tổng hợp trong phạm vi cho phép. Không truyền ra bên ngoài.']
);

const normalized = value => String(value).replace(/\s+/gu, ' ').trim();
const catalog = new Map(rows.map(([source, en, vi]) => [normalized(source), {en, vi}]));
export const CATALOG_SIZE = catalog.size;
const validLanguage = lang => lang === 'en' || lang === 'vi' ? lang : 'ko';

// Only anchored, known UI sentence patterns are translated dynamically. We never
// replace arbitrary Korean substrings inside names, notes or source messages.
function dynamic(text, lang) {
  const en = lang === 'en';
  let match;
  if ((match = text.match(/^가상 확인서 ((?:VN|KR|ID)-\d{3}-[a-z_]+) · 실제 검증 자료 아님$/))) return en ? `Sample verification ${match[1]} · not real verification evidence` : `Xác nhận mẫu ${match[1]} · không phải bằng chứng xác minh thật`;
  if ((match = text.match(/^가상 검토 자료 ((?:VN|KR|ID)-[a-z_]+) · 실제 승인\/준수 증빙 아님$/))) return en ? `Sample review ${match[1]} · not evidence of real approval or compliance` : `Tài liệu kiểm tra mẫu ${match[1]} · không phải bằng chứng phê duyệt hay tuân thủ thật`;
  if ((match = text.match(/^가상 (샵 오너|고객 지원|기술 운영|콘텐츠 운영|현지 검수자|운영 담당|출시 담당|언어 검수|신원 담당|사업·법무|개인정보 담당|재무 담당|상품 담당|지원 책임자|기술 책임자)$/))) return en ? `Fictional ${t(match[1], lang).toLowerCase()}` : `${t(match[1], lang)} giả lập`;
  if ((match = text.match(/^(베트남|한국|인도네시아) \/ (다낭|하노이|호치민|호이안|후에|냐짱|달랏|푸꾸옥|서울|제주|부산|강릉|경주|발리|우붓|자카르타)$/))) return `${t(match[1], lang)} / ${t(match[2], lang)}`;
  if ((match = text.match(/^(.+) · (알림 전달 예시|주문 전달 예시|메뉴 동기화 예시)$/))) return `${match[1]} · ${en ? {'알림 전달 예시':'sample notification handoff','주문 전달 예시':'sample order handoff','메뉴 동기화 예시':'sample menu sync'}[match[2]] : {'알림 전달 예시':'chuyển thông báo mẫu','주문 전달 예시':'chuyển đơn mẫu','메뉴 동기화 예시':'đồng bộ thực đơn mẫu'}[match[2]]}`;
  if (/ × \d+(?:, |$)/u.test(text)) {
    const parts = text.split(', ').map(part => part.match(/^(.+) × (\d+)$/u));
    if (parts.every(part => part && catalog.has(part[1]))) return parts.map(part => `${t(part[1], lang)} × ${part[2]}`).join(', ');
  }
  if ((match = text.match(/^가상 손님 ([A-Z]\*\*)$/))) return en ? `Fictional guest ${match[1]}` : `Khách giả lập ${match[1]}`;
  if ((match = text.match(/^(다낭|하노이|호치민|호이안|후에|냐짱|달랏|푸꾸옥|서울|제주|부산|강릉|경주|발리|우붓|자카르타) ○○ 지역 · 상세 주소 비공개 \[가상\]$/))) return en ? `${t(match[1], lang)} ○○ area · full address hidden [fictional]` : `Khu vực ○○, ${t(match[1], lang)} · ẩn địa chỉ chi tiết [giả lập]`;
  if ((match = text.match(/^(.+) · (SES-[\w-]+)의 가상 세션을 회수합니다\. 다른 실제 기기나 계정에는 영향을 주지 않습니다\.$/))) return en ? `Revoke the simulated session ${match[2]} for ${match[1]}. No real device or account is affected.` : `Thu hồi phiên giả lập ${match[2]} của ${match[1]}. Không ảnh hưởng đến thiết bị hay tài khoản thật.`;
  if ((match = text.match(/^(가상 (?:오너|홀|주방)) ([\d,.]+)$/))) return `${t(match[1], lang)} ${match[2]}`;
  if ((match = text.match(/^거절 사유: (.*)$/))) return en ? `Reason for rejection: ${match[1]}` : `Lý do từ chối: ${match[1]}`;
  if ((match = text.match(/^지원 요청 생성 · (.+)$/))) return en ? `Support case created · ${match[1]}` : `Đã tạo yêu cầu hỗ trợ · ${match[1]}`;
  if ((match = text.match(/^지원 요청 처리 · (open|investigating|waiting|resolved)$/))) return `${en ? 'Support case updated' : 'Đã xử lý yêu cầu hỗ trợ'} · ${t({open:'신규',investigating:'조사 중',waiting:'응답 대기',resolved:'해결'}[match[1]], lang)}`;
  if ((match = text.match(/^샵 공개 정보 수정 · ((?:name|city|locale|publicHours)(?:, (?:name|city|locale|publicHours))*)$/))) return `${en ? 'Shop public information updated' : 'Đã sửa thông tin công khai của quán'} · ${match[1]}`;
  if ((match = text.match(/^샵 준비 항목 확인 · ([a-z_]+) · (done|pending)$/))) return `${en ? 'Shop setup check updated' : 'Đã cập nhật mục chuẩn bị quán'} · ${match[1]} · ${t(match[2] === 'done' ? '확인 완료' : '대기', lang)}`;
  if ((match = text.match(/^국가 출시 근거 시뮬레이션 · (VN|KR|ID) · ([a-z_]+) · (done|pending)$/))) return `${en ? 'Country launch evidence simulated' : 'Giả lập bằng chứng triển khai quốc gia'} · ${match[1]} · ${match[2]} · ${t(match[3] === 'done' ? '확인 완료' : '대기', lang)}`;
  if ((match = text.match(/^독립 승인 요청 · ([a-z]+\.[a-z]+)$/))) return `${en ? 'Independent review requested' : 'Đã đề nghị duyệt độc lập'} · ${match[1]}`;
  if ((match = text.match(/^독립 검토 · ([a-z]+\.[a-z]+) · (approved|rejected|expired|stale)$/))) return `${en ? 'Independent review' : 'Duyệt độc lập'} · ${match[1]} · ${t({approved:'승인·적용',rejected:'거절',expired:'만료',stale:'재검토 필요'}[match[2]], lang)}`;
  if ((match = text.match(/^장애 상태 갱신 · (investigating|monitoring|resolved)$/))) return `${en ? 'Incident status updated' : 'Đã cập nhật trạng thái sự cố'} · ${t({investigating:'조사 중',monitoring:'복구 관찰',resolved:'해결'}[match[1]], lang)}`;
  if ((match = text.match(/^번역 초안 저장 · (ko|en|vi|zh|ja|km|id|lo|hi)$/))) return `${en ? 'Translation draft saved' : 'Đã lưu bản nháp dịch'} · ${match[1]}`;
  if ((match = text.match(/^공지 초안 저장 · (VN|KR|ID|all)$/))) return `${en ? 'Announcement draft saved' : 'Đã lưu bản nháp thông báo'} · ${match[1]}`;
  if ((match = text.match(/^마스킹 로컬 CSV · ([a-z]+) · (\d+)행 · ([\w, ]+)$/))) return en ? `Masked local CSV · ${match[1]} · ${match[2]} rows · ${match[3]}` : `CSV cục bộ đã che dữ liệu · ${match[1]} · ${match[2]} dòng · ${match[3]}`;
  if ((match = text.match(/^국가 정책 독립 검토 · (approved|rejected|expired|stale)$/))) return `${en ? 'Independent country policy review' : 'Duyệt độc lập chính sách quốc gia'} · ${t({approved:'승인·적용',rejected:'거절',expired:'만료',stale:'재검토 필요'}[match[1]], lang)}`;
  if ((match = text.match(/^개인 알림 읽음 처리 · (\d+)건$/))) return en ? `Personal notifications marked as read · ${match[1]}` : `Đánh dấu đã đọc thông báo cá nhân · ${match[1]}`;
  if ((match = text.match(/^SLA 처리 근거: (.*)$/))) return en ? `SLA justification: ${match[1]}` : `Căn cứ xử lý SLA: ${match[1]}`;
  if ((match = text.match(/^총 ([\d,.]+)건 · ([\d,.]+)[–-]([\d,.]+)건 표시$/))) return en ? `${match[1]} records · showing ${match[2]}–${match[3]}` : `${match[1]} mục · hiển thị ${match[2]}–${match[3]}`;
  if ((match = text.match(/^([\d,.]+)번 테이블( · QR)?$/))) return en ? `Table ${match[1]}${match[2] ? ' · QR' : ''}` : `Bàn ${match[1]}${match[2] ? ' · QR' : ''}`;
  if ((match = text.match(/^([\d,.]+)명$/))) return en ? `${match[1]} guests` : `${match[1]} khách`;
  if ((match = text.match(/^([\d,.]+)건$/))) return en ? `${match[1]} records` : `${match[1]} mục`;
  if ((match = text.match(/^([\d,.]+)개$/))) return en ? match[1] : `${match[1]} mục`;
  if ((match = text.match(/^([\d,.]+)회$/))) return en ? `${match[1]} uses` : `${match[1]} lượt`;
  if ((match = text.match(/^([\d,.]+)개 활성$/))) return en ? `${match[1]} active` : `${match[1]} đang hoạt động`;
  if ((match = text.match(/^(주문|예약|샵 직원) ([\d,.]+)$/))) return `${t(match[1], lang)} ${match[2]}`;
  if ((match = text.match(/^([\d,.]+)[–-]([\d,.]+)시간$/))) return en ? `${match[1]}–${match[2]}h` : `${match[1]}–${match[2]} giờ`;
  if ((match = text.match(/^([\d,.]+) \/ ([\d,.]+) 확인$/))) return en ? `${match[1]} / ${match[2]} checked` : `Đã kiểm tra ${match[1]} / ${match[2]}`;
  if ((match = text.match(/^기기 저장 · r(\d+)$/))) return en ? `Saved on device · r${match[1]}` : `Đã lưu trên thiết bị · r${match[1]}`;
  if ((match = text.match(/^가상 자료 기준 (.+) · 표시 시간 (.+) · r(\d+)$/))) return en ? `Sample data as of ${match[1]} · time zone ${match[2]} · r${match[3]}` : `Dữ liệu mẫu lúc ${match[1]} · múi giờ ${match[2]} · r${match[3]}`;
  if ((match = text.match(/^오늘은 (\d+)개의 문의와 (\d+)개의 승인 요청을 확인해 주세요\.$/))) return en ? `Today, review ${match[1]} support cases and ${match[2]} approval requests.` : `Hôm nay, hãy kiểm tra ${match[1]} yêu cầu hỗ trợ và ${match[2]} đề nghị phê duyệt.`;
  if ((match = text.match(/^([\d,.]+)개 조직$/))) return en ? `${match[1]} organizations` : `${match[1]} tổ chức`;
  if ((match = text.match(/^공개 · ([\d,.]+)개 조직$/))) return en ? `published · ${match[1]} organizations` : `đã công khai · ${match[1]} tổ chức`;
  if ((match = text.match(/^([\d,.]+)개 샵 영향 · (.+)$/))) return en ? `${match[1]} shops affected · ${t(match[2], lang)}` : `${match[1]} quán bị ảnh hưởng · ${t(match[2], lang)}`;
  if ((match = text.match(/^(VND|KRW|IDR) 미수 · ([\d,.]+)건$/))) return en ? `${match[1]} outstanding · ${match[2]} invoices` : `Còn phải thu ${match[1]} · ${match[2]} hóa đơn`;
  if ((match = text.match(/^(VND|KRW|IDR) · 가상 총수금 \/ 누적 환불 \/ 순수금$/))) return en ? `${match[1]} · simulated collections / refunds / net` : `${match[1]} · tổng thu / hoàn tiền / thu ròng giả lập`;
  if ((match = text.match(/^(환불|순수금) ([\d,.]+ (?:VND|KRW|IDR))$/))) return `${en ? (match[1] === '환불' ? 'Refunds' : 'Net collections') : (match[1] === '환불' ? 'Hoàn tiền' : 'Thu ròng')} ${match[2]}`;
  if ((match = text.match(/^(.+) 출시 검토$/))) return en ? `${t(match[1], lang)} launch review` : `Xét triển khai tại ${t(match[1], lang)}`;
  if ((match = text.match(/^국가별 필수 검토 · (\d+)\/(\d+)$/))) return en ? `Country launch checks · ${match[1]}/${match[2]}` : `Kiểm tra bắt buộc theo quốc gia · ${match[1]}/${match[2]}`;
  if ((match = text.match(/^(.+) · 검수 (\d+)\/(\d+)$/))) return en ? `${t(match[1], lang)} · checked ${match[2]}/${match[3]}` : `${t(match[1], lang)} · đã kiểm tra ${match[2]}/${match[3]}`;
  if ((match = text.match(/^현재 값 · 대상 v(\d+)$/))) return en ? `Current value · target v${match[1]}` : `Giá trị hiện tại · đối tượng v${match[1]}`;
  if ((match = text.match(/^신청한 변경 · 기준 v(\d+)$/))) return en ? `Requested change · based on v${match[1]}` : `Thay đổi đề nghị · theo v${match[1]}`;
  if ((match = text.match(/^새 시나리오 할당량 · 현재 사용 ([\d,.]+)회$/))) return en ? `New scenario allowance · ${match[1]} used` : `Hạn mức kịch bản mới · đã dùng ${match[1]} lượt`;
  if ((match = text.match(/^가상 환불액 · 잔액 (.+)$/))) return en ? `Simulated refund · balance ${match[1]}` : `Hoàn tiền giả lập · số dư ${match[1]}`;
  if ((match = text.match(/^(.+) 역할로 미리봅니다\.$/))) return en ? `Previewing as ${t(match[1], lang)}.` : `Đang xem với vai trò ${t(match[1], lang)}.`;
  if ((match = text.match(/^(.+) (신청|검토)$/)) && [...['신규 접수 변경','샵 공개 변경','구독 플랜 변경','가상 환불','AI 할당량 변경','운영자 권한 변경','번역 게시','국가 파일럿 활성화']].includes(match[1])) return en ? `${match[2] === '신청' ? 'Request' : 'Review'}: ${t(match[1], lang)}` : `${match[2] === '신청' ? 'Đề nghị' : 'Xét duyệt'}: ${t(match[1], lang)}`;
  if ((match = text.match(/^(.+) 문구 초안$/)) && ['한국어','영어','베트남어','중국어','일본어','크메르어','인도네시아어','라오어','힌디어'].includes(match[1])) return en ? `${t(match[1], lang)} text draft` : `Bản nháp nội dung ${t(match[1], lang)}`;
  if ((match = text.match(/^(.+) 형식이 올바르지 않습니다\.$/))) return en ? `The format of ${t(match[1], lang)} is invalid.` : `Định dạng ${t(match[1], lang)} không hợp lệ.`;
  if ((match = text.match(/^(.+)을\(를\) (\d+)~(\d+)자로 입력하세요\.$/))) return en ? `Enter ${match[2]}–${match[3]} characters for ${t(match[1], lang)}.` : `Nhập từ ${match[2]} đến ${match[3]} ký tự cho ${t(match[1], lang)}.`;
  if ((match = text.match(/^(.+) 값이 올바르지 않습니다\.$/))) return en ? `Choose a valid value for ${t(match[1], lang)}.` : `Chọn giá trị hợp lệ cho ${t(match[1], lang)}.`;
  if ((match = text.match(/^(.+)은\(는\) (\d+)~(\d+) 사이 정수여야 합니다\.$/))) return en ? `${t(match[1], lang)} must be a whole number from ${match[2]} to ${match[3]}.` : `${t(match[1], lang)} phải là số nguyên từ ${match[2]} đến ${match[3]}.`;
  if ((match = text.match(/^(.+)은\(는\) (\d+)~(\d+) 사이의 정수여야 합니다\.$/))) return en ? `${t(match[1], lang)} must be a whole number from ${match[2]} to ${match[3]}.` : `${t(match[1], lang)} phải là số nguyên từ ${match[2]} đến ${match[3]}.`;
  if ((match = text.match(/^(시작일|종료일|업무 기한|지원 처리 기한|적용 예정일)을\(를\) 확인하세요\.$/))) return en ? `Check ${t(match[1], lang).toLowerCase()}.` : `Kiểm tra ${t(match[1], lang).toLowerCase()}.`;
  if ((match = text.match(/^(.+)을\(를\) 찾을 수 없습니다\.$/))) return en ? `${t(match[1], lang)} was not found.` : `Không tìm thấy ${t(match[1], lang)}.`;
  if ((match = text.match(/^가상 환불 (\d+) (VND|KRW|IDR) · 실제 환불 미실행$/))) return en ? `Simulated refund ${match[1]} ${match[2]} · no real refund issued` : `Hoàn tiền giả lập ${match[1]} ${match[2]} · không hoàn tiền thật`;
  if ((match = text.match(/^([\d,.]+) ms · 샘플$/))) return `${match[1]} ms · ${en ? 'sample' : 'mẫu'}`;
  if ((match = text.match(/^대상 v(\d+) 기준입니다\. 30분 안에 다른 담당자가 검토하며, 대상이 바뀌면 다시 신청합니다\.(.*)$/))) return (en ? `Based on target v${match[1]}. A separate reviewer has 30 minutes to review it. Submit again if the target changes.` : `Dựa trên đối tượng v${match[1]}. Người duyệt độc lập cần xét trong 30 phút. Hãy gửi lại nếu đối tượng thay đổi.`) + (match[2].trim() ? ` ${t(match[2].trim(), lang)}` : '');
  return null;
}

export function t(text, lang = 'ko') {
  const source = String(text ?? '');
  lang = validLanguage(lang);
  if (lang === 'ko' || !source.trim()) return source;
  const key = normalized(source);
  const exact = catalog.get(key)?.[lang];
  const translated = exact ?? dynamic(key, lang);
  if (translated === null || translated === undefined) return source;
  const leading = source.match(/^\s*/u)?.[0] || '';
  const trailing = source.match(/\s*$/u)?.[0] || '';
  return leading + translated + trailing;
}

const textSources = new WeakMap();
const attributeSources = new WeakMap();
const ATTRIBUTE_SKIP = '[data-original],[data-localized],[data-i18n-skip],script,style,code,pre,[contenteditable]:not([contenteditable="false"])';
const SKIP = `${ATTRIBUTE_SKIP},input,textarea`;
const ATTRIBUTES = ['placeholder', 'title', 'aria-label', 'data-label', 'alt'];
const skipped = element => !element || !!element.closest?.(SKIP);
function textNodes(root) {
  const document = root?.ownerDocument || (root?.nodeType === 9 ? root : null);
  if (!document?.createTreeWalker || (root.nodeType === 1 && skipped(root))) return [];
  const walker = document.createTreeWalker(root, 4);
  const result = [];
  let node;
  while ((node = walker.nextNode())) if (!skipped(node.parentElement)) result.push(node);
  return result;
}
function elements(root) {
  if (!root || (root.nodeType === 1 && root.closest?.('[data-original],[data-localized],[data-i18n-skip]'))) return [];
  return [...(root.nodeType === 1 ? [root] : []), ...(root.querySelectorAll?.('*') || [])];
}

export function localize(root, lang = 'ko') {
  lang = validLanguage(lang);
  for (const node of textNodes(root)) {
    const value = node.nodeValue || '';
    const previous = textSources.get(node);
    const source = previous && (value === previous.output || value === previous.source) ? previous.source : value;
    const output = t(source, lang);
    if (value !== output) node.nodeValue = output;
    textSources.set(node, {source, output});
  }
  for (const element of elements(root)) {
    // Input/textarea values and machine-readable attributes are never touched.
    // Translating their explicit UI labels is safe; data-original still wins.
    if (element.closest?.(ATTRIBUTE_SKIP)) continue;
    let saved = attributeSources.get(element);
    if (!saved) attributeSources.set(element, saved = new Map());
    for (const attribute of ATTRIBUTES) {
      if (!element.hasAttribute(attribute)) continue;
      const value = element.getAttribute(attribute);
      const previous = saved.get(attribute);
      const source = previous && (value === previous.output || value === previous.source) ? previous.source : value;
      const output = t(source, lang);
      if (value !== output) element.setAttribute(attribute, output);
      saved.set(attribute, {source, output});
    }
  }
  return root;
}

// Reports untranslated Korean UI strings without looking at field values or
// marked source content. Useful after each route/modal renders during QA.
export function auditTranslations(root, lang = 'ko') {
  lang = validLanguage(lang);
  if (lang === 'ko') return [];
  const issues = [], seen = new Set();
  const add = (value, element, attribute = null, previous = null) => {
    const text = normalized(value || '');
    // A known translated label may deliberately contain a literal confirmation
    // token. Audit the original key rather than flagging that required token.
    if (previous && value === previous.output && t(previous.source, lang) !== previous.source) return;
    if (!/[가-힣]/u.test(text) || t(text, lang) !== text) return;
    const key = `${attribute || 'text'}:${text}`;
    if (seen.has(key)) return;
    seen.add(key);
    issues.push({text, tag: element?.tagName?.toLowerCase() || '', attribute});
  };
  for (const node of textNodes(root)) add(node.nodeValue, node.parentElement, null, textSources.get(node));
  for (const element of elements(root)) {
    if (element.closest?.(ATTRIBUTE_SKIP)) continue;
    for (const attribute of ATTRIBUTES) if (element.hasAttribute(attribute)) add(element.getAttribute(attribute), element, attribute, attributeSources.get(element)?.get(attribute));
  }
  return issues;
}
