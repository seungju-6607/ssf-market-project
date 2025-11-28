// src/pages/home/Home.jsx
import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";
import {
  toggleWishlistServer,
  syncWishlistFromServer,
} from "../../hooks/useWishlist.js";
import { isInWishlist } from "../../hooks/useWishlist.js";


// 브랜드 로고 이미지
import brand8Seconds from "../../assets/brands/brand_에잇세컨즈.webp";
import brandBeanpole from "../../assets/brands/brand_빈폴.webp";
import brandBeaker from "../../assets/brands/brand_비이커.webp";
import brandKuho from "../../assets/brands/brand_구호.png";
import brandIsseyMiyake from "../../assets/brands/brand_이세이미야케.webp";
import brandMaisonKitsune from "../../assets/brands/brand_메종키츠네.webp";
import brandTheory from "../../assets/brands/brand_띠어리.png";
import brandKuhoPlus from "../../assets/brands/brand_구호플러스.webp";
import brandCommeDesGarcons from "../../assets/brands/brand_꼼데가르송.webp";
import brandPatagonia from "../../assets/brands/brand_파타고니아.webp";
import brandSportyRich from "../../assets/brands/brand_스포티앤리치.webp";
import brandSie from "../../assets/brands/brand_시에.webp";
import brandInuGolf from "../../assets/brands/brand_이뉴골프.webp";
import brandGeneralIdea from "../../assets/brands/brand_제너럴 아이디어.webp";
import brandLeMouton from "../../assets/brands/brand_르무통.webp";
import brandAmi from "../../assets/brands/brand_아미.png";
import brandJuunJ from "../../assets/brands/brand_준지.png";
import brandRokadis from "../../assets/brands/brand_로가디스.webp";
import brandDanton from "../../assets/brands/brand_단톤.webp";
import brand10CorsoComo from "../../assets/brands/brand_텐꼬르소꼬모.webp";
import brandDiapter from "../../assets/brands/brand_디애퍼처.webp";
import brandCos from "../../assets/brands/brand_코스.webp";
import brandSaintJames from "../../assets/brands/brand_세인트제임스.webp";
import brandTommyHilfiger from "../../assets/brands/brand_타미힐피거.png";
import brandCanadaGoose from "../../assets/brands/brand_캐나다구스.webp";
import brandHera from "../../assets/brands/brand_헤라.webp";
import brandGalaxyLifestyle from "../../assets/brands/brand_갤럭시라이프스타일.webp";
import brandRebaige from "../../assets/brands/brand_르베이지.png";
import brandToryBurch from "../../assets/brands/brand_토리버치.webp";
import brandGalaxy from "../../assets/brands/brand_갤럭시.webp";
import brandLemaire from "../../assets/brands/brand_르메르.png";
import brandFitflop from "../../assets/brands/brand_핏플랍.png";
import brandGanni from "../../assets/brands/brand_가니.png";
import brandRagBone from "../../assets/brands/brand_랙앤본.webp";
import brandSandsound from "../../assets/brands/brand_샌드사운드.webp";

