// src/data/navData.js
// 헤더 드롭다운 + 메뉴판에서 공통으로 쓰는 내비 데이터

export const NAV = {
  women: [
    { label: "전체", to: "/women" },
    { label: "신상품", to: "/women/new" },
    { label: "아우터", to: "/women/outer" },
    { label: "재킷", to: "/women/jacket" },
    { label: "니트", to: "/women/knit" },
    { label: "셔츠", to: "/women/shirt" },
    { label: "티셔츠", to: "/women/tshirt" },
    { label: "원피스", to: "/women/onepiece" },
    { label: "팬츠", to: "/women/pants" },
    { label: "스커트", to: "/women/skirt" },
  ],

  men: [
    { label: "신상품", to: "/men/new" },
    { label: "정장", to: "/men/suit" },
    { label: "재킷", to: "/men/jacket" },
    { label: "셔츠", to: "/men/shirt" },
    { label: "니트", to: "/men/knit" },
    { label: "티셔츠", to: "/men/tshirt" },
    { label: "팬츠", to: "/men/pants" },
  ],

  kids: [
    { label: "신상품", to: "/kids/new" },
    { label: "남아", to: "/kids/boy" },
    { label: "여아", to: "/kids/girl" },
    { label: "베이비", to: "/kids/baby" },
  ],

  luxury: [
    { label: "신상품", to: "/luxury/new" },
    { label: "여성", to: "/luxury/women" },
    { label: "남성", to: "/luxury/men" },
  ],

  sports: [
    { label: "신상품", to: "/sports/new" },
    { label: "아웃도어", to: "/sports/outdoor" },
    { label: "러닝", to: "/sports/running" },
    { label: "요가", to: "/sports/yoga" },
    { label: "피트니스", to: "/sports/fitness" },
    { label: "테니스", to: "/sports/tennis" },
    { label: "수영", to: "/sports/swim" },
  ],

  golf: [
    { label: "신상품", to: "/golf/new" },
    { label: "여성", to: "/golf/women" },
    { label: "남성", to: "/golf/men" },
  ],

  beauty: [
    { label: "신상품", to: "/beauty/new" },
    { label: "스킨케어", to: "/beauty/skin" },
    { label: "메이크업", to: "/beauty/makeup" },
    { label: "향수", to: "/beauty/perfume" },
  ],

  life: [
    { label: "신상품", to: "/life/new" },
    { label: "가구", to: "/life/furniture" },
    { label: "반려동물", to: "/life/pet" },
    { label: "카/캠핑", to: "/life/car" },
  ],

  outlet: [
    { label: "여성", to: "/outlet/women" },
    { label: "남성", to: "/outlet/men" },
    { label: "키즈", to: "/outlet/kids" },
    { label: "럭셔리", to: "/outlet/luxury" },
    { label: "슈즈", to: "/outlet/shoes" },
    { label: "스포츠", to: "/outlet/sports" },
    { label: "골프", to: "/outlet/golf" },
    { label: "라이프", to: "/outlet/life" },
  ],
};

export default NAV;
