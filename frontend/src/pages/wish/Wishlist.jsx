// src/pages/wish/Wishlist.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Wishlist.css";
import {
  syncWishlistFromServer,
  toggleWishlistServer,
  clearWishlistOnServer,
} from "../../hooks/useWishlist";

const formatKRW = (n) =>
  `₩${Number(n || 0).toLocaleString()}`;

function Wishlist() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");

  const fetchItemKey = async (productId) => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/items/product/${productId}`
        );
        if (!res.ok) throw new Error("상품 정보를 불러오지 못했습니다.");
        const data = await res.json();
        return data.itemKey;
      } catch (err) {
        console.error("fetchItemKey 오류:", err);
        return null;
      }
    };

  useEffect(() => {
    const loginUser = JSON.parse(
      localStorage.getItem("loginUser") || "{}"
    );
    if (!loginUser.email) {
      alert("로그인 후 이용해 주세요.");
      navigate("/login");
      return;
    }
    setEmail(loginUser.email);
  }, [navigate]);


  useEffect(() => {
    if (!email) return;
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      const list = await syncWishlistFromServer(email);
      if (!cancelled) {
        setItems(list);
        setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [email]);

  const empty = !loading && items.length === 0;

  const handleRemoveOne = async (item) => {
    if (!email) return;
    setItems((prev) =>
      prev.filter((it) => it.productId !== item.productId)
    );

    try {
      await toggleWishlistServer(email, item);
    } catch (e) {
      console.error("위시 개별 삭제 오류:", e);
      const list = await syncWishlistFromServer(email);
      setItems(list);
    }
  };
  const handleClearAll = async () => {
    if (!email) return;
    if (!window.confirm("위시리스트를 모두 비우시겠습니까?")) return;

    setItems([]);

    try {
      await clearWishlistOnServer(email);
      localStorage.setItem("wishlist", JSON.stringify([]));
      window.dispatchEvent(new Event("wishlistUpdated"));

    } catch (e) {
      console.error("위시 전체 삭제 오류:", e);
      const list = await syncWishlistFromServer(email);
      setItems(list);
    }
  };


  const totalPrice = useMemo(
    () =>
      items.reduce(
        (sum, it) => sum + Number(it.productPrice || 0),
        0
      ),
    [items]
  );

  return (
    <div className="wishlist-page">
      <div className="wishlist-header">
        <h1 className="wishlist-title">위시리스트</h1>

        <div className="wishlist-header-right">
          <span className="wishlist-count">
            총{" "}
            <strong>{items.length}</strong>개
          </span>
          {items.length > 0 && (
            <button
              type="button"
              className="wishlist-clear-btn"
              onClick={handleClearAll}
            >
              위시리스트 비우기
            </button>
          )}
        </div>
      </div>

      {loading && (
        <div className="wishlist-empty">
          불러오는 중...
        </div>
      )}

      {empty && (
        <div className="wishlist-empty">
          <p>담긴 상품이 없습니다.</p>
          <button
            type="button"
            className="wishlist-go-shopping"
            onClick={() => navigate("/")}
          >
            쇼핑하러 가기
          </button>
        </div>
      )}

      {!loading && items.length > 0 && (
        <>
          <div className="wishlist-grid">
            {items.map((item) => (
              <div
                key={item.productId}
                className="wishlist-card"
              >
                {/* ---------------- 이미지 클릭 시 itemKey 확보 ---------------- */}
                <Link
                  to="#"
                  className="wishlist-image-wrap"
                  onClick={async (e) => {
                    e.preventDefault();

                    // 1. itemKey 확인, 없으면 fetch
                    let key = item.itemKey;
                    if (!key) {
                      try {
                        key = await fetchItemKey(item.productId);
                        if (!key) {
                          alert("상품 정보를 가져오지 못했습니다.");
                          return;
                        }
                        item.itemKey = key; // 임시 저장
                      } catch (err) {
                        console.error("상품 키 fetch 오류:", err);
                        alert("상품 정보를 가져오는 중 오류가 발생했습니다.");
                        return;
                      }
                    }

                    // 2. ProductDetail로 navigate + state 전달
                    navigate(`/product/${key}`, {
                      state: {
                        product: {
                          id: item.itemKey,          // ProductDetail에서 id
                          name: item.productName,
                          image: item.productImage,
                          price: item.productPrice,
                          selectedSize: item.selectedSize || "",
                          brand: item.productBrand,
                          // 필요하면 다른 필드도 추가 가능
                        },
                      },
                    });
                  }}
                >
                  <img
                    src={
                      item.productImage ||
                      item.product?.img ||
                      "https://via.placeholder.com/300x400?text=NO+IMAGE"
                    }
                    alt={item.productName}
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/300x400?text=NO+IMAGE";
                    }}
                  />
                </Link>
                {/* ---------------------------------------------------------------- */}

                <div className="wishlist-info">
                  <div className="wishlist-brand">
                    {item.productBrand}
                  </div>
                  <div className="wishlist-name">
                    {item.productName}
                  </div>
                  <div className="wishlist-price-row">
                    <span className="wishlist-price">
                      {formatKRW(item.productPrice)}
                    </span>
                   {item.productPriceOri > 0 &&
                    Number(item.productPriceOri) > Number(item.productPrice) && (
                    <span className="wishlist-price-ori">
                    {formatKRW(item.productPriceOri)}
                     </span>
                  )}

                  </div>
                </div>

                {/* ---------------- 옵션 선택 ---------------- */}
                <div style={{ padding: "16px", display: "grid", gap: "8px", margin: "12px 0", width: "100%", maxWidth: "320px" }}>
                  <label style={{ display: "grid", gap: "4px", fontSize: "13px"}}>
                    사이즈
                    <select
                      value={item.selectedSize || ""}
                      onChange={(e) =>
                        setItems((prev) =>
                          prev.map((it) =>
                            it.productId === item.productId
                              ? { ...it, selectedSize: e.target.value }
                              : it
                          )
                        )
                      }
                      style={{
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        padding: "8px",
                        fontSize: "14px",
                        width: "100%",
                      }}
                    >
                      <option value="">선택하세요</option>
                      {["XS", "S", "M", "L", "XL"].map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                {/* --------------------------------------------- */}

                <div className="wishlist-actions">
                  <button
                    type="button"
                    className="wishlist-remove-btn"
                    onClick={() => handleRemoveOne(item)}
                  >
                    삭제
                  </button>
                  <button
                    type="button"
                    className="wishlist-buy-btn"
                    onClick={async () => {
                      if (!item.selectedSize) { alert("사이즈를 선택해 주세요."); return; }
                      try {
                        const data = await fetchItemKey(item.productId);
                        const payload = {
                            product: {
                              id: data,
                              name: item.productName,
                              image: item.productImage,
                              price: item.productPrice,
                            },
                            qty: 1,
                            size: item.selectedSize,
                          };

                        // itemKey 사용해서 checkout 페이지로 이동
                        localStorage.setItem("directCheckout", JSON.stringify([payload]));
                        localStorage.setItem("orderSource", "direct");
                        navigate("/checkout", { state: { order: payload } });
                      } catch (err) {
                        console.error("바로구매 오류:", err);
                        alert("상품 정보를 가져오는 중 오류가 발생했습니다.");
                      }
                    }}
                  >
                    바로구매
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="wishlist-summary">
            <div className="wishlist-summary-text">
              선택 상품 합계
            </div>
            <div className="wishlist-summary-price">
              {formatKRW(totalPrice)}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Wishlist;
