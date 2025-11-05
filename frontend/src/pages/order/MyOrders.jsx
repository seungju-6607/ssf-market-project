// src/pages/order/MyOrders.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./MyOrders.css";

const formatKRW = (n) => `₩${Number(n || 0).toLocaleString()}`;

export default function MyOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState(() => {
    try { return JSON.parse(localStorage.getItem("orders")) || []; } catch { return []; }
  });
  const user = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("loginUser")) || null; } catch { return null; }
  }, []);

  useEffect(() => {
    try { setOrders(JSON.parse(localStorage.getItem("orders")) || []); }
    catch { setOrders([]); }
  }, []);

  const mine = useMemo(() => {
    if (!user?.email) return [];
    return orders.filter((o) => (o.buyer?.email || "") === user.email);
  }, [orders, user]);

  const formatDate = (msOrIso) => {
    if (!msOrIso) return "-";
    const d = typeof msOrIso === "number" ? new Date(msOrIso) : new Date(msOrIso);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${y}-${m}-${day} ${hh}:${mm}`;
  };

  if (!user) {
    return (
      <div className="my-orders-container">
        <h1 className="my-orders-title">주문내역</h1>
        <p>로그인이 필요합니다.</p>
        <button onClick={() => navigate("/login")} className="login-button">로그인 하러가기</button>
      </div>
    );
  }

  return (
    <div className="my-orders-container">
      <h1 className="my-orders-title">주문내역</h1>

      {mine.length === 0 ? (
        <div className="empty-orders-container">
          <div>주문 내역이 없습니다.</div>
          <Link to="/" className="continue-shopping-link">쇼핑 계속하기</Link>
        </div>
      ) : (
        <div className="orders-list">
          {mine.map((o) => (
            <div key={o.id} className="order-item">
              <div className="order-header">
                <div className="order-id">주문번호 {o.id}</div>
                <div className="order-date">{formatDate(o.createdAt)}</div>
              </div>

              <div className="order-body">
                <div className="order-product">
                  <img
                    src={o.product?.image || o.product?.img || "/images/noimg.png"}
                    alt={o.product?.name || "상품"}
                    className="order-product-image"
                    onError={(e)=>{e.currentTarget.src="/images/noimg.png"}}
                  />
                  <div className="order-info">
                    <div className="order-name">{o.product?.name || "-"}</div>
                    <div className="order-meta">
                      <span>옵션: {o.option?.size || "-"}</span>
                      <span style={{ marginLeft: 10 }}>수량: {o.qty || 1}개</span>
                    </div>
                  </div>
                </div>

                <div className="order-total">{formatKRW(o.total)}</div>
              </div>

              <div className="order-footer">
                <span className="order-status">{o.status}</span>
                {o.product?.id && (
                  <Link to={`/product/${o.product.id}`} className="view-product-link">상품보기</Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
