// src/data/productData.js

const products = [
  /* ================= 전체(빠른보기 등 공용) ================= */
  {
    id: "all-1",
    name: "데일리 코튼 셔츠",
    desc: "부드러운 코튼 소재의 베이직 셔츠.",
    brand: "BASIC LINE",
    price: 59000,
    category: "all",
    subcategory: "main",
    image: "https://picsum.photos/seed/all-1/800/1000",
  },
  {
    id: "all-2",
    name: "스트레이트 데님 팬츠",
    desc: "과한 워싱 없는 일자핏 데님.",
    brand: "BASIC LINE",
    price: 79000,
    category: "all",
    subcategory: "main",
    image: "https://picsum.photos/seed/all-2/800/1000",
  },
  {
    id: "all-3",
    name: "오버핏 맨투맨",
    desc: "루즈핏 실루엣의 스트릿 무드 맨투맨.",
    brand: "BASIC LINE",
    price: 69000,
    category: "all",
    subcategory: "main",
    image: "https://picsum.photos/seed/all-3/800/1000",
  },

  /* ================= 여성 ================= */
  {
    id: "women-outer-1",
    name: "트위드 크롭 자켓",
    desc: "격식 있는 자리에도 좋은 트위드 자켓.",
    brand: "WOMEN LINE",
    price: 159000,
    category: "women",
    subcategory: "outer", // /women/outer
    image: "https://picsum.photos/seed/women-outer-1/800/1000",
  },
  {
    id: "women-onepiece-1",
    name: "플라워 프린트 원피스",
    desc: "은은한 플라워 패턴의 미디 원피스.",
    brand: "WOMEN LINE",
    price: 129000,
    category: "women",
    subcategory: "onepiece", // /women/onepiece
    image: "https://picsum.photos/seed/women-onepiece-1/800/1000",
  },
  {
    id: "women-pants-1",
    name: "하이웨이스트 슬랙스",
    desc: "레그라인을 길어 보이게 해주는 슬랙스.",
    brand: "WOMEN LINE",
    price: 89000,
    category: "women",
    subcategory: "pants", // /women/pants
    image: "https://picsum.photos/seed/women-pants-1/800/1000",
  },
  {
    id: "women-knit-1",
    name: "울 혼방 니트 가디건",
    desc: "포근한 무드의 루즈핏 가디건.",
    brand: "WOMEN LINE",
    price: 99000,
    category: "women",
    subcategory: "knit",
    image: "https://picsum.photos/seed/women-knit-1/800/1000",
  },
  {
    id: "women-shirt-1",
    name: "오버핏 스트라이프 셔츠",
    desc: "레이어드하기 좋은 스트라이프 셔츠.",
    brand: "WOMEN LINE",
    price: 69000,
    category: "women",
    subcategory: "shirt",
    image: "https://picsum.photos/seed/women-shirt-1/800/1000",
  },
  {
    id: "women-skirt-1",
    name: "플리츠 미디 스커트",
    desc: "움직일 때마다 예쁜 실루엣의 플리츠 스커트.",
    brand: "WOMEN LINE",
    price: 99000,
    category: "women",
    subcategory: "skirt",
    image: "https://picsum.photos/seed/women-skirt-1/800/1000",
  },

  /* ================= 남성 ================= */
  {
    id: "men-suit-1",
    name: "테일러드 수트 세트",
    desc: "비즈니스에 적합한 슬림핏 수트.",
    brand: "MEN LINE",
    price: 259000,
    category: "men",
    subcategory: "suit", // /men/suit
    image: "https://picsum.photos/seed/men-suit-1/800/1000",
  },
  {
    id: "men-shirt-1",
    name: "옥스포드 셔츠",
    desc: "클래식 버튼다운 옥스포드 셔츠.",
    brand: "MEN LINE",
    price: 79000,
    category: "men",
    subcategory: "shirt",
    image: "https://picsum.photos/seed/men-shirt-1/800/1000",
  },
  {
    id: "men-pants-1",
    name: "스트레치 치노 팬츠",
    desc: "신축성 좋은 데일리 치노 팬츠.",
    brand: "MEN LINE",
    price: 89000,
    category: "men",
    subcategory: "pants",
    image: "https://picsum.photos/seed/men-pants-1/800/1000",
  },
  {
    id: "men-outer-1",
    name: "캐시미어 블렌드 코트",
    desc: "부드러운 캐시미어 혼방의 롱 코트.",
    brand: "MEN LINE",
    price: 299000,
    category: "men",
    subcategory: "outer",
    image: "https://picsum.photos/seed/men-outer-1/800/1000",
  },
  {
    id: "men-knit-1",
    name: "메리노 울 니트",
    desc: "얇고 따뜻한 베이직 니트.",
    brand: "MEN LINE",
    price: 99000,
    category: "men",
    subcategory: "knit",
    image: "https://picsum.photos/seed/men-knit-1/800/1000",
  },
  {
    id: "men-tshirt-1",
    name: "그래픽 반팔 티셔츠",
    desc: "스트릿 감성의 그래픽 티셔츠.",
    brand: "MEN LINE",
    price: 39000,
    category: "men",
    subcategory: "tshirt",
    image: "https://picsum.photos/seed/men-tshirt-1/800/1000",
  },

  /* ================= 키즈 ================= */
  {
    id: "kids-main-1",
    name: "키즈 컬러 패딩",
    desc: "화사한 컬러감의 가벼운 패딩 점퍼.",
    brand: "KIDS LINE",
    price: 99000,
    category: "kids",
    subcategory: "main",
    image: "https://picsum.photos/seed/kids-main-1/800/1000",
  },
  {
    id: "kids-main-2",
    name: "그래픽 맨투맨",
    desc: "아이들이 좋아하는 캐릭터 맨투맨.",
    brand: "KIDS LINE",
    price: 39000,
    category: "kids",
    subcategory: "main",
    image: "https://picsum.photos/seed/kids-main-2/800/1000",
  },
  {
    id: "kids-main-3",
    name: "조거 팬츠",
    desc: "활동성 좋은 밴딩 조거 팬츠.",
    brand: "KIDS LINE",
    price: 35000,
    category: "kids",
    subcategory: "main",
    image: "https://picsum.photos/seed/kids-main-3/800/1000",
  },

  /* ================= 럭셔리 ================= */
  {
    id: "luxury-main-1",
    name: "럭셔리 더블 코트",
    desc: "고급 울 혼방 원단의 클래식 더블 코트.",
    brand: "LUXURY",
    price: 890000,
    category: "luxury",
    subcategory: "main",
    image: "https://picsum.photos/seed/luxury-main-1/800/1000",
  },
  {
    id: "luxury-main-2",
    name: "프리미엄 레더 백",
    desc: "이탈리안 가죽으로 제작된 토트백.",
    brand: "LUXURY",
    price: 1250000,
    category: "luxury",
    subcategory: "main",
    image: "https://picsum.photos/seed/luxury-main-2/800/1000",
  },
  {
    id: "luxury-main-3",
    name: "실크 블라우스",
    desc: "광택감이 도는 100% 실크 블라우스.",
    brand: "LUXURY",
    price: 590000,
    category: "luxury",
    subcategory: "main",
    image: "https://picsum.photos/seed/luxury-main-3/800/1000",
  },

  /* ================= 백&슈즈 ================= */
  {
    id: "bags-main-1",
    name: "미니 크로스백",
    desc: "데일리로 가볍게 들기 좋은 미니 크로스.",
    brand: "BAG&SHOES",
    price: 89000,
    category: "bags-shoes",
    subcategory: "main",
    image: "https://picsum.photos/seed/bags-main-1/800/1000",
  },
  {
    id: "bags-main-2",
    name: "데일리 토트백",
    desc: "수납력이 좋은 사각 토트백.",
    brand: "BAG&SHOES",
    price: 119000,
    category: "bags-shoes",
    subcategory: "main",
    image: "https://picsum.photos/seed/bags-main-2/800/1000",
  },
  {
    id: "bags-main-3",
    name: "클래식 로퍼",
    desc: "부드러운 가죽의 클래식 로퍼.",
    brand: "BAG&SHOES",
    price: 129000,
    category: "bags-shoes",
    subcategory: "main",
    image: "https://picsum.photos/seed/bags-main-3/800/1000",
  },

  /* ================= 스포츠 ================= */
  {
    id: "sports-main-1",
    name: "러닝 자켓",
    desc: "리플렉티브 디테일의 러닝 자켓.",
    brand: "SPORTS",
    price: 99000,
    category: "sports",
    subcategory: "main",
    image: "https://picsum.photos/seed/sports-main-1/800/1000",
  },
  {
    id: "sports-main-2",
    name: "요가 레깅스",
    desc: "4방향 스트레치 원단의 레깅스.",
    brand: "SPORTS",
    price: 59000,
    category: "sports",
    subcategory: "main",
    image: "https://picsum.photos/seed/sports-main-2/800/1000",
  },
  {
    id: "sports-main-3",
    name: "트레이닝 세트",
    desc: "상의/하의 셋업 트레이닝 세트.",
    brand: "SPORTS",
    price: 89000,
    category: "sports",
    subcategory: "main",
    image: "https://picsum.photos/seed/sports-main-3/800/1000",
  },

  /* ================= 골프 ================= */
  {
    id: "golf-main-1",
    name: "남성 골프 폴로 셔츠",
    desc: "흡습·속건 기능의 골프 폴로.",
    brand: "GOLF",
    price: 89000,
    category: "golf",
    subcategory: "main",
    image: "https://picsum.photos/seed/golf-main-1/800/1000",
  },
  {
    id: "golf-main-2",
    name: "여성 골프 원피스",
    desc: "라인이 예쁜 A라인 골프 원피스.",
    brand: "GOLF",
    price: 149000,
    category: "golf",
    subcategory: "main",
    image: "https://picsum.photos/seed/golf-main-2/800/1000",
  },
  {
    id: "golf-main-3",
    name: "하이브리드 골프 클럽",
    desc: "초보도 치기 쉬운 하이브리드 클럽.",
    brand: "GOLF",
    price: 249000,
    category: "golf",
    subcategory: "main",
    image: "https://picsum.photos/seed/golf-main-3/800/1000",
  },

  /* ================= 뷰티 ================= */
  {
    id: "beauty-main-1",
    name: "수분 진정 토너",
    desc: "민감성 피부도 사용 가능한 수분 토너.",
    brand: "BEAUTY",
    price: 25000,
    category: "beauty",
    subcategory: "main",
    image: "https://picsum.photos/seed/beauty-main-1/800/1000",
  },
  {
    id: "beauty-main-2",
    name: "세럼 파운데이션",
    desc: "광채 피부를 연출해주는 세럼 파데.",
    brand: "BEAUTY",
    price: 42000,
    category: "beauty",
    subcategory: "main",
    image: "https://picsum.photos/seed/beauty-main-2/800/1000",
  },
  {
    id: "beauty-main-3",
    name: "컬링 마스카라",
    desc: "번짐 적은 롱래쉬 마스카라.",
    brand: "BEAUTY",
    price: 19000,
    category: "beauty",
    subcategory: "main",
    image: "https://picsum.photos/seed/beauty-main-3/800/1000",
  },

  /* ================= 라이프 ================= */
  {
    id: "life-main-1",
    name: "우드 라운드 테이블",
    desc: "내추럴 우드 소재 라운드 테이블.",
    brand: "LIFE",
    price: 189000,
    category: "life",
    subcategory: "main",
    image: "https://picsum.photos/seed/life-main-1/800/1000",
  },
  {
    id: "life-main-2",
    name: "플로어 스탠드 조명",
    desc: "은은한 빛의 플로어 램프.",
    brand: "LIFE",
    price: 129000,
    category: "life",
    subcategory: "main",
    image: "https://picsum.photos/seed/life-main-2/800/1000",
  },
  {
    id: "life-main-3",
    name: "코튼 블랭킷",
    desc: "사계절 사용 가능한 코튼 블랭킷.",
    brand: "LIFE",
    price: 59000,
    category: "life",
    subcategory: "main",
    image: "https://picsum.photos/seed/life-main-3/800/1000",
  },

  /* ================= 아울렛 ================= */
  {
    id: "outlet-main-1",
    name: "[OUTLET] 여성 더블 코트",
    desc: "지난 시즌 코트를 특가로 만나는 기회.",
    brand: "OUTLET",
    price: 159000,
    originalPrice: 289000,
    category: "outlet",
    subcategory: "main",
    image: "https://picsum.photos/seed/outlet-main-1/800/1000",
  },
  {
    id: "outlet-main-2",
    name: "[OUTLET] 스니커즈",
    desc: "베스트셀러 스니커즈를 합리적인 가격으로.",
    brand: "OUTLET",
    price: 59000,
    originalPrice: 109000,
    category: "outlet",
    subcategory: "main",
    image: "https://picsum.photos/seed/outlet-main-2/800/1000",
  },
  {
    id: "outlet-main-3",
    name: "[OUTLET] 니트 풀오버",
    desc: "울 혼방 니트를 시즌오프 가격으로.",
    brand: "OUTLET",
    price: 49000,
    originalPrice: 89000,
    category: "outlet",
    subcategory: "main",
    image: "https://picsum.photos/seed/outlet-main-3/800/1000",
  },
];

// 2) CATEGORY / SUBCATEGORY 로 묶은 구조 (Search.jsx에서 사용)
const PRODUCT_DATA = products.reduce((acc, p) => {
  const cat = p.category || "etc";
  const sub = p.subcategory || "main";

  if (!acc[cat]) acc[cat] = {};
  if (!acc[cat][sub]) acc[cat][sub] = [];
  acc[cat][sub].push(p);

  return acc;
}, {});

// 3) CategoryPage 에서 쓰는 헬퍼
function getProductsByCategory(categoryKey, subcategoryKey = "main") {
  const cat = PRODUCT_DATA[categoryKey];
  if (!cat) return [];

  // 지정된 서브카테고리가 있으면 그대로
  if (cat[subcategoryKey]) return cat[subcategoryKey];

  // 없으면 그 카테고리의 모든 서브카테고리 묶어서 반환
  return Object.values(cat).flat();
}

// ------------------------------------------------------------------
// export 들
// ------------------------------------------------------------------
export { products, PRODUCT_DATA, getProductsByCategory };
export default products;
