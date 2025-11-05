// src/pages/order/PaymentMethod.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Payment.css";

/** 아이콘/QR 파일명(원하시면 여기만 바꾸세요) */
const ASSETS = {
  toss: {
    label: "토스페이",
    icon: "/icons/tosspay.svg",
    qr: "/icons/qr_toss.png",
  },
  kakao: {
    label: "카카오페이",
    icon: "/icons/kakaopay.svg",
    qr: "/icons/qr_kakao.png",
  },
  naver: {
    label: "네이버페이",
    icon: "/icons/naverpay.svg",
    qr: "/icons/qr_naver.png",
  },
};

export default function PaymentMethod() {
  const navigate = useNavigate();
  const location = useLocation();
  const [method, setMethod] = useState("toss");
  const [seconds, setSeconds] = useState(5);

  // Checkout에서 넘어온 값
  const { amount = 0, items = [], coupon = null } = location.state || {};

  // 안전 가드
  useEffect(() => {
    if (!amount || !items.length) {
      // 금액/아이템이 없으면 결제 진행 불가 → 장바구니/결제로 돌려보내기
      navigate("/checkout");
    }
  }, [amount, items, navigate]);

  // (옵션) 카운트다운(모의 UX)
  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const selected = useMemo(() => ASSETS[method], [method]);

  const handleGo = () => {
    navigate("/pay/gateway", { state: {
      method,
      amount,
      items,
      coupon,
      // QR 이미지 경로는 여기서 넘겨줘도 되고, gateway에서 다시 맵핑해도 됩니다.
      qr: selected ? `${process.env.PUBLIC_URL}${selected.qr}` : "",
      label: selected?.label || "",
    }});
  };

  return (
    <div className="pay-wrap">
      <h2 className="pay-title">결제 수단 선택</h2>
      <p className="pay-sub">
        선택한 결제수단의 결제창으로 이동합니다. (모의) · 남은 시간: {seconds}초
      </p>

      <div className="pay-methods">
        {Object.entries(ASSETS).map(([key, cfg]) => (
          <label
            key={key}
            className={`pay-card ${method === key ? "active" : ""}`}
            onClick={() => setMethod(key)}
          >
            <input
              type="radio"
              name="pm"
              checked={method === key}
              onChange={() => setMethod(key)}
            />
            <img
              className="pay-icon"
              src={`${process.env.PUBLIC_URL}${cfg.icon}`}
              alt={cfg.label}
              onError={(e) => (e.currentTarget.style.visibility = "hidden")}
            />
            <span className="pay-label">{cfg.label}</span>
          </label>
        ))}
      </div>

      <div className="pay-go">
        <button className="pay-btn primary" onClick={handleGo}>
          결제창으로 이동 (모의)
        </button>
      </div>
    </div>
  );
}
