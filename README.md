# 원샵 · one shop ai

아이작스튜디오 × 원컴퍼니 재단. 9개 언어의 프로덕션북과 샵 에이전트 앱 5.25.0.

- [프로덕션북](https://isaacweb007.github.io/modu-ai/)
- [사장님 로그인·복구 전체 시연](https://isaacweb007.github.io/modu-ai/?lang=ko&v=5.13.0#owner-demo)
- [사장님 앱](https://isaacweb007.github.io/modu-ai/jumo/owner.html?lang=ko&v=5.13.0)
- [주모 손님 앱](https://isaacweb007.github.io/modu-ai/jumo/?lang=ko&v=5.13.0)

## 사장님 로그인·복구 전체 시연

프로덕션북 목차의 **사장님 로그인·복구 시연**에서 **전체 시연 시작**을 누르면 로그인 → 이메일 입력 → 가상 메일함 → 새 비밀번호 → 다시 로그인 → 기존 샵 → 주문 내역이 이어집니다. 직접 입력하지 않는 시나리오이며 실제 메일·로그인·비밀번호 변경·AI·결제는 실행하지 않습니다.

일시정지, 이전/다음, 단계 선택, 처음부터 재생을 지원합니다. 복구 전후 같은 샘플 메뉴 8개·주문 4건·예약 3건을 보여주며, 주문에는 테이블 번호 또는 배달 주소·연락처가 표시됩니다. 마지막 화면의 샵·주문·예약·메뉴 탭을 직접 둘러볼 수 있습니다. 9개 언어와 모바일 화면을 지원하며, 언어/화면 크기를 바꿔도 진행 단계와 같은 샘플 기록이 유지됩니다.

## 원샵 주문 확인

원샵은 one shop ai의 식당·레스토랑·카페용 샵 에이전트 프로젝트입니다. 손님은 주문 직전 매장 식사 또는 온라인 배달을 선택합니다. 매장에서는 테이블 번호를 직접 확인하며, 온라인은 배달 주소와 전화번호를 입력합니다. 최종 확인 카드에서 검토한 정보는 주문과 같은 트랜잭션으로 저장됩니다. 실제 AI·결제·배송 업체는 연결하지 않았습니다.

샵 현황은 전체·매장 식사·온라인 배달·접수 대기별로 주문을 표시합니다. 주문 카드에 테이블 번호 또는 배송 주소·연락처가 나타나며, 과거 기록에 확인 정보가 없으면 ‘정보 확인 필요’로 표시합니다. 손님의 주소·연락처는 주문한 방문 세션과 해당 샵 소유자만 조회할 수 있습니다.

프로덕션북은 준비된 네 화면 시나리오를 보여줍니다. 별도의 사장님앱에서 만든 샵은 비밀번호 로그인과 서버 저장·기기 간 동기화를 사용합니다. 기존 저장 키·API 경로·배포 URL은 호환을 위해 유지합니다.

대표 캐릭터는 사용자가 확정한 파란 낙서 원형 캐릭터입니다. 앱·프로덕션북·QR 인쇄물·사이트 아이콘에 같은 에셋을 사용합니다. 배포 에셋은 `dist/assets/one-shop/`, 승인 원본과 로고 마스터 및 친구 5색은 로컬 `design/one-shop-brand/`에 보관합니다. 친구 5색은 연두·분홍·버터 옐로·코랄·라벤더이며 앱의 대표 색상은 파란색으로 유지합니다.

## 작동하는 흐름

직접 샵을 등록하는 연결 모드에서는 사장님이 매니저와 대화하며 상호·주소·공개 연락처·SNS를 입력하고 메뉴 사진과 매장 사진·영상을 업로드합니다. 메뉴 이름·설명·가격·판매 여부를 확인하면 샵 고유 링크와 테이블 QR이 생성됩니다. 메뉴 추가·삭제도 가능합니다. 사진에서 메뉴를 자동으로 읽는 기능은 아직 연결하지 않았습니다.

다른 휴대폰이 QR로 접속하면 서버에 저장된 같은 샵과 메뉴를 읽습니다. 주문과 예약은 Supabase에 저장되고 사장님 대시보드에 실시간으로 반영됩니다. 사장님이 주문 접수·준비·완료, 예약 확인·취소를 처리하면 손님 화면도 갱신됩니다. 대화와 직원 요청·불편 사항도 해당 샵의 기록에 남습니다.

AI 에이전트 답변은 준비된 시나리오입니다. 실제 AI 모델, 온라인 결제, POS 전송, SMS·이메일 알림, 구독 청구는 연결하지 않았습니다. 실제 연결 모드에서는 결제 완료나 포인트를 임의로 만들 수 없습니다. 가위바위보·룰렛·결제·포인트의 기존 시뮬레이션은 `?preview=1` 체험에서 사용할 수 있습니다.

## 샵 관리 권한

사장님앱은 **샵 비밀번호**를 설정하고 로그인해야 열립니다. 기존 샵의 최초 비밀번호는 기존 관리 권한이 남아 있는 기기에서만 설정합니다. 새 데모 샵을 만들면 비밀번호와 함께 주모 메뉴·샘플 주문 1건·예약 1건이 서버에 저장됩니다. 공개 프로덕션북의 네 화면 시연은 별도의 가상 시나리오입니다.

**로그인 · 보안**에서 관리 링크 복사, 비밀번호 변경, 로그아웃을 할 수 있습니다. 다른 기기에서는 관리 링크와 같은 비밀번호로 로그인합니다. 관리 세션은 12시간 후 만료됩니다. 로그아웃은 해당 세션을 서버에서 폐기하며 비밀번호 변경은 다른 사장님 세션을 모두 해제합니다. 샵과 주문 기록은 유지합니다.

손님 토큰과 직원 링크로 사장님 API를 호출할 수 없습니다. 직원은 발급된 전용 링크로 접속하며 서버가 역할별 조회·변경 권한을 확인합니다. 직원 삭제, 권한 변경, 링크 교체는 기존 세션에도 적용됩니다. 직원 링크를 가진 사람이 사용할 수 있는 구조이며 직원 본인 인증, 이메일·Google 인증, 이메일 비밀번호 복구는 아직 구현하지 않았습니다.

비밀번호는 서버에서 소금값을 포함한 PBKDF2-SHA256 600,000회 해시로만 저장합니다. 세션 원문은 DB에 저장하지 않으며 샵별 실패 횟수 제한과 서버 만료 검증을 적용합니다. 자동 이메일 복구가 없으므로 실제 운영용 계정 체계로 확장하기 전 별도 복구 절차가 필요합니다.

## 이메일 복구 데모 (5.13.0)

[이메일 복구 시연](https://isaacweb007.github.io/modu-ai/jumo/recovery.html?lang=ko&v=5.13.0)은 이메일 입력 → 데모 메일함 → 시연용 새 비밀번호 → 샘플 샵 복귀로 이어집니다. 사장님 로그인 화면, 로그인·보안 설정, 프로덕션북의 샵 개설 섹션에서 열 수 있습니다. 한국어를 기본으로 기존 9개 언어를 지원합니다.

사용자 요청에 따라 실제 이메일 서비스와 계정 복구는 실 개발 때 연결합니다. 현재 흐름은 독립된 가상 주모 데이터만 사용하며 메뉴 8개·주문 4건·예약 3건을 재설정 전후 동일하게 보여줍니다. 실제 샵 비밀번호, 사장님 세션, 직원 권한, 서버 주문은 변경하지 않습니다. 입력한 이메일과 비밀번호를 저장하거나 서버로 전송하지 않습니다. 데모 샘플 데이터만 별도 브라우저 저장 키에 유지합니다.

## 개발과 검증

```sh
npm ci
npm run build:vendor
npm test
npm run dev
```

`http://127.0.0.1:4318/jumo/owner.html?lang=ko`에서 비밀번호로 데모 샵을 만들거나 기존 샵에 로그인합니다. 실제 공유 QR은 공개 GitHub Pages 주소를 사용합니다. 로컬 수정은 배포 후 공유 링크에 반영됩니다.

- `dist/`: 배포되는 앱·프로덕션북·이미지·아이콘·폰트
- `supabase/migrations/`: DB 스키마, 권한, 트랜잭션, 실시간 알림
- `supabase/functions/modu-api/`: 사장님 비밀번호·세션 및 직원 권한 검증, 공개 샵 조회, 주문·예약·미디어 API
- `scripts/verify-cloud*.mjs`: 별도 소유자·손님 권한을 사용하는 실제 서버 통합 검증
- `docs/backend-v4.md`: API·보안·배포 구조
- `docs/verification-v4.md`: 확인한 범위와 제한
- `docs/owner-sample-v4.2.md`: 사장님 샘플 구성·저장·초기화 검증
- `docs/one-shop-v5.11.md`: 비밀번호·세션·직원 접근 제어와 검증 결과
- `docs/one-shop-v5.md`: 원샵 변경, 주문 출처와 배송 정보, 검증 결과

`npm run test:cloud`는 전용 개발 검증 매장과 주문·예약을 생성합니다. 관리 키는 git에서 제외된 `artifacts/`에만 0600 권한으로 보관됩니다. 기존 운영 데이터를 삭제하지 않습니다.

## 배포

GitHub `main` 푸시 → Actions의 의존성 설치·번들·검사 → GitHub Pages. 기존 Sites 주소는 소유자 전용으로 유지합니다. 사이트 소스와 배포 아카이브는 Sites source helper로 동일 커밋에서 저장합니다. 두 프런트엔드는 동일한 `modu-ai` Supabase 백엔드를 사용하며, 손님 QR은 공개 GitHub 주소로 생성합니다.

공개 설정은 `dist/shared/cloud-config.js`에 있습니다. 공개 가능한 프로젝트 URL과 publishable key만 포함합니다. 서버 관리 키는 Supabase Edge 런타임의 `SUPABASE_SERVICE_ROLE_KEY`를 사용하며 저장소·브라우저에 포함하지 않습니다.

언어: 한국어·영어·베트남어·중국어·일본어·크메르어·인도네시아어·라오스어·힌디어. 직접 작성한 메뉴 설명은 자동 번역하지 않으며, 변경하지 않은 주모 샘플은 9개 언어로 제공됩니다. 가격은 현재 VND 기준입니다. 음식 이미지는 AI로 만든 메뉴 시안입니다.


## 5.3 — character expressions and illustrated production book

- Higgsfield GPT Image 2.5 assets: greeting, thinking and order-taking poses; six editorial shop illustrations. Optimized outputs live in `dist/assets/one-shop/poses/` and `stories/`. Masters, prompts and completed job records are in the local `design/one-shop-brand/motion-v1/` folder. These drawings are brand concept illustrations. The illustrated table card is not a scannable QR code.
- The owner and guest apps show a greeting at entry, a short thinking transition for scenario replies, and contextual message avatars for menu, checkout, reservation and reports. The presentation does not change saved order state or imply that a payment completed. Real AI and payment integration remain disabled.
- All 18 book chapters have contextual art. The sidebar supports chapter search, collapsible groups, current chapter and reading progress; bottom controls move between chapters. Phone navigation supports Escape and keyboard focus containment.
- A three-pose interactive character preview appears in the principles chapter. Motion respects the device reduced-motion preference, and the book has a persistent pause/play control. New labels cover all nine existing languages.
- Verified: mobile 390px, desktop 1440px, nine-language chapter layouts, menu → table confirmation → sample order receipt, owner scenario reply; 24 automated checks.

## 5.4 — 라미의 세계

파란 AI 에이전트 이름을 **라미 / Rami**로 확정했습니다. 이름은 **동그라미**에서 따왔습니다. 9개 언어에 5개 캐릭터 섹션(이야기, 24개 표정, 6개 직업군, 굿즈·상품권, BI·아이콘)을 추가했고 밝은 흰색 배경과 굵은 사이드바 제목을 적용했습니다.

- `dist/assets/one-shop/rami/`: 개별 PNG/WebP, BI SVG, 앱 아이콘, 다운로드 ZIP.
- `design/one-shop-brand/rami-v5.4/`: 로컬 고해상도 원본, 프롬프트, 제작 및 검수 기록. Git에는 최적화한 공개 에셋만 포함합니다.
- 로고 SVG 안의 캐릭터는 래스터이며 문자는 편집 가능합니다. 상품권은 미발행 디자인 시안입니다.
- 사장님앱의 매니저·알림, 손님앱의 에이전트 소개, 인사·생각·주문 동작에 라미를 적용했습니다.

## 5.24 — 앱별 프로덕션 섹션

- 통합 시연 다음에 `#apps` 섹션을 추가했습니다. 손님앱, 사장님앱, 직원앱을 별도로 열며 직원은 홀·주방 샘플을 선택합니다.
- 상단과 목차에서 앱 섹션에 접근합니다. 한국어 기본과 기존 9개 언어, 모바일 세로 배치를 지원합니다.
- 손님은 기존 주모 샵으로, 사장님은 기존 인증 화면으로 연결됩니다. 5.24 당시 직원 체험은 독립 로컬 샘플이었습니다. 5.25부터 아래의 공유 샵 체험으로 연결됩니다. 인증·권한·서버 데이터 처리와 통합 시연 로직은 변경하지 않았습니다.
- 검수: 네 앱 진입 화면, 모바일 390px의 9개 언어·터치 버튼·가로 넘침, 목차 검색과 통합 시연 단계 진행, 정적 번들 검증.


## 5.25 — 같은 주모 샵으로 연결되는 네 앱

프로덕션북 `#apps`에서 **주모 연결 체험 시작**을 누른 뒤 손님·사장님·홀·주방 앱을 각각 엽니다. 역할별 **링크 복사**로 다른 휴대폰에서도 같은 체험 샵을 열 수 있습니다. 손님은 라미의 언어 선택 → 메뉴 → 테이블 확인 → 주문 전송, 홀은 접수, 주방은 조리 시작 → 준비 완료를 처리합니다. 사장님과 손님 화면은 서버 알림으로 갱신되며 연결 복구 및 20초 주기 조회도 유지됩니다.

- 생성마다 새로운 주모 샵과 역할별 접근 권한을 발급합니다. 기존 샵·계정에는 접근하지 않습니다. 체험 링크는 24시간 유효하며, 새 체험을 만들더라도 이미 열린 앱은 기존 체험 샵에 남습니다.
- 사장님 체험 링크는 서버에서 `demo=true`로 확인한 세션만 허용합니다. 실제 샵의 비밀번호 인증은 그대로이며 체험 진입은 기존 기본 사장님 계정 선택을 덮어쓰지 않습니다. 링크의 권한 정보는 URL 조각에서 즉시 제거합니다.
- 홀은 접수·서빙과 배달 정보를, 주방은 메뉴·수량과 조리 상태를 봅니다. 서버가 조회·처리 때마다 직원 권한과 삭제 상태를 확인합니다. 링크는 체험 참가자에게만 공유하며 개인정보를 입력하지 않습니다.
- 생성은 IP별 시간당 5회, 전체 시간당 100회로 제한합니다. 만료된 체험 샵은 모든 API 접근을 차단합니다. 만료는 접근 종료이며 자동 데이터 삭제를 의미하지 않습니다.
- 통합 시연은 기존 시나리오로 유지합니다. 실제 AI·결제·메일·배달 서비스는 미연결이며 연결 주문은 미결제 상태로 남습니다.
- 검증: 자동 테스트 168개, `node scripts/verify-connected-demo.mjs`의 서버 API 검사 31개와 Realtime 신호. 역할별 상태 일치, 배달 정보 제한, 권한 변경·삭제, 사장님 체험 진입과 만료 검증을 포함합니다.
