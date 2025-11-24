// src/data/specialData.js

export const SPECIAL_DATA = [
  // ====== 진행중 기획전 ======
  {
    id: 101,
    title: "BEAKER 겨울 아우터 단독 기획전",
    brand: "BEAKER",
    type: "SALE", // EVENT | SALE | COUPON | BRAND
    status: "ING", // ING | END
    period: "2025.11.01 ~ 2025.11.30",
    badge: "~30% OFF",
    banner: "https://picsum.photos/seed/sp01/1200/500",
    shortDescription:
      "한 번에 끝내는 겨울 아우터 준비. 비이커 단독 할인 & 한정 수량.",
    benefits: [
      "겨울 아우터 최대 30% 즉시할인",
      "10만원 이상 구매 시 머플러 증정 (선착순)",
      "APP 전용 추가 5% 쿠폰 중복 적용"
    ],
    content: [
      "이번 BEAKER 겨울 아우터 기획전은 FW 시즌을 앞두고 가장 많이 찾는 핵심 아이템만 선별했습니다.",
      "간결한 싱글 코트부터 캐주얼한 패딩 점퍼까지, 일상에서 가장 활용도가 높은 라인업으로 구성되었습니다.",
      "지금 구매하면 시즌 후반보다 훨씬 넓은 사이즈·컬러 선택이 가능하고, 단독 할인 혜택까지 동시에 누릴 수 있습니다."
    ],
    tags: ["BEAKER", "OUTER", "WINTER", "SALE"]
  },
  {
    id: 102,
    title: "8SECONDS 따뜻한 니트&패딩 페스티벌",
    brand: "8SECONDS",
    type: "SALE",
    status: "ING",
    period: "2025.11.10 ~ 2025.12.05",
    badge: "한정 기간",
    banner: "https://picsum.photos/seed/sp02/1200/500",
    shortDescription:
      "FW 필수템 니트 & 패딩을 합리적인 가격으로 만나는 에잇세컨즈 페스티벌.",
    benefits: [
      "니트 단독 2장 이상 구매 시 추가 10% 할인",
      "롱패딩 / 쇼트패딩 전 상품 15% 즉시할인",
      "멤버십 회원에게 5% 추가 적립"
    ],
    content: [
      "에잇세컨즈의 겨울 컬렉션을 한 번에 만나볼 수 있는 페스티벌입니다.",
      "데일리 니트부터 트렌디한 짧은 패딩까지, 다양한 스타일을 기획전 특가로 준비했습니다.",
      "특히 멀티 컬러 니트 라인은 단독으로도 포인트가 되며, 아우터 안에 레이어드하기에도 좋습니다."
    ],
    tags: ["8SECONDS", "KNIT", "PADDING", "FESTIVAL"]
  },
  {
    id: 103,
    title: "LEMAIRE 시그니처 컬렉션 위크",
    brand: "LEMAIRE",
    type: "BRAND",
    status: "ING",
    period: "2025.11.15 ~ 2025.11.24",
    badge: "NEW ARRIVAL",
    banner: "https://picsum.photos/seed/sp03/1200/500",
    shortDescription:
      "르메르의 미니멀 무드를 담은 시그니처 컬렉션 단독 공개.",
    benefits: [
      "시그니처 라인 전 제품 적립 10% 특별 제공",
      "일부 컬렉션 한정 수량 선런칭",
      "르메르 단독 포장 서비스"
    ],
    content: [
      "LEMAIRE의 시그니처 컬렉션 위크는 브랜드의 핵심 세계관을 가장 잘 보여주는 아이템들로 구성되었습니다.",
      "실루엣과 소재에 집중한 디자인은 트렌드와 상관없이 오랫동안 착용할 수 있는 것이 특징입니다.",
      "이번 기획전 기간에만 제공되는 단독 적립 혜택과 선런칭 아이템을 놓치지 마세요."
    ],
    tags: ["LEMAIRE", "MINIMAL", "SIGNATURE"]
  },
  {
    id: 104,
    title: "SYSTEM X SIE 겨울 셋업 제안",
    brand: "SYSTEM / SIE",
    type: "EVENT",
    status: "ING",
    period: "2025.11.05 ~ 2025.11.25",
    badge: "SET-UP",
    banner: "https://picsum.photos/seed/sp04/1200/500",
    shortDescription:
      "포멀과 캐주얼을 넘나드는 겨울 셋업 기획전. 출근룩 고민 끝.",
    benefits: [
      "셋업 구매 시 전용 이너 티셔츠 1장 증정",
      "일부 상품 추가 20% 할인",
      "재직자 인증 고객 대상 특별 쿠폰 발급"
    ],
    content: [
      "SYSTEM과 SIE가 함께 제안하는 겨울 셋업 기획전은 출근룩과 일상룩을 한 번에 해결해 줄 구성입니다.",
      "자켓과 팬츠의 핏을 최적화하여 별도의 수선 없이도 바로 착용 가능한 비율을 구현했습니다.",
      "현재 재직자 인증 고객에게는 추가 혜택이 제공되니, 마이페이지에서 간편 인증을 진행해 보세요."
    ],
    tags: ["SYSTEM", "SIE", "SETUP", "OFFICE"]
  },
  {
    id: 105,
    title: "겨울 선물 추천전 with BEANPOLE",
    brand: "BEANPOLE",
    type: "COUPON",
    status: "ING",
    period: "2025.11.20 ~ 2025.12.31",
    badge: "GIFT",
    banner: "https://picsum.photos/seed/sp05/1200/500",
    shortDescription:
      "머플러·장갑·가방까지, 연말 선물용으로 추천하는 빈폴 아이템 모음.",
    benefits: [
      "기획전 전용 10% 선물 쿠폰 지급",
      "2개 이상 구매 시 추가 5% 할인",
      "선물 포장 서비스 무료 제공"
    ],
    content: [
      "연말 시즌을 앞두고 선물 고민이 깊어지는 시기, 빈폴이 제안하는 선물 추천전입니다.",
      "베이식하면서도 브랜드 특유의 디테일이 살아 있는 머플러·장갑·숄더백 등을 한 번에 모았습니다.",
      "기획전 전용 쿠폰과 무료 포장 서비스를 통해 부담 없이 센스 있는 선물을 준비해 보세요."
    ],
    tags: ["BEANPOLE", "GIFT", "ACCESSORY"]
  },

  // ====== 종료된 기획전 (END) ======
  {
    id: 201,
    title: "8SECONDS 가을 시즌오프",
    brand: "8SECONDS",
    type: "SALE",
    status: "END",
    period: "2025.09.15 ~ 2025.10.05",
    badge: "종료",
    banner: "https://picsum.photos/seed/sp06/1200/500",
    shortDescription:
      "가을 시즌오프 특가. 일부 상품은 여전히 상시 할인 카테고리에서 만나볼 수 있습니다.",
    benefits: [
      "최대 50% 시즌오프 할인",
      "일부 상품 상시 세일 코너 이동",
      "APP 단독 추가 쿠폰 제공 (기간 종료)"
    ],
    content: [
      "본 기획전은 종료되었지만, 일부 인기 상품은 여전히 상시 할인 카테고리에서 확인하실 수 있습니다.",
      "시즌오프 특가에 참여하지 못했다면, 상시 세일 코너를 통해 비슷한 혜택을 경험해 보세요."
    ],
    tags: ["8SECONDS", "SEASONOFF"]
  },
  {
    id: 202,
    title: "SYSTEM HOMME 썸머 라스트 찬스",
    brand: "SYSTEM HOMME",
    type: "SALE",
    status: "END",
    period: "2025.08.20 ~ 2025.09.01",
    badge: "종료",
    banner: "https://picsum.photos/seed/sp07/1200/500",
    shortDescription:
      "여름 셔츠·팬츠 라스트 찬스. 현재는 일부 상품만 단독 특가로 유지 중입니다.",
    benefits: [
      "셔츠/팬츠 1+1 구성",
      "라스트 찬스 전용 할인 코드",
      "일부 상품 단독 특가 유지"
    ],
    content: [
      "라스트 찬스 기획전은 종료되었지만, 일부 인기 품목은 단독 특가로 유지되고 있습니다.",
      "다가오는 여름 시즌을 위해 미리 준비하고 싶다면, 상시 특가 상품을 체크해 보세요."
    ],
    tags: ["SYSTEMHOMME", "LASTCHANCE"]
  }
];
