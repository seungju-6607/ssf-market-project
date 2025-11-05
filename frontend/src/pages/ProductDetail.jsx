// src/pages/ProductDetail.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import "./ProductDetail.css";

export default function ProductDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const fromState = location.state?.product || null;

  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1);
  const [isWished, setIsWished] = useState(false);

  // 현재 상품
  const product = useMemo(() => {
    if (fromState && fromState.id) return fromState;
    try {
      return JSON.parse(localStorage.getItem("lastProduct")) || null;
    } catch {
      return null;
    }
  }, [fromState, id]);

  const clampQty = (v) => (v < 1 ? 1 : v > 99 ? 99 : v);

  // 숫자 가격
  const normalizedPrice =
    typeof product?.price === "string"
      ? Number(String(product.price).replace(/[^\d]/g, "")) || 0
      : Number(product?.price || 0);

  // 찜 상태 체크
  useEffect(() => {
    if (!product?.id) return;
    try {
      const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      setIsWished(wishlist.some((w) => String(w.id) === String(product.id)));
    } catch {
      setIsWished(false);
    }
  }, [product]);

  const toggleWish = () => {
    if (!product) return;
    try {
      const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      const i = wishlist.findIndex((w) => String(w.id) === String(product.id));
      if (i >= 0) {
        wishlist.splice(i, 1);
        setIsWished(false);
      } else {
        wishlist.push({
          id: product.id,
          name: product.name || "",
          image: product.image || product.img,
          price: normalizedPrice,
          addedAt: Date.now(),
        });
        setIsWished(true);
      }
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch {}
  };

  // 장바구니 담기
  const addToCart = () => {
    if (!product) {
      alert("상품 정보를 찾을 수 없습니다.");
      return;
    }
    if (!size) {
      alert("사이즈를 선택해 주세요.");
      return;
    }
    try {
      const itemId = `${product.id}-${size}`;
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const idx = cart.findIndex((c) => c.id === itemId);
      if (idx >= 0) {
        const cur = Number(cart[idx].qty) || 1;
        const add = Number(qty) || 1;
        cart[idx].qty = Math.min(99, cur + add);
      } else {
        cart.push({
          id: itemId,
          product: {
            id: product.id,
            name: product.name || "",
            image: product.image || product.img,
            price: normalizedPrice,
          },
          size,
          qty: Number(qty) || 1,
        });
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cartUpdated"));
      alert("장바구니에 담았습니다.");
    } catch (e) {
      console.error(e);
      alert("장바구니 처리 중 오류가 발생했습니다.");
    }
  };

  // 바로 주문 → Checkout으로 "주문 1건" 전달
  const goCheckout = () => {
    if (!product) {
      alert("상품 정보를 찾을 수 없습니다.");
      return;
    }
    if (!size) {
      alert("사이즈를 선택해 주세요.");
      return;
    }

    const payload = {
      product: {
        id: product.id,
        name: product.name || "",
        image: product.image || product.img,
        price: normalizedPrice,
      },
      size,
      qty: Number(qty),
    };

    // 혹시 대비해 로컬에도 저장
    localStorage.setItem("pendingOrder", JSON.stringify(payload));
    // 최근 상품도 유지
    localStorage.setItem("lastProduct", JSON.stringify(product));

    // ✅ Checkout으로 state로도 함께 전달
    navigate("/checkout", { state: { order: payload } });
  };

  if (!product) {
    return (
      <div className="product-detail-container">
        상품 정보를 찾을 수 없습니다. 목록에서 이미지를 클릭해 다시 들어와 주세요.
      </div>
    );
  }

  return (
    <div className="product-detail-container">
      <h1 className="product-detail-title">상품 상세</h1>

      <div className="product-detail-grid">
        <div>
          <img
            src={product.image || product.img}
            alt={product.name}
            className="product-image"
          />
        </div>

        <div>
          <div className="product-name-section">
            <div className="product-name">{product.name || "상품명"}</div>

            <button
              onClick={toggleWish}
              className="wishlist-button"
              title={isWished ? "찜 취소" : "찜하기"}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill={isWished ? "#ff4444" : "none"}>
                <path
                  d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                  stroke={isWished ? "#ff4444" : "currentColor"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div className="product-price">
            {normalizedPrice ? `₩${normalizedPrice.toLocaleString()}` : ""}
          </div>

          <div className="product-form-container">
            <label className="form-label">
              <span className="form-label-text">사이즈</span>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="form-select"
              >
                <option value="">선택하세요</option>
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
              </select>
            </label>

            <label className="form-label">
              <span className="form-label-text">수량</span>
              <input
                type="number"
                min="1"
                max="99"
                value={qty}
                onChange={(e) => setQty(clampQty(Number(e.target.value)))}
                className="form-input"
              />
            </label>

            <div className="button-group">
              <button onClick={addToCart} className="cart-button">
                장바구니 담기
              </button>
              <button onClick={goCheckout} className="checkout-button">
                주문하기
              </button>
            </div>

            <Link to="/cart" className="cart-link">
              장바구니로 이동
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
