// src/pages/ProductList.jsx
import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/CategoryPage.css";

// 가격 → 숫자
const toNumberPrice = (val) =>
  typeof val === "number" ? val : Number(String(val).replace(/[^\d]/g, "")) || 0;

/** 이미지 후보 경로 생성기 (안전장치)
 * - PUBLIC_URL + encodeURI(원본)
 * - PUBLIC_URL + 원본(비인코딩)
 * - PUBLIC_URL + 파일명 소문자화
 * - 루트(/) + encodeURI(원본)
 * - 루트(/) + 파일명 소문자화
 * - 마지막: placeholder
 */
const buildImageCandidates = (raw) => {
  const PUBLIC = process.env.PUBLIC_URL || "";
  const withLeadingSlash = raw.startsWith("/") ? raw : `/${raw}`;

  // 파일명/확장자 분리해 소문자 변형
  const parts = withLeadingSlash.split("/");
  const file = parts.pop() || "";
  const lowerFile = file.toLowerCase();
  const lowerPath = [...parts, lowerFile].join("/");

  const encoded = encodeURI(withLeadingSlash);
  const encodedLower = encodeURI(lowerPath);

  const candidates = [
    `${PUBLIC}${encoded}`,
    `${PUBLIC}${withLeadingSlash}`,     // 인코딩 없이
    `${PUBLIC}${encodedLower}`,         // 파일명 소문자
    `${PUBLIC}${lowerPath}`,            // 소문자 비인코딩
    encoded,                            // PUBLIC_URL 없이도 시도
    withLeadingSlash,                   // 비인코딩 루트
  ];

  // 중복 제거
  return Array.from(new Set(candidates));
};

/** 이미지 src 계산 (http/https는 그대로, 그 외는 후보 배열 생성)
 *  - 반환: { src, candidates }
 */
const srcOf = (imgOrProduct) => {
  const raw =
    typeof imgOrProduct === "string"
      ? imgOrProduct
      : imgOrProduct?.image || imgOrProduct?.img || "";

  if (!raw) {
    return {
      src: `${process.env.PUBLIC_URL}/images/placeholder.png`,
      candidates: [],
    };
  }
  if (/^https?:\/\//i.test(raw)) {
    return { src: raw, candidates: [] };
  }
  const candidates = buildImageCandidates(raw.replace(/\/{2,}/g, "/"));
  return { src: candidates[0], candidates: candidates.slice(1) };
};

// ===== 하드코딩: 로컬 이미지 기반 상품들 =====
const local_women_outer = [
  {
    id: "women-outer-101",
    brand: "SSF SHOP",
    name: "베이지 캐주얼 자켓",
    img: "/images/women/outer/women_outer1.webp",
    desc: "데일리로 활용하기 좋은 기본 아우터",
    price: "129000",
    originalPrice: 159000,
    discountRate: 10,
    rating: 4.5,
    reviewCount: 72,
    wishCount: 320,
    colors: ["beige", "black"],
  },
  {
    id: "women-outer-102",
    brand: "SSF SHOP",
    name: "패턴 자켓",
    img: "/images/women/outer/women_outer2.webp",
    desc: "유니크한 감각으로 스트릿 패션에 적합",
    price: "159000",
    originalPrice: 199000,
    discountRate: 15,
    rating: 4.4,
    reviewCount: 51,
    wishCount: 240,
    colors: ["brown", "black"],
  },
  {
    id: "women-outer-103",
    brand: "SSF SHOP",
    name: "블랙 라이더 자켓",
    img: "/images/women/outer/women_outer3.webp",
    desc: "시크한 무드의 포인트 아이템",
    price: "189000",
    originalPrice: 219000,
    discountRate: 10,
    rating: 4.7,
    reviewCount: 33,
    wishCount: 410,
    colors: ["black"],
  },
  {
    id: "women-outer-104",
    brand: "SSF SHOP",
    name: "경량 패딩 자켓",
    img: "/images/women/outer/women_outer4.webp",
    desc: "가볍지만 따뜻한 간절기 필수템",
    price: "99000",
    originalPrice: 129000,
    discountRate: 20,
    rating: 4.3,
    reviewCount: 28,
    wishCount: 180,
    colors: ["black", "navy"],
  },
  {
    id: "women-outer-105",
    brand: "SSF SHOP",
    name: "블랙 포켓 자켓",
    img: "/images/women/outer/women_outer5.webp",
    desc: "편안한 핏으로 스타일리시하게 연출 가능",
    price: "149000",
    originalPrice: 169000,
    discountRate: 10,
    rating: 4.6,
    reviewCount: 46,
    wishCount: 265,
    colors: ["black"],
  },
  {
    id: "women-outer-106",
    brand: "SSF SHOP",
    name: "카키 오버핏 자켓",
    img: "/images/women/outer/women_outer6.webp",
    desc: "실용성과 멋을 동시에 갖춘 아이템",
    price: "139000",
    originalPrice: 169000,
    discountRate: 15,
    rating: 4.5,
    reviewCount: 39,
    wishCount: 221,
    colors: ["khaki", "beige"],
  },
];

