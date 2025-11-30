// src/pages/CategoryPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CATEGORY_DATA } from "../data/categoryData";
import { getProductsByCategory } from "../data/productData";
import "./Page.css";
import "../styles/CategoryPage.css";

import {
  toggleWishlistServer,
  syncWishlistFromServer,
} from "../hooks/useWishlist.js";

// 이미지 URL 처리
const srcOf = (p) => {
  const url = p?.image || p?.img || "";
  if (!url) return `${process.env.PUBLIC_URL}/images/placeholder.png`;
  if (/^https?:\/\//i.test(url)) return url;
  const cleaned = url.replace(/^\.?\/*/, "");
  return cleaned.startsWith("images/")
    ? `${process.env.PUBLIC_URL}/${cleaned}`
    : `${process.env.PUBLIC_URL}/images/${cleaned}`;
};

// 금액 포맷
const formatPrice = (v) => {
  const n =
    typeof v === "number"
      ? v
      : Number(String(v).replace(/[^\d]/g, "")) || 0;
  return n.toLocaleString() + "원";
};

// productId 생성
const pidOf = (p, idx) =>
  p?.id ?? p?.code ?? p?.pid ?? `cat-${idx}`;

export default function CategoryPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const pathname = location.pathname;
  const pathParts = pathname.split("/").filter(Boolean);
  const categoryKey = pathParts[0];
  const subcategoryKey = pathParts[1] || "main";

  const categoryData = CATEGORY_DATA[categoryKey];

  const [activeTab, setActiveTab] = useState("");
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  // set 으로 빠르게 체크
  const wishSet = useMemo(
    () => new Set(wishlist.map((it) => it.productId)),
    [wishlist]
  );

  // 로그인 유저
  const loginUser = JSON.parse(localStorage.getItem("loginUser") || "{}");
  const email = loginUser.email;

  // 페이지 입장 시 위시 불러오기
  useEffect(() => {
    if (email) {
      syncWishlistFromServer(email).then((list) => {
        setWishlist(list);
      });
    } else {
      setWishlist([]);
    }
  }, [email]);

  // 카테고리 / 서브카테고리 로딩
  useEffect(() => {
    if (!categoryData) return;

    const match = categoryData.subcategories.find(
      (s) => s.path === pathname
    );
    setActiveTab(
      match ? match.name : categoryData.subcategories[0].name
    );

    setProducts(getProductsByCategory(categoryKey, subcategoryKey) || []);
  }, [pathname, categoryKey, subcategoryKey, categoryData]);
console.log("products 확인 : ", products);

  const handleWishlistClick = async (p, id) => {
    // if (!email) {
    //   alert("로그인 후 이용해주세요.");
    //   navigate("/login");
    //   return;
    // }
    //로그인 필수 기능 넣을 시 다시 활성화

    const normalized = {
      id,
      name: p.name || "",
      brand: p.brand || p.brandName || "",
      image: p.image || p.img || "",
      price:
        typeof p.price === "string"
          ? Number(p.price.replace(/[^\d]/g, "")) || 0
          : Number(p.price || 0),
      priceOri:
        p.originalPrice
          ? Number(String(p.originalPrice).replace(/[^\d]/g, ""))
          : 0,
    };

    const current = [...wishlist];
    const exists = current.some((it) => it.productId === id);

    // 1) 즉시 화면 반영 (optimistic update)
    let next;
    if (!exists) {
      next = [
        ...current,
        {
          email,
          productId: id,
          productName: normalized.name,
          productBrand: normalized.brand,
          productImage: normalized.image,
          productPrice: normalized.price,
          productPriceOri: normalized.priceOri,
        },
      ];
    } else {
      next = current.filter((it) => it.productId !== id);
    }

    setWishlist(next);

    localStorage.setItem("wishlist_local", JSON.stringify(next));
    window.dispatchEvent(new Event("wishlistUpdated"));

    try {
      await toggleWishlistServer(email, normalized);
    } catch (e) {
      console.error("Category wishlist toggle error:", e);
      const real = await syncWishlistFromServer(email);
      setWishlist(real);
    }
  };
  
  const goToProductDetail = (p, idx) => {
    const normalized = {
      id: pidOf(p, idx),
      name: p.name || "상품명 없음",
      image: p.image || p.img || "",
      price:
        typeof p.price === "string"
          ? Number(p.price.replace(/[^\d]/g, "")) || 0
          : Number(p.price || 0),
      desc: p.desc || "",
      brand: p.brand || p.brandName || "",
    };
    localStorage.setItem("lastProduct", JSON.stringify(normalized));
    navigate(`/product/${normalized.id}`, {
      state: { product: normalized },
    });
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

  const pageData =
    categoryData.pages[subcategoryKey] ||
    categoryData.pages.main;
  const isMainCategory = subcategoryKey === "main";

  const breadcrumbItems = [{ name: "Home", path: "/" }];
  breadcrumbItems.push({
    name: categoryData.name,
    path: `/${categoryKey}`,
  });
  if (!isMainCategory && pageData)
    breadcrumbItems.push({
      name: pageData.title,
      path: pathname,
    });

  return (
    <div className="category-page">
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
        <div className="page-header">
          <h1 className="page-title">
            {pageData.title}{" "}
            <span className="count">{pageData.count}개 상품</span>
          </h1>
        </div>

        {/* 탭 */}
        <div className="category-tabs">
          {categoryData.subcategories.map((subcat) => (
            <Link
              key={subcat.name}
              to={subcat.path}
              className={`tab ${
                activeTab === subcat.name ? "active" : ""
              }`}
              onClick={() => setActiveTab(subcat.name)}
            >
              {subcat.name}
            </Link>
          ))}
        </div>

        {/* 상품 리스트 */}
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
                        e.currentTarget.src =
                          `${process.env.PUBLIC_URL}/images/placeholder.png`;
                      }}
                    />

                    {/* 하트 버튼 */}
                    <button
                      className={`wishlist-btn ${
                        wished ? "active" : ""
                      }`}
                      aria-pressed={wished}
                      aria-label={
                        wished ? "위시에서 제거" : "위시에 추가"
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWishlistClick(p, id);
                      }}
                      title={wished ? "위시에 담김" : "위시에 담기"}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill={wished ? "currentColor" : "none"}
                      >
                        <path
                          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </svg>
                    </button>

                    {p.discountLabel && (
                      <span className="discount-badge">
                        {p.discountLabel}
                      </span>
                    )}
                  </div>

                  <div className="product-info">
                    <span className="brand">
                      {p.brand || p.brandName}
                    </span>
                    <h3 className="product-name">{p.name}</h3>
                    <div className="price">
                      {p.originalPrice && (
                        <span className="original-price">
                          {formatPrice(p.originalPrice)}
                        </span>
                      )}
                      <span className="current-price">
                        {p.priceLabel
                          ? p.priceLabel
                          : formatPrice(p.price)}
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
