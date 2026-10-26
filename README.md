# 모두의 AI · modu ai

아이작스튜디오 × 원컴퍼니 재단의 가게 에이전트 플랫폼 프로덕션북과 주모(Jumo) 데모 2.0.

## 인터넷에서 보기

- 프로덕션북: https://isaacweb007.github.io/modu-ai/
- 손님 앱: https://isaacweb007.github.io/modu-ai/jumo/?lang=ko
- 사장님 앱: https://isaacweb007.github.io/modu-ai/jumo/owner.html?lang=ko

## 로컬 실행

Node.js 22 이상과 Python 3에서 실행합니다. 별도 npm 패키지 설치나 API 키가 필요하지 않습니다.

```sh
npm test
npm run dev
```

http://127.0.0.1:4318 에서 책을, `/jumo/`에서 손님 앱을, `/jumo/owner.html`에서 사장님 앱을 봅니다. `dist/`의 HTML·CSS·JavaScript가 배포 파일입니다.

## 구현

- 한국어·영어·베트남어·중국어·일본어·크메르어·인도네시아어·라오어·힌디어. 18개 장의 책, 손님 앱, 사장님 앱에 적용했습니다.
- 가게 소개, 사진 중심 8종 메뉴, 메뉴 검색·분류·상세, 장바구니, 수량 조절과 주문 상태.
- 매장 전용 시나리오 채팅, 예시 추천·재료 응답, 직원 요청과 불만 기록, 방문별·일별 대화 한도.
- 무료 가위바위보와 4칸 룰렛. 게임별 방문당 1회, 방문당 최대 1개 데모 쿠폰, 사용 처리.
- 사장님 정보 입력, 메뉴 사진 로컬 미리보기, 예시 메뉴 가격·판매 상태 확인, 테이블 QR SVG와 A6 인쇄 화면.
- 익명 방문 또는 동의한 닉네임, 대화·주문·요청·쿠폰 기록, JSON 내려받기.
- 앰버 주막·청록 유리·아이보리 테이블·딥 와인·미드나이트 5개 디자인. 실제 앱을 이용하는 미리보기와 적용.
- POS 연동용 OpenAPI 초안과 현재 데모 주문의 예시 payload.

## 데모의 경계

GPT API, OCR, 실제 주문·결제·구독 청구, 회원 인증, POS 서버는 연결하지 않았습니다. 채팅은 키워드와 준비된 시나리오로 응답합니다. 등록되지 않은 사실은 직원 확인을 안내합니다. 매장과 메뉴 가격은 VND 예시이며, 음식 이미지는 AI로 만든 콘셉트입니다.

데이터는 해당 사이트의 해당 브라우저 localStorage에만 남습니다. 서로 다른 기기·브라우저·호스팅 주소 사이에서는 동기화되지 않습니다. 사진은 선택한 페이지에서만 미리 보며 서버로 업로드하지 않습니다. QR로 접속해도 실제 개인정보나 회원 정보가 자동 수집되지 않습니다. 사장님 화면은 체험용 공개 화면으로 실제 운영 권한을 제공하지 않습니다.

`?preview=1` 미리보기는 세션·주문·채팅·게임을 메모리에만 저장해 실제 데모 기록과 분리합니다. 게임 횟수와 사용량 제한은 데모용으로, 실제 서비스에서는 인증된 서버에서 검증해야 합니다.

GitHub Pages는 공개 체험 링크입니다. 기존 Sites 주소는 소유자 전용 접근 설정을 유지합니다. 실제 매장용으로 전환할 때는 가게별 DB·인증·서버 예산 제한·서명된 QR·POS 어댑터를 구현해야 합니다.

## 소스와 에셋

- `dist/book.js`, `dist/book-content.js`, `dist/book.css`: 9개 언어 프로덕션북과 내장 앱 미리보기.
- `dist/jumo/guest.js`, `owner.js`, `app.css`, `design.css`: 손님·사장님 앱.
- `dist/shared/state.js`, `chat.js`: 주문·게임·혜택·대화 로직.
- `dist/shared/copy.js`, `design-copy.js`, `menu.js`: 다국어 문구와 메뉴 데이터.
- `dist/jumo/assets/`: 최적화한 주모 이미지와 게임 에셋.
- `source-assets/higgsfield/`: GPT Image 2.5 원본 이미지와 생성 기록.
- `dist/api/pos-contract.json`: 실제 서버가 아닌 API 설계 계약.
- `tests/demo.test.mjs`: 주문·가격 변동·품절·게임 결과·한도·다국어 검증.
- `docs/verification.md`: 브라우저 검증과 남은 제품화 범위.

## 배포

`main` 브랜치를 GitHub에 푸시하면 `.github/workflows/pages.yml`이 테스트 후 `dist/`를 GitHub Pages로 배포합니다. Sites 배포는 `.openai/hosting.json`의 기존 프로젝트를 유지하며 Sites 소스 워크플로를 사용합니다. 비밀값이나 브라우저에서 내려받은 방문 기록을 저장소에 추가하지 않습니다.

번역은 데모용 초안입니다. 실제 출시 전에는 현지어 검수와 메뉴 재료·알레르기·가격 확인이 필요합니다.
