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
                <Link
                  to={`/product/${item.productId}`}
                  className="wishlist-image-wrap"
                >
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/300x400?text=NO+IMAGE";
                    }}
                  />
                </Link>

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
                    onClick={() =>
                      navigate("/checkout", {
                        state: {
                          from: "wishlist",
                          items: [
                            {
                              id: item.productId,
                              name: item.productName,
                              image: item.productImage,
                              price: item.productPrice,
                              quantity: 1,
                              brand: item.productBrand,
                            },
                          ],
                        },
                      })
                    }
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
