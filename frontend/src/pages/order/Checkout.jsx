// src/pages/order/Checkout.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Checkout.css";

/* ===========================
   1) 안전한 숫자 변환 / 통화 포맷
   =========================== */
const toNumber = (v) =>
  typeof v === "number" ? v : Number(String(v ?? "").replace(/[^\d]/g, "")) || 0;

const formatKRW = (n) => `₩${Number(n || 0).toLocaleString()}`;

/* ===========================
   2) 쿠폰 할인 계산 (문자/형식 섞여도 OK)
   - type: "fixed|flat" → 정액
           "percent|percentage|rate" → 비율
   - amount/value/name 에 숫자가 섞여 있어도 toNumber로 추출
   - rate는 15, "15%", "15 %”… 전부 처리
   - max/amount cap, min 주문금액도 처리
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
    const rate = Number(rawCoupon.rate) || toNumber(rawCoupon.rate) || 0; // "15%"도 가능
    discount = Math.floor((subtotal * rate) / 100);
    const cap = toNumber(rawCoupon.max) || toNumber(rawCoupon.amount) || 0;
    if (cap) discount = Math.min(discount, cap);
  } else {
    // fixed/flat/그 외 → 정액 처리
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

  // 쿠폰 목록: 컨텍스트가 있으면 그걸 쓰고, 없으면 localStorage에서
  const [coupons, setCoupons] = useState(() => readJSON("coupons", []));
  // 선택된 쿠폰
  const [couponId, setCouponId] = useState("");

  // 합계
  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, it) => sum + toNumber(it.product?.price) * Number(it.qty || 1),
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

  // 디버그 로그 (문제 시 콘솔에서 구조 확인)
  useEffect(() => {
    // console.log("[DEBUG] items:", items);
    // console.log("[DEBUG] subtotal:", subtotal);
    // console.log("[DEBUG] coupons:", coupons);
    // console.log("[DEBUG] selectedCoupon:", selectedCoupon);
    // console.log("[DEBUG] discount:", discount);
  }, [items, subtotal, coupons, selectedCoupon, discount]);

  // 결제 버튼 → 결제수단 선택 페이지로 이동(바로 결제 X)
const goPaymentMethod = () => {
  // PaySelect가 기대하는 데이터 구조로 전달
  const payloadData = {
    items,
    subtotal,
    discount,
    shipping,
    total,
    coupon: selectedCoupon ? { ...selectedCoupon, discount } : null,
  };

  // localStorage에도 백업 저장
  try {
    localStorage.setItem("lastCheckout", JSON.stringify(payloadData));
  } catch (e) {
    console.error("Failed to save checkout data:", e);
  }

  navigate("/pay", payloadData);
};

  // 쿠폰 사용 처리(실 결제 성공 후에 처리하는 게 정석; 여기서는 데모용)
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
              />
              <div className="order-info">
                <div className="order-name">{it.product?.name}</div>
                <div className="order-sub">
                  사이즈: {it.size || "-"} · 수량: {it.qty || 1}
                </div>
              </div>
              <div className="order-price">
                {formatKRW(toNumber(it.product?.price) * Number(it.qty || 1))}
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

        {/* 1) 결제수단 페이지로 이동 (권장) */}
        <button className="pay-btn" onClick={goPaymentMethod}>
          결제하기
        </button>

        {/* 2) 데모용 즉시 주문 완료(필요 없으면 지워도 됩니다) */}
        {/* <button className="pay-btn ghost" onClick={placeOrderForDemo}>
          (데모) 바로 결제 완료 처리
        </button> */}
      </section>
    </div>
  );
}