// 여성 ▸ 재킷
const local_women_jacket = [
  {
    id: "women-jacket-201",
    brand: "SSF SHOP",
    name: "재킷 상품 1",
    img: "/images/women/jacket/women_jacket1.webp",
    desc: "스타일리시한 재킷",
    price: "119000",
    originalPrice: 149000,
    discountRate: 20,
    rating: 4.5,
    reviewCount: 23,
    wishCount: 130,
    colors: ["grey", "black"],
  },
  {
    id: "women-jacket-202",
    brand: "SSF SHOP",
    name: "재킷 상품 2",
    img: "/images/women/jacket/women_jacket2.webp",
    desc: "스타일리시한 재킷",
    price: "129000",
    originalPrice: 159000,
    discountRate: 15,
    rating: 4.4,
    reviewCount: 18,
    wishCount: 98,
    colors: ["brown", "black"],
  },
  {
    id: "women-jacket-203",
    brand: "SSF SHOP",
    name: "재킷 상품 3",
    img: "/images/women/jacket/women_jacket3.webp",
    desc: "스타일리시한 재킷",
    price: "139000",
    originalPrice: 169000,
    discountRate: 15,
    rating: 4.6,
    reviewCount: 30,
    colors: ["black"],
  },
  {
    id: "women-jacket-204",
    brand: "SSF SHOP",
    name: "재킷 상품 4",
    img: "/images/women/jacket/women_jacket4.webp",
    desc: "스타일리시한 재킷",
    price: "149000",
    originalPrice: 179000,
    discountRate: 15,
    rating: 4.5,
    reviewCount: 14,
    colors: ["grey"],
  },
  {
    id: "women-jacket-205",
    brand: "SSF SHOP",
    name: "재킷 상품 5",
    img: "/images/women/jacket/women_jacket5.webp",
    desc: "스타일리시한 재킷",
    price: "159000",
    originalPrice: 199000,
    discountRate: 20,
    rating: 4.7,
    reviewCount: 41,
    wishCount: 260,
    colors: ["black", "brown"],
  },
  {
    id: "women-jacket-206",
    brand: "SSF SHOP",
    name: "재킷 상품 6",
    img: "/images/women/jacket/women_jacket6.webp",
    desc: "스타일리시한 재킷",
    price: "169000",
    originalPrice: 209000,
    discountRate: 20,
    rating: 4.6,
    reviewCount: 37,
    colors: ["black", "grey"],
  },
];

const local_women_knit = [];
const local_women_shirt = [];
const local_women_tshirt = [];
const local_women_onepiece = [];
const local_women_pants = [];
const local_women_skirt = [];

// (옵션) 외부 샘플
const sampleProducts = [
  {
    id: 1,
    brand: "BEAKER ORIGINAL",
    name: "Women Bandana Pattern Quilted Jumper - Black",
    img: "https://image.msscdn.net/images/goods_img/20231113/3658826/3658826_17077044817712_500.jpg",
    desc: "Women Bandana Pattern Quilted Jumper",
    price: "517750",
    originalPrice: 545000,
    discountRate: 5,
    rating: 4.5,
    reviewCount: 64,
    wishCount: 999,
    colors: ["black", "navy"],
  },
];

