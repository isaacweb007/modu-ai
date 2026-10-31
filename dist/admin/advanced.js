// v0.3 advanced views. Fictional browser-local data only; no service integrations.
import {reportFor,visibleNotifications,canAdvanced as actorCanAdvanced} from './operations.js?v=0.3.0';
const COPY = {
  local:['로컬 업무 데모','Local workflow demo','Mô phỏng nghiệp vụ trên trình duyệt'],
  missing:['이 역할에서 열 수 없는 화면입니다.','This view is outside your current role.','Vai trò hiện tại không được xem màn hình này.'],
  original:['입력 원문','Original entry','Nội dung gốc'],
  shop:['대상 샵','Shop','Cửa hàng'],
  all:['전체','All','Tất cả'],
  country:['국가','Country','Quốc gia'],
  noRows:['이 범위에 표시할 기록이 없습니다.','No records in this scope.','Không có bản ghi trong phạm vi này.'],
  filter:['검색·필터','Search and filter','Tìm kiếm và lọc'],
  query:['제목·번호 검색','Search title or ID','Tìm theo tiêu đề hoặc mã'],
  status:['상태','Status','Trạng thái'],
  apply:['적용하기','Apply','Áp dụng'],
  reset:['필터 초기화','Clear filters','Xóa bộ lọc'],
  saved:['화면 설정을 적용했습니다.','View updated.','Đã cập nhật chế độ xem.'],
  details:['상세 보기','View details','Xem chi tiết'],
  name:['이름','Name','Tên'],
  due:['기한 · UTC','Due time · UTC','Hạn xử lý · UTC'],
  dueNone:['기한 미설정','No due time','Chưa đặt hạn'],
  overdue:['기한 초과','Overdue','Quá hạn'],
  soon:['24시간 이내','Due within 24h','Đến hạn trong 24 giờ'],
  priority:['우선순위','Priority','Mức ưu tiên'],
  high:['높음','High','Cao'],
  medium:['보통','Medium','Trung bình'],
  low:['낮음','Low','Thấp'],
  assignee:['담당자','Assignee','Người phụ trách'],
  unassigned:['미배정','Unassigned','Chưa phân công'],
  open:['대기','Open','Chờ xử lý'],
  doing:['진행 중','In progress','Đang xử lý'],
  done:['완료','Done','Hoàn tất'],
  draft:['초안','Draft','Bản nháp'],
  pending:['승인 대기','Pending review','Chờ duyệt'],
  approved:['승인됨','Approved','Đã duyệt'],
  rejected:['거절됨','Rejected','Bị từ chối'],
  stale:['재검토 필요','Review again','Cần xem xét lại'],
  expired:['기한 만료','Expired','Hết hạn'],
  reviewed:['검토자','Reviewer','Người duyệt'],
  created:['생성 시각','Created','Thời điểm tạo'],
  updated:['최근 변경','Updated','Cập nhật gần nhất'],
  reason:['처리 사유','Reason','Lý do xử lý'],
  version:['자료 버전','Record version','Phiên bản bản ghi'],
  workLead:['할 일과 지원 기한을 함께 관리하세요. 체크리스트와 처리 메모는 관련 사건에 연결됩니다.','Track tasks and support deadlines together. Checklists and notes stay linked to the case.','Quản lý công việc và hạn hỗ trợ cùng một nơi. Danh sách kiểm tra và ghi chú được liên kết với vụ việc.'],
  workClock:['기한은 UTC로 입력하며 이 기기의 현재 시각으로 비교합니다. 실제 SLA나 외부 알림을 보장하는 화면이 아닙니다.','Enter deadlines in UTC. This device’s clock determines overdue status. This demo is not a live SLA or external alert service.','Nhập hạn theo UTC. Trạng thái quá hạn dựa trên giờ của thiết bị. Đây không phải cam kết SLA hay dịch vụ cảnh báo bên ngoài.'],
  taskTab:['운영 업무','Tasks','Công việc vận hành'],
  slaTab:['지원 기한·에스컬레이션','Support deadlines','Hạn hỗ trợ và chuyển cấp'],
  taskNew:['업무 만들기','Create task','Tạo công việc'],
  taskTitle:['업무 제목','Task title','Tiêu đề công việc'],
  taskDetail:['연결된 업무 상세','Task details','Chi tiết công việc liên kết'],
  taskSave:['업무 기록 저장','Save task update','Lưu cập nhật công việc'],
  taskChecklist:['확인할 항목 · 한 줄에 하나','Checklist · one item per line','Danh sách kiểm tra · mỗi dòng một mục'],
  checklist:['체크리스트','Checklist','Danh sách kiểm tra'],
  taskNote:['처리 메모','Update note','Ghi chú xử lý'],
  taskNotes:['업무 기록','Task history','Lịch sử công việc'],
  taskNoNotes:['아직 추가 메모가 없습니다.','No additional notes yet.','Chưa có ghi chú bổ sung.'],
  taskReadOnly:['현재 역할은 업무를 읽을 수 있지만 변경할 수 없습니다.','Your role can read this task but cannot change it.','Vai trò này được xem nhưng không được sửa công việc.'],
  relatedCase:['연결 지원 사건','Linked support case','Vụ việc hỗ trợ liên kết'],
  none:['연결하지 않음','No link','Không liên kết'],
  caseId:['사건 번호','Case ID','Mã vụ việc'],
  caseOpen:['지원 사건 열기','Open support case','Mở vụ việc hỗ trợ'],
  caseState:['지원 처리 상태','Case status','Trạng thái hỗ trợ'],
  investigating:['조사 중','Investigating','Đang xác minh'],
  waiting:['응답 대기','Waiting for response','Chờ phản hồi'],
  resolved:['해결됨','Resolved','Đã giải quyết'],
  escalated:['상위 담당자 검토','Escalated','Đã chuyển cấp'],
  normal:['일반 처리','Standard handling','Xử lý thông thường'],
  slaChange:['기한·우선순위 변경','Update deadline and priority','Đổi hạn và mức ưu tiên'],
  escalate:['상위 담당자 검토 필요','Escalate for review','Cần chuyển cấp xem xét'],
  slaHistory:['기한·전환 이력','Deadline history','Lịch sử hạn xử lý'],
  taskLinkNote:['사건 상태나 샵 주문을 자동으로 바꾸지 않습니다. 관련 사건에서 담당자가 다음 조치를 확인합니다.','This does not change the case status or shop orders automatically. The assignee reviews the next action in the linked case.','Thao tác này không tự đổi trạng thái vụ việc hoặc đơn hàng. Người phụ trách xác nhận bước tiếp theo trong vụ việc liên kết.'],
  policiesLead:['국가별 체험 기간과 포함 답변 횟수를 버전으로 관리합니다. 초안은 다른 담당자가 승인하며 미래 효력 시각을 명시합니다.','Version trial periods and included replies by country. Another person reviews each draft, with an explicit future effective time.','Quản lý thời gian dùng thử và số lượt trả lời theo từng phiên bản, từng quốc gia. Một người khác duyệt bản nháp với thời điểm có hiệu lực trong tương lai.'],
  policyBoundary:['성공한 새 AI 답변의 횟수 정책입니다. 현금 잔액·모델 원가 예산·실제 청구가 아니며, 현재 AI 호출과 요금 적용은 연결하지 않았습니다.','These are quotas for successful new AI replies, not cash balances, model-cost budgets, or live billing. AI calls and live pricing remain disconnected.','Đây là hạn mức cho câu trả lời AI mới thành công, không phải số dư tiền, ngân sách chi phí mô hình hay thanh toán thật. Chưa kết nối AI hoặc áp dụng giá thật.'],
  policyNew:['새 정책안','New policy draft','Tạo chính sách nháp'],
  policyCopy:['새 안으로 복사','Copy into a new draft','Sao chép thành bản nháp mới'],
  policyName:['정책 이름','Policy name','Tên chính sách'],
  trialDays:['체험 기간 · 일','Trial period · days','Thời gian dùng thử · ngày'],
  included:['포함 답변 · 회','Included replies','Số lượt trả lời bao gồm'],
  warnPercent:['사용량 경고 · %','Usage warning · %','Cảnh báo sử dụng · %'],
  hardLimit:['한도 도달 시 새 AI 생성 중지','Stop new AI generation at the quota','Dừng tạo câu trả lời AI mới khi hết hạn mức'],
  hardOn:['새 생성만 중지','Stop new generation only','Chỉ dừng tạo câu trả lời mới'],
  hardOff:['자동 차단 미사용','Automatic block off','Không tự động chặn'],
  effective:['효력 예정 · UTC','Effective time · UTC','Dự kiến có hiệu lực · UTC'],
  futureEffect:['미래 효력 예정','Scheduled for the future','Dự kiến có hiệu lực trong tương lai'],
  policyDetail:['정책 버전 상세','Policy version details','Chi tiết phiên bản chính sách'],
  policyEdit:['초안 수정','Edit draft','Sửa bản nháp'],
  policySave:['초안 저장','Save draft','Lưu bản nháp'],
  policySubmit:['독립 검토 요청','Request independent review','Yêu cầu duyệt độc lập'],
  policyDecide:['정책 검토','Review policy','Duyệt chính sách'],
  policyReviewNote:['신청자와 다른 사람이 검토합니다. 제출 버전·기한·효력 시각을 다시 확인하며 기존 주문과 과거 청구는 바꾸지 않습니다.','A different person reviews the request. Submitted version, expiry, and effective time are checked again. Existing orders and past invoices stay unchanged.','Người duyệt phải khác người gửi. Hệ thống kiểm tra lại phiên bản, hạn duyệt và thời điểm hiệu lực. Đơn hàng và hóa đơn cũ không thay đổi.'],
  decision:['검토 결과','Decision','Kết quả duyệt'],
  approve:['승인','Approve','Chấp thuận'],
  reject:['사유를 남기고 거절','Reject with a reason','Từ chối và ghi lý do'],
  submitter:['신청자','Requester','Người gửi'],
  policyImmutable:['승인된 안은 원본으로 보존합니다. 바꾸려면 새 안을 작성하세요. 미래 효력은 설계용 시연이며 실제 상품을 자동 변경하지 않습니다.','Approved proposals are preserved. Make a new draft to revise them. Future effect is simulated and does not change live products.','Bản đã duyệt được giữ nguyên. Muốn thay đổi, hãy tạo bản nháp mới. Hiệu lực tương lai chỉ là mô phỏng, không tự đổi sản phẩm thật.'],
  policyDefault:['국가별 체험·답변 정책안','Country trial and reply proposal','Đề xuất dùng thử và lượt trả lời theo quốc gia'],
  reportsLead:['기간과 권한 범위 안의 가상 기록을 집계합니다. 샵 운영과 구독 청구를 별도 표로 확인하세요.','Aggregate fictional records within your selected period and access scope. Shop operations and subscription invoices stay separate.','Tổng hợp dữ liệu giả lập trong khoảng thời gian và phạm vi được phép. Xem riêng hoạt động cửa hàng và hóa đơn thuê bao.'],
  reportWindow:['집계 기간','Report period','Kỳ báo cáo'],
  start:['시작일 · UTC','Start date · UTC','Ngày bắt đầu · UTC'],
  end:['종료일 · UTC 포함','End date · UTC inclusive','Ngày kết thúc · UTC, tính cả ngày'],
  reportConfig:['리포트 조건','Report filters','Bộ lọc báo cáo'],
  reportCounts:['생성된 요청과 지원 사건','Created requests and support cases','Yêu cầu và vụ việc hỗ trợ được tạo'],
  orders:['주문','Orders','Đơn hàng'],
  bookings:['예약','Bookings','Đặt chỗ'],
  cases:['지원 사건','Support cases','Vụ việc hỗ trợ'],
  activeShops:['조회 범위의 샵','Shops in scope','Cửa hàng trong phạm vi'],
  requestAmounts:['미결제 데모 주문 요청액','Unpaid demo order request amounts','Giá trị yêu cầu đơn hàng mô phỏng chưa thanh toán'],
  platformMoney:['기간 내 청구의 현재 가상 수금 상태','Current simulated collection status of selected invoices','Trạng thái thu tiền mô phỏng hiện tại của hóa đơn trong kỳ'],
  currency:['원 통화','Original currency','Tiền tệ gốc'],
  count:['건수','Records','Số bản ghi'],
  amount:['금액','Amount','Số tiền'],
  gross:['가상 총수금','Simulated gross collection','Tổng thu mô phỏng'],
  refunds:['가상 환불','Simulated refunds','Hoàn tiền mô phỏng'],
  net:['가상 순수금','Simulated net collection','Thu ròng mô phỏng'],
  noFinance:['이 역할에는 청구 집계 권한이 없습니다.','Your role cannot view billing aggregates.','Vai trò này không được xem tổng hợp thanh toán.'],
  noDiagnostic:['이 역할에는 주문·예약·지원 상세 집계 권한이 없습니다.','Your role cannot view order, booking, or support aggregates.','Vai trò này không được xem tổng hợp đơn hàng, đặt chỗ hoặc hỗ trợ.'],
  reportRule:['주문·예약·지원·업무는 생성일 기준입니다. 청구는 첫 청구 이벤트가 기간 안인 자료를 선택해 현재 수금 상태와 해당 청구의 누적 환불을 보여줍니다. 기간별 현금 입출금표가 아닙니다. 순수금은 선택 청구의 총수금에서 누적 환불을 뺀 값이며 원 통화를 서로 합산하지 않습니다.','Orders, bookings, cases, and tasks use creation time. Invoices are selected by their first event in the period, then show current collections and cumulative refunds for those invoices. This is not a period cash-flow statement. Net is gross collections minus cumulative refunds for selected invoices; currencies are never added together.','Đơn hàng, đặt chỗ, hỗ trợ và công việc được tính theo ngày tạo. Chọn hóa đơn có sự kiện đầu tiên trong kỳ, rồi hiển thị tiền đã thu và hoàn tiền lũy kế của các hóa đơn đó. Đây không phải báo cáo dòng tiền theo kỳ. Thu ròng bằng tổng thu trừ hoàn tiền lũy kế; không cộng các loại tiền với nhau.'],
  reportHonesty:['가상 자료만 집계합니다. 실제 매출·MRR·운영 실적이 아닙니다.', 'Demo records only; not real sales, MRR, or operational performance.','Chỉ có dữ liệu giả lập; không phải doanh thu, MRR hay hiệu quả vận hành thật.'],
  reportExport:['집계 CSV 내려받기', 'Export report CSV','Tải báo cáo CSV'],
  reportExportNote:['집계 행만 내려받고 내보내기 기록을 남깁니다. 연락처·대화·토큰은 포함하지 않습니다.','Downloads aggregate rows and records the export. No contacts, conversations, or tokens are included.','Chỉ tải các dòng tổng hợp và ghi lại lịch sử xuất. Không chứa liên hệ, hội thoại hoặc mã truy cập.'],
  inboxLead:['나에게 온 운영 알림을 확인하세요. 읽음 표시는 현재 가상 운영자에게만 적용됩니다.','Review notifications addressed to you. Read receipts belong only to the current demo operator.','Xem thông báo vận hành gửi cho bạn. Trạng thái đã đọc chỉ áp dụng cho người vận hành giả lập hiện tại.'],
  inboxBoundary:['앱 밖 푸시·이메일은 발송하지 않습니다. 로컬 알림과 읽음 기록은 브라우저에 저장되며, 권한이 없는 자료로 이동할 수 없습니다.','No external push or email is sent. Notifications and read receipts are stored locally. Restricted records cannot be opened.','Không gửi thông báo đẩy hoặc email ra ngoài. Thông báo và trạng thái đã đọc được lưu trên trình duyệt; không mở được dữ liệu ngoài quyền hạn.'],
  unread:['읽지 않음','Unread','Chưa đọc'],
  read:['읽음','Read','Đã đọc'],
  markRead:['읽음으로 표시','Mark as read','Đánh dấu đã đọc'],
  markAll:['현재 목록 모두 읽음','Mark this list as read','Đánh dấu danh sách này đã đọc'],
  openTarget:['관련 기록 열기','Open related records','Mở bản ghi liên quan'],
  notificationDetail:['내 알림 상세','My notification','Chi tiết thông báo của tôi'],
  notificationType:['알림 종류','Notification type','Loại thông báo'],
  readAt:['읽은 시각','Read at','Thời điểm đã đọc'],
  targetMissing:['관련 자료에 대한 접근이 만료됐거나 현재 범위 밖입니다.','Access to the related record has expired or is outside your scope.','Quyền truy cập bản ghi liên quan đã hết hạn hoặc nằm ngoài phạm vi hiện tại.'],
  rows:['개 기록','records','bản ghi'],
  operationsByCountry:['국가별 운영 집계','Operations by country','Tổng hợp vận hành theo quốc gia'],
  publishedShops:['공개 샵','Published shops','Cửa hàng công khai'],
  intakeShops:['접수 중','Accepting orders','Đang nhận đơn'],
  openCases:['미해결 지원','Open cases','Vụ việc chưa giải quyết'],
  openTasks:['미완료 업무','Open tasks','Công việc chưa hoàn tất'],
  invoiceCount:['청구 수','Invoices','Số hóa đơn'],
  issued:['발행 금액','Issued amount','Số tiền đã lập'],
  outstanding:['미수금','Outstanding','Chưa thu'],
  readOnlyLink:['현재 범위에서 연결 자료를 확인하세요.','Open linked records within your current scope.','Xem bản ghi liên kết trong phạm vi hiện tại.']
};
const LANGUAGE_INDEX={ko:0,en:1,vi:2};
const LOCALES={ko:'ko-KR',en:'en-US',vi:'vi-VN'};
const view={workTab:'tasks',workStatus:'all',workQ:'',policyStatus:'all',policyQ:'',inboxStatus:'unread',reportStart:'2026-10-01',reportEnd:'2026-10-31',reportCountry:'all'};
const tr=(c,key)=>COPY[key]?.[LANGUAGE_INDEX[c.lang]??0]??key;
const nfmt=(c,n)=>new Intl.NumberFormat(LOCALES[c.lang]||LOCALES.ko).format(Number(n)||0);
const time=(c,value)=>value?new Intl.DateTimeFormat(LOCALES[c.lang]||LOCALES.ko,{timeZone:'UTC',month:'short',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date(value))+' UTC':'—';
const inputTime=value=>value?new Date(value).toISOString().slice(0,16):'';
const futureInput=()=>new Date(Date.now()+24*60*60*1000).toISOString().slice(0,16);
const inputISO=value=>{if(!/^\d{4}-\d\d-\d\dT\d\d:\d\d$/.test(value||''))throw new Error('Use YYYY-MM-DDTHH:mm · UTC');const date=new Date(value+'Z');if(!Number.isFinite(date.valueOf()))throw new Error('Invalid UTC date');return date.toISOString();};
const plain=(c,text)=>`<span data-original>${c.e(text||'—')}</span>`;
const nameOf=(c,id)=>c.state.members.find(m=>m.id===id)?.name||id||tr(c,'unassigned');
const shopOf=(c,id)=>c.state.shops.find(s=>s.id===id);
const countryLabel=(c,code)=>({ko:{VN:'베트남',KR:'한국',ID:'인도네시아'},en:{VN:'Vietnam',KR:'South Korea',ID:'Indonesia'},vi:{VN:'Việt Nam',KR:'Hàn Quốc',ID:'Indonesia'}}[c.lang]||{VN:'Vietnam',KR:'South Korea',ID:'Indonesia'})[code]||code;
const statusBadge=(c,status)=>c.badge(status,tr(c,status));
const advButton=(c,key,action,id='',disabled=false)=>c.button(tr(c,key),'advanced-'+action,id,'secondary small',disabled);
const shell=(c,body)=>`<section class="advanced-area" data-localized lang="${c.e(c.lang)}">${body}</section>`;
const readonly=(c)=>shell(c,c.card(tr(c,'local'),c.notice(tr(c,'missing'))));
const stateRows=(c,key)=>Array.isArray(c.state[key])?c.state[key]:[];
const permit=(c,key,storeId=null)=>c.canAdvanced(key,storeId);
const scopedRows=(c,key,permission)=>stateRows(c,key).filter(row=>c.visibleIds().has(row.storeId)&&permit(c,permission,row.storeId));
const policyVisible=(c,p)=>permit(c,'policy.read')&&currentMember(c)?.countries?.includes(p.country)&&scopeCountries(c).includes(p.country);
const currentMember=c=>c.state.members.find(m=>m.id===c.actorId);
const linkedCase=(c,id)=>c.state.cases.find(row=>row.id===id&&c.visibleIds().has(row.storeId)&&c.allowed('diagnostic.read',row.storeId));
const scopeCountries=c=>[...new Set(c.visibleShops().map(s=>s.country))];
const empty=(c)=>`<p class="advanced-empty">${c.e(tr(c,'noRows'))}</p>`;
const stat=(c,label,value,detail='')=>`<article class="advanced-stat"><span>${c.e(label)}</span><strong>${c.e(value)}</strong>${detail?`<small>${c.e(detail)}</small>`:''}</article>`;
const head=(c,key,actions='')=>`<div class="advanced-head"><p>${c.e(tr(c,key))}</p><div class="advanced-actions">${actions}</div></div>`;
const listTable=(c,headers,rows)=>rows.length?c.table(headers,rows):empty(c);
const options=(c,keys)=>keys.map(key=>[key,tr(c,key)]);

function work(c){
  if(!permit(c,'task.read'))return readonly(c);
  const tasks=scopedRows(c,'tasks','task.read'),cases=c.state.cases.filter(row=>c.visibleIds().has(row.storeId)&&c.allowed('diagnostic.read',row.storeId));
  const now=Date.now(),active=tasks.filter(t=>t.status!=='done'),over=active.filter(t=>Date.parse(t.dueAt)<now),due=active.filter(t=>Date.parse(t.dueAt)>=now&&Date.parse(t.dueAt)-now<86400000);
  const tabs=`<div class="advanced-tabs">${[['tasks','taskTab'],['sla','slaTab']].map(([id,key])=>`<button class="tab ${view.workTab===id?'active':''}" data-action="advanced-work-tab" data-id="${id}">${c.e(tr(c,key))}</button>`).join('')}</div>`;
  let rows=view.workTab==='tasks'?tasks:cases;
  if(view.workQ)rows=rows.filter(t=>`${t.id} ${t.title||t.subject} ${shopOf(c,t.storeId)?.name}`.toLowerCase().includes(view.workQ.toLowerCase()));
  if(view.workStatus==='overdue')rows=rows.filter(t=>Date.parse(t.dueAt)<now&&!['done','resolved'].includes(t.status));
  else if(view.workStatus!=='all')rows=rows.filter(t=>t.status===view.workStatus);
  rows=[...rows].sort((a,b)=>(Date.parse(a.dueAt)||Infinity)-(Date.parse(b.dueAt)||Infinity));
  const list=view.workTab==='tasks'?listTable(c,[tr(c,'taskTitle'),tr(c,'assignee'),tr(c,'due'),tr(c,'checklist'),tr(c,'status'),tr(c,'details')],rows.map(t=>[
    `${plain(c,t.title)}<small>${c.e(t.id)} · ${plain(c,shopOf(c,t.storeId)?.name)}</small>`,plain(c,nameOf(c,t.assignee)),`${c.e(time(c,t.dueAt))}${Date.parse(t.dueAt)<now&&t.status!=='done'?statusBadge(c,'overdue'):''}`,
    `${(t.checklist||[]).filter(k=>k.done).length}/${(t.checklist||[]).length}`,statusBadge(c,t.status),advButton(c,'details','task-detail',t.id)
  ])):listTable(c,[tr(c,'caseId'),tr(c,'priority'),tr(c,'due'),tr(c,'status'),tr(c,'details')],rows.map(row=>[
    `${plain(c,row.subject)}<small>${c.e(row.id)} · ${plain(c,shopOf(c,row.storeId)?.name)}</small>`,statusBadge(c,row.priority),`${c.e(row.dueAt?time(c,row.dueAt):tr(c,'dueNone'))}${Date.parse(row.dueAt)<now&&row.status!=='resolved'?statusBadge(c,'overdue'):''}`,
    `${statusBadge(c,row.status)} ${row.escalated?statusBadge(c,'escalated'):''}`,advButton(c,'slaChange','sla',row.id,!permit(c,'case.sla.update',row.storeId))
  ]));
  return shell(c,`${head(c,'workLead',advButton(c,'filter','work-filter')+advButton(c,'taskNew','task-new','',!permit(c,'task.create')))}<div class="advanced-stats">${stat(c,tr(c,'taskTab'),nfmt(c,active.length))}${stat(c,tr(c,'overdue'),nfmt(c,over.length))}${stat(c,tr(c,'soon'),nfmt(c,due.length))}${stat(c,tr(c,'escalated'),nfmt(c,cases.filter(r=>r.escalated).length))}</div>${c.notice(tr(c,'workClock'))}<section class="card">${tabs}<div class="advanced-table">${list}</div></section>`);
}

function taskForm(c,id='',newStoreId=''){
  const task=stateRows(c,'tasks').find(t=>t.id===id&&c.visibleIds().has(t.storeId)&&permit(c,'task.read',t.storeId));
  if(id&&!task)throw new Error(tr(c,'missing'));
  if(task){
    const editable=permit(c,'task.update',task.storeId)&&!(currentMember(c)?.role==='technical'&&task.assignee!==c.actorId),checklist=task.checklist||[];
    const info=c.fields([[tr(c,'shop'),plain(c,shopOf(c,task.storeId)?.name)],[tr(c,'assignee'),plain(c,nameOf(c,task.assignee))],[tr(c,'due'),c.e(time(c,task.dueAt))],[tr(c,'priority'),statusBadge(c,task.priority)],[tr(c,'version'),`v${task.version}`]]);
    const notes=`<div class="advanced-notes"><h3>${c.e(tr(c,'taskNotes'))}</h3>${(task.notes||[]).length?(task.notes||[]).map(note=>`<article><small>${c.e(time(c,note.at))} · ${plain(c,note.actor||nameOf(c,note.actorId))}</small><p data-original>${c.e(note.text)}</p></article>`).join(''):`<p>${c.e(tr(c,'taskNoNotes'))}</p>`}</div>`;
    if(!editable){c.openModal(tr(c,'taskDetail'),`<section data-localized>${info}<h3 data-original>${c.e(task.title)}</h3><ul>${checklist.map(k=>`<li><input type="checkbox" disabled ${k.done?'checked':''}> ${plain(c,k.label||k.text)}</li>`).join('')}</ul>${notes}${c.notice(tr(c,'taskReadOnly'))}</section>`);return;}
    const checkbox=checklist.map(k=>`<label class="advanced-check"><input type="checkbox" name="check_${c.e(k.id)}" ${k.done?'checked':''}><span data-original>${c.e(k.label||k.text)}</span></label>`).join('');
    c.formModal(tr(c,'taskDetail'),`<div class="span-2" data-localized>${info}<h3 data-original>${c.e(task.title)}</h3>${task.caseId&&linkedCase(c,task.caseId)?c.link(tr(c,'caseOpen'),`#support/${task.caseId}`,'subtle'):''}</div>${c.selectField(tr(c,'status'),'status',options(c,['open','doing','done']),task.status)}<div class="span-2" data-localized><h3>${c.e(tr(c,'checklist'))}</h3>${checkbox}</div>${c.textarea(tr(c,'taskNote'),'note','','required maxlength="3000"')}<div class="span-2" data-localized>${notes}</div>`,data=>c.run('task.update',{id:task.id,expectedVersion:task.version,status:data.status,checklist:checklist.map(k=>({id:k.id,done:data['check_'+k.id]==='on'})),note:data.note}),tr(c,'taskSave'),tr(c,'taskLinkNote'));
    return;
  }
  if(!permit(c,'task.create'))throw new Error(tr(c,'missing'));
  const stores=c.visibleShops().filter(s=>permit(c,'task.create',s.id));
  if(!newStoreId){c.openModal(tr(c,'shop'),`<section data-localized class="advanced-shop-picker">${stores.map(s=>`<button type="button" class="button secondary" data-action="advanced-task-new-for" data-id="${c.e(s.id)}"><span data-original>${c.e(s.name)}</span><small>${c.e(s.id)}</small></button>`).join('')}</section>`,tr(c,'taskNew'));return;}
  const selected=stores.find(s=>s.id===newStoreId);if(!selected)throw new Error(tr(c,'missing'));
  const allowedPeople=c.state.members.filter(m=>actorCanAdvanced(c.state,m.id,'task.update',selected.id));
  const cases=c.state.cases.filter(row=>row.storeId===selected.id&&linkedCase(c,row.id));
  const body=`${c.selectField(tr(c,'shop'),'storeId',[[selected.id,selected.name]],selected.id)}${c.field(tr(c,'taskTitle'),'title','','text','required maxlength="160"')}${c.selectField(tr(c,'priority'),'priority',options(c,['high','medium','low']),'medium')}${c.field(tr(c,'due'),'dueAt',futureInput(),'datetime-local','required')}${c.selectField(tr(c,'relatedCase'),'caseId',[['',tr(c,'none')],...cases.map(row=>[row.id,row.id+' · '+row.subject])],'')}${c.selectField(tr(c,'assignee'),'taskAssignee',allowedPeople.map(m=>[m.id,m.name]),allowedPeople.some(m=>m.id===c.actorId)?c.actorId:allowedPeople[0]?.id)}${c.textarea(tr(c,'taskChecklist'),'checklist','','required maxlength="3000"')}`;
  c.formModal(tr(c,'taskNew'),body,data=>c.run('task.create',{storeId:data.storeId,caseId:data.caseId||null,title:data.title,priority:data.priority,assignee:data.taskAssignee,dueAt:inputISO(data.dueAt),checklist:data.checklist.split(/\r?\n/).map(s=>s.trim()).filter(Boolean)}),tr(c,'taskNew'),tr(c,'taskLinkNote'));
}

function slaForm(c,id){
  const row=c.state.cases.find(r=>r.id===id&&c.visibleIds().has(r.storeId)&&permit(c,'case.sla.update',r.storeId));if(!row)throw new Error(tr(c,'missing'));
  c.formModal(tr(c,'slaChange'),`<div class="span-2" data-localized>${c.fields([[tr(c,'caseId'),c.e(row.id)],[tr(c,'shop'),plain(c,shopOf(c,row.storeId)?.name)]])}<p data-original>${c.e(row.subject)}</p>${c.link(tr(c,'caseOpen'),`#support/${row.id}`,'subtle')}</div>${c.selectField(tr(c,'priority'),'priority',options(c,['high','medium','low']),row.priority)}${c.field(tr(c,'due'),'dueAt',inputTime(row.dueAt)||futureInput(),'datetime-local','required')}<label class="advanced-check span-2" data-localized><input type="checkbox" name="escalated" ${row.escalated?'checked':''}><span>${c.e(tr(c,'escalate'))}</span></label>${c.textarea(tr(c,'reason'),'reason','','required minlength="3" maxlength="2000"')}`,
    data=>c.run('case.sla.update',{id:row.id,expectedVersion:row.version,priority:data.priority,dueAt:inputISO(data.dueAt),escalated:data.escalated==='on',reason:data.reason}),tr(c,'apply'),tr(c,'taskLinkNote'));
}

function policies(c){
  if(!permit(c,'policy.read'))return readonly(c);
  let rows=stateRows(c,'policies').filter(p=>policyVisible(c,p));if(view.policyStatus!=='all')rows=rows.filter(p=>p.status===view.policyStatus);if(view.policyQ)rows=rows.filter(p=>`${p.id} ${p.name} ${p.country}`.toLowerCase().includes(view.policyQ.toLowerCase()));
  return shell(c,`${head(c,'policiesLead',advButton(c,'filter','policy-filter')+advButton(c,'policyNew','policy-new','',!permit(c,'policy.draft.save')))}${c.notice(tr(c,'policyBoundary'))}<section class="card advanced-table">${listTable(c,[tr(c,'policyName'),tr(c,'country'),tr(c,'trialDays'),tr(c,'included'),tr(c,'effective'),tr(c,'status'),tr(c,'details')],rows.map(p=>[
    `${plain(c,p.name)}<small>${c.e(p.id)} · v${p.version}</small>`,c.e(countryLabel(c,p.country)),nfmt(c,p.trialDays),nfmt(c,p.includedUnits),c.e(time(c,p.effectiveAt)),statusBadge(c,p.status),advButton(c,'details','policy-detail',p.id)
  ]))}</section>`);
}
function policyForm(c,id='',copy=false){
  const p=id?stateRows(c,'policies').find(p=>p.id===id&&policyVisible(c,p)):null;if(id&&!p)throw new Error(tr(c,'missing'));
  const countries=(currentMember(c)?.countries||[]).map(code=>[code,countryLabel(c,code)]);
  const body=`${c.field(tr(c,'policyName'),'name',p?.name||tr(c,'policyDefault'),'text','required maxlength="160"')}${c.selectField(tr(c,'country'),'country',p&&!copy?[[p.country,countryLabel(c,p.country)]]:countries,p?.country||countries[0]?.[0])}${c.field(tr(c,'trialDays'),'trialDays',p?.trialDays??14,'number','required min="0" max="90" step="1"')}${c.field(tr(c,'included'),'includedUnits',p?.includedUnits??500,'number','required min="1" max="1000000" step="1"')}${c.field(tr(c,'warnPercent'),'warningPercent',p?.warningPercent??90,'number','required min="1" max="99" step="1"')}${c.field(tr(c,'effective'),'effectiveAt',p&&p.status==='draft'&&!copy?inputTime(p.effectiveAt):futureInput(),'datetime-local','required')}<label class="advanced-check span-2" data-localized><input type="checkbox" name="hardLimit" ${p?.hardLimit===false?'':'checked'}><span>${c.e(tr(c,'hardLimit'))}</span></label>${c.textarea(tr(c,'reason'),'reason',p?.reason||'','required minlength="5" maxlength="2000"')}`;
  c.formModal(tr(c,'policySave'),body,data=>c.run('policy.draft.save',{...(!copy&&p?{id:p.id,expectedVersion:p.version}:{}),name:data.name,country:data.country,trialDays:Number(data.trialDays),includedUnits:Number(data.includedUnits),warningPercent:Number(data.warningPercent),hardLimit:data.hardLimit==='on',effectiveAt:inputISO(data.effectiveAt),reason:data.reason}),tr(c,'policySave'),tr(c,'policyBoundary'));
}
function policyDetail(c,id){
  const p=stateRows(c,'policies').find(p=>p.id===id&&policyVisible(c,p));if(!p)throw new Error(tr(c,'missing'));
  const info=c.fields([[tr(c,'policyName'),plain(c,p.name)],[tr(c,'country'),c.e(countryLabel(c,p.country))],[tr(c,'version'),`v${p.version}`],[tr(c,'status'),statusBadge(c,p.status)],[tr(c,'trialDays'),nfmt(c,p.trialDays)],[tr(c,'included'),nfmt(c,p.includedUnits)],[tr(c,'warnPercent'),nfmt(c,p.warningPercent)+'%'],[tr(c,'hardLimit'),c.e(tr(c,p.hardLimit?'hardOn':'hardOff'))],[tr(c,'effective'),c.e(time(c,p.effectiveAt))],[tr(c,'submitter'),plain(c,nameOf(c,p.requesterId||p.draftBy))],[tr(c,'reviewed'),plain(c,nameOf(c,p.reviewerId))]]);
  const edit=['draft','rejected','stale','expired'].includes(p.status);
  c.openModal(tr(c,'policyDetail'),`<section data-localized lang="${c.e(c.lang)}">${info}<article class="message mt"><h3>${c.e(tr(c,'reason'))}</h3><p data-original>${c.e(p.reason)}</p>${p.reviewReason?`<p data-original>${c.e(p.reviewReason)}</p>`:''}</article>${c.notice(tr(c,'policyImmutable'))}<div class="form-actions">${advButton(c,'policyEdit','policy-edit',p.id,!edit||!permit(c,'policy.draft.save'))}${advButton(c,'policyCopy','policy-copy',p.id,!permit(c,'policy.draft.save'))}${advButton(c,'policySubmit','policy-submit',p.id,p.status!=='draft'||!permit(c,'policy.submit'))}${advButton(c,'policyDecide','policy-decide',p.id,p.status!=='pending'||p.requesterId===c.actorId||p.draftBy===c.actorId||!permit(c,'policy.decide'))}</div></section>`,tr(c,'local'));
}

function effectiveReportCountry(c){
  const countries=scopeCountries(c);if(!countries.length)return null;
  if(view.reportCountry!=='all'&&countries.includes(view.reportCountry))return view.reportCountry;
  return countries.length===1?countries[0]:'all';
}
function reportData(c){
  const country=effectiveReportCountry(c);if(country===null)return null;
  return reportFor(c.state,c.actorId,country,{startAt:view.reportStart+'T00:00:00.000Z',endAt:view.reportEnd+'T23:59:59.999Z',now:Date.now()});
}
function reports(c){
  if(!permit(c,'report.read'))return readonly(c);const r=reportData(c),canExport=permit(c,'report.export')&&!!r;
  const header=head(c,'reportsLead',advButton(c,'reportConfig','report-filter')+advButton(c,'reportExport','report-export','',!canExport));
  if(!r)return shell(c,header+empty(c));
  const count=value=>value===null?'—':nfmt(c,value),diagnostic=r.totals.orders!==null,financial=c.allowed('billing.read');
  const countryTable=listTable(c,[tr(c,'country'),tr(c,'activeShops'),tr(c,'publishedShops'),tr(c,'intakeShops'),tr(c,'orders'),tr(c,'bookings'),tr(c,'openCases'),tr(c,'openTasks')],r.rows.map(row=>[c.e(countryLabel(c,row.country)),count(row.shops),count(row.publishedShops),count(row.openIntake),count(row.orders),count(row.bookings),count(row.openCases),count(row.openTasks)]));
  const billingTable=listTable(c,[tr(c,'currency'),tr(c,'invoiceCount'),tr(c,'issued'),tr(c,'gross'),tr(c,'outstanding'),tr(c,'refunds'),tr(c,'net')],r.billingByCurrency.map(row=>[c.e(row.currency),count(row.invoiceCount),nfmt(c,row.issuedAmount),nfmt(c,row.paidAmount),nfmt(c,row.outstandingAmount),nfmt(c,row.refundedAmount),nfmt(c,row.netCollectedAmount)]));
  return shell(c,`${header}<div class="advanced-report-context"><span>${c.e(view.reportStart)} — ${c.e(view.reportEnd)} · UTC</span><span>${c.e(r.country==='all'?tr(c,'all'):countryLabel(c,r.country))} · ${c.e(time(c,r.asOf))}</span></div>${c.notice(tr(c,'reportHonesty'))}<div class="advanced-stats">${stat(c,tr(c,'activeShops'),count(r.totals.shops))}${stat(c,tr(c,'orders'),count(r.totals.orders))}${stat(c,tr(c,'bookings'),count(r.totals.bookings))}${stat(c,tr(c,'openCases'),count(r.totals.openCases))}</div><section class="card advanced-report-section"><div class="card-head"><h2 class="card-title">${c.e(tr(c,'operationsByCountry'))}</h2></div>${countryTable}${!diagnostic?c.notice(tr(c,'noDiagnostic')):''}</section><section class="card advanced-report-section"><div class="card-head"><h2 class="card-title">${c.e(tr(c,'platformMoney'))}</h2></div>${financial?billingTable:c.notice(tr(c,'noFinance'))}</section>${c.notice(tr(c,'reportRule'))}${c.notice(tr(c,'reportExportNote'))}`);
}

const SYSTEM_NOTICES={
  '관리자 업무 체험이 준비됐어요.':['Your admin workspace is ready.','Không gian trải nghiệm quản trị đã sẵn sàng.'],
  '가상 업무·국가 정책·보고서·개인 알림을 살펴보세요. 실제 시스템은 연결하지 않습니다.':['Explore simulated tasks, country policies, reports, and personal notifications. No live systems are connected.','Khám phá công việc, chính sách quốc gia, báo cáo và thông báo cá nhân giả lập. Không kết nối hệ thống thật.'],
  '지원 요청에 새 처리 내역이 있어요.':['A support case has a new update.','Vụ việc hỗ trợ có cập nhật mới.'],
  '권한이 있는 지원 요청 화면에서 확인하세요.':['Review it in the support view allowed by your current access.','Xem trong màn hình hỗ trợ thuộc quyền truy cập hiện tại.'],
  '담당 업무가 업데이트됐어요.':['An assigned task has been updated.','Công việc được phân công đã có cập nhật.'],
  '체크 항목과 기한을 업무 화면에서 확인하세요.':['Check the checklist and deadline in Tasks.','Kiểm tra danh sách và hạn xử lý trong Công việc.'],
  '국가 정책 검토가 업데이트됐어요.':['A country policy review has been updated.','Việc duyệt chính sách quốc gia đã có cập nhật.'],
  '실제 청구에 적용하지 않는 정책 시뮬레이션입니다.':['This policy simulation does not affect live billing.','Chính sách mô phỏng này không áp dụng cho thanh toán thật.'],
  '검토 요청의 처리 상태가 바뀌었어요.':['A review request has changed status.','Trạng thái yêu cầu duyệt đã thay đổi.'],
  '권한이 있는 승인 화면에서 최신 결과를 확인하세요.':['See the latest result in your permitted approvals view.','Xem kết quả mới nhất trong màn hình phê duyệt được phép.'],
  '가상 청구 검토 상태가 바뀌었어요.':['A simulated billing review has changed status.','Trạng thái duyệt thanh toán giả lập đã thay đổi.'],
  '실제 결제나 환불은 실행하지 않았습니다.':['No actual payment or refund was made.','Không thực hiện thanh toán hoặc hoàn tiền thật.'],
  '관리자 권한 검토가 업데이트됐어요.':['An operator access review has been updated.','Việc duyệt quyền quản trị viên đã có cập nhật.'],
  '필요한 경우 가상 세션이 회수되며 실제 계정은 변경하지 않습니다.':['Demo sessions may be revoked; no real accounts are changed.','Phiên giả lập có thể bị thu hồi; tài khoản thật không thay đổi.'],
  '샵 운영 검토가 업데이트됐어요.':['A shop operations review has been updated.','Việc duyệt vận hành cửa hàng đã có cập nhật.'],
  '현재 권한 범위의 샵 화면에서 결과를 확인하세요.':['Review the result in the shop view within your current scope.','Xem kết quả trong màn hình cửa hàng thuộc phạm vi hiện tại.'],
  '기술 운영 작업이 업데이트됐어요.':['A technical operations task has been updated.','Công việc vận hành kỹ thuật đã có cập nhật.'],
  '실제 외부 시스템 작업은 실행하지 않았습니다.':['No real external-system operation was performed.','Không thực hiện thao tác nào trên hệ thống bên ngoài thật.']
};
function systemNotice(c,value){
  const translations=SYSTEM_NOTICES[value];
  if(c.lang==='ko'||translations)return `<span>${c.e(c.lang==='en'?translations?.[0]||value:c.lang==='vi'?translations?.[1]||value:value)}</span>`;
  return plain(c,value);
}
function targetRoute(c,n){
  const id=n.targetId,type=n.targetType;
  if(['case','support'].includes(type)&&linkedCase(c,id))return `support/${id}`;
  if(['task','work'].includes(type)){
    if(!id&&n.kind==='demo.welcome')return permit(c,'task.read')?'work':'reports';
    if(stateRows(c,'tasks').some(t=>t.id===id&&c.visibleIds().has(t.storeId)&&permit(c,'task.read',t.storeId)))return 'work';
  }
  if(['policy','policies'].includes(type)&&stateRows(c,'policies').some(p=>p.id===id&&policyVisible(c,p)))return 'policies';
  if(['store','shops'].includes(type)&&c.visibleIds().has(id))return `shops/${id}`;
  if(['incident','integrations'].includes(type)&&c.allowed('diagnostic.read')){
    const incident=c.state.incidents.find(i=>i.id===id&&i.affectedStoreIds.some(s=>c.visibleIds().has(s)));if(incident)return `health/${id}`;
    const job=c.state.jobs.find(j=>j.id===id&&c.visibleIds().has(j.storeId));if(job)return 'health';
    const integration=c.state.integrations.find(i=>i.id===id&&c.visibleIds().has(i.storeId));if(integration)return 'health';
  }
  if(['approval','approvals'].includes(type)){
    const a=c.state.approvals.find(a=>a.id===id);if(!a)return null;
    if(a.storeId&&!c.visibleIds().has(a.storeId))return null;
    if(a.kind==='country.activation'&&!currentMember(c)?.countries.includes(a.targetId))return null;
    if(c.allowed(`approval.request:${a.kind}`,a.storeId)||c.allowed(`approval.decide:${a.kind}`,a.storeId))return 'approvals';
  }
  if(type==='members'&&c.allowed('member.read')&&currentMember(c)?.storeIds===null){const m=c.state.members.find(m=>m.id===id);if(m?.countries.every(code=>currentMember(c).countries.includes(code)))return 'people';}
  if(type==='countries'&&currentMember(c)?.countries.includes(n.country||id))return `regions/${n.country||id}`;
  if(type==='content')return n.kind.startsWith('announcement.')?'announcements':'content';
  return null;
}
function notifications(c){
  const ids=c.visibleIds(),countries=scopeCountries(c);
  return visibleNotifications(c.state,c.actorId).filter(n=>(!n.storeId||ids.has(n.storeId))&&(!n.country||n.country==='all'||countries.includes(n.country))).sort((a,b)=>Date.parse(b.at)-Date.parse(a.at));
}
const receipt=(c,id)=>stateRows(c,'notificationReads').find(r=>r.actorId===c.actorId&&r.notificationId===id);
function inbox(c){
  if(!permit(c,'notification.read'))return readonly(c);
  const all=notifications(c),unread=all.filter(n=>!receipt(c,n.id)),rows=view.inboxStatus==='unread'?unread:all;
  return shell(c,`${head(c,'inboxLead',advButton(c,'markAll','notification-all','',!rows.some(n=>!receipt(c,n.id))))}${c.notice(tr(c,'inboxBoundary'))}<div class="advanced-tabs"><button class="tab ${view.inboxStatus==='unread'?'active':''}" data-action="advanced-inbox-filter" data-id="unread">${c.e(tr(c,'unread'))} ${nfmt(c,unread.length)}</button><button class="tab ${view.inboxStatus==='all'?'active':''}" data-action="advanced-inbox-filter" data-id="all">${c.e(tr(c,'all'))} ${nfmt(c,all.length)}</button></div><div class="advanced-inbox">${rows.length?rows.map(n=>`<article class="card advanced-notification ${receipt(c,n.id)?'is-read':''}"><span class="advanced-notification-dot" aria-hidden="true"></span><div><div class="advanced-notification-meta"><strong>${systemNotice(c,n.title)}</strong>${statusBadge(c,receipt(c,n.id)?'read':'unread')}</div><p>${systemNotice(c,n.summary)}</p><small>${c.e(time(c,n.at))} · ${c.e(n.id)}${n.storeId?' · '+plain(c,shopOf(c,n.storeId)?.name):''}</small></div><div class="advanced-actions">${advButton(c,'details','notification-detail',n.id)}${advButton(c,'markRead','notification-read',n.id,!!receipt(c,n.id))}</div></article>`).join(''):empty(c)}</div>`);
}
function notificationDetail(c,id){
  const n=notifications(c).find(n=>n.id===id);if(!n)throw new Error(tr(c,'missing'));const read=receipt(c,id),route=targetRoute(c,n);
  c.openModal(tr(c,'notificationDetail'),`<section data-localized lang="${c.e(c.lang)}"><h3>${systemNotice(c,n.title)}</h3><p>${systemNotice(c,n.summary)}</p>${c.fields([[tr(c,'notificationType'),c.e(n.kind)],[tr(c,'created'),c.e(time(c,n.at))],[tr(c,'readAt'),read?c.e(time(c,read.readAt)):'—'],[tr(c,'assignee'),plain(c,nameOf(c,c.actorId))]])}${!route?c.notice(tr(c,'targetMissing')):''}<div class="form-actions">${advButton(c,'markRead','notification-read',id,!!read)}${advButton(c,'openTarget','notification-open',id,!route)}</div></section>`,tr(c,'local'));
}
function dismissAdvancedModal(){const dialog=document.querySelector('#detail-dialog');if(dialog?.open)dialog.close();}

export function renderAdvanced(route,ctx){
  const renderers={work,policies,reports,inbox};return renderers[route]?renderers[route](ctx):null;
}
export function handleAdvanced(action,id,c){
  if(!action.startsWith('advanced-'))return false;
  const key=action.slice(9);
  if(key==='work-tab'){view.workTab=id==='sla'?'sla':'tasks';view.workStatus='all';c.render();}
  else if(key==='work-filter')c.formModal(tr(c,'filter'),`${c.field(tr(c,'query'),'q',view.workQ,'text','maxlength="180"')}${c.selectField(tr(c,'status'),'status',options(c,['all','overdue',...(view.workTab==='tasks'?['open','doing','done']:['open','investigating','waiting','resolved'])]),view.workStatus)}`,data=>{view.workQ=data.q.trim();view.workStatus=data.status;return {message:tr(c,'saved')};},tr(c,'apply'));
  else if(key==='task-new')taskForm(c);
  else if(key==='task-new-for')taskForm(c,'',id);
  else if(key==='task-detail')taskForm(c,id);
  else if(key==='sla')slaForm(c,id);
  else if(key==='policy-filter')c.formModal(tr(c,'filter'),`${c.field(tr(c,'query'),'q',view.policyQ,'text','maxlength="180"')}${c.selectField(tr(c,'status'),'status',options(c,['all','draft','pending','approved','rejected','stale','expired']),view.policyStatus)}`,data=>{view.policyQ=data.q.trim();view.policyStatus=data.status;return {message:tr(c,'saved')};},tr(c,'apply'));
  else if(key==='policy-new')policyForm(c);
  else if(key==='policy-edit')policyForm(c,id);
  else if(key==='policy-copy')policyForm(c,id,true);
  else if(key==='policy-detail')policyDetail(c,id);
  else if(key==='policy-submit'){
    const p=stateRows(c,'policies').find(p=>p.id===id&&policyVisible(c,p));if(!p)throw new Error(tr(c,'missing'));
    c.formModal(tr(c,'policySubmit'),`<div class="span-2" data-localized><p data-original>${c.e(p.name)}</p>${c.fields([[tr(c,'version'),`v${p.version}`],[tr(c,'effective'),c.e(time(c,p.effectiveAt))]])}</div>`,()=>c.run('policy.submit',{id:p.id,expectedVersion:p.version}),tr(c,'policySubmit'),tr(c,'policyReviewNote'));
  }else if(key==='policy-decide'){
    const p=stateRows(c,'policies').find(p=>p.id===id&&policyVisible(c,p));if(!p)throw new Error(tr(c,'missing'));
    c.formModal(tr(c,'policyDecide'),`<div class="span-2" data-localized><p data-original>${c.e(p.name)}</p>${c.fields([[tr(c,'submitter'),plain(c,nameOf(c,p.requesterId||p.draftBy))],[tr(c,'effective'),c.e(time(c,p.effectiveAt))]])}</div>${c.selectField(tr(c,'decision'),'decision',options(c,['approve','reject']),'approve')}${c.textarea(tr(c,'reason'),'reason','','required minlength="3" maxlength="2000"')}`,data=>c.run('policy.decide',{id:p.id,expectedVersion:p.version,decision:data.decision,reason:data.reason}),tr(c,'apply'),tr(c,'policyReviewNote'));
  }else if(key==='report-filter')c.formModal(tr(c,'reportConfig'),`${c.field(tr(c,'start'),'start',view.reportStart,'date','required')}${c.field(tr(c,'end'),'end',view.reportEnd,'date','required')}${c.selectField(tr(c,'country'),'country',[['all',tr(c,'all')],...scopeCountries(c).map(code=>[code,countryLabel(c,code)])],view.reportCountry)}`,data=>{if(!data.start||!data.end||data.start>data.end)throw new Error(tr(c,'reportConfig'));view.reportStart=data.start;view.reportEnd=data.end;view.reportCountry=data.country;return {message:tr(c,'saved')};},tr(c,'apply'));
  else if(key==='report-export')exportReport(c);
  else if(key==='inbox-filter'){view.inboxStatus=id==='all'?'all':'unread';c.render();}
  else if(key==='notification-detail')notificationDetail(c,id);
  else if(key==='notification-read'){if(!notifications(c).some(n=>n.id===id))throw new Error(tr(c,'missing'));const result=c.run('notification.read',{ids:[id]});dismissAdvancedModal();c.render();c.toast(result.message||tr(c,'read'));}
  else if(key==='notification-all'){const ids=notifications(c).filter(n=>!receipt(c,n.id)).map(n=>n.id);if(ids.length){let result;for(let offset=0;offset<ids.length;offset+=200)result=c.run('notification.read',{ids:ids.slice(offset,offset+200)});c.render();c.toast(result?.message||tr(c,'read'));}}
  else if(key==='notification-open'){const n=notifications(c).find(n=>n.id===id),route=n&&targetRoute(c,n);if(!route)throw new Error(tr(c,'targetMissing'));c.run('notification.read',{ids:[id]});dismissAdvancedModal();c.navigate(route);}
  else return false;
  return true;
}

function exportReport(c){
  if(!permit(c,'report.export'))throw new Error(tr(c,'missing'));
  const country=effectiveReportCountry(c);if(country===null)throw new Error(tr(c,'missing'));
  const result=c.run('report.export',{country,startAt:view.reportStart+'T00:00:00.000Z',endAt:view.reportEnd+'T23:59:59.999Z'}),report=result.report;
  if(!report||!Array.isArray(report.rows)||!Array.isArray(report.billingByCurrency))throw new Error(tr(c,'missing'));
  const rows=[['section','country','metric','currency','value','start_utc','end_utc','as_of']];
  for(const row of report.rows)for(const key of ['shops','publishedShops','openIntake','orders','bookings','openCases','openTasks','overdueTasks'])if(row[key]!==null)rows.push(['country',row.country,key,'',row[key],report.startAt,report.endAt,report.asOf]);
  for(const row of report.billingByCurrency)for(const key of ['invoiceCount','issuedAmount','paidAmount','outstandingAmount','refundedAmount','netCollectedAmount'])rows.push(['selected_invoice_cohort','',key,row.currency,row[key],report.startAt,report.endAt,report.asOf]);
  const cell=value=>{let valueText=String(value??'');if(/^[=+@\-\t\r]/.test(valueText))valueText="'"+valueText;return '"'+valueText.replaceAll('"','""')+'"';};
  const url=URL.createObjectURL(new Blob(['\uFEFF'+rows.map(row=>row.map(cell).join(',')).join('\r\n')],{type:'text/csv;charset=utf-8'}));
  const a=document.createElement('a');a.href=url;a.download=`one-shop-aggregate-demo-${view.reportStart}-${view.reportEnd}.csv`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);c.render();c.toast(result.message||tr(c,'reportExport'));
}
