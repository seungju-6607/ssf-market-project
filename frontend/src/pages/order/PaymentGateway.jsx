// src/pages/order/PaymentGateway.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// 금액 포맷/숫자화 유틸
const formatKRW = (n) => `₩${Number(n || 0).toLocaleString()}`;
const toNumber = (v) =>
  typeof v === "number" ? v : Number(String(v || "").replace(/[^\d]/g, "")) || 0;

export default function PaymentGateway() {
  const navigate = useNavigate();
  const location = useLocation();
  const [method, setMethod] = useState(""); // toss / kakao / naver
  const [processing, setProcessing] = useState(false);
  const [secLeft, setSecLeft] = useState(5);
  const timerRef = useRef(null);

  // Checkout에서 넘어온 결제 데이터
  const statePayment = location.state?.payment || null;

  // 혹시 새로고침 대비 로컬에 백업 저장
  useEffect(() => {
    if (statePayment) {
      localStorage.setItem("lastPayment", JSON.stringify(statePayment));
    }
  }, [statePayment]);

  // 마지막 결제 데이터 복구
  const backupPayment = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("lastPayment") || "null");
    } catch {
      return null;
    }
  }, []);

  const payment = statePayment || backupPayment;

  const items = payment?.items || [];
  const subtotal = toNumber(payment?.subtotal);
  const discount = toNumber(payment?.discount);
  const shipping = toNumber(payment?.shipping);
  const total = Math.max(0, subtotal - discount + shipping);

  // 결제 요청
  const requestPay = () => {
    if (!payment || items.length === 0) {
      alert("결제 데이터가 없습니다. 다시 시도해 주세요.");
      navigate("/cart");
      return;
    }
    if (!method) {
      alert("결제수단을 선택해 주세요.");
      return;
    }

    setProcessing(true);
    setSecLeft(5);

    timerRef.current = setInterval(() => {
      setSecLeft((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current);
          handlePaidSuccess();
        }
        return s - 1;
      });
    }, 1000);
  };

  // 결제 성공 처리 (주문 생성 + 쿠폰 사용 처리 + 장바구니 정리)
  const handlePaidSuccess = () => {
    try {
      // 1) 주문 기록 저장
      const order = {
        id: `O-${Date.now()}`,
        createdAt: new Date().toISOString(),
        method,
        items,
        amounts: { subtotal, discount, shipping, total },
        coupon: payment?.coupon || null,
        status: "PAID",
      };
      const orders = JSON.parse(localStorage.getItem("orders") || "[]");
      orders.unshift(order);
      localStorage.setItem("orders", JSON.stringify(orders));

      // 2) 쿠폰 사용 처리
      if (payment?.coupon?.id) {
        const coupons = JSON.parse(localStorage.getItem("coupons") || "[]");
        const idx = coupons.findIndex((c) => c.id === payment.coupon.id);
        if (idx >= 0) {
          coupons[idx] = {
            ...coupons[idx],
            used: true,
            usedAt: new Date().toISOString(),
          };
          localStorage.setItem("coupons", JSON.stringify(coupons));
        }
      }

      // 3) 장바구니/임시 주문 청소
      localStorage.removeItem("pendingOrder");
      localStorage.removeItem("cartCheckout");
      localStorage.removeItem("lastPayment");

      // 장바구니 비우기 (헤더 카운트 갱신 이벤트 발송)
      localStorage.setItem("cart", JSON.stringify([]));
      try {
        window.dispatchEvent(new Event("cartUpdated"));
      } catch {}

      // 4) 성공 페이지로 이동
      navigate("/order/success", { state: { order } });
    } catch (e) {
      console.error(e);
      alert("결제 처리 중 오류가 발생했습니다.");
      navigate("/cart");
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  if (!payment || items.length === 0) {
    return (
      <div className="container" style={{ padding: 24 }}>
        <h2>결제</h2>
        선택된 주문 정보가 없습니다. <a href="/#/cart">장바구니</a>에서 다시 시도해 주세요.
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "24px 0 80px" }}>
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>결제수단 선택</h2>

      <section
        style={{
          maxWidth: 960,
          margin: "0 auto",
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 6px 18px rgba(0,0,0,.06)",
          padding: 20,
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: 12 }}>🧾 주문 금액</div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            rowGap: 10,
          }}
        >
          <div>총 상품 금액</div>
          <div>{formatKRW(subtotal)}</div>
          <div>쿠폰 할인</div>
          <div>-{formatKRW(discount)}</div>
          <div>배송비</div>
          <div>{formatKRW(shipping)}</div>
          <div style={{ fontWeight: 800, marginTop: 8 }}>최종 결제 금액</div>
          <div style={{ fontWeight: 800, marginTop: 8, color: "#5b21b6" }}>
            {formatKRW(total)}
          </div>
        </div>
      </section>

      <section
        style={{
          maxWidth: 960,
          margin: "16px auto 0",
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 6px 18px rgba(0,0,0,.06)",
          padding: 20,
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: 12 }}>💳 결제수단</div>

        <div style={{ display: "grid", gap: 12 }}>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              border: "1px solid #ddd",
              borderRadius: 10,
              padding: "12px 14px",
              cursor: "pointer",
            }}
          >
            <input
              type="radio"
              name="pm"
              value="toss"
              checked={method === "toss"}
              onChange={(e) => setMethod(e.target.value)}
            />
            토스페이
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              border: "1px solid #ddd",
              borderRadius: 10,
              padding: "12px 14px",
              cursor: "pointer",
            }}
          >
            <input
              type="radio"
              name="pm"
              value="kakao"
              checked={method === "kakao"}
              onChange={(e) => setMethod(e.target.value)}
            />
            카카오페이
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              border: "1px solid #ddd",
              borderRadius: 10,
              padding: "12px 14px",
              cursor: "pointer",
            }}
          >
            <input
              type="radio"
              name="pm"
              value="naver"
              checked={method === "naver"}
              onChange={(e) => setMethod(e.target.value)}
            />
            네이버페이
          </label>
        </div>

        <button
          onClick={requestPay}
          style={{
            marginTop: 16,
            width: "100%",
            height: 52,
            border: 0,
            borderRadius: 12,
            background: method ? "#5b21b6" : "#c4b5fd",
            color: "#fff",
            fontWeight: 800,
            fontSize: 16,
            cursor: method ? "pointer" : "not-allowed",
          }}
          disabled={!method || processing}
        >
          결제 요청
        </button>
      </section>

      {/* 진행 중 오버레이 */}
      {processing && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              width: 360,
              background: "#fff",
              borderRadius: 12,
              padding: 24,
              textAlign: "center",
              boxShadow: "0 6px 24px rgba(0,0,0,.2)",
            }}
          >
            <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 6 }}>
              {method === "toss" ? "토스페이" : method === "kakao" ? "카카오페이" : "네이버페이"}
            </div>
            <div style={{ color: "#666", marginBottom: 12 }}>
              결제 페이지로 연결 중입니다…
            </div>
            <div style={{ fontSize: 32, fontWeight: 900, color: "#5b21b6" }}>
              {secLeft}s
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
