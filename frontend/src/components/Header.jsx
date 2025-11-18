// src/components/Header.jsx
import "./Header.css";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.js";
import { getLogout } from "../feature/auth/authAPI.js";
import { getCartCount } from "../feature/cart/cartAPI.js";
import { resetCartCount } from "../feature/cart/cartSlice.js";
import { logoutNaver, initNaverLogin, getNaverLogin } from "../utils/naverLogin.js";

export default function Header() {
  const { user: authUser, isAuthenticated, ready, logout } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const cartCount = useSelector((state) => state.cart.cartCount);
  const [wishCount, setWishCount] = useState(0);
  
  // 장바구니 수량 표시 여부 (null이 아니고 0보다 클 때만)
  const showCartBadge = useMemo(() => {
    return cartCount !== null && cartCount > 0;
  }, [cartCount]);

  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(true);

  const [activeMenu, setActiveMenu] = useState(null); // 'women' | 'men' | ...
  const [menuTopPosition, setMenuTopPosition] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);

  const headerRef = useRef(null);

  /** 공용 MegaMenu 래퍼 */
  const MegaMenu = ({ id, active, top, cols = "2", children }) => (
    <div className={`mega-menu ${active === id ? "active" : ""}`} style={{ top: `${top}px` }}>
      <div className="container">
        <div className={`mega-menu-inner ${cols === "3" ? "cols-3" : ""}`}>{children}</div>
      </div>
    </div>
  );

  /** 검색/브랜드 더미 데이터 */
  const popularSearches = [
    { rank: 1, keyword: "에잇세컨즈", trend: null },
    { rank: 2, keyword: "빈폴레이디스", trend: null },
    { rank: 3, keyword: "단톤", trend: null },
    { rank: 4, keyword: "메종키츠네", trend: null },
    { rank: 5, keyword: "로메르", trend: null },
    { rank: 6, keyword: "빈폴키즈", trend: null },
    { rank: 7, keyword: "카디건", trend: null },
    { rank: 8, keyword: "꽁데가르송", trend: "up" },
    { rank: 9, keyword: "준지", trend: "down" },
    { rank: 10, keyword: "폴리즈클로젯", trend: "down" },
  ];
  const autocompleteKeywords = [
    "카디건","가방","가니","남자 가죽 자켓","여성 카디건","메종키츠네 카디건","남자 카디건",
    "발렌시아가","로메르 가방","에잇세컨즈 가방","구호","구호플러스","나이키","니트","니트",
    "단톤","데님","데님팬츠","드레스","띠어리","로고","로퍼","맨투맨","면바지","목도리","무스탕",
    "반팔티","발렌시아가 가방","백팩","뱀부백","부츠","블라우스","빈폴","빈폴레이디스","빈폴키즈",
    "사파리재킷","셔츠","스니커즈","슬랙스","아우터","앵클부츠","야상","에코백","원피스","울코트",
    "자켓","재킷","정장","조끼","청바지","체크셔츠","카라티","코트","크로스백","티셔츠","트렌치코트",
    "트레이닝복","파카","패딩","폴로셔츠","플리츠스커트","후드티","후드집업"
  ];
  const brandData = [
    { name: "GANNI", nameKr: "가니", link: "/brand/ganni" },
    { name: "GANISONG", nameKr: "가니송", link: "/brand/ganisong" },
    { name: "Wilhelmina Garcia", nameKr: "빌헬미나 가르시아", link: "/brand/wilhelmina-garcia" },
    { name: "에잇세컨즈", nameEn: "8SECONDS", link: "/brand/8seconds" },
    { name: "빈폴", nameEn: "BEANPOLE", link: "/brand/beanpole" },
    { name: "빈폴레이디스", nameEn: "BEANPOLE LADIES", link: "/brand/beanpole-ladies" },
    { name: "빈폴키즈", nameEn: "BEANPOLE KIDS", link: "/brand/beanpole-kids" },
    { name: "구호", nameEn: "KUHO", link: "/brand/kuho" },
    { name: "구호플러스", nameEn: "KUHO PLUS", link: "/brand/kuho-plus" },
    { name: "메종키츠네", nameEn: "MAISON KITSUNE", link: "/brand/maison-kitsune" },
    { name: "아미", nameEn: "AMI", link: "/brand/ami" },
    { name: "단톤", nameEn: "DANTON", link: "/brand/danton" },
    { name: "띠어리", nameEn: "THEORY", link: "/brand/theory" },
    { name: "로메르", nameEn: "LEMAIRE", link: "/brand/lemaire" },
    { name: "발렌시아가", nameEn: "BALENCIAGA", link: "/brand/balenciaga" },
    { name: "토리버치", nameEn: "TORY BURCH", link: "/brand/tory-burch" },
    { name: "꽁데가르송", nameEn: "COMME DES GARCONS", link: "/brand/comme-des-garcons" },
    { name: "준지", nameEn: "JUUN.J", link: "/brand/junji" },
  ];

  /** 카트/위시/검색 동기화(인증은 컨텍스트로만 처리) */
  useEffect(() => {
    const updateWishCount = () => {
      try {
        setWishCount((JSON.parse(localStorage.getItem("wishlist")) || []).length);
      } catch {
        setWishCount(0);
      }
    };
    const loadRecentSearches = () => {
      try {
        setRecentSearches(JSON.parse(localStorage.getItem("recentSearches")) || []);
      } catch {
        setRecentSearches([]);
      }
    };
    updateWishCount();
    loadRecentSearches();
    window.addEventListener("wishlistUpdated", updateWishCount);
    return () => window.removeEventListener("wishlistUpdated", updateWishCount);
  }, []);

  /** 장바구니 수량 초기 로드 및 로그아웃 시 리셋 */
  useEffect(() => {
    if (ready) {
      if (isAuthenticated && authUser?.email) {
        dispatch(getCartCount(authUser.email));
      } else {
        // 로그아웃 상태일 때 장바구니 수량 초기화
        dispatch(resetCartCount());
      }
    }
  }, [ready, isAuthenticated, authUser?.email, dispatch]);

  /** 헤더 bottom 좌표 → 메가메뉴 top */
  useEffect(() => {
    const computeMenuTop = () => {
      if (!headerRef.current) return;
      const { bottom } = headerRef.current.getBoundingClientRect();
      setMenuTopPosition(bottom);
    };
    computeMenuTop();
    window.addEventListener("resize", computeMenuTop);
    window.addEventListener("scroll", computeMenuTop);
    return () => {
      window.removeEventListener("resize", computeMenuTop);
      window.removeEventListener("scroll", computeMenuTop);
    };
  }, [bannerVisible, location.pathname]);

  /** 인증/네비 핸들러 */
  const handleLogout = async () => {
    try {
      await dispatch(getLogout());
    } catch {
      // API 실패해도 클라이언트 상태는 정리
    } finally {
      dispatch(resetCartCount());
      logout();
      // 네이버 로그아웃 인스턴스 준비 대기
      const waitNaverLogout = async () => {
        let naverLogin = getNaverLogin();
        if (!naverLogin) {
          try {
            naverLogin = await initNaverLogin(); // SDK 초기화 및 인스턴스 반환
          } catch (err) {
            console.warn("네이버 SDK 초기화 실패:", err);
            return;
          }
        }
        if (naverLogin) {
          logoutNaver(); // utils에 정의된 로그아웃 함수
        }
      };
      await waitNaverLogout();
      alert("로그아웃되었습니다.");
      navigate("/", { replace: true });
    }
  };

  const handleCartClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      alert("로그인이 필요합니다.");
      navigate("/login");
    }
  };
  const handleMyPageClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      alert("로그인이 필요합니다.");
      navigate("/login");
    }
  };

  /** 검색 */
  const filteredKeywords = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return autocompleteKeywords.filter((k) => k.toLowerCase().includes(q)).slice(0, 10);
  }, [searchQuery]);

  const filteredBrands = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return brandData
      .filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          (b.nameKr && b.nameKr.toLowerCase().includes(q)) ||
          (b.nameEn && b.nameEn.toLowerCase().includes(q))
      )
      .slice(0, 10);
  }, [searchQuery]);

  const handleSearch = (keyword) => {
    const raw = (keyword || "").trim();
    if (!raw) return;
    try {
      let recent = JSON.parse(localStorage.getItem("recentSearches")) || [];
      recent = recent.filter((item) => item !== raw);
      recent.unshift(raw);
      localStorage.setItem("recentSearches", JSON.stringify(recent.slice(0, 10)));
      setRecentSearches(recent.slice(0, 10));
    } catch {}
    navigate(`/search/${encodeURIComponent(raw)}`);
    setSearchModalOpen(false);
  };

  return (
    <>
      {/* Mega overlay */}
      {activeMenu && (
        <div
          className="mega-menu-overlay"
          style={{ top: `${menuTopPosition}px` }}
          onClick={() => setActiveMenu(null)}
        />
      )}

      {/* Top banner */}
      {bannerVisible && (
        <div className="top-banner">
          <div className="container">
            <span>🎉 신규 회원 가입시 10,000원 쿠폰 즉시 지급! </span>
            <Link to="/signup">회원가입 하러 가기 →</Link>
            <button
              className="banner-close"
              onClick={() => setBannerVisible(false)}
              aria-label="배너 닫기"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="header" ref={headerRef}>
        {/* user strip */}
        {/* 네이버 SDK가 로그인 버튼을 렌더링할 컨테이너 (React 관리 X, 숨김 처리) */}
        <div id="naverIdLogin" style={{ display: "none" }} />
        <div className="user-menu-wrapper">
          <div className="container">
            <div className="user-menu">
              <Link to="/mypage" onClick={handleMyPageClick}>
                마이페이지
                {isAuthenticated && authUser?.name ? ` (${authUser.name}님)` : ""}
              </Link>
              {ready && (
                isAuthenticated ? (
                  <button onClick={handleLogout} className="logout-btn">로그아웃</button>
                ) : (
                  <Link to="/login">로그인</Link>
                )
              )}
            </div>
          </div>
        </div>

        {/* logo & actions */}
        <div className="logo-section">
          <div className="container">
            <div className="logo-section-inner">
              <Link to="/" className="logo">
                <img src="https://ext.same-assets.com/947818454/418726284.svg" alt="SSF SHOP" />
              </Link>

              <div className="header-right">
                <div className="header-actions">
                  <button className="search-btn" aria-label="검색" onClick={() => setSearchModalOpen(true)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                      <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>

                  {/* Wish → /wishlist */}
                  <Link to="/wishlist" className="wishlist-btn" aria-label="위시리스트">
                    {wishCount > 0 && <span className="cart-count">{wishCount}</span>}
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      />
                    </svg>
                  </Link>

                  <Link to="/cart" className="cart-btn" aria-label="장바구니" onClick={handleCartClick}>
                    {showCartBadge && <span className="cart-count">{cartCount}</span>}
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M9 22c.553 0 1-.448 1-1s-.447-1-1-1-1 .448-1 1 .447 1 1 1Z" fill="currentColor" />
                      <path d="M20 22c.553 0 1-.448 1-1s-.447-1-1-1-1 .448-1 1 .447 1 1 1Z" fill="currentColor" />
                      <path
                        d="M1 1h4l2.68 13.39c.09.46.34.874.71 1.168.37.294.83.45 1.3.442h9.72c.47.009.928-.147 1.294-.442.366-.294.616-.708.708-1.168L23 6H6"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      />
                    </svg>
                  </Link>
                </div>

                <div className="nav-divider"></div>

                <div className="brand-logos">
                  <Link to="/brand/10-corso-como">
                    <img src="https://ext.same-assets.com/947818454/451353350.svg" alt="10 CORSO COMO" />
                  </Link>
                  <Link to="/brand/beaker">
                    <img src="https://ext.same-assets.com/947818454/863943049.svg" alt="BEAKER" />
                  </Link>
                  <Link to="/brand/another">
                    <img src="https://ext.same-assets.com/947818454/2516667277.svg" alt="ANOTHER#" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== NAVIGATION ===================== */}
        <div className="nav-section">
          <div className="container">
            <div className="nav-wrapper">
              <nav className="product-nav" onMouseLeave={() => setActiveMenu(null)}>
                <ul>
                  {/* 여성 */}
                  <li className={`nav-item ${activeMenu === "women" ? "open" : ""}`} onMouseEnter={() => setActiveMenu("women")}>
                    <Link to="/women">여성</Link>
                    <MegaMenu id="women" active={activeMenu} top={menuTopPosition} cols="3">
                      <div className="mega-menu-column">
                        <h4>의류</h4>
                        <ul>
                          <li><Link to="/women/outer">아우터</Link></li>
                          <li><Link to="/women/jacket">재킷/베스트</Link></li>
                          <li><Link to="/women/knit">니트</Link></li>
                          <li><Link to="/women/shirt">셔츠/블라우스</Link></li>
                          <li><Link to="/women/tshirt">티셔츠</Link></li>
                          <li><Link to="/women/onepiece">원피스</Link></li>
                          <li><Link to="/women/pants">팬츠</Link></li>
                          <li><Link to="/women/skirt">스커트</Link></li>
                        </ul>
                      </div>
                    </MegaMenu>
                  </li>

                  {/* 남성 */}
                  <li className={`nav-item ${activeMenu === "men" ? "open" : ""}`} onMouseEnter={() => setActiveMenu("men")}>
                    <Link to="/men">남성</Link>
                    <MegaMenu id="men" active={activeMenu} top={menuTopPosition} cols="3">
                      <div className="mega-menu-column">
                        <h4>의류</h4>
                        <ul>
                          <li><Link to="/men/outer">아우터</Link></li>
                          <li><Link to="/men/suit">정장</Link></li>
                          <li><Link to="/men/jacket">재킷/베스트</Link></li>
                          <li><Link to="/men/shirt">셔츠</Link></li>
                          <li><Link to="/men/knit">니트</Link></li>
                          <li><Link to="/men/tshirt">티셔츠</Link></li>
                          <li><Link to="/men/pants">팬츠</Link></li>
                        </ul>
                      </div>
                    </MegaMenu>
                  </li>

                  {/* 키즈 */}
                  <li className={`nav-item ${activeMenu === "kids" ? "open" : ""}`} onMouseEnter={() => setActiveMenu("kids")}>
                    <Link to="/kids">키즈</Link>
                    <MegaMenu id="kids" active={activeMenu} top={menuTopPosition}>
                      <div className="mega-menu-column">
                        <h4>메뉴</h4>
                        <ul>
                          <li><Link to="/kids/new">신상품</Link></li>
                          <li><Link to="/kids/boy">남아</Link></li>
                          <li><Link to="/kids/girl">여아</Link></li>
                          <li><Link to="/kids/baby">베이비</Link></li>
                        </ul>
                      </div>
                    </MegaMenu>
                  </li>

                  {/* 럭셔리 */}
                  <li className={`nav-item ${activeMenu === "luxury" ? "open" : ""}`} onMouseEnter={() => setActiveMenu("luxury")}>
                    <Link to="/luxury">럭셔리</Link>
                    <MegaMenu id="luxury" active={activeMenu} top={menuTopPosition}>
                      <div className="mega-menu-column">
                        <h4>카테고리</h4>
                        <ul>
                          <li><Link to="/luxury/new">신상품</Link></li>
                          <li><Link to="/luxury/women-apparel">여성의류</Link></li>
                          <li><Link to="/luxury/women-acc">여성 패션잡화</Link></li>
                          <li><Link to="/luxury/men-apparel">남성의류</Link></li>
                          <li><Link to="/luxury/men-bag-wallet">남성 패션잡화</Link></li>
                        </ul>
                      </div>
                    </MegaMenu>
                  </li>

                  {/* 백&슈즈 */}
                  <li className={`nav-item ${activeMenu === "shoes" ? "open" : ""}`} onMouseEnter={() => setActiveMenu("shoes")}>
                    <Link to="/shoes">백&슈즈</Link>
                    <MegaMenu id="shoes" active={activeMenu} top={menuTopPosition}>
                      <div className="mega-menu-column">
                        <h4>카테고리</h4>
                        <ul>
                          <li><Link to="/shoes/new">신상품</Link></li>
                          <li><Link to="/shoes/women-bag">여성 가방</Link></li>
                          <li><Link to="/shoes/women-wallet">여성 지갑</Link></li>
                          <li><Link to="/shoes/women-shoes">여성 슈즈</Link></li>
                          <li><Link to="/shoes/men-bag">남성 가방</Link></li>
                          <li><Link to="/shoes/men-wallet">남성 지갑</Link></li>
                          <li><Link to="/shoes/men-shoes">남성 슈즈</Link></li>
                          <li><Link to="/shoes/travel">여행 용품</Link></li>
                        </ul>
                      </div>
                    </MegaMenu>
                  </li>

                  {/* 스포츠 */}
                  <li className={`nav-item ${activeMenu === "sports" ? "open" : ""}`} onMouseEnter={() => setActiveMenu("sports")}>
                    <Link to="/sports">스포츠</Link>
                    <MegaMenu id="sports" active={activeMenu} top={menuTopPosition}>
                      <div className="mega-menu-column">
                        <h4>카테고리</h4>
                        <ul>
                          <li><Link to="/sports/new">신상품</Link></li>
                          <li><Link to="/sports/men-apparel">남성의류</Link></li>
                          <li><Link to="/sports/women-apparel">여성의류</Link></li>
                          <li><Link to="/sports/shoes">슈즈</Link></li>
                          <li><Link to="/sports/bag">가방</Link></li>
                          <li><Link to="/sports/gear">스포츠용품</Link></li>
                          <li><Link to="/sports/camping">캠핑용품</Link></li>
                          <li><Link to="/sports/swim">스윔/비치웨어</Link></li>
                        </ul>
                      </div>
                    </MegaMenu>
                  </li>

                  {/* 골프 */}
                  <li className={`nav-item ${activeMenu === "golf" ? "open" : ""}`} onMouseEnter={() => setActiveMenu("golf")}>
                    <Link to="/golf">골프</Link>
                    <MegaMenu id="golf" active={activeMenu} top={menuTopPosition}>
                      <div className="mega-menu-column">
                        <h4>카테고리</h4>
                        <ul>
                          <li><Link to="/golf/balls">골프공</Link></li>
                          <li><Link to="/golf/women-apparel">여성 골프의류</Link></li>
                          <li><Link to="/golf/women-shoes">여성 골프슈즈</Link></li>
                          <li><Link to="/golf/men-apparel">남성 골프의류</Link></li>
                          <li><Link to="/golf/men-shoes">남성 골프슈즈</Link></li>
                          <li><Link to="/golf/club">골프클럽</Link></li>
                          <li><Link to="/golf/bag">골프백</Link></li>
                          <li><Link to="/golf/acc">골프ACC</Link></li>
                        </ul>
                      </div>
                    </MegaMenu>
                  </li>

                  {/* 뷰티 */}
                  <li className={`nav-item ${activeMenu === "beauty" ? "open" : ""}`} onMouseEnter={() => setActiveMenu("beauty")}>
                    <Link to="/beauty">뷰티</Link>
                    <MegaMenu id="beauty" active={activeMenu} top={menuTopPosition}>
                      <div className="mega-menu-column">
                        <h4>카테고리</h4>
                        <ul>
                          <li><Link to="/beauty/new">신상품</Link></li>
                          <li><Link to="/beauty/skincare">스킨케어</Link></li>
                          <li><Link to="/beauty/makeup">메이크업</Link></li>
                          <li><Link to="/beauty/perfume">향수</Link></li>
                        </ul>
                      </div>
                    </MegaMenu>
                  </li>

                  {/* 라이프 */}
                  <li className={`nav-item ${activeMenu === "life" ? "open" : ""}`} onMouseEnter={() => setActiveMenu("life")}>
                    <Link to="/life">라이프</Link>
                    <MegaMenu id="life" active={activeMenu} top={menuTopPosition}>
                      <div className="mega-menu-column">
                        <h4>카테고리</h4>
                        <ul>
                          <li><Link to="/life/furniture">가구</Link></li>
                          <li><Link to="/life/lighting">조명</Link></li>
                          <li><Link to="/life/home-deco">홈데코</Link></li>
                          <li><Link to="/life/home-fragrance">홈 프레그런스</Link></li>
                          <li><Link to="/life/pet">반려동물</Link></li>
                          <li><Link to="/life/food">식품</Link></li>
                          <li><Link to="/life/desk-design">데스크/디자인문구</Link></li>
                          <li><Link to="/life/appliance">가전</Link></li>
                          <li><Link to="/life/car">자동차용품</Link></li>
                          <li><Link to="/life/digital">디지털</Link></li>
                          <li><Link to="/life/art">아트/컬처</Link></li>
                          <li><Link to="/life/organize">수납/정리</Link></li>
                          <li><Link to="/life/giftcard">상품권</Link></li>
                        </ul>
                      </div>
                    </MegaMenu>
                  </li>

                  {/* 아울렛 */}
                  <li className={`nav-item ${activeMenu === "outlet" ? "open" : ""}`} onMouseEnter={() => setActiveMenu("outlet")}>
                    <Link to="/outlet">아울렛</Link>
                    <MegaMenu id="outlet" active={activeMenu} top={menuTopPosition}>
                      <div className="mega-menu-column">
                        <h4>빠른보기</h4>
                        <ul>
                          <li><Link to="/outlet/women">여성</Link></li>
                          <li><Link to="/outlet/men">남성</Link></li>
                          <li><Link to="/outlet/kids">키즈</Link></li>
                          <li><Link to="/outlet/luxury">럭셔리</Link></li>
                          <li><Link to="/outlet/shoes">백&슈즈</Link></li>
                          <li><Link to="/outlet/sports">스포츠</Link></li>
                          <li><Link to="/outlet/golf">골프</Link></li>
                          <li><Link to="/outlet/beauty">뷰티</Link></li>
                          <li><Link to="/outlet/life">라이프</Link></li>
                        </ul>
                      </div>
                    </MegaMenu>
                  </li>
                </ul>
              </nav>

              <div className="nav-divider"></div>

              <nav className="sub-nav" onMouseEnter={() => setActiveMenu(null)}>
                <ul>
                  <li><Link to="/ranking">랭킹</Link></li>
                  <li><Link to="/brands">브랜드</Link></li>
                  <li><Link to="/magazine">매거진</Link></li>
                  <li><Link to="/market">플리마켓</Link></li>
                  <li><Link to="/special" className="nav-link-special">기획전</Link></li>
                  <li><Link to="/event" className="nav-link-special">이벤트</Link></li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Button */}
      <button className="mobile-menu-btn" aria-label="메뉴" onClick={() => setMobileMenuOpen(true)}>
        <span></span><span></span><span></span>
      </button>

      {/* Search Modal */}
      {searchModalOpen && (
        <div
          className="search-overlay"
          style={{ top: `${menuTopPosition}px` }}
          onClick={(e) => {
            if (e.target.className === "search-overlay") {
              setSearchModalOpen(false);
              setSearchQuery("");
            }
          }}
        >
          <div className="search-content">
            <div className="container">
              <div className="search-header">
                <form
                  className="search-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSearch(searchQuery);
                  }}
                >
                  <input
                    type="text"
                    placeholder="검색어를 입력하세요"
                    className="search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      className="clear-input-btn"
                      onClick={() => setSearchQuery("")}
                      aria-label="검색어 지우기"
                    >
                      ×
                    </button>
                  )}
                  <button type="submit" className="search-submit" aria-label="검색">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                      <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>
                </form>
                <button
                  className="search-close"
                  onClick={() => {
                    setSearchModalOpen(false);
                    setSearchQuery("");
                  }}
                  aria-label="닫기"
                >
                  ×
                </button>
              </div>

              <div className="search-body">
                {searchQuery.trim() ? (
                  <>
                    <div className="search-section autocomplete-keywords">
                      {filteredKeywords.length > 0 ? (
                        <ul className="autocomplete-list">
                          {filteredKeywords.map((keyword, index) => (
                            <li key={index}>
                              <button
                                className={`autocomplete-keyword ${index === 0 ? "first" : ""}`}
                                onClick={() => handleSearch(keyword)}
                              >
                                {keyword}
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="empty-message">검색 결과가 없습니다.</p>
                      )}
                    </div>

                    <div className="search-section autocomplete-brands">
                      <h3>브랜드</h3>
                      {filteredBrands.length > 0 ? (
                        <ul className="brand-list-autocomplete">
                          {filteredBrands.map((brand, index) => (
                            <li key={index}>
                              <Link to={brand.link} className="brand-item" onClick={() => setSearchModalOpen(false)}>
                                {brand.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="empty-message">검색 결과가 없습니다.</p>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="search-section recent-searches">
                      <h3>최근검색어</h3>
                      {recentSearches.length === 0 ? (
                        <p className="empty-message">최근 검색어가 없습니다.</p>
                      ) : (
                        <>
                          <ul className="search-list">
                            {recentSearches.map((keyword, index) => (
                              <li key={index}>
                                <button className="search-keyword" onClick={() => handleSearch(keyword)}>{keyword}</button>
                                <button
                                  className="remove-btn"
                                  onClick={() => {
                                    try {
                                      let recent = JSON.parse(localStorage.getItem("recentSearches")) || [];
                                      recent = recent.filter((i) => i !== keyword);
                                      localStorage.setItem("recentSearches", JSON.stringify(recent));
                                      setRecentSearches(recent);
                                    } catch {}
                                  }}
                                  aria-label="삭제"
                                >
                                  ×
                                </button>
                              </li>
                            ))}
                          </ul>
                          <button
                            className="clear-all-btn"
                            onClick={() => {
                              try {
                                localStorage.removeItem("recentSearches");
                                setRecentSearches([]);
                              } catch {}
                            }}
                          >
                            전체 삭제
                          </button>
                        </>
                      )}
                    </div>

                    <div className="search-section popular-searches">
                      <div className="section-header">
                        <h3>인기검색어</h3>
                        <div className="header-actions">
                          <span className="update-time">19:00 업데이트</span>
                          <Link to="/ranking" className="view-all">전체보기 &gt;</Link>
                        </div>
                      </div>
                      <ul className="popular-list">
                        {popularSearches.map((item) => (
                          <li key={item.rank}>
                            <span className="rank">{item.rank}</span>
                            <button className="search-keyword" onClick={() => handleSearch(item.keyword)}>{item.keyword}</button>
                            {item.trend === "up" && <span className="trend trend-up">▲</span>}
                            {item.trend === "down" && <span className="trend trend-down">▼</span>}
                            {!item.trend && <span className="trend trend-none">―</span>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={`mobile-menu ${mobileMenuOpen ? "active" : ""}`}>
          <div className="mobile-menu-header">
            <Link to="/" className="mobile-logo">
              <img src="https://ext.same-assets.com/947818454/418726284.svg" alt="SSF SHOP" />
            </Link>
            <button className="mobile-menu-close" onClick={() => setMobileMenuOpen(false)}>&times;</button>
          </div>
          <nav className="mobile-nav">
            <ul>
              <li><Link to="/women">여성</Link></li>
              <li><Link to="/men">남성</Link></li>
              <li><Link to="/kids">키즈</Link></li>
              <li><Link to="/luxury">럭셔리</Link></li>
              <li><Link to="/shoes">백&슈즈</Link></li>
              <li><Link to="/sports">스포츠</Link></li>
              <li><Link to="/golf">골프</Link></li>
              <li><Link to="/beauty">뷰티</Link></li>
              <li><Link to="/life">라이프</Link></li>
              <li><Link to="/issue">이슈</Link></li>
            </ul>
          </nav>
        </div>
      )}
    </>
  );
}
