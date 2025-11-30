import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchOrderDetail } from "../../feature/order/orderAPI.js";
import { fetchAdminOrderDetail, cancelOrder } from "../../feature/admin/adminOrdersAPI.js";
import "./MyOrdersDetail.css";

const formatKRW = (n) => `₩${Number(n || 0).toLocaleString()}`;

const shortenOrderId = (id = "") => {
  if (!id || id.length < 13) return id;
  return `${id.slice(0, 8)}${id.slice(9, 13)}`;
};

const formatDateTime = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
};

const extractThumb = (itemList) => {
  if (!itemList) return null;
  try {
    const parsed = typeof itemList === "string" ? JSON.parse(itemList) : itemList;
    if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === "string") {
      return parsed[0];
    }
  } catch (err) {
    console.error("이미지 파싱 실패", err);
  }
  return null;
};

const buildOptionText = (item) => {
  const parts = [];
  if (item.size) parts.push(`사이즈 ${item.size}`);
  if (item.quantity) parts.push(`${item.quantity}개`);
  return parts.length > 0 ? parts.join(" · ") : "-";
};

export default function MyOrdersDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const isAdminUser = (authState?.role || "").toLowerCase() === "admin";

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("loginUser")) || null;
    } catch {
      return null;
    }
  }, []);

  const isAdmin = location.state?.isAdmin === true;
  const fullOrderId = location.state?.orderId || "";
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!fullOrderId || (!isAdmin && !user?.email)) {
      setLoading(false);
      setError("주문 정보를 불러올 수 없습니다.");
      return;
    }

    let mounted = true; //가져오고자 하는 데이터가 모두 mount 되었는지 확인하기위한 플래그
    setLoading(true);
    setError(null);

    const load = async () => {
      try {
        const data = isAdmin
          ? await fetchAdminOrderDetail(fullOrderId)
          : await dispatch(fetchOrderDetail(fullOrderId));

        if (!mounted) return;
        setDetail(data);
        setLoading(false);
      } catch (e) {
        console.error("주문 상세 조회 실패:", e);
        if (!mounted) return;
        setError("주문 정보를 불러오지 못했습니다.");
        setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [dispatch, user?.email, fullOrderId, isAdmin]);

  if (!user) {
    return (
      <div className="order-detail-page">
        <div className="order-detail-card">
          <p>로그인이 필요합니다.</p>
          <button type="button" className="detail-outline-btn" onClick={() => navigate("/login")}>
            로그인 하러가기
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="order-detail-page">
        <div className="order-detail-card">
          <p>주문 정보를 불러오는 중입니다.</p>
        </div>
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="order-detail-page">
        <div className="order-detail-card">
          <p>{error || "주문 정보를 찾을 수 없습니다."}</p>
          <div className="detail-actions">
            <button type="button" className="detail-outline-btn" onClick={() => navigate(-1)}>
              목록으로
            </button>
          </div>
        </div>
      </div>
    );
  }

  const greetingName = detail.customerName || user.username || "-";
  const totalPurchaseText = `누적 구매금액 ${formatKRW(detail.totalPurchase)}`;
  const displayOrderId = shortenOrderId(detail.orderId);
  const orderedAt = formatDateTime(detail.orderedAt);
  const buyer = detail.buyer || {};
  const shipping = detail.shipping || {};
  const amounts = detail.amounts || {};
  const items = detail.items || [];
  const orderStatus = detail.orderStatus || "S";
  const isCancelled = orderStatus === "C";

  const handleCancelOrder = async () => {
    if (!window.confirm("정말 주문을 취소하시겠습니까?")) {
      return;
    }

    setCancelling(true);
    try {
      await cancelOrder(fullOrderId);
      // 주문 상세 정보 다시 불러오기
      const updatedDetail = isAdmin
        ? await fetchAdminOrderDetail(fullOrderId)
        : await dispatch(fetchOrderDetail(fullOrderId));
      setDetail(updatedDetail);
      alert("주문이 취소되었습니다.");
    } catch (e) {
      console.error("주문 취소 실패:", e);
      alert("주문 취소에 실패했습니다.");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="order-detail-page">
      <div className="order-detail-card">
        <section className="detail-greeting">
          <div className="detail-avatar" aria-hidden />
          <div className="detail-greeting-text">
            <p className="detail-greeting-title">{greetingName} 님의 주문 내역</p>
            <p className="detail-greeting-sub">{totalPurchaseText}</p>
          </div>
          <div className="detail-badge">
            <strong>사용 가능한 쿠폰</strong>
            <span>{detail.couponCount ?? 0}</span>
          </div>
        </section>

        <section className="detail-order-info">
          <div>
            <span className="detail-label">주문일시</span>
            <strong>{orderedAt}</strong>
          </div>
          <div>
            <span className="detail-label">주문번호</span>
            <strong>{displayOrderId}</strong>
          </div>
        </section>

        <section className="detail-items">
          <header className="detail-section-header">주문 상세 내역</header>
          <div className="detail-item-head">
            <span>상품정보</span>
          </div>
          {items.map((item, idx) => {
            const thumb = extractThumb(item.itemList);
            return (
              <div key={`${item.name}-${idx}`} className="detail-item-row">
                <div className="detail-item-info">
                  <div className="detail-item-thumb">
                    {thumb ? (
                      <img
                        src={thumb}
                        alt={item.name || "상품"}
                        onError={(e) => {
                          e.currentTarget.src = `${process.env.PUBLIC_URL}/images/placeholder.png`;
                        }}
                      />
                    ) : (
                      <span>이미지 없음</span>
                    )}
                  </div>
                  <div>
                    <p className="detail-item-name">{item.name}</p>
                    <p className="detail-item-option">{buildOptionText(item)}</p>
                    <p className="detail-item-price">{formatKRW(item.price)}</p>
                  </div>
                </div>
                <div className="detail-item-status">
                  {isCancelled ? (
                    <button 
                      type="button" 
                      className="detail-cancel-btn"
                    >
                      주문취소
                    </button>
                  ) : (
                    <button 
                      type="button" 
                      className="detail-ghost-btn"
                    >
                      결제완료
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </section>

        <section className="detail-grid">
          <div className="detail-section">
            <header className="detail-section-header">구매자 정보</header>
            <dl>
              <div>
                <dt>주문자</dt>
                <dd>{buyer.name || "-"}</dd>
              </div>
              <div>
                <dt>연락처</dt>
                <dd>{buyer.phone || "-"}</dd>
              </div>
              <div>
                <dt>이메일</dt>
                <dd>{buyer.email || "-"}</dd>
              </div>
            </dl>
          </div>

          <div className="detail-section">
            <header className="detail-section-header">배송지 정보</header>
            <dl>
              <div>
                <dt>수령인</dt>
                <dd>{shipping.recipient || "-"}</dd>
              </div>
              <div>
                <dt>연락처</dt>
                <dd>{shipping.phone || "-"}</dd>
              </div>
              <div>
                <dt>배송지</dt>
                <dd>
                  {shipping.zipcode ? `(${shipping.zipcode}) ` : ""}
                  {shipping.address || ""}
                  {shipping.addressDetail ? `, ${shipping.addressDetail}` : ""}
                </dd>
              </div>
              <div>
                <dt>배송 메모</dt>
                <dd>{shipping.memo || "-"}</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="detail-amounts">
          <header className="detail-section-header">주문 금액 상세</header>
          <ul>
            <li>
              <span>상품금액</span>
              <strong>{formatKRW(amounts.product)}</strong>
            </li>
            <li>
              <span>배송비</span>
              <strong>{formatKRW(amounts.shippingFee)}</strong>
            </li>
            <li>
              <span>할인금액</span>
              <strong>- {formatKRW(amounts.discount)}</strong>
            </li>
            <li className="detail-amount-total">
              <span>총 결제금액</span>
              <strong>{formatKRW(amounts.payTotal)}</strong>
            </li>
          </ul>
        </section>

        <div className="detail-actions">
          {isAdminUser && !isCancelled && (
            <button 
              type="button" 
              onClick={handleCancelOrder}
              className="detail-cancel-outline-btn"
              disabled={cancelling}
            >
              주문취소
            </button>
          )}
          <button type="button" onClick={() => navigate(-1)} className="detail-outline-btn">
            목록으로
          </button>
        </div>
      </div>
    </div>
  );
}

