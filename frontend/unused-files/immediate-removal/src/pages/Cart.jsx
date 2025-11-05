// src/pages/Cart.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useRequireAuth from "../hooks/useRequireAuth";
import { toNumber, formatKRW } from "../utils/money";

function getCart() {
  try { return JSON.parse(localStorage.getItem("cart") || "[]"); } catch { return []; }
}
function setCart(items) {
  localStorage.setItem("cart", JSON.stringify(items));
}

export default function Cart() {
  const ok = useRequireAuth(); // 로그인 강제
  const navigate = useNavigate();
  const [items, setItems] = useState(getCart());

  const subtotal = useMemo(
    () => items.reduce((sum, it) => sum + toNumber(it.price) * (it.qty || 1), 0),
    [items]
  );

  if (!ok) return null;

  const updateQty = (id, qty) => {
    const next = items.map((it) => (it.id === id ? { ...it, qty } : it));
    setItems(next); setCart(next);
  };

  const remove = (id) => {
    const next = items.filter((it) => it.id !== id);
    setItems(next); setCart(next);
  };

  return (
    <div className="container" style={{ padding: 24 }}>
      <h2>장바구니</h2>
      {items.length === 0 ? (
        <p>장바구니가 비었습니다.</p>
      ) : (
        <>
          {items.map((it) => (
            <div key={it.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid #eee" }}>
              <img src={it.img} alt={it.name} style={{ width: 80, height: 100, objectFit: "cover", borderRadius: 8 }} />
              <div style={{ flex: 1 }}>
                <div>{it.name}</div>
                <div style={{ color: "#666", fontSize: 13 }}>{formatKRW(it.price)}</div>
              </div>
              <input
                type="number"
                min={1}
                value={it.qty || 1}
                onChange={(e) => updateQty(it.id, Math.max(1, Number(e.target.value)))}
                style={{ width: 64 }}
              />
              <button onClick={() => remove(it.id)}>삭제</button>
            </div>
          ))}
          <div style={{ textAlign: "right", marginTop: 16 }}>
            <div>상품금액: <b>{formatKRW(subtotal)}</b></div>
            <button style={{ marginTop: 12 }} onClick={() => navigate("/checkout")}>
              주문하기
            </button>
          </div>
        </>
      )}
    </div>
  );
}
