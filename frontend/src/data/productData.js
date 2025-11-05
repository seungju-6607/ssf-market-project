// 카테고리별 상품 데이터
export const PRODUCT_DATA = {
  women: {
    main: [], // 메인은 샘플 이미지 사용
    new: [
      { id: "women_new_1", name: "심플 블랙 티셔츠", desc: "데일리로 활용하기 좋은 베이직 아이템", price: "89000", image: "/images/women/new/women_new1.jpg" },
      { id: "women_new_2", name: "슬림 슬랙스", desc: "세련된 핏으로 오피스룩에도 잘 어울림", price: "99000", image: "/images/women/new/women_new2.webp" },
      { id: "women_new_3", name: "니트 가디건", desc: "여성스러운 무드로 다양한 계절에 활용 가능", price: "59000", image: "/images/women/new/women_new3.webp" },
      { id: "women_new_4", name: "그레이 톤 팬츠", desc: "캐주얼과 포멀룩 모두 소화", price: "79000", image: "/images/women/new/women_new4.jpg" },
      { id: "women_new_5", name: "화이트 베이직 티셔츠", desc: "깔끔한 스타일의 필수 아이템", price: "99000", image: "/images/women/new/women_new5.webp" },
      { id: "women_new_6", name: "롱 원피스", desc: "심플하면서 우아한 라인", price: "109000", image: "/images/women/new/women_new6.webp" },
    ],
    outer: [
      { id: "women_outer_1", name: "베이지 캐주얼 자켓", desc: "데일리로 활용하기 좋은 기본 아우터", price: "129000", image: "/images/women/outer/women_outer1.webp" },
      { id: "women_outer_2", name: "패턴 자켓", desc: "유니크한 감각으로 스트릿 패션에 적합", price: "159000", image: "/images/women/outer/women_outer2.webp" },
      { id: "women_outer_3", name: "블랙 라이더 자켓", desc: "시크한 무드의 포인트 아이템", price: "189000", image: "/images/women/outer/women_outer3.webp" },
      { id: "women_outer_4", name: "경량 패딩 자켓", desc: "가볍지만 따뜻한 간절기 필수템", price: "99000", image: "/images/women/outer/women_outer4.webp" },
      { id: "women_outer_5", name: "카키 오버핏 자켓", desc: "편안한 핏으로 스타일리시하게 연출 가능", price: "149000", image: "/images/women/outer/women_outer5.webp" },
      { id: "women_outer_6", name: "블랙 포켓 자켓", desc: "실용성과 멋을 동시에 갖춘 아이템", price: "139000", image: "/images/women/outer/women_outer6.webp" },
    ],
    jacket: [],
    knit: [],
    shirt: [],
    tshirt: [],
    onepiece: [],
    pants: [],
    skirt: [],
  },
  men: {
    main: [], // 샘플 이미지
    new: [],
    suit: [],
    pants: [],
    jacket: [],
    shirt: [],
    knit: [],
    tshirt: [],
  },
  kids: {
    main: [], // 샘플 이미지
    new: [],
    boy: [],
    girl: [],
    baby: [],
  },
  sports: {
    main: [], // 샘플 이미지
    new: [],
    outdoor: [],
    running: [],
    yoga: [],
    fitness: [],
    tennis: [],
    swim: [],
  },
  beauty: {
    main: [
      { id: "beauty_main_1", name: "", desc: "", price: "", image: "/images/beauty/new/beauty_new1.webp" },
      { id: "beauty_main_2", name: "", desc: "", price: "", image: "/images/beauty/new/beauty_new2.webp" },
      { id: "beauty_main_3", name: "", desc: "", price: "", image: "/images/beauty/new/beauty_new3.webp" },
      { id: "beauty_main_4", name: "", desc: "", price: "", image: "/images/beauty/new/beauty_new4.webp" },
      { id: "beauty_main_5", name: "", desc: "", price: "", image: "/images/beauty/new/beauty_new5.webp" },
      { id: "beauty_main_6", name: "", desc: "", price: "", image: "/images/beauty/new/beauty_new6.webp" },
    ],
    new: [],
    skin: [],
    makeup: [],
    perfume: [],
  },
};

// 카테고리와 서브카테고리에 맞는 상품 데이터 가져오기
export const getProductsByCategory = (category, subcategory = "main") => {
  if (!PRODUCT_DATA[category]) {
    return [];
  }
  return PRODUCT_DATA[category][subcategory] || [];
};
