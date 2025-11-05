// src/pages/order/PaySelect.jsx
import React, { useMemo, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./PaySelect.css";

const formatKRW = (n) => `₩${Number(n || 0).toLocaleString()}`;

export default function PaySelect() {
  const navigate = useNavigate();
  const location = useLocation();
  const [method, setMethod] = useState("toss");

  // 1) 체크아웃에서 온 state 우선, 없으면 lastCheckout(백업), 마지막으로 payPayload
  const payload = useMemo(() => {
    try {
      const fromState = location.state || null;
      if (fromState && fromState.items && fromState.items.length) return fromState;
      const last = JSON.parse(localStorage.getItem("lastCheckout") || "null");
      if (last && last.items && last.items.length) return last;
      const payPayload = JSON.parse(localStorage.getItem("payPayload") || "null");
      return payPayload;
    } catch {
      return null;
    }
  }, [location.state]);

  useEffect(() => {
    if (!payload || !payload.items || payload.items.length === 0) {
      // 유효한 결제 대상 없으면 체크아웃으로 되돌림
      navigate("/order/checkout");
    }
  }, [payload, navigate]);

  if (!payload) return null;

  const goConfirm = () => {
    const next = { ...payload, method };
    try {
      localStorage.setItem("payPayload", JSON.stringify(next));
    } catch {}
    navigate("/pay/confirm", next);
  };

  return (
    <div className="ps-wrap">
      <div className="ps-card">
        <h2 className="ps-title">결제수단 선택</h2>

        <div className="ps-methods">
          <label className={`ps-row ${method === "toss" ? "active" : ""}`}>
            <input type="radio" name="pm" value="toss" checked={method === "toss"} onChange={() => setMethod("toss")} />
            <span>토스페이</span>
          </label>
          <label className={`ps-row ${method === "kakao" ? "active" : ""}`}>
            <input type="radio" name="pm" value="kakao" checked={method === "kakao"} onChange={() => setMethod("kakao")} />
            <span>카카오페이</span>
          </label>
          <label className={`ps-row ${method === "naver" ? "active" : ""}`}>
            <input type="radio" name="pm" value="naver" checked={method === "naver"} onChange={() => setMethod("naver")} />
            <span>네이버페이</span>
          </label>
        </div>

        <div className="ps-summary">
          <div><span>상품 개수</span><b>{payload.items?.length || 0}개</b></div>
          <div><span>결제 금액</span><b>{formatKRW(payload.total)}</b></div>
        </div>

        <div className="ps-actions">
          <button type="button" className="ps-next" onClick={goConfirm}>다음으로</button>
        </div>
      </div>
    </div>
  );
}