export default function ProductList() {
  const location = useLocation();
  const navigate = useNavigate();

  // ===== 경로 파싱: /women/outer, /search/키워드, /search?q=
  const pathParts = location.pathname.split("/").filter(Boolean);
  const first = pathParts[0] || "women";
  const isSearchMode = first === "search";
  const category = isSearchMode ? "" : first;
  const subcategory = isSearchMode ? "" : pathParts[1] || "outer";

  // 검색어 파싱
  const searchKeyword = useMemo(() => {
    if (!isSearchMode) return "";
    const fromPath = pathParts[1] ? decodeURIComponent(pathParts[1]) : "";
    const fromQuery = new URLSearchParams(location.search).get("q") || "";
    return (fromPath || fromQuery || "").trim();
  }, [isSearchMode, pathParts, location.search]);

  // 상태
  const [activeTab, setActiveTab] = useState("전체");
  const [sortBy, setSortBy] = useState("인기상품순(전체)");
  const [refresh, setRefresh] = useState(0); // 위시 토글 반영용

  // 브랜드 로고(디자인 유지용)
  const brandLogos = [
    { name: "아미", img: "/icons/brand_아미.png" },
    { name: "메종키츠네", img: "/icons/brand_메종키츠네.webp" },
    { name: "시에", img: "/icons/brand_시에.webp" },
    { name: "이세이미야케", img: "/icons/brand_이세이미야케.webp" },
    { name: "타미힐피거", img: "/icons/brand_타미힐피거.png" },
    { name: "디애퍼처", img: "/icons/brand_디애퍼처.webp" },
    { name: "르베이지", img: "/icons/brand_르베이지.png" },
    { name: "준지", img: "/icons/brand_준지.png" },
    { name: "단톤", img: "/icons/brand_단톤.png" },
    { name: "가니", img: "/icons/brand_가니.png" },
    { name: "토리버치", img: "/icons/brand_토리버치.jpg" },
    { name: "라코스테", img: "/icons/brand_라코스테.png" },
  ];

  // 카테고리/탭 메타
  const categoryInfo = {
    women: { name: "여성", nameEn: "WOMEN" },
    men: { name: "남성", nameEn: "MEN" },
    kids: { name: "키즈", nameEn: "KIDS" },
    beauty: { name: "뷰티", nameEn: "BEAUTY" },
    sports: { name: "스포츠", nameEn: "SPORTS" },
    life: { name: "라이프", nameEn: "LIFE" },
    luxury: { name: "럭셔리", nameEn: "LUXURY" },
    "bags-shoes": { name: "백&슈즈", nameEn: "BAGS & SHOES" },
    outlet: { name: "아울렛", nameEn: "OUTLET" },
  };

  const subcategoryInfo = {
    outer: { name: "아우터", tabs: ["전체", "코트", "점퍼", "다운/패딩", "퍼"] },
    jacket: { name: "재킷/베스트", tabs: ["전체", "블레이저", "베스트", "라이더", "기타"] },
    knit: { name: "니트웨어", tabs: ["전체", "카디건", "니트", "베스트"] },
    shirt: { name: "셔츠/블라우스", tabs: ["전체", "셔츠", "블라우스"] },
    tshirt: { name: "티셔츠", tabs: ["전체", "반팔", "긴팔", "민소매"] },
    onepiece: { name: "원피스", tabs: ["전체", "미니", "미디", "롱"] },
    pants: { name: "팬츠", tabs: ["전체", "청바지", "슬랙스", "레깅스", "기타"] },
    skirt: { name: "스커트", tabs: ["전체", "미니", "미디", "롱"] },
  };

  // 로컬 묶음 테이블
  const localByCategory = {
    women: {
      outer: local_women_outer,
      jacket: local_women_jacket,
      knit: local_women_knit,
      shirt: local_women_shirt,
      tshirt: local_women_tshirt,
      onepiece: local_women_onepiece,
      pants: local_women_pants,
      skirt: local_women_skirt,
    },
  };

  // 카테고리 페이지용 데이터
  const getProductsByCategory = () => {
    const locals =
      (localByCategory[category] && localByCategory[category][subcategory]) ||
      [];
    return [...sampleProducts, ...locals];
  };

  // 검색 전체 집합(여성 전부 + 샘플)
  const getAllProductsForSearch = () => {
    const allLocalWomen = Object.values(localByCategory.women || {}).flat();
    return [...sampleProducts, ...allLocalWomen];
  };

  // 가격 포맷
  const formatPrice = (price) => {
    if (typeof price === "string") return price;
    return `₩${Number(price || 0).toLocaleString()}`;
  };

  // 상세 페이지 이동
  const handleProductClick = (product) => {
    const normalized = {
      id: product.id,
      name: product.name || "상품명 없음",
      image: product.image || product.img || "",
      img: product.image || product.img || "",
      price:
        typeof product.price === "string"
          ? toNumberPrice(product.price)
          : Number(product.price || 0),
      desc: product.desc || "",
      brand: product.brand || "",
      rating: product.rating || 0,
      reviewCount: product.reviewCount || 0,
    };
    localStorage.setItem("lastProduct", JSON.stringify(normalized));
    navigate(`/product/${normalized.id}`, { product: normalized });
  };

  // ===== 위시리스트 =====
  const readWishlist = () => {
    try {
      return JSON.parse(localStorage.getItem("wishlist") || "[]");
    } catch {
      return [];
    }
  };
  const isWished = (id) =>
    readWishlist().some((p) => String(p.id) === String(id));

  const toggleWishlist = (e, product) => {
    e.stopPropagation();
    const data = {
      id: product.id,
      name: product.name,
      img: product.image || product.img || "",
      price: product.price,
      brand: product.brand || "",
    };
    let list = readWishlist();
    if (isWished(product.id)) {
      list = list.filter((p) => String(p.id) !== String(product.id));
    } else {
      list.unshift(data);
    }
    localStorage.setItem("wishlist", JSON.stringify(list));
    try {
      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch {}
    setRefresh((n) => n + 1);
  };

  // ===== 정렬 =====
  const sortProducts = (arr) => {
    const cp = [...arr];
    switch (sortBy) {
      case "낮은가격순":
        return cp.sort((a, b) => toNumberPrice(a.price) - toNumberPrice(b.price));
      case "높은가격순":
        return cp.sort((a, b) => toNumberPrice(b.price) - toNumberPrice(a.price));
      case "할인율순":
        return cp.sort((a, b) => (b.discountRate || 0) - (a.discountRate || 0));
      case "리뷰많은순":
        return cp.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
      default:
        return cp; // 인기상품순(전체)
    }
  };

  // ===== 최종 리스트 =====
  const baseProducts = useMemo(() => {
    return isSearchMode ? getAllProductsForSearch() : getProductsByCategory();
  }, [isSearchMode, category, subcategory, refresh]); // eslint-disable-line

  const normalizeText = (s) => (s || "").toLowerCase().replace(/\s+/g, "");
  const filteredProducts = useMemo(() => {
    let list = baseProducts;
    if (isSearchMode && searchKeyword) {
      const key = normalizeText(searchKeyword);
      list = baseProducts
        .map((p) => {
          const n = normalizeText(p.name || "");
          const exact = n === key ? 1 : 0;
          const includes = n.includes(key) ? 1 : 0;
          return { p, score: exact * 2 + includes };
        })
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((x) => x.p);
    }
    return sortProducts(list);
  }, [baseProducts, isSearchMode, searchKeyword, sortBy]); // eslint-disable-line

  const productsToShow = filteredProducts;

  // 화면용 메타
  const currentCategory =
    categoryInfo[category] || {
      name: category || "검색",
      nameEn: (category || "SEARCH").toUpperCase(),
    };
  const currentSubcategory =
    subcategoryInfo[subcategory] || { name: subcategory || "검색 결과", tabs: ["전체"] };

  // 공통 onError 핸들러: 후보 경로 순차 시도
  const handleImgError = (e) => {
    const img = e.currentTarget;
    const rest = img.dataset.candidates
      ? JSON.parse(img.dataset.candidates)
      : [];
    if (rest.length > 0) {
      const next = rest.shift();
      img.dataset.candidates = JSON.stringify(rest);
      img.src = next;
    } else {
      img.onerror = null;
      img.src = `${process.env.PUBLIC_URL}/images/placeholder.png`;
    }
  };

  return (
    <div className="category-page">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <div className="container">
          <Link to="/">Home</Link>
          <span className="separator">&gt;</span>
          {!isSearchMode ? (
            <>
              <Link to={`/${category}`}>{currentCategory.name}</Link>
              <span className="separator">&gt;</span>
              <span className="current">{currentSubcategory.name}</span>
            </>
          ) : (
            <span className="current">검색</span>
          )}
        </div>
      </div>

      <div className="container">
        {/* Page Title */}
        <div className="page-header">
          {!isSearchMode ? (
            <h1 className="page-title">
              {currentSubcategory.name}{" "}
              <span className="count">{productsToShow.length}개 상품</span>
            </h1>
          ) : (
            <h1 className="page-title">
              ‘{searchKeyword}’ 검색 결과{" "}
              <span className="count">{productsToShow.length}개 상품</span>
            </h1>
          )}
        </div>

        {/* Brand Logos */}
        {!isSearchMode && (
          <div className="brand-logos-section">
            {brandLogos.map((brand, idx) => {
              const { src, candidates } = srcOf(brand.img);
              return (
                <div key={idx} className="brand-logo-item">
                  <img
                    src={src}
                    alt={brand.name}
                    loading="lazy"
                    data-candidates={JSON.stringify(candidates)}
                    onError={handleImgError}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* Tabs */}
        {!isSearchMode && (
          <div className="category-tabs">
            {(currentSubcategory.tabs || ["전체"]).map((tab) => (
              <button
                key={tab}
                className={`tab ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        )}

        {/* Filters / Sort */}
        <div className="filter-section">
          {!isSearchMode ? (
            <div className="filter-buttons">
              <div className="filter-dropdown">
                <button className="filter-btn">
                  브랜드 <span className="arrow">∨</span>
                </button>
              </div>
              <div className="filter-dropdown">
                <button className="filter-btn">
                  가격 <span className="arrow">∨</span>
                </button>
              </div>
              <div className="filter-dropdown">
                <button className="filter-btn">
                  사이즈 <span className="arrow">∨</span>
                </button>
              </div>
              <div className="filter-dropdown">
                <button className="filter-btn">
                  색상 <span className="arrow">∨</span>
                </button>
              </div>
              <div className="filter-dropdown">
                <button className="filter-btn">
                  혜택/배송 <span className="arrow">∨</span>
                </button>
              </div>
            </div>
          ) : (
            <div />
          )}

          <div className="sort-section">
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option>인기상품순(전체)</option>
              <option>신상품순</option>
              <option>낮은가격순</option>
              <option>높은가격순</option>
              <option>할인율순</option>
              <option>리뷰많은순</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="product-grid">
          {productsToShow.length === 0 ? (
            <p className="no-result">검색 결과가 없습니다.</p>
          ) : (
            productsToShow.map((product) => {
              const { src, candidates } = srcOf(product);
              const wished = isWished(product.id);
              return (
                <div key={product.id} className="product-card">
                  <div
                    className="product-image-link"
                    onClick={() => handleProductClick(product)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="product-image-wrapper">
                      <img
                        src={src}
                        alt={product.name}
                        className="product-image"
                        loading="lazy"
                        data-candidates={JSON.stringify(candidates)}
                        onError={handleImgError}
                      />
                      <button
                        className={`wishlist-btn ${wished ? "active" : ""}`}
                        aria-label="찜하기"
                        onClick={(e) => toggleWishlist(e, product)}
                        title={wished ? "위시리스트에서 제거" : "위시리스트에 추가"}
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill={wished ? "currentColor" : "none"}>
                          <path
                            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="product-info">
                    <div className="product-brand">{product.brand}</div>
                    <div
                      className="product-name"
                      onClick={() => handleProductClick(product)}
                      style={{ cursor: "pointer" }}
                    >
                      {product.name}
                    </div>

                    <div className="product-price">
                      {product.discountRate > 0 && (
                        <>
                          <span className="original-price">
                            {formatPrice(product.originalPrice)}
                          </span>
                          <span className="discount-rate">{product.discountRate}%</span>
                        </>
                      )}
                      <span className="price">{formatPrice(product.price)}</span>
                    </div>

                    {product.rating && (
                      <div className="product-meta">
                        <div className="rating-reviews">
                          <span className="rating">★ {product.rating}({product.reviewCount || 0})</span>
                          {product.wishCount && <span className="wishlist">♥ {product.wishCount}+</span>}
                        </div>
                      </div>
                    )}

                    {product.colors && product.colors.length > 0 && (
                      <div className="product-colors">
                        {product.colors.map((color, idx) => (
                          <span
                            key={idx}
                            className="color-dot"
                            style={{
                              backgroundColor:
                                color === "black" ? "#000"
                                  : color === "white" ? "#fff"
                                  : color === "navy" ? "#001f3f"
                                  : color === "beige" ? "#f5f5dc"
                                  : color === "brown" ? "#8b4513"
                                  : color === "orange" ? "#ff6600"
                                  : color === "pink" ? "#ff69b4"
                                  : color === "blue" ? "#0074d9"
                                  : color === "grey" ? "#808080"
                                  : color === "khaki" ? "#c3b091"
                                  : color === "charcoal" ? "#36454f"
                                  : color,
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination (목업) */}
        <div className="pagination">
          <button className="page-btn">&lt;</button>
          <button className="page-btn active">1</button>
          <button className="page-btn">2</button>
          <button className="page-btn">3</button>
          <button className="page-btn">4</button>
          <button className="page-btn">5</button>
          <button className="page-btn">&gt;</button>
        </div>
      </div>
    </div>
  );
}
