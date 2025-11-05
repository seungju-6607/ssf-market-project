// src/pages/order/PayConfirm.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./PayConfirm.css";

const toNumber = (v) => (typeof v === "number" ? v : Number(String(v ?? "").replace(/[^\d]/g, "")) || 0);
const formatKRW = (n) => `₩${Number(n || 0).toLocaleString()}`;
const readJSON = (k, f) => { try { const v = JSON.parse(localStorage.getItem(k) || "null"); return v ?? f; } catch { return f; } };

// 안전한 이미지 경로 유틸 (QR만 사용)
const PLACEHOLDER = `${process.env.PUBLIC_URL || ""}/images/placeholder.webp`;
const srcOf = (raw) => {
  const s = String(raw || "").trim();
  if (!s) return PLACEHOLDER;
  if (/^https?:\/\//i.test(s)) return s;
  return `${process.env.PUBLIC_URL || ""}/${s.replace(/^\/+/, "")}`;
};

// 다양한 형태의 item을 한 형태로 표준화
const normalizeItem = (raw) => {
  if (!raw) return null;
  const p = raw.product || raw;
  return {
    product: {
      id: p.id,
      name: p.name || "",
      image: p.image || p.img || "",
      price: toNumber(p.price),
    },
    option: { size: raw.size || p.size || "" },
    qty: toNumber(raw.qty || p.qty || 1),
  };
};

export default function PayConfirm() {
  const navigate = useNavigate();
  const location = useLocation();
  const incoming = useMemo(() => {
    // 우선순위: (1) location.state (2) localStorage.payPayload
    const fromState = location.state || null;
    if (fromState && fromState.items && fromState.items.length) return fromState;
    return readJSON("payPayload", null);
  }, [location.state]);

  const method = incoming?.method || "toss";
  const methodLabel = method === "kakao" ? "카카오페이" : method === "naver" ? "네이버페이" : "토스페이";

  useEffect(() => {
    if (!incoming || !incoming.items || incoming.items.length === 0) {
      navigate("/order/checkout");
    }
  }, [incoming, navigate]);

  const items = useMemo(() => (incoming?.items || []).map(normalizeItem).filter(Boolean), [incoming]);

  // 금액 계산
  const subtotal = useMemo(() => items.reduce((s, it) => s + toNumber(it.product.price) * it.qty, 0), [items]);
  const rawDiscount = toNumber(incoming?.coupon?.discount || incoming?.discount);
  const effectiveDiscount = Math.min(subtotal, Math.max(0, rawDiscount));
  const shipping = toNumber(incoming?.shipping || 0);
  const total = Math.max(0, subtotal - effectiveDiscount + shipping);

  // QR 경로
  const qrCandidates = ["/icons/qr.png", "/icons/qr.webp", "/icons/qr.jpg"];
  const qrSrc0 = useMemo(() => srcOf(qrCandidates[0]), []);

  const [paying, setPaying] = useState(false);

  const markCouponUsed = () => {
    const c = incoming?.coupon;
    if (!c) return;
    const list = readJSON("coupons", []);
    const next = list.map((x) =>
      String(x.id) === String(c.id) ? { ...x, used: true, usedAt: new Date().toISOString() } : x
    );
    localStorage.setItem("coupons", JSON.stringify(next));
  };

  // 주문 저장: 각 상품 당 한 건씩(관리자/마이페이지 호환)
  const saveOrders = () => {
    const user = readJSON("loginUser", null);
    const buyer = user
      ? { id: user.id, name: user.name || (user.email ? user.email.split("@")[0] : "사용자"), email: user.email || "" }
      : { id: "guest", name: "비회원", email: "" };

    const prev = readJSON("orders", []);
    const now = new Date();
    const iso = now.toISOString();
    const baseId = Date.now();

    // 할인 분배 (비례 분배)
    const parts = items.map((it) => toNumber(it.product.price) * it.qty);
    const partsSum = parts.reduce((a, b) => a + b, 0) || 1;
    const discounts = parts.map((p) => Math.round((p / partsSum) * effectiveDiscount));

    const perItemOrders = items.map((it, idx) => {
      const price = toNumber(it.product.price);
      const qty = toNumber(it.qty);
      const line = price * qty;
      const dc = Math.min(line, toNumber(discounts[idx] || 0));
      const totalLine = Math.max(0, line - dc + (idx === 0 ? shipping : 0)); // 배송비는 첫 아이템에만

      return {
        id: `ORD-${baseId}-${idx}`,
        createdAt: iso,
        buyer,
        product: { id: it.product.id, name: it.product.name, image: it.product.image, price },
        option: { size: it.option?.size || "" },
        qty,
        subtotal: line,
        discount: dc,
        shipping: idx === 0 ? shipping : 0,
        total: totalLine,
        method: methodLabel,
        status: "결제완료",
      };
    });

    const next = [...perItemOrders, ...prev];
    localStorage.setItem("orders", JSON.stringify(next));
    return perItemOrders.map(o => o.id);
  };

  const clearTemp = () => {
    localStorage.removeItem("payPayload");
    localStorage.removeItem("pendingOrder");
    localStorage.removeItem("cartCheckout");
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const onClickPay = () => {
    if (paying) return;
    setPaying(true);
    try {
      // 실제 결제 SDK가 들어갈 자리 (성공 가정)
      markCouponUsed();
      saveOrders();
      clearTemp();
      navigate("/orders");
    } catch (e) {
      console.error(e);
      alert("결제 처리에 실패했습니다. 다시 시도해주세요.");
      setPaying(false);
    }
  };

  if (!incoming) return null;

  return (
    <div className="pc-wrap">
      {/* QR 영역 */}
      <div className="pc-col qr">
        <h2 className="pc-title">{methodLabel} QR</h2>
        <div className="pc-qrbox">
          <img src={qrSrc0} alt="결제 QR" onError={(e) => (e.currentTarget.src = qrSrc0)} />
        </div>
        <div style={{ marginTop: 10, color: "#666", fontSize: 14 }}>
          앱에서 QR을 스캔해 결제를 진행하세요.
        </div>

        <div className="pc-actions" style={{ marginTop: 16 }}>
          <button className="btn btn-primary" onClick={onClickPay} disabled={paying}>
            {paying ? "처리 중..." : "결제 완료"}
          </button>
          <button className="ghost" onClick={() => navigate(-1)} style={{ marginLeft: 8 }} disabled={paying}>
            이전으로
          </button>
        </div>
      </div>

      {/* 합계 */}
      <div className="pc-col sum">
        <h2 className="pc-title">주문 요약</h2>
        <div className="pc-items">
          {items.map((it, i) => (
            <div className="pc-item" key={`${it.product.id}-${i}`}>
              <div className="pc-name">{it.product.name}</div>
              <div className="pc-qty">{it.qty}개</div>
              <div className="pc-price">{formatKRW(toNumber(it.product.price) * it.qty)}</div>
            </div>
          ))}
        </div>

        <div className="pc-sum">
          <div className="pc-row"><span>상품 금액</span><b>{formatKRW(subtotal)}</b></div>
          <div className="pc-row"><span>할인</span><b>-{formatKRW(effectiveDiscount)}</b></div>
          <div className="pc-row"><span>배송비</span><b>{formatKRW(shipping)}</b></div>
          <div className="pc-row total"><span>결제 금액</span><b>{formatKRW(total)}</b></div>
        </div>
      </div>
    </div>
  );
}
