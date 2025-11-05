// src/pages/cart/CartPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./CartPage.css";

export default function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [selected, setSelected] = useState({});

  // ✅ 로그인 여부 확인
  useEffect(() => {
    const isLogin = localStorage.getItem("isLogin") === "true";
    if (!isLogin) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }
  }, [navigate]);

  // ✅ 장바구니 불러오기
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("cart")) || [];
      setCart(saved);
      const initSel = {};
      saved.forEach((i) => {
        initSel[i.id] = true;
      });
      setSelected(initSel);
    } catch {
      setCart([]);
      setSelected({});
    }
  }, []);

  // ✅ 장바구니 저장 (로컬 + 이벤트 발생)
  const saveCart = (next) => {
    setCart(next);
    localStorage.setItem("cart", JSON.stringify(next));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // ✅ 단일 체크
  const toggleOne = (id) =>
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));

  // ✅ 전체선택
  const allChecked = useMemo(
    () => cart.length > 0 && cart.every((i) => selected[i.id]),
    [cart, selected]
  );
  const toggleAll = () => {
    const next = {};
    cart.forEach((i) => {
      next[i.id] = !allChecked;
    });
    setSelected(next);
  };

  // ✅ 가격 파싱 유틸 (₩, , 제거)
  const parsePrice = (val) => {
    if (!val) return 0;
    if (typeof val === "number") return val;
    return Number(String(val).replace(/[^\d]/g, "")) || 0;
  };

  const unitPrice = (p) => parsePrice(p?.price);
  const linePrice = (i) => unitPrice(i.product) * Number(i.qty || 1);

  // ✅ 수량 변경 함수들
  const inc = (id) => {
    const next = cart.map((i) =>
      i.id === id
        ? { ...i, qty: Math.min(99, (Number(i.qty) || 1) + 1) }
        : i
    );
    saveCart(next);
  };

  const dec = (id) => {
    const next = cart.map((i) =>
      i.id === id
        ? { ...i, qty: Math.max(1, (Number(i.qty) || 1) - 1) }
        : i
    );
    saveCart(next);
  };

  const changeQty = (id, v) => {
    const n = Math.max(1, Math.min(99, Number(v) || 1));
    const next = cart.map((i) =>
      i.id === id ? { ...i, qty: n } : i
    );
    saveCart(next);
  };

  // ✅ 삭제
  const removeOne = (id) => {
    const next = cart.filter((i) => i.id !== id);
    saveCart(next);
    setSelected((prev) => {
      const p = { ...prev };
      delete p[id];
      return p;
    });
  };

  const removeSelected = () => {
    const next = cart.filter((i) => !selected[i.id]);
    saveCart(next);
    const ns = {};
    next.forEach((i) => {
      ns[i.id] = true;
    });
    setSelected(ns);
  };

  const clearAll = () => {
    saveCart([]);
    setSelected({});
  };

  // ✅ 선택 상품 필터
  const selectedItems = useMemo(
    () => cart.filter((i) => selected[i.id]),
    [cart, selected]
  );

  // ✅ 총합 계산
  const totalPrice = useMemo(
    () => selectedItems.reduce((s, i) => s + linePrice(i), 0),
    [selectedItems]
  );

  // ✅ 결제 페이지 이동
  const proceed = () => {
    if (selectedItems.length === 0) {
      alert("결제할 상품을 선택해주세요.");
      return;
    }

    const payload = selectedItems.map((i) => ({
      id: i.id,
      name: i.product?.name || "",
      image: i.product?.image || i.product?.img || "",
      price: parsePrice(i.product?.price),
      qty: Number(i.qty || 1),
      size: i.size || "",
    }));

    if (payload.length === 0) {
      alert("결제할 상품 데이터가 올바르지 않습니다.");
      return;
    }

    localStorage.setItem("cartCheckout", JSON.stringify(payload));
    navigate("/checkout", { state: { fromCart: true } });
  };

  return (
    <div className="cart-wrap">
      <h1 className="cart-title">장바구니</h1>

      {cart.length === 0 ? (
        <div className="cart-empty">
          <p>장바구니가 비어 있습니다.</p>
          <Link to="/" className="btn">
            쇼핑하러 가기
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-head">
            <label className="chk">
              <input
                type="checkbox"
                checked={allChecked}
                onChange={toggleAll}
              />
              <span>전체선택</span>
            </label>
            <div className="cart-head-actions">
              <button className="btn" onClick={removeSelected}>
                선택삭제
              </button>
              <button className="btn-danger" onClick={clearAll}>
                전체삭제
              </button>
            </div>
          </div>

          <div className="cart-list">
            {cart.map((i) => {
              const unit = unitPrice(i.product);
              const sub = linePrice(i);
              const imgSrc = i.product?.image || i.product?.img;

              return (
                <div className="cart-item" key={i.id}>
                  <label className="chk">
                    <input
                      type="checkbox"
                      checked={!!selected[i.id]}
                      onChange={() => toggleOne(i.id)}
                    />
                  </label>

                  <img
                    className="cart-img"
                    src={imgSrc || "/images/placeholder.png"}
                    alt={i.product?.name}
                  />

                  <div className="cart-info">
                    <div className="cart-name">
                      {i.product?.name || "상품"}
                    </div>
                    <div className="cart-meta">사이즈: {i.size}</div>
                    <div className="cart-meta">
                      단가: ₩{unit.toLocaleString()}
                    </div>
                  </div>

                  <div className="cart-qty">
                    <button onClick={() => dec(i.id)}>-</button>
                    <input
                      value={i.qty}
                      onChange={(e) => changeQty(i.id, e.target.value)}
                    />
                    <button onClick={() => inc(i.id)}>+</button>
                  </div>

                  <div className="cart-sub">
                    ₩{sub.toLocaleString()}
                  </div>

                  <button
                    className="btn-danger"
                    onClick={() => removeOne(i.id)}
                  >
                    삭제
                  </button>
                </div>
              );
            })}
          </div>

          <div className="cart-summary">
            <div className="cart-sum-row">
              <span>선택 상품 금액</span>
              <b>₩{totalPrice.toLocaleString()}</b>
            </div>
            <div className="cart-actions">
              <Link to="/" className="btn">
                쇼핑 계속하기
              </Link>
              <button className="pay-btn" onClick={proceed}>
                선택 상품 결제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
