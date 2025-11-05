// src/pages/CategoryPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CATEGORY_DATA } from "../data/categoryData";
import { getProductsByCategory } from "../data/productData";
import { productKey } from "../hooks/useWishlist";
import "./Page.css";
import "../styles/CategoryPage.css";

// 홈과 동일한 로컬스토리지 키
const WISHLIST_KEY = "wishlist";

// 홈과 동일한 포맷으로 읽기/쓰기
const readWishlist = () => {
  try { return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || []; }
  catch { return []; }
};
const writeWishlist = (arr) => {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(arr));
};

// 이미지 경로 보정(그대로)
const srcOf = (p) => {
  const url = p?.image || p?.img || "";
  if (!url) return `${process.env.PUBLIC_URL}/images/placeholder.png`;
  if (/^https?:\/\//i.test(url)) return url;
  const cleaned = url.replace(/^\.?\/*/, "");
  return cleaned.startsWith("images/")
    ? `${process.env.PUBLIC_URL}/${cleaned}`
    : `${process.env.PUBLIC_URL}/images/${cleaned}`;
};

// 가격 포맷(그대로)
const formatPrice = (v) => {
  const n = typeof v === "number" ? v : Number(String(v).replace(/[^\d]/g, "")) || 0;
  return n.toLocaleString() + "원";
};

// id 없을 수 있으니 보정
const pidOf = (p, idx) => p?.id ?? p?.code ?? p?.pid ?? productKey(p) ?? `cat-${idx}`;

export default function CategoryPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const pathname = location.pathname;
  const pathParts = pathname.split("/").filter(Boolean);
  const categoryKey = pathParts[0];
  const subcategoryKey = pathParts[1] || "main";

  const categoryData = CATEGORY_DATA[categoryKey];

  const [activeTab, setActiveTab] = useState("");
  const [sortBy, setSortBy] = useState("인기상품순(전체)");
  const [products, setProducts] = useState([]);

  // ✅ 홈과 똑같이: wishlist를 상태로 들고, 로컬스토리지에도 저장
  const [wishlist, setWishlist] = useState(() => readWishlist());
  const wishSet = useMemo(() => new Set(wishlist.map((it) => it.id)), [wishlist]);

  useEffect(() => {
    if (!categoryData) return;
    const match = categoryData.subcategories.find((s) => s.path === pathname);
    setActiveTab(match ? match.name : categoryData.subcategories[0].name);
    setProducts(getProductsByCategory(categoryKey, subcategoryKey) || []);
  }, [pathname, categoryKey, subcategoryKey, categoryData]);

  // ✅ 홈과 동일: 토글 함수 (딱 이거만 같으면 동작도 같음)
 const toggleWishlist = (p, idx) => {
  const id = pidOf(p, idx);
  setWishlist((prev) => {
    const exists = prev.some((it) => it.id === id);
    let next;
    if (exists) {
      next = prev.filter((it) => it.id !== id);
    } else {
      const normalized = {
        id,
        name: p.name || "상품명",
        image: p.image || p.img || "",
        price: typeof p.price === "number" ? p.price : Number(String(p.price).replace(/[^\d]/g, "")) || 0,
        desc: p.desc || "",
        brand: p.brand || p.brandName || "",
      };
      next = [...prev, normalized];
    }

    // ✅ 홈처럼 로컬스토리지 저장
    localStorage.setItem("wishlist", JSON.stringify(next));

    // ✅ 추가: 같은 탭에서도 바로 반영되게 이벤트 발송
    window.dispatchEvent(new Event("storage"));

    return next;
  });
};

  const goToProductDetail = (p, idx) => {
    const normalized = {
      id: pidOf(p, idx),
      name: p.name || "상품명 없음",
      image: p.image || p.img || "",
      price: typeof p.price === "string" ? Number(p.price.replace(/[^\d]/g, "")) || 0 : Number(p.price || 0),
      desc: p.desc || "",
      brand: p.brand || p.brandName || "",
    };
    localStorage.setItem("lastProduct", JSON.stringify(normalized));
    navigate(`/product/${normalized.id}`, { product: normalized });
  };

  if (!categoryData) {
    return (
      <div className="category-page">
        <div className="container">
          <h1>카테고리를 찾을 수 없습니다</h1>
          <Link to="/">홈으로 돌아가기</Link>
        </div>
      </div>
    );
  }

  const pageData = categoryData.pages[subcategoryKey] || categoryData.pages.main;
  const isMainCategory = subcategoryKey === "main";

  const breadcrumbItems = [{ name: "Home", path: "/" }];
  breadcrumbItems.push({ name: categoryData.name, path: `/${categoryKey}` });
  if (!isMainCategory && pageData) breadcrumbItems.push({ name: pageData.title, path: pathname });

  return (
    <div className="category-page">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <div className="container">
          {breadcrumbItems.map((item, idx) => (
            <React.Fragment key={idx}>
              {idx === breadcrumbItems.length - 1 ? (
                <span className="current">{item.name}</span>
              ) : (
                <>
                  <Link to={item.path}>{item.name}</Link>
                  <span className="separator">&gt;</span>
                </>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="container">
        {/* Title */}
        <div className="page-header">
          <h1 className="page-title">
            {pageData.title} <span className="count">{pageData.count}개 상품</span>
          </h1>
        </div>

        {/* Tabs */}
        <div className="category-tabs">
          {categoryData.subcategories.map((subcat) => (
            <Link
              key={subcat.name}
              to={subcat.path}
              className={`tab ${activeTab === subcat.name ? "active" : ""}`}
              onClick={() => setActiveTab(subcat.name)}
            >
              {subcat.name}
            </Link>
          ))}
        </div>

        {/* Grid */}
        {products.length > 0 ? (
          <div className="product-grid">
            {products.map((p, idx) => {
              const id = pidOf(p, idx);
              const wished = wishSet.has(id);
              return (
                <div
                  className="product-card"
                  key={id}
                  onClick={() => goToProductDetail(p, idx)}
                >
                  <div className="thumb">
                    <img
                      src={srcOf(p)}
                      alt={p.name}
                      className="thumb-img"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = `${process.env.PUBLIC_URL}/images/placeholder.png`;
                      }}
                    />

                    {/* ✅ 홈과 완전히 같은 버튼 마크업/동작 */}
                    <button
                      className={`wishlist-btn ${wished ? "active" : ""}`}
                      aria-pressed={wished}
                      aria-label={wished ? "위시에서 제거" : "위시에 추가"}
                      onClick={(e) => { e.stopPropagation(); toggleWishlist(p, idx); }}
                      title={wished ? "위시에 담김" : "위시에 담기"}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill={wished ? "currentColor" : "none"}
                        />
                      </svg>
                    </button>

                    {p.discountLabel && <span className="discount-badge">{p.discountLabel}</span>}
                  </div>

                  <div className="product-info">
                    <span className="brand">{p.brand || p.brandName}</span>
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
        ) : (
          <p>상품이 없습니다.</p>
        )}
      </div>
    </div>
  );
}
