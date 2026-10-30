# 라미 원도메인 랜딩페이지

- 랜딩: https://ramiai.dev/ — 사용자 요청에 따라 로그인 없이 공개
- 프로덕션북: https://book.ramiai.dev/ — 기존 접근 설정 유지
- 디자인 전환: A 기본 / ?concept=b / ?concept=c
- 실제 AI와 결제는 연결하지 않은 시안
- 로컬 실행: python3 -m http.server 4319 --directory dist

360·390·1440px에서 그림 비율과 가로 넘침을 확인했다. 공개 상태에서 루트 HTML과 CSS가 인증 없이 HTTP 200을 반환하는 것을 확인했다. 기존 프로덕션북의 landing-concepts 경로는 원도메인으로 이동한다.

검토 스크린샷은 원본 작업폴더의 검토 디렉터리에 저장했다.
