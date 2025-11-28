// src/pages/order/MyOrders.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderHistory } from "../../feature/order/orderAPI.js";
import "./MyOrders.css";

const formatKRW = (n) => `₩${Number(n || 0).toLocaleString()}`;

export default function MyOrders() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const orderHistory = useSelector((state) => state.order.orderHistory);
  const user = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("loginUser")) || null; } catch { return null; }
  }, []);

  const today = useMemo(() => new Date(), []);

  // 3개월 전 날짜가 기본
  const threeMonthsAgo = useMemo(() => {
    const base = new Date();
    base.setMonth(base.getMonth() - 3);
    return base;
  }, []);

  const toDateInput = (d) => {
    if (!d) return "";
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const [startDate, setStartDate] = useState(toDateInput(threeMonthsAgo));
  const [endDate, setEndDate] = useState(toDateInput(today));
  const [appliedRange, setAppliedRange] = useState({
    startDate: toDateInput(threeMonthsAgo),
    endDate: toDateInput(today),
  });

  useEffect(() => {
    if (user?.email) {
      dispatch(fetchOrderHistory(appliedRange));
    }
  }, [dispatch, user?.email, appliedRange.startDate, appliedRange.endDate]);

  const handleSearch = () => {
    if (startDate && endDate && startDate > endDate) {
      alert("시작일이 종료일 이후입니다.");
      return;
    }
    setAppliedRange({ startDate, endDate });
  };

  // 날짜값을 YYYY.MM.DD 형식의 문자열로 바꿔줌
  const formatDate = (dateValue) => {

    if (!dateValue) return "-";
    let d = new Date(dateValue);
    if (isNaN(d.getTime())) return "-";

    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    return `${y}.${m}.${day}`;
  };

  //imgList가 ["URL 문자열"] 형태여도 하나의 String으로 인식하기 때문에 파싱필요.
  const extractThumb = (itemList) => {
    if (!itemList) return null;
    try {
      const parsed = typeof itemList === "string" ? JSON.parse(itemList) : itemList;
      if (Array.isArray(parsed) && parsed.length > 0) {

        const first = parsed[0];
        if (typeof first === "string") return first;

      }
    } catch (err) {
      console.error("이미지 파싱 실패", err);
    }
    return null;
  };

  if (!user) {
    return (
      <div className="my-orders-container">
        <div className="my-orders-header">
          <h1 className="my-orders-title">주문내역</h1>
        </div>
        <p>로그인이 필요합니다.</p>
        <button onClick={() => navigate("/login")} className="login-button">로그인 하러가기</button>
      </div>
    );
  }

  return (
    <div className="my-orders-container">
      <div className="my-orders-header">
        <h1 className="my-orders-title">주문내역</h1>
        <div className="my-orders-filter">
          <label>
            <span>시작일</span>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </label>
          <label>
            <span>종료일</span>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </label>
          <button type="button" onClick={handleSearch} className="my-orders-filter-btn">
            검색
          </button>
        </div>
      </div>

      {!orderHistory || orderHistory.length === 0 ? (
        <div className="empty-orders-container">
          <div>주문 내역이 없습니다.</div>
          <Link to="/" className="continue-shopping-link">쇼핑 계속하기</Link>
        </div>
        ) : (
        <div className="orders-list">

          {/* 첫번째 그룹 반복 - UUID 기준 */}
          {orderHistory.map((orderItems, orderIdx) => {
            const firstItem = orderItems[0]; // 주문 정보는 첫 번째 아이템에서 가져오기
            return (
              <div key={firstItem.orderId} className="my-orders-item-group">
                <div className="my-orders-group-header">
                  <div className="my-orders-date-label">
                    {formatDate(firstItem.orderedAt)}
                  </div>
                  <button
                    type="button"
                    className="my-orders-detail-btn"
                    onClick={() =>
                      navigate("/mypage/orders/detail", {
                        state: { orderId: firstItem.orderId, orderedAt: firstItem.orderedAt },
                      })
                    }
                  >
                    주문상세 &gt;
                  </button>
                </div>

                {/* 두번째 그룹 반복 - 위에서 가져온 orderItems 요소를 다시한번 map 돌린다. */}
                {orderItems.map((o, idx) => {
                  const thumb = extractThumb(o.itemList);
                  return (
                    <div key={`${o.orderId}-${idx}`} className="my-orders-item">
                      <div className="my-orders-body">
                        <div className="my-orders-product-image-wrapper">
                          {thumb ? (
                            <img
                              src={thumb}
                              alt={o.itemName || "상품"}
                              className="my-orders-product-image"
                              onError={(e) => {
                                e.currentTarget.src = `${process.env.PUBLIC_URL}/images/placeholder.png`;
                              }}
                            />
                          ) : (
                            <div className="my-orders-product-image placeholder">
                              <span>이미지 없음</span>
                            </div>
                          )}
                        </div>

                        <div className="my-orders-product-info">
                          <div className="my-orders-product-name">{o.itemName || "-"}</div>
                          <div className="my-orders-option">
                            {o.itemSize && <span>사이즈: {o.itemSize}</span>}
                            {o.itemSize && o.itemQty && <span>  </span>}
                            {o.itemQty && <span>수량: {o.itemQty}</span>}
                          </div>
                        </div>

                        <div className="my-orders-price-wrapper">
                          <span className="my-orders-price">{formatKRW(o.itemPrice)}</span>
                        </div>

                        <div className="my-orders-status-wrapper">
                          <span className="my-orders-status">결제완료</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
        )
      }
    </div>
  )
}
