import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

// 브랜드 로고 이미지 import
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

  // ---- NEW: 위시리스트 상태 (id 셋만 캐시해서 빠르게 렌더) ----
  const [wishIds, setWishIds] = useState(() => {
    try {
      const w = JSON.parse(localStorage.getItem("wishlist")) || [];
      return new Set(w.map((it) => it.id));
    } catch {
      return new Set();
    }
  });

  const totalPages = 3; // 9장 / 3장씩

  const slides = useMemo(
    () => [
      { title: "8SECONDS", subtitle: "리즈와 함께면 지금이 리즈", desc: "BEYOND THE REBELS · 2nd Drop", image: "/icons/main1.webp" },
      { title: "KUHO PLUS", subtitle: "25 Winter Collection", desc: "혜택이 넘치는 세싸패 LIVE", image: "/icons/main2.webp" },
      { title: "J RIUM", subtitle: "나를 안는 부드러움", desc: "~38% + 7% + 5만포인트 + 사은품", image: "/icons/main3.webp" },

      { title: "COS", subtitle: "다가온 가을의 순간", desc: "변화하는 계절의 감각적인 스타일링", image: "/icons/main4.webp" },
      { title: "UGG & REQINS", subtitle: "어쩔 수 없이 걷고 싶은 계절", desc: "어그, 호갱 등 인기 슈즈 특가", image: "/icons/main5.webp" },
      { title: "ROUGE & LOUNGE", subtitle: "인플루언서가 탐낸 실루엣", desc: "F/W 레더 백 단독 할인", image: "/icons/main6.webp" },

      { title: "LEMAIRE", subtitle: "코지 니트 컬렉션", desc: "FW 신상품 얼리버드 20%", image: "/icons/main7.webp" },
      { title: "BEANPOLE", subtitle: "따뜻한 데일리 아우터", desc: "시즌오프 최대 60% + 쿠폰", image: "/icons/main8.webp" },
      { title: "Theory", subtitle: "소프트 캐시미어", desc: "한정 수량 특별가", image: "/icons/main9.webp" },
    ],
    []
  );

  useEffect(() => {
    const t = setInterval(() => setPage((p) => (p + 1) % totalPages), 5000);
    return () => clearInterval(t);
  }, []);

  const prev = () => setPage((p) => (p - 1 + totalPages) % totalPages);
  const next = () => setPage((p) => (p + 1) % totalPages);

  const productCategories = ["니트 카디건", "백 & 슈즈", "쥬얼리 & 액세서리", "뷰티 & 향수", "코스메틱", "키즈 & 베이비"];
  const rankingCategories = ["여성", "남성", "키즈", "럭셔리", "백&슈즈", "스포츠", "골프", "뷰티", "라이프"];

  // ---- NEW: 홈 상품 데이터 (아이디/가격/할인/이미지 포함) ----
  const homeProducts = useMemo(
    () => [
      {
        id: "P-ANGGAE-1",
        brand: "anggae",
        name: "Smocked Knit Cardigan - Grey",
        image: "/images/3207359177.jpeg",
        price: 159000,
      },
      {
        id: "P-8SEC-1",
        brand: "8 seconds",
        name: "울100 카디건 - 카키",
        image: "/images/1010207927.jpeg",
        price: 59900,
        originalPrice: 69900,
        discountLabel: "10%",
      },
      {
        id: "P-MAIA-1",
        brand: "Maia",
        name: "Two-Way Cardigan - French Roast",
        image: "/images/3793950654.jpeg",
        priceLabel: "품절",
      },
      {
        id: "P-320S-1",
        brand: "320Showroom",
        name: "V-Neck Button-Up Wool Alpaca Knit Cardigan",
        image: "/images/3826030000.jpeg",
        price: 64800,
        originalPrice: 79000,
        discountLabel: "10%",
      },
      {
        id: "P-HANE-1",
        brand: "HANE",
        name: "플라테카드 자켓 울 니트 가디건_Charcoal",
        image: "/images/635366670.jpeg",
        price: 118800,
        originalPrice: 156000,
        discountLabel: "26%",
      },
    ],
    []
  );

  // ---- NEW: 위시리스트 헬퍼 ----
  const isWishlisted = (id) => wishIds.has(id);

  const toggleWishlist = (product) => {
    try {
      let list = JSON.parse(localStorage.getItem("wishlist")) || [];
      const exists = list.some((it) => it.id === product.id);

      if (exists) {
        list = list.filter((it) => it.id !== product.id);
      } else {
        const payload = {
          id: product.id,
          name: product.name,
          brand: product.brand,
          image: product.image,
          price: product.price ?? null,
          originalPrice: product.originalPrice ?? null,
          priceLabel: product.priceLabel ?? null,
          discountLabel: product.discountLabel ?? null,
        };
        list.push(payload);
      }

      localStorage.setItem("wishlist", JSON.stringify(list));
      // 로컬 상태도 즉시 반영
      setWishIds(new Set(list.map((it) => it.id)));
      // 헤더 카운트 갱신용 커스텀 이벤트
      try { window.dispatchEvent(new Event("wishlistUpdated")); } catch {}
    } catch (e) {
      console.error("Failed to update wishlist", e);
    }
  };

  // 브랜드 데이터 (총 35개 브랜드)
  const brandData = [
    // Page 1 (1-12)
    { logo: brand8Seconds, name: "에잇세컨즈", link: "/brand/8seconds", isImage: true },
    { logo: brandBeanpole, name: "빈폴", link: "/brand/beanpole", isImage: true },
    { logo: brandBeaker, name: "비이커", link: "/brand/beaker", isImage: true },
    { logo: brandKuho, name: "구호", link: "/brand/kuho", isImage: true },
    { logo: brandIsseyMiyake, name: "이세이미야케", link: "/brand/issey-miyake", isImage: true },
    { logo: brandMaisonKitsune, name: "메종키츠네", link: "/brand/maison-kitsune", isImage: true },
    { logo: brandTheory, name: "띠어리", link: "/brand/theory", isImage: true },
    { logo: brandKuhoPlus, name: "구호플러스", link: "/brand/kuho-plus", isImage: true },
    { logo: brandCommeDesGarcons, name: "꼼데가르송", link: "/brand/comme-des-garcons", isImage: true },
    { logo: brandPatagonia, name: "파타고니아", link: "/brand/patagonia", isImage: true },
    { logo: brandSportyRich, name: "스포티앤리치", link: "/brand/sporty-rich", isImage: true },
    { logo: brandSie, name: "시에", link: "/brand/sie", isImage: true },

    // Page 2 (13-24)
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

    // Page 3 (25-35)
    { logo: brandCanadaGoose, name: "캐나다구스", link: "/brand/canada-goose", isImage: true },
    { logo: brandHera, name: "헤라", link: "/brand/hera", isImage: true },
    { logo: brandGalaxyLifestyle, name: "갤럭시라이프스타일", link: "/brand/galaxy-lifestyle", isImage: true },
    { logo: brandRebaige, name: "르베이지", link: "/brand/rebaige", isImage: true },
    { logo: brandToryBurch, name: "토리버치", link: "/brand/tory-burch", isImage: true },
    { logo: brandGalaxy, name: "갤럭시", link: "/brand/galaxy", isImage: true },
    { logo: brandLemaire, name: "르메르", link: "/brand/lemaire", isImage: true },
    { logo: brandFitflop, name: "핏플랍", link: "/brand/fitflop", isImage: true },
    { logo: brandGanni, name: "가니", link: "/brand/ganni", isImage: true },
    { logo: brandRagBone, name: "랙앤본", link: "/brand/rag-bone", isImage: true },
    { logo: brandSandsound, name: "샌드사운드", link: "/brand/sandsound", isImage: true }
  ];

  const brandsPerPage = 12;
  const totalBrandPages = Math.ceil(brandData.length / brandsPerPage);
  const currentBrands = brandData.slice(brandPage * brandsPerPage, (brandPage + 1) * brandsPerPage);

  const handleBrandPrev = () => {
    setBrandPage((prev) => (prev - 1 + totalBrandPages) % totalBrandPages);
  };

  const handleBrandNext = () => {
    setBrandPage((prev) => (prev + 1) % totalBrandPages);
  };

  // 가격 포맷
  const formatPrice = (n) => (typeof n === "number" ? n.toLocaleString() : n);

  return (
    <>
      <main className="main-content">
        {/* === 3장씩 보이는 슬라이드 === */}
        <section className="tri-hero">
          <div className="tri-hero__container">
            <div className="tri-hero__wrap" style={{ transform: `translateX(-${page * 100}%)` }}>
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
            <button className="tri-hero__nav tri-hero__prev" onClick={prev} aria-label="이전">
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <button className="tri-hero__nav tri-hero__next" onClick={next} aria-label="다음">
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path d="M9 18l6-6-6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <div className="tri-hero__dots">
              {[0, 1, 2].map((n) => (
                <span key={n} className={`tri-dot ${page === n ? "active" : ""}`} onClick={() => setPage(n)} />
              ))}
            </div>
          </div>
        </section>

        {/* === 인기 브랜드 === */}
        <section className="popular-brands">
          <div className="container">
            <h2 className="section-title">인기 브랜드</h2>

            <div className="brands-slider-wrapper">
              <div className="brands-grid">
                {currentBrands.map((brand, index) => (
                  <Link key={index} to={brand.link} className="brand-card">
                    <div className="brand-logo-box">
                      {brand.isImage ? (
                        <img src={brand.logo} alt={brand.name} className="brand-logo-img" />
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
                  <path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
              <span className="pagination-text">{brandPage + 1} / {totalBrandPages}</span>
              <button
                className="pagination-arrow"
                onClick={handleBrandNext}
                aria-label="다음 페이지"
              >
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path d="M9 18l6-6-6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* === 이벤트 배너 === */}
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
                <img src="/images/1642450336.jpeg" alt="앱에서 첫 로그인하고 쿠폰 받기" />
                <div className="event-content">
                  <h3>앱에서 첫 로그인하고 쿠폰 받기</h3>
                  <p>1만원 쿠폰 즉시 지급</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Grid Section */}
        <section className="product-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">고마움과 안부, 마음껏 전할 시간</h2>

              {/* ---- NEW: 위시리스트 페이지로 가는 링크 ---- */}
              <div className="category-tabs">
                {productCategories.map((category, index) => (
                  <button
                    key={index}
                    className={`tab-btn ${index === activeProductTab ? 'active' : ''}`}
                    onClick={() => setActiveProductTab(index)}
                  >
                    {category}
                  </button>
                ))}
                <Link to="/wishlist" className="tab-btn" style={{ textDecoration: "none" }}>
                  위시리스트 보러가기 →
                </Link>
              </div>
            </div>

            <div className="product-grid">
              {homeProducts.map((p) => {
                const wished = isWishlisted(p.id);
                return (
                  <div className="product-card" key={p.id}>
                    <div className="product-image">
                      <img src={p.image} alt={p.name} />
                      {/* ---- NEW: 하트 버튼 (토글) ---- */}
                      <button
                        className={`wishlist-btn ${wished ? "active" : ""}`}
                        aria-pressed={wished}
                        aria-label={wished ? "위시에서 제거" : "위시에 추가"}
                        onClick={() => toggleWishlist(p)}
                        title={wished ? "위시에 담김" : "위시에 담기"}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                            stroke="currentColor"
                            strokeWidth="2"
                            // 활성화 시 하트 채우기
                            fill={wished ? "currentColor" : "none"}
                          />
                        </svg>
                      </button>
                      {p.discountLabel && <span className="discount-badge">{p.discountLabel}</span>}
                    </div>
                    <div className="product-info">
                      <span className="brand">{p.brand}</span>
                      <h3 className="product-name">{p.name}</h3>
                      <div className="price">
                        {p.originalPrice && <span className="original-price">{formatPrice(p.originalPrice)}</span>}
                        <span className="current-price">
                          {p.priceLabel ? p.priceLabel : formatPrice(p.price)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Ranking Section */}
        <section className="ranking-section">
          <div className="container">
            <h2 className="section-title">랭킹</h2>
            <div className="ranking-tabs">
              {rankingCategories.map((category, index) => (
                <button
                  key={index}
                  className={`tab-btn ${index === activeRankingTab ? 'active' : ''}`}
                  onClick={() => setActiveRankingTab(index)}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="ranking-grid">
              <div className="ranking-item">
                <span className="rank">1</span>
                <img src="/images/3206396286.jpeg" alt="SAMSONITE" />
                <div className="item-info">
                  <h4>SAMSONITE</h4>
                  <p>[캠소나이트] OCLITE 캐리어 55/68(2024년형) 2종세트 4종택1</p>
                  <div className="price">
                    <span className="discount">59%</span>
                    <strong>197,100</strong>
                  </div>
                </div>
              </div>

              <div className="ranking-item">
                <span className="rank">2</span>
                <img src="/images/357450008.jpeg" alt="FITFLOP" />
                <div className="item-info">
                  <h4>FITFLOP</h4>
                  <p>[핏플랍] 여성 벨트 메리제인 탈레미나 블랙루소스 - 톰 플랙</p>
                  <div className="price">
                    <span className="discount">5%</span>
                    <strong>246,050</strong>
                  </div>
                </div>
              </div>

              <div className="ranking-item">
                <span className="rank">3</span>
                <img src="/images/1491953271.jpeg" alt="KUHO" />
                <div className="item-info">
                  <h4>KUHO</h4>
                  <p>[BINA] Nylon Buckle Point Shoulder Bag - Black</p>
                  <div className="price">
                    <span className="discount">20%</span>
                    <strong>238,400</strong>
                  </div>
                </div>
              </div>

              <div className="ranking-item">
                <span className="rank">4</span>
                <img src="/images/573690851.jpeg" alt="LEMAIRE" />
                <div className="item-info">
                  <h4>LEMAIRE</h4>
                  <p>[UNISEX] Croissant Coin Purse - Dark Chocolate</p>
                  <div className="price">
                    <strong>1,980,000</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Brands Section */}
        <section className="featured-brands">
          <div className="container">
            <h2 className="section-title">주목할 브랜드</h2>
            <div className="featured-grid">
              <div className="featured-card">
                <img src="/images/1119019333.jpeg" alt="anggae" />
                <div className="featured-content">
                  <h3>anggae</h3>
                  <p>25F/W 3rd Drop</p>
                  <p className="subtitle">일상에 스며들 가을의 설레임</p>
                  <Link to="/brand/anggae" className="featured-link">기획전 바로가기 →</Link>
                </div>
              </div>

              <div className="featured-card">
                <img src="/images/578281922.jpeg" alt="anggae" />
                <div className="featured-products">
                  <div className="mini-product">
                    <img src="/images/1202455836.jpeg" alt="anggae Ribbed Snake Cardigan" />
                    <span className="brand">anggae</span>
                    <span className="name">Ribbed Snake Cardigan - Black</span>
                    <strong>189,000</strong>
                  </div>
                  <div className="mini-product">
                    <img src="/images/3859394708.jpeg" alt="anggae Off Shoulder Pullover" />
                    <span className="brand">anggae</span>
                    <span className="name">Off Shoulder Pullover - Black</span>
                    <strong>159,000</strong>
                  </div>
                </div>
              </div>

              <div className="featured-card">
                <img src="/images/3086143679.jpeg" alt="VOLVIK" />
                <div className="featured-content">
                  <h3>VOLVIK</h3>
                  <p>혜택이 불어오는</p>
                  <p className="subtitle">필드를 즐길 시간</p>
                  <Link to="/brand/volvik" className="featured-link">기획전 바로가기 →</Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Brand Story Section */}
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
