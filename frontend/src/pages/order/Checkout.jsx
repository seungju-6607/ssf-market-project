// src/pages/order/Checkout.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Checkout.css";

/* ===========================
   0) 공통 유틸
   =========================== */

const toNumber = (v) =>
  typeof v === "number" ? v : Number(String(v ?? "").replace(/[^\d]/g, "")) || 0;

const formatKRW = (n) => `₩${Number(n || 0).toLocaleString()}`;

// // const readJSON = (key, fallback) => {
//   try {
//     const v = JSON.parse(localStorage.getItem(key) || "null");
//     return v ?? fallback;
//   } catch {
//     return fallback;
//   }
// };

/**
 * 어떤 형태의 객체가 오더라도
 * { product: { id, name, image, price }, size, qty } 로 정규화
 */
const normalizeOrderItem = (raw) => {
  if (!raw) return null;

  const baseProd = raw.product || raw;

  const id =
    baseProd.id ||
    raw.id ||
    baseProd.code ||
    raw.code ||
    `p-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

  const name = baseProd.name || raw.name || raw.title || "상품명";
  const image =
    baseProd.image ||
    baseProd.img ||
    raw.image ||
    raw.img ||
    baseProd.src ||
    raw.src ||
    "";
  const price = toNumber(
    baseProd.price != null ? baseProd.price : raw.price != null ? raw.price : 0
  );

  const size = raw.size || raw.option?.size || "";
  const qty = Number(raw.qty || 1);

  return {
    product: { id, name, image, price },
    size,
    qty,
  };
};

/* ===========================
   1) 쿠폰 할인 계산
   =========================== */
const getDiscountByCoupon = (subtotal, rawCoupon) => {
  if (!rawCoupon) return 0;
  const ctype = String(rawCoupon.type || "").toLowerCase().trim();

  const min = toNumber(rawCoupon.min);
  if (subtotal < min) return 0;

  let discount = 0;

  const isPercent =
    ctype === "percent" || ctype === "percentage" || ctype === "rate";

  if (isPercent) {
    const rate =
      typeof rawCoupon.rate === "number"
        ? rawCoupon.rate
        : toNumber(rawCoupon.rate);
    discount = Math.floor((subtotal * rate) / 100);
    const cap =
      toNumber(rawCoupon.max) || toNumber(rawCoupon.amount) || 0;
    if (cap) discount = Math.min(discount, cap);
  } else {
    const amt =
      toNumber(rawCoupon.amount) ||
      toNumber(rawCoupon.value) ||
      toNumber(rawCoupon.name);
    discount = amt;
  }

  return Math.max(0, Math.min(discount, subtotal));
};

/* ===========================
   3) 보조: 로컬에서 카트/단건 주문 불러오기
   =========================== */
const readJSON = (key, fallback) => {
  try {
    const v = JSON.parse(localStorage.getItem(key) || "null");
    return v ?? fallback;
  } catch {
    return fallback;
  }
};

const getCheckoutPayload = (location) => {
  // 우선순위: (1) location.state.order (2) localStorage.pendingOrder (3) localStorage.cartCheckout (4) cart 전체
  const fromState = location?.state?.order;
  if (fromState) return [fromState];

  const pendingOrder = readJSON("pendingOrder", null);
  if (pendingOrder) return [pendingOrder];

  const cartCheckout = readJSON("cartCheckout", null);
  if (Array.isArray(cartCheckout) && cartCheckout.length > 0) {
    // cartCheckout 구조: [{ id, name, image, price, qty, size }]
    // product 객체로 래핑
    return cartCheckout.map((i) => ({
      product: {
        id: i.id,
        name: i.name || "",
        image: i.image || "",
        price: toNumber(i.price),
      },
      size: i.size || "",
      qty: Number(i.qty || 1),
    }));
  }

  // cart에서 전부 가져오기 (마지막 fallback)
  const cart = readJSON("cart", []);
  // cart 구조: [{ id, product:{id,name,image,price}, size, qty }]
  return cart.map((i) => ({
    product: {
      id: i.product?.id,
      name: i.product?.name || "",
      image: i.product?.image || i.product?.img || "",
      price: toNumber(i.product?.price),
    },
    size: i.size || "",
    qty: Number(i.qty || 1),
  }));
};

/* ===========================
   4) Checkout Component
   =========================== */
export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();

  // 주문 상품
  const items = useMemo(() => getCheckoutPayload(location), [location]);

  // 쿠폰 목록 (localStorage 사용)
  const [coupons, setCoupons] = useState(() => readJSON("coupons", []));
  const [couponId, setCouponId] = useState("");

  // 합계
  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, it) =>
          sum + toNumber(it.product?.price) * Number(it.qty || 1),
        0
      ),
    [items]
  );

  // 사용 가능한 쿠폰 필터
  const availableCoupons = useMemo(() => {
    const now = Date.now();
    return (coupons || []).filter((c) => {
      if (c.used) return false;
      if (c.expiresAt) {
        const t = new Date(c.expiresAt).getTime();
        if (!isNaN(t) && t < now) return false;
      }
      return true;
    });
  }, [coupons]);

  // 선택 쿠폰
  const selectedCoupon = useMemo(
    () => availableCoupons.find((c) => String(c.id) === String(couponId)),
    [availableCoupons, couponId]
  );

  const discount = useMemo(
    () => getDiscountByCoupon(subtotal, selectedCoupon),
    [subtotal, selectedCoupon]
  );

  const shipping = 0; // 예시
  const total = Math.max(0, subtotal - discount + shipping);

  useEffect(() => {
    // 필요하면 콘솔 찍어서 구조 확인
    // console.log("[DEBUG] items:", items);
  }, [items]);

  /* === 결제수단 선택 페이지로 이동 === */
  const goPaymentMethod = () => {
    const payloadData = {
      items,
      subtotal,
      discount,
      shipping,
      total,
      coupon: selectedCoupon ? { ...selectedCoupon, discount } : null,
    };

    try {
      localStorage.setItem("lastCheckout", JSON.stringify(payloadData));
    } catch (e) {
      console.error("Failed to save checkout data:", e);
    }

    navigate("/pay", payloadData);
  };

  /* === (옵션) 쿠폰 사용 처리 & 데모용 완결 === */
  const markCouponUsed = (c) => {
    if (!c) return;
    const next = (coupons || []).map((x) =>
      String(x.id) === String(c.id)
        ? { ...x, used: true, usedAt: new Date().toISOString() }
        : x
    );
    setCoupons(next);
    localStorage.setItem("coupons", JSON.stringify(next));
  };

  // 주문 완료 처리 (PaymentSuccess 페이지 등에서 호출하는 게 일반적)
  const placeOrderForDemo = () => {
    markCouponUsed(selectedCoupon);
    // 장바구니 비우기 (선택 결제였다면 cartCheckout만 비우는 것이 좋음)
    localStorage.removeItem("cartCheckout");
    localStorage.removeItem("pendingOrder");
    alert(`결제가 완료되었습니다!\n총 ${items.length}개 상품\n결제 금액: ${formatKRW(total)}`);
    navigate("/order/success");
  };

  if (!items || items.length === 0) {
    return (
      <div className="checkout-page">
        <h2 className="title">주문 결제</h2>
        <p className="empty-info">선택된 상품이 없습니다. 장바구니로 이동해 주세요.</p>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h2 className="title">주문 결제</h2>

      {/* 주문 상품 */}
      <section className="section">
        <h3 className="section-title">📦 주문 상품</h3>
        <div className="order-items">
          {items.map((it, idx) => (
            <div className="order-item" key={idx}>
              <img
                className="order-thumb"
                src={it.product?.image}
                alt={it.product?.name}
                onError={(e) => {
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80";
                }}
              />
              <div className="order-info">
                <div className="order-name">{it.product?.name}</div>
                <div className="order-sub">
                  사이즈: {it.size || "-"} · 수량: {it.qty || 1}
                </div>
              </div>
              <div className="order-price">
                {formatKRW(
                  toNumber(it.product?.price) * Number(it.qty || 1)
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 쿠폰 선택 */}
      <section className="section">
        <h3 className="section-title">🎟 쿠폰 선택</h3>
        {availableCoupons.length === 0 ? (
          <p className="no-coupon">사용 가능한 쿠폰이 없습니다.</p>
        ) : (
          <>
            <select
              className="coupon-select"
              value={String(couponId)}
              onChange={(e) => setCouponId(e.target.value)}
            >
              <option value="">선택 안 함</option>
              {availableCoupons.map((c) => {
                const ctype = String(c.type || "").toLowerCase().trim();
                const isPercent =
                  ctype === "percent" ||
                  ctype === "percentage" ||
                  ctype === "rate";

                let label = "";
                if (isPercent) {
                  const rate = Number(c.rate) || toNumber(c.rate) || 0;
                  const cap = toNumber(c.max) || toNumber(c.amount) || 0;
                  label = `${rate}%${cap ? ` (최대 ${formatKRW(cap)})` : ""}`;
                } else {
                  const amt =
                    toNumber(c.amount) ||
                    toNumber(c.value) ||
                    toNumber(c.name);
                  label = formatKRW(amt);
                }
                return (
                  <option key={String(c.id)} value={String(c.id)}>
                    {c.name} - {label}
                  </option>
                );
              })}
            </select>

            <p className="coupon-hint">
              적용 할인 예상: <b>{formatKRW(discount)}</b>
            </p>
          </>
        )}
      </section>

      {/* 합계 */}
      <section className="section">
        <div className="sum-row">
          <span>총 상품 금액</span>
          <b>{formatKRW(subtotal)}</b>
        </div>
        <div className="sum-row">
          <span>쿠폰 할인</span>
          <b>-{formatKRW(discount)}</b>
        </div>
        <div className="sum-row">
          <span>배송비</span>
          <b>{formatKRW(shipping)}</b>
        </div>
        <div className="sum-row total">
          <span>최종 결제 금액</span>
          <b>{formatKRW(total)}</b>
        </div>

        {/* 결제수단 선택 페이지로 이동 */}
        <button className="pay-btn" onClick={goPaymentMethod}>
          결제하기
        </button>

    
      </section>
    </div>
  );
}