export default function Home() {
  const [page, setPage] = useState(0);
  const [activeProductTab, setActiveProductTab] = useState(0);
  const [activeRankingTab, setActiveRankingTab] = useState(0);
  const [brandPage, setBrandPage] = useState(0);
  const navigate = useNavigate();

  const [email, setEmail] = useState(null);
  const [wishlistVersion, setWishlistVersion] = useState(0);

  
  useEffect(() => {
    try {
      const raw = localStorage.getItem("loginUser");
      const loginUser = raw ? JSON.parse(raw) : null;
      setEmail(loginUser?.email || null);
    } catch {
      setEmail(null);
    }
  }, []);

  const [wishIds, setWishIds] = useState(new Set());

  // 서버에서 위시리스트 동기화
  useEffect(() => {
    const loadWishlist = async () => {
      if (!email) {
        setWishIds(new Set());
        return;
      }
      try {
        const list = await syncWishlistFromServer(email); // DTO 리스트
        const ids = new Set(
          (list || []).map((item) => item.productId || item.id)
        );
        setWishIds(ids);
      } catch (e) {
        console.error("Home wishlist sync error:", e);
      }
    };

    loadWishlist();
  }, [email]);

  // 상품 / 랭킹 카드별 선택된 사이즈
  const [selectedSizes, setSelectedSizes] = useState({});
  const [selectedRankSizes, setSelectedRankSizes] = useState({});

  const totalPages = 3;

  const slides = useMemo(
    () => [
      {
        title: "8SECONDS",
        subtitle: "리즈와 함께면 지금이 리즈",
        desc: "BEYOND THE REBELS · 2nd Drop",
        image: "/icons/main1.webp",
      },
      {
        title: "KUHO PLUS",
        subtitle: "25 Winter Collection",
        desc: "혜택이 넘치는 세싸패 LIVE",
        image: "/icons/main2.webp",
      },
      {
        title: "J RIUM",
        subtitle: "나를 안는 부드러움",
        desc: "~38% + 7% + 5만포인트 + 사은품",
        image: "/icons/main3.webp",
      },
      {
        title: "COS",
        subtitle: "다가온 가을의 순간",
        desc: "변화하는 계절의 감각적인 스타일링",
        image: "/icons/main4.webp",
      },
      {
        title: "UGG & REQINS",
        subtitle: "어쩔 수 없이 걷고 싶은 계절",
        desc: "어그, 호갱 등 인기 슈즈 특가",
        image: "/icons/main5.webp",
      },
      {
        title: "ROUGE & LOUNGE",
        subtitle: "인플루언서가 탐낸 실루엣",
        desc: "F/W 레더 백 단독 할인",
        image: "/icons/main6.webp",
      },
      {
        title: "LEMAIRE",
        subtitle: "코지 니트 컬렉션",
        desc: "FW 신상품 얼리버드 20%",
        image: "/icons/main7.webp",
      },
      {
        title: "BEANPOLE",
        subtitle: "따뜻한 데일리 아우터",
        desc: "시즌오프 최대 60% + 쿠폰",
        image: "/icons/main8.webp",
      },
      {
        title: "Theory",
        subtitle: "소프트 캐시미어",
        desc: "한정 수량 특별가",
        image: "/icons/main9.webp",
      },
    ],
    []
  );

  useEffect(() => {
  const handler = () => setWishlistVersion(v => v + 1);
  window.addEventListener("wishlistUpdated", handler);
  return () => window.removeEventListener("wishlistUpdated", handler);
  }, []);


  useEffect(() => {
    const t = setInterval(() => setPage((p) => (p + 1) % totalPages), 5000);
    return () => clearInterval(t);
  }, []);

  const prev = () => setPage((p) => (p - 1 + totalPages) % totalPages);
  const next = () => setPage((p) => (p + 1) % totalPages);

  const productCategories = [
    "니트 카디건",
    "백 & 슈즈",
    "럭셔리",
    "뷰티 & 향수",
    "코스메틱",
    "키즈 & 베이비",
  ];
  const rankingCategories = [
    "여성",
    "남성",
    "키즈",
    "럭셔리",
    "백&슈즈",
    "스포츠",
    "골프",
    "뷰티",
    "라이프",
  ];

  // 홈 상품 탭 데이터
  const productTabsData = useMemo(
    () => [
      // 0. 니트 카디건
      [
        {
          id: "P-ANGGAE-1",
          brand: "anggae",
          name: "Soft Smocked Knit Cardigan",
          image: "/images/women/knit/women_knit1.webp",
          price: 159000,
        },
        {
          id: "P-8SEC-1",
          brand: "8SECONDS",
          name: "울100 루즈핏 니트 - 카키",
          image: "/images/women/knit/women_knit2.webp",
          price: 59900,
          originalPrice: 69900,
          discountLabel: "10%",
        },
        {
          id: "P-MAIA-1",
          brand: "MAIA",
          name: "Two-Way 버튼업 가디건",
          image: "/images/women/knit/women_knit3.webp",
          priceLabel: "품절",
        },
        {
          id: "P-320S-1",
          brand: "320SHOWROOM",
          name: "V-Neck 알파카 니트",
          image: "/images/women/knit/women_knit4.webp",
          price: 64800,
          originalPrice: 79000,
          discountLabel: "10%",
        },
        {
          id: "P-HANE-1",
          brand: "HANE",
          name: "플라테 울 니트 가디건",
          image: "/images/women/knit/women_knit5.webp",
          price: 118800,
          originalPrice: 156000,
          discountLabel: "26%",
        },
      ],

      // 1. 백 & 슈즈
      [
        {
          id: "P-BAG-1",
          brand: "ROUGE&LOUNGE",
          name: "블랙 메리제인 레더 플랫",
          image: "/images/shoes/women/shoes_women1.webp",
          price: 298000,
          originalPrice: 398000,
          discountLabel: "25%",
        },
        {
          id: "P-BAG-2",
          brand: "BEANPOLE",
          name: "레오파드 클래식 플랫",
          image: "/images/shoes/women/shoes_women2.webp",
          price: 189000,
        },
        {
          id: "P-SHOES-1",
          brand: "FITFLOP",
          name: "벨트 메리제인 컴포트 슈즈",
          image: "/images/shoes/men/shoes_men1.webp",
          price: 246050,
          originalPrice: 259000,
          discountLabel: "5%",
        },
        {
          id: "P-SHOES-2",
          brand: "UGG",
          name: "CLASSIC MINI PLATFORM - Chestnut",
          image: "/images/shoes/men/shoes_men2.webp",
          price: 219000,
        },
      ],

      // 2. 럭셔리
      [
        {
          id: "P-JEWEL-1",
          brand: "MAISON KITSUNÉ",
          name: "클래식 울 블렌드 니트",
          image: "/images/luxury/men/luxury_men1.webp",
          price: 98000,
        },
        {
          id: "P-JEWEL-2",
          brand: "TORY BURCH",
          name: "마린 스트라이프 롱슬리브 티",
          image: "/images/luxury/men/luxury_men3.webp",
          price: 118000,
        },
        {
          id: "P-ACC-1",
          brand: "LEMAIRE",
          name: "레메르 클래식 스트라이프 셔츠",
          image: "/images/luxury/women/luxury_women4.webp",
          price: 158000,
        },
      ],

      // 3. 뷰티 & 향수
      [
        {
          id: "P-BEAUTY-1",
          brand: "HERA",
          name: "스킨케어 에센스 세트",
          image: "/images/beauty/skin/beauty_skin1.webp",
          price: 68000,
        },
        {
          id: "P-BEAUTY-2",
          brand: "TOM FORD",
          name: "Soleil Brûlant EDP",
          image: "/images/beauty/skin/beauty_skin2.webp",
          price: 395000,
        },
        {
          id: "P-BEAUTY-3",
          brand: "LE LABO",
          name: "Santal 33",
          image: "/images/beauty/skin/beauty_skin3.webp",
          price: 289000,
        },
      ],

      // 4. 코스메틱
      [
        {
          id: "P-COS-1",
          brand: "HERA",
          name: "센슈얼 누드 밤",
          image: "/images/beauty/makeup/beauty_makeup1.webp",
          price: 39000,
        },
        {
          id: "P-COS-2",
          brand: "MAC",
          name: "파우더 키스 립스틱",
          image: "/images/beauty/makeup/beauty_makeup2.webp",
          price: 34000,
        },
        {
          id: "P-COS-3",
          brand: "NARS",
          name: "블러쉬 ORGASM",
          image: "/images/beauty/makeup/beauty_makeup3.webp",
          price: 48000,
        },
      ],

      // 5. 키즈 & 베이비
      [
        {
          id: "P-KIDS-1",
          brand: "ASICS KIDS",
          name: "키즈 플리스 겨울 머플러",
          image: "/images/kids/baby/kids_baby3.webp",
          price: 39000,
        },
        {
          id: "P-KIDS-2",
          brand: "PATAGONIA",
          name: "베이비 레트로-X 미튼",
          image: "/images/kids/baby/kids_baby1.webp",
          price: 29000,
        },
        {
          id: "P-KIDS-3",
          brand: "BEANPOLE KIDS",
          name: "키즈 클래식 스니커즈 – Black",
          image: "/images/kids/girl/kids_girl2.webp",
          price: 59000,
        },
      ],
    ],
    []
  );

  // 홈 상품 사이즈 옵션
  const PRODUCT_SIZE_OPTIONS = useMemo(
    () => ({
      "P-ANGGAE-1": ["S", "M", "L"],
      "P-8SEC-1": ["S", "M", "L"],
      "P-MAIA-1": ["S", "M", "L"],
      "P-320S-1": ["S", "M", "L"],
      "P-HANE-1": ["S", "M", "L"],

      "P-BAG-1": ["ONE"],
      "P-BAG-2": ["ONE"],
      "P-SHOES-1": ["230", "240", "250", "260"],
      "P-SHOES-2": ["230", "240", "250", "260"],

      "P-JEWEL-1": ["FREE"],
      "P-JEWEL-2": ["FREE"],
      "P-ACC-1": ["FREE"],

      "P-BEAUTY-1": ["13g", "15g"],
      "P-BEAUTY-2": ["50ml", "100ml"],
      "P-BEAUTY-3": ["50ml", "100ml"],

      "P-COS-1": ["1호", "2호"],
      "P-COS-2": ["01", "02", "03"],
      "P-COS-3": ["Light", "Medium"],

      "P-KIDS-1": ["XS", "S", "M"],
      "P-KIDS-2": ["3Y", "4Y", "5Y"],
      "P-KIDS-3": ["110", "120", "130"],
    }),
    []
  );


  const isWishlisted = (id) => {
  try {
    const list = JSON.parse(localStorage.getItem("wishlist")) || [];
    return list.some(item => item.id === id || item.productId === id);
  } catch {
    return false;
  }
};

  const toggleWishlist = async (product) => {
    if (!email) {
      alert("로그인 후 찜 기능을 이용할 수 있습니다.");
      return;
    }

    try {
      const normalizedPrice =
        typeof product.price === "number" ? product.price : 0;

      const on = await toggleWishlistServer(email, {
        ...product,
        price: normalizedPrice,
      });

      setWishIds((prev) => {
        const next = new Set(prev);
        if (on) next.add(product.id);
        else next.delete(product.id);
        return next;
      });
    } catch (e) {
      console.error("Home wishlist toggle error:", e);
      alert("찜 처리 중 오류가 발생했습니다.");
    }
  };

  const handleSizeSelect = (productId, size) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [productId]: prev[productId] === size ? undefined : size,
    }));
  };

  // 홈 상품 카드 클릭 → Checkout
  const handleProductClick = (product) => {
    if (!product || typeof product.price !== "number") {
      alert("품절 상품은 구매할 수 없습니다.");
      return;
    }

    const sizeOptions = PRODUCT_SIZE_OPTIONS[product.id] || [];
    const selectedSize = selectedSizes[product.id];

    if (sizeOptions.length > 0 && !selectedSize) {
      alert("사이즈를 선택해 주세요.");
      return;
    }

    navigate("/checkout", {
      state: {
        order: {
          id: product.id,
          name: product.name,
          image: product.image,
          price: product.price,
          qty: 1,
          size: selectedSize || "",
        },
      },
    });
  };

  // 인기 브랜드 데이터
  const brandData = [
    { logo: brand8Seconds, name: "에잇세컨즈", link: "/brand/8seconds", isImage: true },
    { logo: brandBeanpole, name: "빈폴", link: "/brand/beanpole", isImage: true },
    { logo: brandBeaker, name: "비이커", link: "/brand/beaker", isImage: true },
    { logo: brandKuho, name: "구호", link: "/brand/kuho", isImage: true },
    { logo: brandIsseyMiyake, name: "이세이미야케", link: "/brand/issey-miyake", isImage: true },
    { logo: brandMaisonKitsune, name: "메종키츠네", link: "/brand/maison-kitsune", isImage: true },
    { logo: brandTheory, name: "띠어리", link: "/brand/theory", isImage: true },
    { logo: brandKuhoPlus, name: "구호플러스", link: "/brand/kuho-plus", isImage: true },
    {
      logo: brandCommeDesGarcons,
      name: "꼼데가르송",
      link: "/brand/comme-des-garcons",
      isImage: true,
    },
    { logo: brandPatagonia, name: "파타고니아", link: "/brand/patagonia", isImage: true },
    { logo: brandSportyRich, name: "스포티앤리치", link: "/brand/sporty-rich", isImage: true },
    { logo: brandSie, name: "시에", link: "/brand/sie", isImage: true },

    { logo: brandInuGolf, name: "이뉴골프", link: "/brand/inu-golf", isImage: true },
    { logo: brandGeneralIdea, name: "제너럴 아이디어", link: "/brand/general-idea", isImage: true },
    { logo: brandLeMouton, name: "르무통", link: "/brand/le-mouton", isImage: true },
    { logo: brandAmi, name: "아미", link: "/brand/ami", isImage: true },
    { logo: brandJuunJ, name: "준지", link: "/brand/juun-j", isImage: true },
    { logo: brandRokadis, name: "로가디스", link: "/brand/rogadis", isImage: true },
    { logo: brandDanton, name: "단톤", link: "/brand/danton", isImage: true },
    { logo: brand10CorsoComo, name: "텐꼬르소꼬모", link: "/brand/10-corso-como", isImage: true },
    { logo: brandDiapter, name: "디애퍼처", link: "/brand/diapter", isImage: true },
    { logo: brandCos, name: "코스", link: "/brand/cos", isImage: true },
    { logo: brandSaintJames, name: "세인트제임스", link: "/brand/saint-james", isImage: true },
    { logo: brandTommyHilfiger, name: "타미힐피거", link: "/brand/tommy-hilfiger", isImage: true },

    { logo: brandCanadaGoose, name: "캐나다구스", link: "/brand/canada-goose", isImage: true },
    { logo: brandHera, name: "헤라", link: "/brand/hera", isImage: true },
    {
      logo: brandGalaxyLifestyle,
      name: "갤럭시라이프스타일",
      link: "/brand/galaxy-lifestyle",
      isImage: true,
    },
    { logo: brandRebaige, name: "르베이지", link: "/brand/rebaige", isImage: true },
    { logo: brandToryBurch, name: "토리버치", link: "/brand/tory-burch", isImage: true },
    { logo: brandGalaxy, name: "갤럭시", link: "/brand/galaxy", isImage: true },
    { logo: brandLemaire, name: "르메르", link: "/brand/lemaire", isImage: true },
    { logo: brandFitflop, name: "핏플랍", link: "/brand/fitflop", isImage: true },
    { logo: brandGanni, name: "가니", link: "/brand/ganni", isImage: true },
    { logo: brandRagBone, name: "랙앤본", link: "/brand/rag-bone", isImage: true },
    { logo: brandSandsound, name: "샌드사운드", link: "/brand/sandsound", isImage: true },
  ];

  const brandsPerPage = 12;
  const totalBrandPages = Math.ceil(brandData.length / brandsPerPage);
  const currentBrands = brandData.slice(
    brandPage * brandsPerPage,
    (brandPage + 1) * brandsPerPage
  );

  const handleBrandPrev = () => {
    setBrandPage((prev) => (prev - 1 + totalBrandPages) % totalBrandPages);
  };

  const handleBrandNext = () => {
    setBrandPage((prev) => (prev + 1) % totalBrandPages);
  };

  const formatPrice = (n) =>
    typeof n === "number" ? n.toLocaleString() : n;

  const currentProducts = productTabsData[activeProductTab] || [];


  const rankingTabsData = [
    // 0. 여성
    [
      {
        id: "R-W-1",
        rank: 1,
        brand: "KUHO",
        name: "플리츠 니트 스커트 셋업",
        image: "/images/women/new/women_new1.webp",
        discount: 30,
        price: 197100,
      },
      {
        id: "R-W-2",
        rank: 2,
        brand: "KUHO PLUS",
        name: "벨티드 슬랙스 니트 톱 세트",
        image: "/images/women/new/women_new2.webp",
        discount: 20,
        price: 246000,
      },
      {
        id: "R-W-3",
        rank: 3,
        brand: "anggae",
        name: "롱 슬릿 니트 원피스",
        image: "/images/women/new/women_new3.webp",
        discount: 15,
        price: 238400,
      },
      {
        id: "R-W-4",
        rank: 4,
        brand: "LEMAIRE",
        name: "하이넥 니트 탑 & 플리츠 팬츠",
        image: "/images/women/new/women_new4.webp",
        price: 298000,
      },
    ],

    // 1. 남성
    [
      {
        id: "R-M-1",
        rank: 1,
        brand: "GALAXY",
        name: "클래식 테일러드 싱글 수트",
        image: "/images/men/suit/men_suit4.webp",
        discount: 30,
        price: 298000,
      },
      {
        id: "R-M-2",
        rank: 2,
        brand: "JUUN.J",
        name: "오버핏 모던 싱글 블레이저",
        image: "/images/men/suit/men_suit5.webp",
        discount: 15,
        price: 328000,
      },
      {
        id: "R-M-3",
        rank: 3,
        brand: "PATAGONIA",
        name: "리사이클 폴라 플리스 머플러",
        image: "/images/men/new/men_new3.webp",
        price: 89000,
      },
      {
        id: "R-M-4",
        rank: 4,
        brand: "AMI",
        name: "하트 로고 니트 머플러",
        image: "/images/men/new/men_new4.webp",
        price: 98000,
      },
    ],

    // 2. 키즈
    [
      {
        id: "R-K-1",
        rank: 1,
        brand: "ASICS KIDS",
        name: "테디 버킷 햇 점퍼 세트",
        image: "/images/kids/new/kids_new1.webp",
        price: 69000,
      },
      {
        id: "R-K-2",
        rank: 2,
        brand: "PATAGONIA",
        name: "베이비 레트로-X 점퍼",
        image: "/images/kids/new/kids_new2.webp",
        price: 129000,
      },
      {
        id: "R-K-3",
        rank: 3,
        brand: "BEANPOLE KIDS",
        name: "플러피 미트 글러브",
        image: "/images/kids/new/kids_new3.webp",
        price: 39000,
      },
      {
        id: "R-K-4",
        rank: 4,
        brand: "ASICS KIDS",
        name: "프린트 트렁크 2팩",
        image: "/images/kids/new/kids_new4.webp",
        price: 89000,
      },
    ],

    // 3. 럭셔리
    [
      {
        id: "R-LUX-1",
        rank: 1,
        brand: "LEMAIRE",
        name: "Croissant Sling Bag - Black",
        image: "/images/luxury/new/luxury_new1.webp",
        price: 1980000,
      },
      {
        id: "R-LUX-2",
        rank: 2,
        brand: "COMOLI",
        name: "체크 스트랩 숄더 백",
        image: "/images/luxury/new/luxury_new2.webp",
        price: 980000,
      },
      {
        id: "R-LUX-3",
        rank: 3,
        brand: "SUITSUPPLY",
        name: "울 하프 슬리브 니트 톱",
        image: "/images/luxury/new/luxury_new3.webp",
        price: 398000,
      },
      {
        id: "R-LUX-4",
        rank: 4,
        brand: "AMI",
        name: "체크 울 재킷",
        image: "/images/luxury/new/luxury_new4.webp",
        price: 598000,
      },
    ],

    // 4. 백 & 슈즈
    [
      {
        id: "R-BS-1",
        rank: 1,
        brand: "ROUGE&LOUNGE",
        name: "레오파드 퍼 키링 파우치",
        image: "/images/shoes/new/shoes_new1.webp",
        price: 98000,
      },
      {
        id: "R-BS-2",
        rank: 2,
        brand: "BEANPOLE",
        name: "퍼 슬링백 뮬",
        image: "/images/shoes/new/shoes_new2.webp",
        price: 189000,
      },
      {
        id: "R-BS-3",
        rank: 3,
        brand: "FITFLOP",
        name: "시어 글라스 스트랩 힐",
        image: "/images/shoes/new/shoes_new3.webp",
        price: 246050,
      },
      {
        id: "R-BS-4",
        rank: 4,
        brand: "UGG",
        name: "화이트 러닝 스니커즈",
        image: "/images/shoes/new/shoes_new4.webp",
        price: 219000,
      },
    ],

    // 5. 스포츠
    [
      {
        id: "R-SP-1",
        rank: 1,
        brand: "PATAGONIA",
        name: "레트로X 숏 패딩",
        image: "/images/sports/new/sports_new1.webp",
        price: 259000,
      },
      {
        id: "R-SP-2",
        rank: 2,
        brand: "VOLVIK",
        name: "라이트 다운 베스트",
        image: "/images/sports/new/sports_new2.webp",
        price: 189000,
      },
      {
        id: "R-SP-3",
        rank: 3,
        brand: "ASICS",
        name: "하이넥 패딩베스트",
        image: "/images/sports/new/sports_new3.webp",
        price: 199000,
      },
      {
        id: "R-SP-4",
        rank: 4,
        brand: "NIKE",
        name: "플리스 조거 팬츠",
        image: "/images/sports/new/sports_new4.webp",
        price: 69000,
      },
    ],

    // 6. 골프
    [
      {
        id: "R-GOLF-1",
        rank: 1,
        brand: "VOLVIK",
        name: "컬러 패턴 골프 니트",
        image: "/images/golf/new/golf_new1.webp",
        price: 298000,
      },
      {
        id: "R-GOLF-2",
        rank: 2,
        brand: "GALAXY",
        name: "남성 골프 점퍼 세트",
        image: "/images/golf/new/golf_new2.webp",
        price: 398000,
      },
      {
        id: "R-GOLF-3",
        rank: 3,
        brand: "PATAGONIA",
        name: "윈드브레이커 풀오버",
        image: "/images/golf/new/golf_new3.webp",
        price: 219000,
      },
      {
        id: "R-GOLF-4",
        rank: 4,
        brand: "BEANPOLE GOLF",
        name: "플레이어 셋업",
        image: "/images/golf/new/golf_new4.webp",
        price: 159000,
      },
    ],

    // 7. 뷰티
    [
      {
        id: "R-BEAUTY-1",
        rank: 1,
        brand: "HERA",
        name: "블랙 쿠션 세트",
        image: "/images/beauty/new/beauty_new1.webp",
        price: 68000,
      },
      {
        id: "R-BEAUTY-2",
        rank: 2,
        brand: "TOM FORD",
        name: "프라이빗 블렌드 EDP",
        image: "/images/beauty/new/beauty_new2.webp",
        price: 395000,
      },
      {
        id: "R-BEAUTY-3",
        rank: 3,
        brand: "LE LABO",
        name: "Santal 33 오 드 퍼퓸",
        image: "/images/beauty/new/beauty_new3.webp",
        price: 289000,
      },
      {
        id: "R-BEAUTY-4",
        rank: 4,
        brand: "MAC",
        name: "립스틱 3종 키트",
        image: "/images/beauty/new/beauty_new4.webp",
        price: 99000,
      },
    ],

    // 8. 라이프
    [
      {
        id: "R-LIFE-1",
        rank: 1,
        brand: "SSF HOME",
        name: "코지 워싱 코튼 베딩세트",
        image: "/images/life/new/life_new1.webp",
        price: 189000,
      },
      {
        id: "R-LIFE-2",
        rank: 2,
        brand: "anggae",
        name: "스트라이프 코튼 이불커버",
        image: "/images/life/new/life_new2.webp",
        price: 189000,
      },
      {
        id: "R-LIFE-3",
        rank: 3,
        brand: "anggae",
        name: "라이트 코튼 블랭킷",
        image: "/images/life/new/life_new3.webp",
        price: 159000,
      },
      {
        id: "R-LIFE-4",
        rank: 4,
        brand: "COMOLI",
        name: "플라워 프린트 코튼 베딩",
        image: "/images/life/new/life_new4.webp",
        price: 189000,
      },
    ],
  ];

  // 랭킹 사이즈 옵션 (향수는 ml, 침구는 사이즈 등)
  const RANKING_SIZE_OPTIONS = useMemo(
    () => ({
      // 여성
      "R-W-1": ["S", "M", "L"],
      "R-W-2": ["S", "M", "L"],
      "R-W-3": ["S", "M", "L"],
      "R-W-4": ["S", "M", "L"],

      // 남성
      "R-M-1": ["M", "L", "XL"],
      "R-M-2": ["M", "L", "XL"],
      "R-M-3": ["FREE"],
      "R-M-4": ["FREE"],

      // 키즈
      "R-K-1": ["160", "170", "180"],
      "R-K-2": ["3Y", "4Y", "5Y"],
      "R-K-3": ["FREE"],
      "R-K-4": ["110", "120", "130"],

      // 럭셔리
      "R-LUX-1": ["ONE"],
      "R-LUX-2": ["ONE"],
      "R-LUX-3": ["S", "M", "L"],
      "R-LUX-4": ["S", "M", "L"],

      // 백 & 슈즈
      "R-BS-1": ["ONE"],
      "R-BS-2": ["230", "235", "240", "245"],
      "R-BS-3": ["225", "230", "235", "240", "245"],
      "R-BS-4": ["230", "240", "250", "260"],

      // 스포츠
      "R-SP-1": ["S", "M", "L"],
      "R-SP-2": ["S", "M", "L"],
      "R-SP-3": ["S", "M", "L"],
      "R-SP-4": ["S", "M", "L"],

      // 골프
      "R-GOLF-1": ["S", "M", "L"],
      "R-GOLF-2": ["S", "M", "L", "XL"],
      "R-GOLF-3": ["S", "M", "L"],
      "R-GOLF-4": ["S", "M", "L"],

      // 뷰티 (향수는 ml 선택)
      "R-BEAUTY-1": ["13g", "15g"],
      "R-BEAUTY-2": ["30ml", "50ml", "100ml"],
      "R-BEAUTY-3": ["50ml", "100ml"],
      "R-BEAUTY-4": ["SET"],

      // 라이프 (침구 사이즈)
      "R-LIFE-1": ["SS", "Q", "K"],
      "R-LIFE-2": ["SS", "Q", "K"],
      "R-LIFE-3": ["SS", "Q"],
      "R-LIFE-4": ["SS", "Q", "K"],
    }),
    []
  );

  const currentRankingProducts = rankingTabsData[activeRankingTab] || [];

  const handleRankSizeSelect = (productId, size) => {
    setSelectedRankSizes((prev) => ({
      ...prev,
      [productId]: prev[productId] === size ? undefined : size,
    }));
  };

  const handleRankingClick = (item) => {
    if (!item || typeof item.price !== "number") return;

    const sizeOptions = RANKING_SIZE_OPTIONS[item.id] || [];
    const selectedSize = selectedRankSizes[item.id];

    if (sizeOptions.length > 0 && !selectedSize) {
      alert("사이즈를 선택해 주세요.");
      return;
    }

    navigate("/checkout", {
      state: {
        order: {
          id: item.id,
          name: item.name,
          image: item.image,
          price: item.price,
          qty: 1,
          size: selectedSize || "",
        },
      },
    });
  };

  return (
    <>
      <main className="main-content">
        {/* 3장씩 보이는 메인 슬라이드 */}
        <section className="tri-hero">
          <div className="tri-hero__container">
            <div
              className="tri-hero__wrap"
              style={{ transform: `translateX(-${page * 100}%)` }}
            >
              {slides.map((s, i) => (
                <Link key={i} to="/menu" className="tri-card">
                  <img src={s.image} alt={s.title} className="tri-card__img" />
                  <div className="tri-card__overlay">
                    <div className="tri-card__brand">{s.title}</div>
                    <h2 className="tri-card__title">{s.subtitle}</h2>
                    <p className="tri-card__desc">{s.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
            <button
              className="tri-hero__nav tri-hero__prev"
              onClick={prev}
              aria-label="이전"
            >
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path
                  d="M15 18l-6-6 6-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <button
              className="tri-hero__nav tri-hero__next"
              onClick={next}
              aria-label="다음"
            >
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path
                  d="M9 18l6-6-6-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <div className="tri-hero__dots">
              {[0, 1, 2].map((n) => (
                <span
                  key={n}
                  className={`tri-dot ${page === n ? "active" : ""}`}
                  onClick={() => setPage(n)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* 인기 브랜드 */}
        <section className="popular-brands">
          <div className="container">
            <h2 className="section-title">인기 브랜드</h2>

            <div className="brands-slider-wrapper">
              <div className="brands-grid">
                {currentBrands.map((brand, index) => (
                  <Link key={index} to={brand.link} className="brand-card">
                    <div className="brand-logo-box">
                      {brand.isImage ? (
                        <img
                          src={brand.logo}
                          alt={brand.name}
                          className="brand-logo-img"
                        />
                      ) : (
                        <span className="brand-logo-text">{brand.logo}</span>
                      )}
                    </div>
                    <span className="brand-name">{brand.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="brands-pagination">
              <button
                className="pagination-arrow"
                onClick={handleBrandPrev}
                aria-label="이전 페이지"
              >
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path
                    d="M15 18l-6-6 6-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
              <span className="pagination-text">
                {brandPage + 1} / {totalBrandPages}
              </span>
              <button
                className="pagination-arrow"
                onClick={handleBrandNext}
                aria-label="다음 페이지"
              >
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path
                    d="M9 18l6-6-6-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* 이벤트 배너 */}
        <section className="event-banner">
          <div className="container">
            <h2 className="section-title">이벤트</h2>
            <div className="event-grid">
              <div className="event-card">
                <img src="/images/216419883.jpeg" alt="첫 구매 한정 -50% 특가" />
                <div className="event-content">
                  <h3>첫 구매 한정 -50% 특가</h3>
                  <p>10주년 기념 최대 혜택 받아가세요</p>
                </div>
              </div>
              <div className="event-card">
                <img src="/images/521681749.jpeg" alt="10주년 한정 첫 구매 지원금" />
                <div className="event-content">
                  <h3>10주년 한정 첫 구매 지원금</h3>
                  <p>매월 100명에게 선물로 1만 포인트 드립니다</p>
                </div>
              </div>
              <div className="event-card">
                <img
                  src="/images/1642450336.jpeg"
                  alt="앱에서 첫 로그인하고 쿠폰 받기"
                />
                <div className="event-content">
                  <h3>앱에서 첫 로그인하고 쿠폰 받기</h3>
                  <p>1만원 쿠폰 즉시 지급</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 홈 상품 섹션 */}
        <section className="product-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">고마움과 안부, 마음껏 전할 시간</h2>

              <div className="category-tabs">
                {productCategories.map((category, index) => (
                  <button
                    key={index}
                    className={`tab-btn ${
                      index === activeProductTab ? "active" : ""
                    }`}
                    onClick={() => setActiveProductTab(index)}
                  >
                    {category}
                  </button>
                ))}
                <Link
                  to="/wishlist"
                  className="tab-btn"
                  style={{ textDecoration: "none" }}
                >
                  위시리스트 보러가기 →
                </Link>
              </div>
            </div>

            <div className="product-grid">
              {currentProducts.map((p) => {
                const wished = isWishlisted(p.id); // 
                const sizeOptions = PRODUCT_SIZE_OPTIONS[p.id] || [];
                const selectedSize = selectedSizes[p.id];

                return (
                  <div
                    className="product-card"
                    key={p.id}
                    onClick={() => handleProductClick(p)}
                  >
                    <div className="product-image">
                      <img src={p.image} alt={p.name} />
                      <button
                        className={`wishlist-btn ${wished ? "active" : ""}`}
                        aria-pressed={wished}
                        aria-label={wished ? "위시에서 제거" : "위시에 추가"}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(p); // 
                        }}
                        title={wished ? "위시에 담김" : "위시에 담기"}
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                            stroke="currentColor"
                            strokeWidth="2"
                            fill={wished ? "currentColor" : "none"}
                          />
                        </svg>
                      </button>
                      {p.discountLabel && (
                        <span className="discount-badge">{p.discountLabel}</span>
                      )}
                    </div>
                    <div className="product-info">
                      <span className="brand">{p.brand}</span>
                      <h3 className="product-name">{p.name}</h3>
                      <div className="price">
                        {p.originalPrice && (
                          <span className="original-price">
                            {formatPrice(p.originalPrice)}
                          </span>
                        )}
                        <span className="current-price">
                          {p.priceLabel ? p.priceLabel : formatPrice(p.price)}
                        </span>
                      </div>

                      {sizeOptions.length > 0 && (
                        <div className="size-selector">
                          <span className="size-label">SIZE</span>
                          <div className="size-options">
                            {sizeOptions.map((size) => (
                              <button
                                key={size}
                                type="button"
                                className={`size-pill ${
                                  selectedSize === size ? "selected" : ""
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSizeSelect(p.id, size);
                                }}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 랭킹 섹션 */}
        <section className="ranking-section">
          <div className="container">
            <h2 className="section-title">랭킹</h2>

            <div className="ranking-tabs">
              {rankingCategories.map((category, index) => (
                <button
                  key={index}
                  className={`tab-btn ${
                    index === activeRankingTab ? "active" : ""
                  }`}
                  onClick={() => setActiveRankingTab(index)}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="ranking-grid">
              {currentRankingProducts.map((item) => {
                const sizeOptions = RANKING_SIZE_OPTIONS[item.id] || [];
                const selectedSize = selectedRankSizes[item.id];

                return (
                  <div
                    key={item.id}
                    className="ranking-item"
                    onClick={() => handleRankingClick(item)}
                  >
                    <div className="rank-badge">{item.rank}</div>
                    <div className="ranking-img-wrap">
                      <img src={item.image} alt={item.brand} />

                      <button
                        className={`ranking-heart ${
                          isWishlisted(item.id) ? "active" : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlistServer(email, item);
                        }}
                      >
                        ♥
                      </button>
                    </div>

                    <div className="item-info">
                      <h4>{item.brand}</h4>
                      <p>{item.name}</p>
                      <div className="price">
                        {item.discount ? (
                          <span className="discount">{item.discount}%</span>
                        ) : null}
                        {item.price ? (
                          <strong>{formatPrice(item.price)}</strong>
                        ) : null}
                      </div>

                      {sizeOptions.length > 0 && (
                        <div className="size-selector ranking-size">
                          <span className="size-label">SIZE</span>
                          <div className="size-options">
                            {sizeOptions.map((size) => (
                              <button
                                key={size}
                                type="button"
                                className={`size-pill ${
                                  selectedSize === size ? "selected" : ""
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRankSizeSelect(item.id, size);
                                }}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>



        {/* 브랜드 스토리 */}
        <section className="brand-story">
          <div className="container">
            <h2 className="section-title">이 주의 브랜드 이슈</h2>
            <div className="story-grid">
              <div className="story-card">
                <img src="/images/133835897.jpeg" alt="타이 스타일링의 정석" />
                <h3>타이 스타일링의 정석</h3>
                <p>SUITSUPPLY</p>
              </div>
              <div className="story-card">
                <img src="/images/3635466172.jpeg" alt="빛나는 도화적 무드" />
                <h3>빛나는 도화적 무드</h3>
                <p>길이를 담은 25F/W</p>
                <p>COMOLI</p>
              </div>
              <div className="story-card">
                <img src="/images/1176900044.jpeg" alt="가을을 담침 시간" />
                <h3>가을을 담침 시간</h3>
                <p>지금 추천해이볍 2S FALL 신상품</p>
                <p>ANOTHER#</p>
              </div>
              <div className="story-card">
                <img src="/images/3362617750.jpeg" alt="아식스 x 세실리에 반센" />
                <h3>아식스 x 세실리에 반센</h3>
                <p>볼 캐치타 톡톡</p>
                <p>ASICS KIDS</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
