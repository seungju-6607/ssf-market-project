import React, { useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { showOrderList } from "../../feature/payment/paymentAPI";
import { useDispatch, useSelector } from "react-redux";
import "./PayConfirm.css";

const toNumber = (v) => (typeof v === "number" ? v : Number(String(v ?? "").replace(/[^\d]/g, "")) || 0);
const formatKRW = (n) => `₩${Number(n || 0).toLocaleString()}`;

export default function PayConfirm() {
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const orderId = searchParams.get("orderId");
    const orderList = useSelector((state) => state.payment.orderList);
    const firstOrder = orderList?.[0];
    const orderDateLabel = useMemo(() => {
      const date = firstOrder?.odate ? new Date(firstOrder.odate) : new Date();
      return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    }, [firstOrder]);
    

    useEffect(() => {
        if (orderId) {
            dispatch(showOrderList(orderId));
        }

        // 결제 완료 후 임시 저장소 정리
        localStorage.removeItem("cartCheckout");
        localStorage.removeItem("directCheckout");
        localStorage.removeItem("orderSource");
    }, [orderId, dispatch]);

    // 총액 계산 - 실제 결제 금액 사용 (쿠폰 할인 적용된 금액)
    // orderList의 첫 번째 항목에서 totalPrice를 가져오거나, 없으면 개별 상품 가격 합계 사용
    const totalPrice = firstOrder?.totalPrice 
      ? toNumber(firstOrder.totalPrice)
      : (orderList?.reduce(
          (sum, i) => sum + toNumber(i.itemPrice) * i.itemQty,
          0
        ) || 0);

    // 썸네일 대표이미지 추출
    const extractThumb = (itemList) => {
        if (!itemList) return "";
        try {
            const parsed = typeof itemList === "string" ? JSON.parse(itemList) : itemList;
            if (Array.isArray(parsed) && parsed.length > 0) {
                const first = parsed[0];
                if (typeof first === "string") return first;
                if (first?.url) return first.url;
                if (first?.src) return first.src;
            }
        } catch (err) {
            console.error("대표 이미지 파싱 실패", err);
        }
        return "";
    };

    const goHome = () => navigate("/");

    return (
        <div className="pc-wrap">
            <div className="pc-card">
                <header className="pc-header">
                    <div>
                        <div className="pc-date">{orderDateLabel}</div>
                        <p className="pc-recipient">
                            받으시는 분 : <strong>{firstOrder?.userName || "-"}</strong>
                        </p>
                    </div>
                    <div className="pc-order-links">
                        <span className="pc-order-id">주문번호 : {orderId}</span>
                        {/* <button type="button" className="pc-detail-link" onClick={goHome}>
                            주문상세 &gt;
                        </button> */}
                    </div>
                </header>

                <section className="pc-items-block">
                    {orderList && orderList.length > 0 ? (
                        orderList.map((item, idx) => {
                            const thumb = extractThumb(item.itemList);
                            return (
                                <article className="pc-row-item" key={`${item.itemName}-${idx}`}>
                                    <div className="pc-item-left">
                                        {thumb ? (
                                            <img className="pc-main-thumb" src={thumb} alt={item.itemName} />
                                        ) : (
                                            <div className="pc-main-thumb placeholder" />
                                        )}
                                    </div>
                                    <div className="pc-item-info">
                                        <span className="pc-badge">빠른배송</span>
                                        <h4>{item.itemName}</h4>
                                        <p className="pc-option">수량 {item.itemQty}개</p>
                                        <p className="pc-price-lg">{formatKRW(toNumber(item.itemPrice))}</p>
                                    </div>
                                    <div className="pc-item-status">
                                        <span>결제완료</span>
                                    </div>
                                </article>
                            );
                        })
                    ) : (
                        <div className="pc-empty">주문 상품을 불러오는 중입니다.</div>
                    )}
                </section>

                {firstOrder && (
                    <section className="pc-order-info">
                        <h3>주문 정보</h3>
                        <dl>
                            <div>
                                <dt>받는 분</dt>
                                <dd>{firstOrder.userName}</dd>
                            </div>
                            <div>
                                <dt>주소</dt>
                                <dd>
                                    ({firstOrder.addrZipCode}) {firstOrder.addrMain} {firstOrder.addrDetail}
                                </dd>
                            </div>
                            <div>
                                <dt>연락처</dt>
                                <dd>{firstOrder.addrTel}</dd>
                            </div>
                            <div>
                                <dt>배송 메모</dt>
                                <dd>{firstOrder.addrReq || "요청사항 없음"}</dd>
                            </div>
                        </dl>
                    </section>
                )}

                <footer className="pc-footer">
                    <div className="pc-total">
                        <span>결제 금액</span>
                        <strong>{formatKRW(totalPrice)}</strong>
                    </div>
                    <button type="button" className="pc-home-btn" onClick={goHome}>
                        홈으로 가기
                    </button>
                </footer>
            </div>
        </div>
    );
}