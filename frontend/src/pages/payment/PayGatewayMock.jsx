// src/pages/payment/PayGatewayMock.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const toNum = (v) =>
  typeof v === "number" ? v : Number(String(v || 0).replace(/[^\d]/g, "")) || 0;
const fmt = (n) => `₩${Number(n || 0).toLocaleString()}`;

export default function PayGatewayMock() {
  const navigate = useNavigate();
  const location = useLocation();

  // backup payload
  const backup = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("lastCheckout") || "null");
    } catch {
      return null;
    }
  }, []);

  // /pay?pm=toss 호환
  const qs = new URLSearchParams(location.search);
  const pmFromQuery = qs.get("pm") || "";

  // 최종 payload 합성
  const raw =
    location.state ||
    backup ||
    { items: [], subtotal: 0, discount: 0, total: 0, couponId: null, method: "" };

  const payload = {
    items: Array.isArray(raw.items) ? raw.items : [],
    // 아래 subtotal/discount/total은 "표시용"으로 다시 계산하므로 일단 보조값만 들고있음
    subtotal: toNum(raw.subtotal),
    discount: toNum(raw.discount),
    total: toNum(raw.total),
    couponId: raw.couponId ?? null,
    method: (raw.method || pmFromQuery || "toss").toLowerCase(),
  };

  // 결제수단 타이틀
  const title =
    payload.method === "kakao" ? "카카오페이"
    : payload.method === "naver" ? "네이버페이"
    : "토스페이";

  // 아이템 없으면 복귀
  useEffect(() => {
    if (!payload.items.length) {
      alert("결제할 상품 정보가 없습니다. 장바구니로 이동합니다.");
      navigate("/cart");
    }
  }, [payload.items.length, navigate]);

  // ---- 금액 "재계산" (쿠폰/합계 일관성 보장) ----
  const subtotal = useMemo(() => {
    return payload.items.reduce((sum, it) => {
      const p = it.product || it;
      const price = toNum(p.price || it.price);
      const qty = Number(it.qty || p.qty || 1);
      return sum + price * qty;
    }, 0);
  }, [payload.items]);

  const couponDiscountCandidate = useMemo(() => {
    // 1) payload.discount 우선
    const fromPayload = toNum(payload.discount);
    if (fromPayload > 0) return fromPayload;

    // 2) couponId가 있으면 로컬 쿠폰에서 금액 탐색 (amount/discount/value 등 관용 필드 지원)
    if (payload.couponId != null) {
      try {
        const list = JSON.parse(localStorage.getItem("coupons") || "[]");
        const cid = String(payload.couponId);
        const found = list.find((c) => String(c.id) === cid);
        if (found) {
          return (
            toNum(found.amount) ||
            toNum(found.discount) ||
            toNum(found.value) ||
            0
          );
        }
      } catch {}
    }
    return 0;
  }, [payload.discount, payload.couponId]);

  // 쿠폰은 항상 상품합계 한도까지만
  const discount = Math.min(subtotal, Math.max(0, couponDiscountCandidate));
  const shipping = 0;
  const total = Math.max(0, subtotal - discount + shipping);

  // ---- UI/흐름 ----
  const [sec, setSec] = useState(5);
  const tickingRef = useRef(null);
  const qrSrc = `${process.env.PUBLIC_URL}/icons/qr.png`;

  const onPaySuccess = () => {
    // 1) 쿠폰 사용 처리
    try {
      if (payload.couponId != null) {
        const saved = JSON.parse(localStorage.getItem("coupons") || "[]");
        const cid = String(payload.couponId);
        const next = saved.map((c) =>
          String(c.id) === cid ? { ...c, used: true, usedAt: new Date().toISOString() } : c
        );
        localStorage.setItem("coupons", JSON.stringify(next));
      }
    } catch {}

    // 2) 주문 저장 (재계산 값 사용)
    try {
      const loginUser = JSON.parse(localStorage.getItem("loginUser") || "null");
      const userId = loginUser?.id || "guest";
      const orders = JSON.parse(localStorage.getItem("orders") || "[]");
      const orderId = `ORD-${Date.now()}`;
      const order = {
        id: orderId,
        userId,
        method: payload.method,
        items: payload.items,
        subtotal,
        discount,
        total,
        status: "PAID",
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem("orders", JSON.stringify([order, ...orders]));
      localStorage.setItem("lastOrderId", orderId);
    } catch {}

    // 3) 장바구니/임시데이터 정리
    try {
      localStorage.removeItem("cart");
      localStorage.removeItem("cartCheckout");
      window.dispatchEvent(new Event("cartUpdated"));
    } catch {}

    // 4) 성공 페이지로 이동 (재계산 값 포함해 넘김)
    navigate("/order/success", { state: {
      ...payload,
      subtotal,
      discount,
      total,
      paidAt: new Date().toISOString(),
    }});
  };

  // 자동 완료 타이머
  useEffect(() => {
    if (sec == null) return;
    tickingRef.current && clearInterval(tickingRef.current);
    tickingRef.current = setInterval(() => {
      setSec((s) => {
        if (s <= 1) {
          clearInterval(tickingRef.current);
          onPaySuccess();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => tickingRef.current && clearInterval(tickingRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ maxWidth: 820, margin: "48px auto", padding: "0 24px" }}>
      <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>결제 확인</h2>
      <p style={{ color: "#666", marginBottom: 24 }}>
        선택하신 <b>{title}</b> 결제창입니다. 아래 QR을 스캔해 결제를 진행해 주세요.
        <br />
        <b>{sec}</b>초 후 자동으로 결제가 완료됩니다.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>
        {/* QR 박스 */}
        <div style={{ border: "1px solid #eee", borderRadius: 16, padding: 20, textAlign: "center" }}>
          <div style={{ fontWeight: 600, marginBottom: 12 }}>{title} QR</div>
          <img
            src={qrSrc}
            alt="결제 QR"
            style={{ width: 260, height: 260, objectFit: "contain", margin: "0 auto", display: "block" }}
            onError={(e) => (e.currentTarget.style.visibility = "hidden")}
          />
          <div style={{ marginTop: 12, color: "#444" }}>{sec}초 뒤 결제가 자동 완료됩니다…</div>
        </div>

        {/* 주문 요약 */}
        <div style={{ border: "1px solid #eee", borderRadius: 16, padding: 20 }}>
          <div style={{ fontWeight: 700, marginBottom: 12 }}>주문 요약</div>

          <div style={{ display: "grid", gap: 8, marginBottom: 12 }}>
            {(payload.items || []).map((it) => (
              <div
                key={it.id}
                style={{ display: "grid", gridTemplateColumns: "60px 1fr auto", gap: 12, alignItems: "center" }}
              >
                <img
                  src={it.img || it.image}
                  alt={it.name}
                  style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8, background: "#fafafa" }}
                  onError={(e) =>
                    (e.currentTarget.src = `${process.env.PUBLIC_URL}/images/placeholder.png`)
                  }
                />
                <div style={{ fontSize: 14 }}>
                  <div style={{ fontWeight: 600 }}>{it.name}</div>
                  <div style={{ color: "#777", marginTop: 2 }}>수량 {toNum(it.qty) || 1}</div>
                </div>
                <div style={{ fontWeight: 600 }}>{fmt(toNum(it.price))}</div>
              </div>
            ))}
          </div>

          <div
            style={{
              borderTop: "1px dashed #eee",
              paddingTop: 10,
              marginTop: 6,
              display: "grid",
              gap: 6,
              fontSize: 14,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>총 상품 금액</span>
              <b>{fmt(subtotal)}</b>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>쿠폰 할인</span>
              <b>-{fmt(discount)}</b>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>배송비</span>
              <b>{fmt(0)}</b>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 16 }}>
              <span style={{ fontWeight: 700 }}>결제 금액</span>
              <b style={{ color: "#5b21b6" }}>{fmt(total)}</b>
            </div>
          </div>

          <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
            <button
              onClick={() => navigate(-1)}
              style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #ddd", background: "#fff", cursor: "pointer" }}
            >
              이전으로
            </button>
            
          </div>
        </div>
      </div>
    </div>
  );
}
