# 자산 출처

- 표지: 내장 image_gen 도구로 이번 프로젝트를 위해 생성. 실제 매장·고객 사진이 아닌 컨셉 일러스트.
- 파일: `dist/assets/neighborhood.png`.
- 글꼴: Pretendard Variable v1.3.9, SIL Open Font License. 라이선스는 `dist/assets/Pretendard-LICENSE.txt`.
- QR 인코더: qrcode-generator v1.4.4 (Kazuhiko Arase), MIT. 라이선스를 자산 디렉터리에 포함.
- 심벌과 음식 아이콘: 프로젝트 안에서 직접 작성한 SVG.

## 최종 생성 프롬프트

Use case: illustration-story. Asset type: wide editorial cover illustration for a Korean project book about an easy AI platform for independent restaurants and cafes. Primary request: an inviting, beautifully crafted miniature neighborhood of three small independent businesses: a cozy Korean restaurant, a modern small cafe, and a bakery. Shop owners and diverse customers are naturally interacting, a guest at an outdoor cafe table looks at a phone near a small table menu stand. Scene feels human, small business hospitality, optimistic and grounded. Style: sophisticated tactile clay-and-paper 3D architectural diorama, refined editorial illustration, soft rounded edges with real wood, glass, ceramic and paper textures, not childish. Composition: wide landscape 2:1, three storefronts connected on a little curved pedestrian street, full facades visible, generous pale blue sky and negative space above; no cut off buildings. Palette: pearl white, ink navy #17264A, sky blue #DDEAFB, coral red #EE654B awnings, warm wood and natural green plants. Lighting: soft morning sunlight, delicate shadows, bright and calm. No legible typography, no logos, no watermark, no robots, no floating UI, no circuits, no sci-fi. All people small within the street scene. High quality art direction.

## 주모 데모 2.0

- 원본 브랜드·메뉴 참고: https://isaacweb007.github.io/jumo-joseon-hiphop-book/?lang=ko#cover
- 기존 주모 프로젝트의 음식 콘셉트: 모둠전, 한치견과, 뻥튀기, 김부각, 홍시, 양갱, 실내·외관 이미지. 현장 촬영 사진이 아닌 AI 브랜드 시안입니다.
- Higgsfield `gpt_image_2_5`: 주모 로고·심벌, 김치전, 삼합 이미지를 새로 생성했습니다. 원본은 `source-assets/higgsfield/`, 최적화 파일은 `dist/jumo/assets/`입니다.
- 같은 모델로 음식 카테고리 6종 스프라이트, 가위·바위·보 세라믹 손 3종, 구리 테두리의 4칸 룰렛, 보상 4종 스프라이트를 생성했습니다. 투명 배경 PNG 원본과 축소 버전을 모두 보관했습니다.
- 생성 job ID·URL·프롬프트·설정은 `source-assets/higgsfield/brand-food-v2.json`, `graphics-v3.json`에 있습니다. API 키는 저장하지 않습니다.
- 내비게이션·검색·주문·직원 요청 등의 작은 조작 아이콘은 `dist/shared/core.js`의 직접 작성한 일관된 선형 SVG입니다. 음식·게임 장식은 생성 에셋을 사용하며 이모지를 사용하지 않습니다.
- 참고 화면: 사용자가 제공한 주황/청록 유리 패널 음식 앱. 구도·폰트 비율·카드 밀도·탭바를 분석해 주모 메뉴로 새로 구현했습니다.

실제 출시 전 로고 사용 범위, 실제 메뉴 제공 내용과 가격, 알레르기 정보를 매장 운영자가 확인해야 합니다.
