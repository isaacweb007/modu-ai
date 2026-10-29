# 프로덕션북 도메인과 랜딩 시안

2026-10-30 기준

- 프로덕션북: https://book.ramiai.dev
- 프로덕션북 기존 주소도 유지: https://modu-ai-project-book.isaacweb007.chatgpt.site
- 원도메인 `ramiai.dev`: 최종 랜딩페이지 선택 후 연결. 이번 작업에서는 루트와 www DNS를 만들지 않았다.
- 시안 비교: `/landing-concepts/`
- A: `/landing-concepts/a/` — 라미와 함께하는 동네. 프로덕션북 감성과 친근한 브랜드 소개.
- B: `/landing-concepts/b/` — 라미와 대화하면 시작되는 샵. 메뉴판부터 샵 전달까지 네 단계 대화 체험.
- C: `/landing-concepts/c/` — 언어가 달라도 반가운 한 끼. 다국어 응대와 관광지 손님 경험.

## 도메인 설정

Cloudflare DNS에 `book` CNAME을 `custom-domains.chatgpt.site`로 연결했다. DNS 전용이며 인증서와 호스팅은 Sites에서 처리한다. Sites와 Cloudflare에서 요구한 두 TXT 소유 확인 레코드도 등록했다.

Sites 사용자 지정 도메인 상태, 제공자 상태, SSL 상태가 모두 `active`인 것을 확인했다. 기존 Sites의 소유자 전용 사용자 목록과 접근 설정은 유지했다. 새 주소에서는 첫 방문 때 기존 ChatGPT 계정 로그인이 필요할 수 있다.

## 시안 범위

세 시안 모두 기존 라미 캐릭터, 친구들, 수채화 샵 에셋과 Pretendard를 사용했다. 실제 가입·AI·결제를 연결하지 않은 검토용 목업이다. 대화와 언어 전환은 준비된 예시만 표시한다.

각 시안의 360·390·808·1440px 반응형 화면과 상호작용을 확인했다. 비교 페이지의 데스크톱 및 모바일 이미지는 실제 구현 화면의 스크린샷이다. 기존 앱과 통합 시연 코드는 변경하지 않았다.
