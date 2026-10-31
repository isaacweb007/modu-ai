// one shop ai admin v0.2 — entirely fictional, browser-local fixtures.
// No production identities, contacts, credentials, payments or network calls.
// Monetary values are integer VND/KRW/IDR demo amounts, never real collections.
export function createSeed() {
  const asOf = '2026-10-31T02:00:00Z';
  const stamp = minutesAgo => new Date(Date.parse(asOf) - minutesAgo * 60000).toISOString();
  const pad = (value, length = 3) => String(value).padStart(length, '0');
  const countries = {
    VN: {currency: 'VND', locale: 'vi-VN', timeZone: 'Asia/Ho_Chi_Minh', fees: {start: 199000, partner: 499000, pro: 999000}, phone: '+84 •• ••• •'},
    KR: {currency: 'KRW', locale: 'ko-KR', timeZone: 'Asia/Seoul', fees: {start: 19000, partner: 49000, pro: 99000}, phone: '+82 •• •••• •'},
    ID: {currency: 'IDR', locale: 'id-ID', timeZone: 'Asia/Makassar', fees: {start: 0, partner: 0, pro: 0}, phone: '+62 •• •••• •'}
  };
  const rows = [
    ['VN-001', '주모 다낭', 'T-001', '주모 베트남 · 가상', 'VN', '다낭', '한식 주점', 'published', 'open', 'active', 'partner', 1440, 4],
    ['VN-002', 'Sen Café', 'T-002', 'Sen Food · 가상', 'VN', '하노이', '카페', 'review', 'closed', 'trial', 'start', 36, 2],
    ['VN-003', 'Bếp nhỏ', 'T-003', 'Bếp nhỏ · 가상', 'VN', '호치민', '식당', 'published', 'open', 'past_due', 'pro', 2700, 3],
    ['VN-004', '주모 호이안', 'T-001', '주모 베트남 · 가상', 'VN', '호이안', '한식 주점', 'published', 'open', 'active', 'partner', 1730, 5],
    ['VN-005', 'Sen Riverside', 'T-002', 'Sen Food · 가상', 'VN', '후에', '카페', 'published', 'open', 'active', 'start', 318, 3],
    ['VN-006', 'Phố Bếp', 'T-003', 'Bếp nhỏ · 가상', 'VN', '호치민', '레스토랑', 'published', 'paused', 'trial', 'partner', 168, 2],
    ['VN-007', 'Mây Garden', 'T-007', 'Mây Dining · 가상', 'VN', '냐짱', '레스토랑', 'published', 'open', 'active', 'pro', 4510, 6],
    ['VN-008', 'Lá & Latte', 'T-008', 'Lá Coffee · 가상', 'VN', '달랏', '카페', 'published', 'open', 'active', 'partner', 1980, 3],
    ['VN-009', 'Bến House', 'T-009', 'Bến Kitchen · 가상', 'VN', '푸꾸옥', '식당', 'review', 'closed', 'draft', 'start', 0, 1],
    ['KR-001', '주모 서울', 'T-004', '주모 코리아 · 가상', 'KR', '서울', '한식 주점', 'published', 'open', 'active', 'partner', 260, 7],
    ['KR-002', '온기 식당', 'T-005', '온기 · 가상', 'KR', '제주', '식당', 'review', 'closed', 'trial', 'start', 12, 1],
    ['KR-003', '주모 부산', 'T-004', '주모 코리아 · 가상', 'KR', '부산', '한식 주점', 'published', 'open', 'active', 'pro', 3230, 4],
    ['KR-004', '온기 강릉', 'T-005', '온기 · 가상', 'KR', '강릉', '식당', 'published', 'paused', 'past_due', 'partner', 870, 3],
    ['KR-005', '모닝 블루', 'T-010', '블루 브루 · 가상', 'KR', '서울', '카페', 'published', 'open', 'active', 'start', 472, 2],
    ['KR-006', '달빛 테이블', 'T-011', '달빛 다이닝 · 가상', 'KR', '경주', '레스토랑', 'draft', 'closed', 'draft', 'pro', 0, 1],
    ['ID-001', 'Sore Coffee', 'T-006', 'Sore · 가상', 'ID', '발리', '카페', 'draft', 'closed', 'draft', 'start', 0, 1],
    ['ID-002', 'Sore Ubud', 'T-006', 'Sore · 가상', 'ID', '우붓', '카페', 'review', 'closed', 'draft', 'partner', 0, 2],
    ['ID-003', 'Pagi Table', 'T-012', 'Pagi Dining · 가상', 'ID', '자카르타', '레스토랑', 'draft', 'closed', 'draft', 'pro', 0, 1]
  ];
  const cafeItems = [
    ['아메리카노', '커피', '커피 원두, 물', '없음', 1],
    ['카페라테', '커피', '커피 원두, 우유', '우유', 1.25],
    ['코코넛 커피', '시그니처', '커피 원두, 코코넛 크림, 우유', '우유', 1.5],
    ['망고 요거트', '음료', '망고, 요거트, 얼음', '우유', 1.6],
    ['버터 크루아상', '베이커리', '밀가루, 버터, 달걀', '밀, 우유, 달걀', 1.15],
    ['바나나 브레드', '베이커리', '바나나, 밀가루, 달걀, 호두', '밀, 달걀, 호두', 1.4],
    ['딸기 치즈 케이크', '디저트', '딸기, 크림치즈, 밀가루', '우유, 밀, 달걀', 1.8],
    ['자스민 티', '차', '자스민 찻잎, 물', '없음', 0.9]
  ];
  const diningItems = [
    ['불고기 덮밥', '식사', '쌀, 소고기, 양파, 간장', '대두, 밀', 1],
    ['바삭 감자전', '안주', '감자, 전분, 식용유', '조리 환경 확인 필요', 0.8],
    ['김치전', '안주', '김치, 밀가루, 대파', '밀, 대두', 0.85],
    ['닭구이 플레이트', '메인', '닭고기, 양파, 간장', '대두, 밀', 1.25],
    ['버섯 채소 비빔밥', '식사', '쌀, 버섯, 당근, 시금치, 참기름', '참깨, 대두', 0.9],
    ['해물 떡볶이', '안주', '쌀떡, 오징어, 새우, 고추장', '갑각류, 오징어, 대두', 1.15],
    ['유자 에이드', '음료', '유자청, 탄산수', '없음', 0.4],
    ['제철 과일 접시', '디저트', '망고, 수박, 파인애플', '계절별 재료 확인 필요', 0.65]
  ];
  const onboardingLabels = [
    ['identity', '오너 계정과 소속 확인', '고객 지원'],
    ['profile', '샵 정보·영업시간 확인', '샵 오너'],
    ['menu', '메뉴·가격·알레르기 검토', '콘텐츠 운영'],
    ['language', '현지 언어 메뉴 검수', '현지 검수자'],
    ['qr', 'QR·테이블 접속 점검', '운영 담당'],
    ['handoff', '홀·주방·예약 전달 점검', '기술 운영'],
    ['policy', '국가 정책·지원 범위 확인', '출시 담당']
  ];
  const shops = rows.map((row, index) => {
    const [id, name, tenant, organization, country, city, type, publication, intake, subscription, plan, usage, version] = row;
    const region = countries[country];
    const base = type === '카페' ? (country === 'VN' ? 45000 : country === 'KR' ? 4500 : 30000) : (country === 'VN' ? 125000 : country === 'KR' ? 14000 : 85000);
    const catalog = type === '카페' ? cafeItems : diningItems;
    const isPublished = publication === 'published';
    const completed = isPublished ? 7 : publication === 'review' ? 3 + index % 3 : index % 3;
    const menu = catalog.map(([itemName, category, ingredients, allergens, ratio], menuIndex) => ({
      id: `${id}-M${pad(menuIndex + 1, 2)}`,
      name: itemName,
      price: Math.round(base * ratio / (country === 'KR' ? 100 : 1000)) * (country === 'KR' ? 100 : 1000),
      available: !(menuIndex === 5 && index % 3 === 0),
      category,
      ingredients,
      allergens
    }));
    return {
      id, name, tenant, organization, country, city, type,
      stage: isPublished ? '가상 운영 중' : publication === 'review' ? '가상 개설 검토' : '가상 등록 초안',
      publication, intake, subscription, plan,
      currency: region.currency,
      monthlyFee: region.fees[plan],
      limit: subscription === 'draft' ? 0 : subscription === 'trial' ? 200 : {start: 500, partner: 2000, pro: 5000}[plan],
      usage, version,
      locale: region.locale,
      timeZone: id === 'ID-003' ? 'Asia/Jakarta' : region.timeZone,
      ownerName: `가상 오너 ${['민', '린', '안', '지', '수', '하', '윤', '보', '도'][index % 9]} ${index + 1}`,
      ownerEmail: `owner.${id.toLowerCase().replace('-', '')}@example.invalid`,
      phoneMasked: `${region.phone}${pad(120 + index)}`,
      createdAt: `2026-${['active', 'past_due'].includes(subscription) ? '07' : '10'}-${pad(4 + index % 20, 2)}T03:00:00Z`,
      partnerId: ['VN-001', 'VN-002', 'VN-004'].includes(id) ? 'partner-linh' : null,
      onboarding: onboardingLabels.map(([stepId, label, owner], stepIndex) => ({
        id: stepId, label, status: stepIndex < completed ? 'done' : 'pending', owner: `가상 ${owner}`,
        evidence: stepIndex < completed ? `가상 확인서 ${id}-${stepId} · 실제 검증 자료 아님` : '가상 검토 대기 · 실제 자료 없음'
      })),
      menu
    };
  });

  const spoken = ['vi', 'ko', 'en', 'zh', 'ja', 'km', 'id', 'lo', 'hi'];
  const originals = {
    vi: quantity => `Cho tôi ${quantity} phần món đã chọn. Vui lòng xác nhận lại đơn giúp tôi nhé.`,
    ko: quantity => `선택한 메뉴 ${quantity}개 주세요. 주문 내용을 확인해 주세요.`,
    en: quantity => `I’d like ${quantity} of the selected item. Please confirm my order.`,
    zh: quantity => `请给我所选菜品${quantity}份。请确认订单内容。`,
    ja: quantity => `選んだメニューを${quantity}つお願いします。注文内容を確認してください。`,
    km: quantity => `សូមម្ហូបដែលបានជ្រើស ${quantity} ចាន។ សូមបញ្ជាក់ការកុម្ម៉ង់របស់ខ្ញុំ។`,
    id: quantity => `Saya pesan ${quantity} porsi menu yang dipilih. Mohon konfirmasi pesanan saya.`,
    lo: quantity => `ຂໍເມນູທີ່ເລືອກ ${quantity} ຈານ. ກະລຸນາຢືນຢັນລາຍການທີ່ສັ່ງໃຫ້ແດ່.`,
    hi: quantity => `चुने हुए व्यंजन की ${quantity} प्लेट दीजिए। कृपया मेरा ऑर्डर पक्का कर दीजिए।`
  };
  const orderStatuses = ['pending', 'accepted', 'cooking', 'ready', 'served', 'cancelled', 'accepted'];
  const actionLabels = {pending: '손님 요청 접수', accepted: '홀 접수', cooking: '주방 조리 시작', ready: '주방 준비 완료', served: '홀 전달 완료', cancelled: '사장님 취소 승인'};
  const orders = [];
  const operating = shops.filter(shop => shop.publication === 'published');
  operating.forEach((shop, shopIndex) => {
    const available = shop.menu.filter(item => item.available);
    for (let orderIndex = 0; orderIndex < 7; orderIndex++) {
      const sequence = orders.length + 1;
      const item = available[(shopIndex + orderIndex) % available.length];
      const quantity = 1 + sequence % 3;
      const items = [{name: item.name, quantity, price: item.price}];
      const channel = sequence % 3 === 0 ? 'delivery' : 'dineIn';
      const guestLanguage = spoken[(sequence - 1) % spoken.length];
      const status = orderStatuses[(shopIndex + orderIndex) % orderStatuses.length];
      const minutesAgo = 8 + sequence * 8;
      const createdAt = stamp(minutesAgo);
      const timeline = [{at: createdAt, actor: '가상 손님', action: '메뉴·수량 확인 후 요청'}];
      if (status !== 'pending') timeline.push({at: stamp(minutesAgo - 2), actor: '가상 홀 직원', action: '주문 접수'});
      if (['cooking', 'ready', 'served'].includes(status)) timeline.push({at: stamp(minutesAgo - 4), actor: '가상 주방 직원', action: '조리 시작'});
      if (['ready', 'served'].includes(status)) timeline.push({at: stamp(minutesAgo - 6), actor: '가상 주방 직원', action: '준비 완료 · 손님 알림 예시'});
      if (status === 'served') timeline.push({at: stamp(minutesAgo - 7), actor: '가상 홀 직원', action: '손님 전달 완료'});
      if (status === 'cancelled') timeline.push({at: stamp(minutesAgo - 5), actor: '가상 오너', action: '사유 확인 후 취소 승인 · 실제 환불 없음'});
      orders.push({
        id: `ORD-${pad(sequence, 4)}`, storeId: shop.id, channel,
        tableNo: channel === 'dineIn' ? 1 + sequence % 12 : null,
        status, amount: items.reduce((sum, line) => sum + line.price * line.quantity, 0), currency: shop.currency, items,
        guestLanguage, original: originals[guestLanguage](quantity),
        translation: `선택한 메뉴 ${quantity}개 요청 · 주문 내용을 확인해 주세요. [가상 통역]`,
        contactMasked: channel === 'delivery' ? shop.phoneMasked : '현장 주문 · 연락처 미수집',
        addressMasked: channel === 'delivery' ? `${shop.city} ○○ 지역 · 상세 주소 비공개 [가상]` : '테이블 주문',
        createdAt, events: timeline
      });
    }
  });

  const bookings = operating.flatMap((shop, shopIndex) => [0, 1, 2].map(bookingIndex => {
    const sequence = shopIndex * 3 + bookingIndex + 1;
    return {
      id: `BKG-${pad(sequence, 4)}`, storeId: shop.id,
      nameMasked: `가상 손님 ${String.fromCharCode(65 + sequence % 26)}**`,
      date: `2026-11-${pad(1 + sequence % 4, 2)}`,
      time: ['12:00', '18:30', '19:00', '20:00'][sequence % 4],
      partySize: [2, 3, 4, 6][sequence % 4],
      status: ['requested', 'confirmed', 'cancelled'][bookingIndex],
      guestLanguage: spoken[sequence % spoken.length],
      createdAt: stamp(45 + sequence * 19),
      note: ['창가 자리 요청 · 가상 메모', '견과류 관련 안내 요청 · 직원 확인 필요', '유아 의자 문의 · 가상 메모'][sequence % 3]
    };
  }));

  const billable = shops.filter(shop => ['active', 'past_due'].includes(shop.subscription));
  const invoices = billable.flatMap((shop, shopIndex) => [0, 1, 2].map(monthIndex => {
    const sequence = shopIndex * 3 + monthIndex + 1;
    const month = 8 + monthIndex;
    const status = monthIndex < 2 ? 'paid' : shop.subscription === 'past_due' ? 'past_due' : shopIndex % 3 === 0 ? 'open' : 'paid';
    const dueAt = status === 'open' ? '2026-11-05T03:00:00Z' : `2026-${pad(month, 2)}-20T03:00:00Z`;
    const paidAt = status === 'paid' ? `2026-${pad(month, 2)}-18T03:15:00Z` : null;
    return {
      id: `INV-${pad(sequence, 4)}`, storeId: shop.id, period: `2026-${pad(month, 2)}`,
      amount: shop.monthlyFee, currency: shop.currency, status, dueAt, paidAt,
      version: monthIndex + 1,
      lines: [{name: `라미 ${ {start: '시작', partner: '파트너', pro: '프로'}[shop.plan]} 월 구독료 [가상 청구]`, amount: shop.monthlyFee}],
      events: [{at: `2026-${pad(month, 2)}-01T03:00:00Z`, actor: '가상 청구 시스템', action: '청구서 예시 생성 · 실제 청구 아님'}, ...(paidAt ? [{at: paidAt, actor: '가상 재무 담당', action: '수납 상태 예시 · 실제 결제 없음'}] : [{at: dueAt, actor: '가상 재무 담당', action: status === 'past_due' ? '미납 안내 검토 예시 · 기존 주문 처리 권리 유지' : '수납 확인 대기 예시'}])]
    };
  }));

  const staff = shops.flatMap((shop, index) => ['floor', 'kitchen', 'floor'].map((role, position) => ({
    id: `STF-${shop.id}-${position + 1}`, storeId: shop.id,
    name: `가상 ${role === 'kitchen' ? '주방' : '홀'} ${['하린', '도윤', '서우'][(index + position) % 3]}`,
    role, status: shop.publication === 'published' ? position === 2 && index % 4 === 0 ? 'invited' : 'active' : 'invited',
    permissions: role === 'kitchen' ? ['ordersView', 'ordersPrepare'] : position === 2 ? ['ordersView', 'ordersServe'] : ['ordersView', 'ordersAccept', 'ordersServe', 'bookingsView', 'bookingsManage', 'requestsView'],
    lastSeen: shop.publication === 'published' ? stamp(4 + index * 7 + position * 11) : null
  })));

  const roleRows = [
    ['ops-min', '가상 운영 민', 'operations', ['VN', 'KR', 'ID'], null],
    ['approve-jin', '가상 운영 승인 진', 'operations_approver', ['VN', 'KR', 'ID'], null],
    ['support-hana', '가상 지원 하나', 'support', ['VN', 'KR'], ['VN-001', 'VN-002', 'VN-003', 'VN-004', 'VN-006', 'KR-001', 'KR-002', 'KR-004']],
    ['finance-su', '가상 재무 수', 'finance', ['VN', 'KR'], null],
    ['finance-lead', '가상 재무 승인 가람', 'finance_approver', ['VN', 'KR'], null],
    ['tech-jun', '가상 기술 준', 'technical', ['VN', 'KR', 'ID'], null],
    ['partner-linh', '가상 현지 파트너 린', 'partner', ['VN'], ['VN-001', 'VN-002', 'VN-004']],
    ['security-yun', '가상 보안 윤', 'security', ['VN', 'KR', 'ID'], null],
    ['audit-reader', '가상 감사 서진', 'auditor', ['VN', 'KR', 'ID'], null]
  ];
  const members = roleRows.map(([id, name, role, scopes, storeIds], index) => ({
    id, name, email: `${id}@example.invalid`, role, countries: [...scopes], storeIds: storeIds === null ? null : [...storeIds], status: 'active', version: 1 + index % 4,
    sessions: [
      {id: `SES-${id}-desktop`, device: '가상 업무용 데스크톱', lastSeen: stamp(2 + index * 3), active: true},
      {id: `SES-${id}-mobile`, device: '가상 업무용 휴대폰', lastSeen: stamp(90 + index * 9), active: index % 2 === 0}
    ]
  }));
  members.push(
    {id: 'support-invite', name: '가상 초대 직원 다은', email: 'support-invite@example.invalid', role: 'support', countries: ['VN'], storeIds: ['VN-005', 'VN-007'], status: 'invited', version: 1, sessions: []},
    {id: 'former-operator', name: '가상 퇴사 직원 정우', email: 'former-operator@example.invalid', role: 'operations', countries: ['KR'], storeIds: ['KR-003'], status: 'suspended', version: 4, sessions: [{id: 'SES-former-operator-closed', device: '가상 이전 업무 기기', lastSeen: stamp(3000), active: false}]}
  );

  const integrations = shops.map((shop, index) => ({
    id: `INT-${pad(index + 1)}`, name: `${shop.name} · ${index % 2 ? '알림 전달' : '주문 전달'} 예시`,
    provider: index % 2 ? '가상 알림 어댑터' : '가상 POS 어댑터', kind: index % 2 ? 'notification' : 'pos',
    country: shop.country, storeId: shop.id,
    status: shop.publication !== 'published' ? 'offline' : ['VN-001', 'VN-006', 'KR-004'].includes(shop.id) ? 'warning' : 'healthy',
    lastSync: shop.publication === 'published' ? stamp(['VN-001', 'VN-006', 'KR-004'].includes(shop.id) ? 14 + index : 1 + index % 5) : null,
    latencyMs: shop.publication !== 'published' ? 0 : 90 + index * 31,
    version: 1 + index % 3
  }));
  integrations.push(
    {id: 'INT-019', name: '주모 다낭 · 메뉴 동기화 예시', provider: '가상 메뉴 어댑터', kind: 'catalog', country: 'VN', storeId: 'VN-001', status: 'healthy', lastSync: stamp(3), latencyMs: 124, version: 2},
    {id: 'INT-020', name: '주모 서울 · 알림 전달 예시', provider: '가상 알림 어댑터', kind: 'notification', country: 'KR', storeId: 'KR-001', status: 'healthy', lastSync: stamp(2), latencyMs: 108, version: 1}
  );
  const operatingIntegrations = integrations.filter(integration => operating.some(shop => shop.id === integration.storeId));
  const jobs = Array.from({length: 18}, (_, index) => {
    const integration = operatingIntegrations[index % operatingIntegrations.length];
    const status = ['failed', 'queued', 'succeeded', 'failed', 'succeeded', 'queued'][index % 6];
    return {
      id: `JOB-${pad(index + 1)}`, integrationId: integration.id, storeId: integration.storeId, status,
      attempts: status === 'queued' ? 0 : status === 'failed' ? 2 + index % 3 : 1,
      error: status === 'failed' ? ['가상 ACK_TIMEOUT · 수신 확인 대기', '가상 PROVIDER_UNAVAILABLE · 외부 연결 예시 중단', '가상 VERSION_CONFLICT · 메뉴 버전 재검토 필요'][index % 3] : '',
      operationId: `demo-operation-${pad(index + 1, 4)}`, updatedAt: stamp(6 + index * 9)
    };
  });

  const caseRows = [
    ['VN-001', '주문 전달 확인 지연', 'integration', 'high', 'investigating', 'tech-jun', 'order'],
    ['VN-002', '메뉴판 가격 확인 요청', 'onboarding', 'medium', 'waiting', 'support-hana', 'store'],
    ['VN-003', '구독 안내와 기존 주문 처리 확인', 'billing', 'high', 'open', 'finance-su', 'invoice'],
    ['VN-004', '베트남어 메뉴 문구 검토', 'translation', 'medium', 'open', 'partner-linh', 'store'],
    ['VN-006', '접수 일시 중지 후 예약 이행 확인', 'operations', 'high', 'investigating', 'ops-min', 'booking'],
    ['KR-001', '예약 시간 변경 문의', 'reservation', 'medium', 'waiting', 'support-hana', 'booking'],
    ['KR-002', '오너 초대 수락 안내', 'identity', 'medium', 'open', 'support-hana', 'store'],
    ['KR-004', '미납 상태의 기존 주문 전달 확인', 'billing', 'high', 'investigating', 'finance-su', 'order'],
    ['VN-007', '사용량 90% 안내 검토', 'ai', 'medium', 'open', 'ops-min', 'store'],
    ['VN-008', '새 메뉴 알레르기 표기 요청', 'catalog', 'high', 'waiting', 'ops-min', 'store'],
    ['ID-001', '국가 출시 검토 자료 준비', 'country', 'low', 'open', 'ops-min', 'store'],
    ['KR-003', '주방 준비 완료 알림 재확인', 'notification', 'medium', 'resolved', 'tech-jun', 'order'],
    ['VN-005', '동일 주문 중복 표시 문의', 'order', 'medium', 'resolved', 'tech-jun', 'order'],
    ['KR-005', '구독 청구 내역 확인', 'billing', 'low', 'resolved', 'finance-su', 'invoice'],
    ['VN-009', 'QR 공개 전 최종 점검', 'onboarding', 'low', 'waiting', 'ops-min', 'store']
  ];
  const cases = caseRows.map(([storeId, subject, category, priority, status, assignee, relatedType], index) => {
    const related = relatedType === 'order' ? orders.find(order => order.storeId === storeId) : relatedType === 'booking' ? bookings.find(booking => booking.storeId === storeId) : relatedType === 'invoice' ? invoices.find(invoice => invoice.storeId === storeId && invoice.status === 'past_due') || invoices.find(invoice => invoice.storeId === storeId) : shops.find(shop => shop.id === storeId);
    const id = `CASE-${240 + index}`;
    return {
      id, storeId, subject: `${subject} [가상]`, category, priority, status, assignee, version: 1 + index % 4,
      createdAt: stamp(180 + index * 31), updatedAt: stamp(10 + index * 7),
      messages: [
        {id: `${id}-M1`, at: stamp(180 + index * 31), author: '가상 샵 오너', visibility: 'shop', text: '이 내용은 상세 기능을 검토하기 위한 가상 문의입니다. 실제 고객 정보나 첨부 자료는 없습니다.'},
        {id: `${id}-M2`, at: stamp(70 + index * 7), author: members.find(member => member.id === assignee)?.name || '가상 운영 담당', visibility: 'internal', text: category === 'billing' ? '청구 상태와 기존 주문 이행 권한을 분리해 확인합니다. 실제 결제·독촉 메일은 보내지 않습니다.' : '관련 샵과 업무 기록 예시를 확인했습니다. 변경이 필요하면 별도 승인 요청을 연결합니다.'},
        {id: `${id}-M3`, at: stamp(10 + index * 7), author: '가상 지원 담당', visibility: 'shop', text: status === 'resolved' ? '가상 검토를 마쳤습니다. 이 시안에서는 실제 시스템에 적용하지 않습니다.' : '현재 내용을 확인 중입니다. 확인한 결과는 이 문의에서 안내드리겠습니다. [가상 안내]'}
      ],
      relatedType, relatedId: related.id
    };
  });

  const incidents = [
    {id: 'INC-001', title: '가상 주문 전달 지연 점검', severity: 'P1', country: 'VN', affectedStoreIds: ['VN-001', 'VN-006'], status: 'investigating', version: 3, createdAt: stamp(45), timeline: [{at: stamp(45), actor: '가상 모니터링', action: '주문 수신 확인 지연 예시 감지'}, {at: stamp(38), actor: '가상 기술 준', action: '가상 장애 조사 시작 · 실제 외부 장애 아님'}, {at: stamp(20), actor: '가상 운영 민', action: '기존 주문 이행을 유지하며 신규 접수 영향 검토'}]},
    {id: 'INC-002', title: '가상 한국 알림 재시도 증가', severity: 'P2', country: 'KR', affectedStoreIds: ['KR-001', 'KR-004'], status: 'monitoring', version: 2, createdAt: stamp(140), timeline: [{at: stamp(140), actor: '가상 모니터링', action: '알림 지연 예시 감지'}, {at: stamp(75), actor: '가상 기술 준', action: '가상 재시도 완료 · 재발 여부 관찰'}]},
    {id: 'INC-003', title: '가상 메뉴 버전 불일치 해결', severity: 'P3', country: 'VN', affectedStoreIds: ['VN-005'], status: 'resolved', version: 4, createdAt: stamp(1600), timeline: [{at: stamp(1600), actor: '가상 지원 하나', action: '메뉴 캐시 표시 문의 접수'}, {at: stamp(1520), actor: '가상 기술 준', action: '표시 버전 검토 예시'}, {at: stamp(1490), actor: '가상 운영 민', action: '가상 해결 확인 · 실제 캐시 변경 없음'}]},
    {id: 'INC-004', title: '가상 인도네시아 연결 검토', severity: 'P3', country: 'ID', affectedStoreIds: ['ID-001', 'ID-002'], status: 'investigating', version: 1, createdAt: stamp(900), timeline: [{at: stamp(900), actor: '가상 출시 담당', action: '출시 전 연결 검토 항목 등록 · 실제 장애 아님'}]}
  ];

  const translationRows = [
    ['welcome', '편한 언어로 이야기해요.', {ko: '편한 언어로 이야기해요.', en: 'Speak in the language you feel comfortable with.', vi: 'Cứ trò chuyện bằng ngôn ngữ của bạn nhé.', zh: '用您熟悉的语言聊聊吧。', ja: '話しやすい言葉でどうぞ。', km: 'និយាយជាភាសាដែលអ្នកស្រួលប្រើបាន។', id: 'Silakan gunakan bahasa yang paling nyaman.', lo: 'ເລືອກໃຊ້ພາສາທີ່ທ່ານສະດວກໄດ້.', hi: 'जिस भाषा में सहज हों, उसी में बात कीजिए।'}],
    ['order_ready', '주문하신 음식이 준비됐어요.', {ko: '주문하신 음식이 준비됐어요.', en: 'Your food is ready. Enjoy your meal!', vi: 'Món của bạn đã xong rồi. Chúc bạn ngon miệng!', zh: '您点的餐已准备好，请慢用！', ja: 'お料理ができました。どうぞお楽しみください。', km: 'ម្ហូបរបស់អ្នករួចរាល់ហើយ។ សូមរីករាយជាមួយអាហារ!', id: 'Pesanan Anda sudah siap. Selamat menikmati!', lo: 'ອາຫານຂອງທ່ານພ້ອມແລ້ວ. ເຊີນຮັບປະທານ!', hi: 'आपका खाना तैयार है। भोजन का आनंद लीजिए!'}],
    ['staff_check', '정확한 내용은 직원에게 확인할게요.', {ko: '정확한 내용은 직원에게 확인할게요.', en: 'Let me check the details with the staff.', vi: 'Để mình hỏi nhân viên cho chính xác nhé.', zh: '我来向店员确认一下。', ja: '詳しい内容をスタッフに確認しますね。', km: 'ខ្ញុំនឹងសួរបុគ្គលិកដើម្បីបញ្ជាក់ព័ត៌មាន។', id: 'Saya akan memastikan detailnya kepada staf.', lo: 'ຂ້ອຍຈະສອບຖາມພະນັກງານໃຫ້ແນ່ໃຈ.', hi: 'मैं सही जानकारी कर्मचारियों से पूछ लेती हूँ।'}]
  ];
  const translations = translationRows.flatMap(([key, source, texts], keyIndex) => spoken.map((locale, localeIndex) => ({
    id: `TR-${key}-${locale}`, key, locale, source, text: texts[locale],
    status: ['ko', 'vi', 'en'].includes(locale) ? 'published' : (keyIndex + localeIndex) % 2 ? 'review' : 'draft',
    version: 1 + (keyIndex + localeIndex) % 3, updatedAt: stamp(60 + keyIndex * 100 + localeIndex * 11)
  })));

  const announcements = [
    {id: 'NOTICE-001', title: '가상 접수 지연 안내', body: '주모 다낭의 주문 전달 경로를 확인하는 상황 예시입니다. 기존 주문은 담당 직원이 계속 처리하며 실제 메시지는 발송하지 않습니다.', country: 'VN', channel: 'owner', status: 'published', version: 2, createdAt: stamp(35)},
    {id: 'NOTICE-002', title: '가상 메뉴 검수 안내', body: '메뉴판 사진과 표시 가격을 다시 확인해 주세요. 승인 전 메뉴는 공개하지 않는 흐름을 검토합니다. [가상 공지]', country: 'VN', channel: 'owner', status: 'draft', version: 1, createdAt: stamp(240)},
    {id: 'NOTICE-003', title: '가상 주방 알림 점검', body: '준비 완료 알림이 늦을 때 주문함을 새로 확인하는 안내 예시입니다. 실제 장애나 점검 일정이 아닙니다.', country: 'KR', channel: 'staff', status: 'published', version: 3, createdAt: stamp(110)},
    {id: 'NOTICE-004', title: '가상 구독 내역 확인', body: '이번 달 구독 청구 예시를 확인하는 안내입니다. 이 시안에서는 실제 청구, 결제, 자동 독촉을 실행하지 않습니다.', country: 'KR', channel: 'owner', status: 'draft', version: 1, createdAt: stamp(180)},
    {id: 'NOTICE-005', title: '가상 현지 운영 준비', body: '인도네시아 출시 조건을 검토하기 위한 초안입니다. 서비스 판매나 국가 출시가 승인된 것은 아닙니다.', country: 'ID', channel: 'partner', status: 'draft', version: 1, createdAt: stamp(720)},
    {id: 'NOTICE-006', title: '가상 다국어 메뉴 도움말', body: '손님 언어와 샵 운영 언어를 각각 선택하는 도움말 예시입니다. 표시된 고객·샵·사용량은 전부 가상 데이터입니다.', country: 'VN', channel: 'guest', status: 'published', version: 2, createdAt: stamp(500)}
  ];

  const countryCheckRows = [
    ['scope', '운영 범위와 현지 담당', '운영 담당'],
    ['language', '메뉴·안내 현지 언어 검수', '언어 검수'],
    ['identity', '오너·직원 계정과 복구', '신원 담당'],
    ['contract', '판매 법인·약관·종료 조건', '사업·법무'],
    ['privacy', '개인정보·보존·국외 이전', '개인정보 담당'],
    ['billing', '구독 통화·청구·미납 정책', '재무 담당'],
    ['payment_scope', '실결제 미제공 범위 안내', '상품 담당'],
    ['support', '현지 지원·사고 대응', '지원 책임자'],
    ['restore', '복원·부하·권한 격리', '기술 책임자']
  ];
  const countryProfiles = ['VN', 'KR', 'ID'].map(code => ({
    code, currency: countries[code].currency, timeZone: countries[code].timeZone,
    status: code === 'ID' ? 'planned' : 'review',
    checks: countryCheckRows.map(([id, label, owner], index) => {
      const done = code === 'VN' ? [0, 1, 6].includes(index) : code === 'KR' ? [0, 1].includes(index) : false;
      return {id, label, status: done ? 'done' : 'pending', evidence: done ? `가상 검토 자료 ${code}-${id} · 실제 승인/준수 증빙 아님` : '실제 확인 전 · 가상 대기 항목', owner: `가상 ${owner}`};
    })
  }));

  return {
    schemaVersion: 2, revision: 1, asOf,
    shops, orders, bookings, cases, invoices, staff, members,
    approvals: [], audit: [], refunds: [],
    integrations, jobs, incidents, translations, announcements, countryProfiles,
    processedCommands: []
  };
}
