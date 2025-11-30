import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CATEGORY_DATA } from "../data/categoryData";
import "./Page.css";
import "../styles/CategoryPage.css";

import {
  toggleWishlistServer,
  syncWishlistFromServer,
} from "../hooks/useWishlist.js";

const srcOf = (p) => {
  let itemArray = [];
  try {
    itemArray = JSON.parse(p?.itemList || "[]");
  } catch (e) {
    console.error("itemList parse error:", e, p?.itemList);
    itemArray = [];
  }

  const url = itemArray[0] || "";
  if (!url) return `${process.env.PUBLIC_URL}/images/placeholder.png`;
  if (/^https?:\/\//i.test(url)) return url;

  const cleaned = url.replace(/^\.?\/*/, "");
  return cleaned.startsWith("images/")
    ? `${process.env.PUBLIC_URL}/${cleaned}`
    : `${process.env.PUBLIC_URL}/images/${cleaned}`;
};

const formatPrice = (v) => {
  const n = typeof v === "number" ? v : Number(String(v).replace(/[^\d]/g, "")) || 0;
  return n.toLocaleString() + "원";
};

// const pidOf = (p, idx) => p?.itemKey ?? `cat-${idx}`;
const pidOf = (p, idx) =>
  p?.productId ?? p?.code ?? p?.pid ?? `cat-${idx}`;


export default function CategoryPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const pathname = location.pathname;
  const pathParts = pathname.split("/").filter(Boolean);
  const categoryKey = pathParts[0];
  const subcategoryKey = pathParts[1] || "main";

  const [activeTab, setActiveTab] = useState(subcategoryKey);
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const wishSet = useMemo(() => new Set(wishlist.map((it) => it.productId)), [wishlist]);
  const loginUser = JSON.parse(localStorage.getItem("loginUser") || "{}");
  const email = loginUser.email;

  // 페이지 입장 시 위시 불러오기
  useEffect(() => {
      if (email) {
        syncWishlistFromServer(email).then(setWishlist);
      } else {
        setWishlist([]);
      }
    }, [email]);

  // 카테고리/서브카테고리 상품 fetch
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const query = subcategoryKey !== "main" ? `?subcategory=${subcategoryKey}` : "";
        const res = await fetch(`http://localhost:8080/api/items/category/${categoryKey}${query}`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (e) {
        console.error("상품 fetch error:", e);
      }
    };
    fetchItems();
  }, [categoryKey, subcategoryKey]);

  const handleWishlistClick = async (p, id) => {
      if (!email) {
        alert("로그인 후 이용해주세요.");
        navigate("/login");
        return;
      }
      //로그인 필수 기능 넣을 시 다시 활성화

      const normalized = {
        id,
        name: p.itemContent || "",
        brand: p.itemBrand || "",
        image: (() => {
            try {
              const list = JSON.parse(p.itemList || "[]");
              return list[0] || "";
            } catch (e) {
              console.error("itemList parse error:", e, p.itemList);
              return "";
            }
          })(),
        price:
          typeof p.itemPrice === "string"
            ? Number(p.itemPrice.replace(/[^\d]/g, "")) || 0
            : Number(p.itemPrice || 0),
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
    let imageUrl = "";
    try {
      const list = JSON.parse(p.itemList || "[]");
      imageUrl = list[0] || "";
    } catch (e) {
      console.error("itemList 파싱 오류:", e);
    }

    const normalized = {
      id: p.itemKey,
      productId : p.productId,
      name: p.itemName || "상품명 없음",
      image: imageUrl,
      price: p.itemPrice || 0,
      desc: p.itemContent || "",
      brand: p.itemBrand || "",
    };

    localStorage.setItem("lastProduct", JSON.stringify(normalized));
    navigate(`/product/${normalized.id}`, { state: { product: normalized } });
  };


  // UI용 서브카테고리 가져오기
  const tabs = CATEGORY_DATA[categoryKey]?.subcategories || [];

  return (
    <div className="category-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">
            {CATEGORY_DATA[categoryKey]?.name || categoryKey}{" "}
            <span className="count">{products.length}개 상품</span>
          </h1>
        </div>

        {/* 카테고리 탭 */}
        <div className="category-tabs">
          {tabs.map((tab, idx) => (
            <Link
              key={idx}
              to={tab.path}
              className={`tab ${activeTab === tab.path.split("/")[1] ? "active" : ""}`}
              onClick={() => setActiveTab(tab.path.split("/")[1])}
            >
              {tab.name}
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
//                   key={id}
                  onClick={() => goToProductDetail(p, idx)}
                >
                  <div className="thumb">
                    <img
                      src={srcOf(p)}
                      alt={p.itemName}
                      className="thumb-img"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = `${process.env.PUBLIC_URL}/images/placeholder.png`;
                      }}
                    />
                    <button
                      className={`wishlist-btn ${wished ? "active" : ""}`}
                      aria-pressed={wished}
                      aria-label={wished ? "위시에서 제거" : "위시에 추가"}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWishlistClick(p, id);
                      }}
                      title={wished ? "위시에 담김" : "위시에 담기"}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill={wished ? "currentColor" : "none"}>
                        <path
                          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="product-info">
                    <span className="brand">{p.itemBrand}</span>
                    <h3 className="product-name">{p.itemName}</h3>
                    <div className="price">
                      {p.itemSale > 0 && <span className="original-price">{formatPrice(p.itemSale)}</span>}
                      <span className="current-price">{formatPrice(p.itemPrice)}</span>
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
