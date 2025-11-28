// src/pages/mypage/MyCoupons.jsx
import React, { useEffect, useState } from "react";
import "../../styles/MyCoupons.css";
import { useAuth } from "../../context/AuthContext";
import { fetchCouponInfo } from "../../feature/coupon/couponAPI";

export default function MyCoupons() {
  const { user } = useAuth();
  const [coupon, setCoupon] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.email) {
      setCoupon(null);
      return;
    }
    let mounted = true;
    const loadCoupon = async () => {
      setLoading(true);
      try {
        const data = await fetchCouponInfo(user.email);
        if (mounted) setCoupon(data || null);
      } catch (err) {
        console.error("쿠폰 조회 실패", err);
        if (mounted) setCoupon(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadCoupon();
    return () => {
      mounted = false;
    };
  }, [user?.email]);

  const visibleCoupon = coupon && coupon.couponYn === "Y" ? coupon : null;

  return (
    <div className="coupon-wrapper">
      <div className="coupon-container">
        <h2>내 쿠폰함</h2>
        {!visibleCoupon ? (
          <p className="empty-text">
            {loading ? "쿠폰 정보를 불러오는 중입니다." : "보유 중인 쿠폰이 없습니다."}
          </p>
        ) : (
          <div className="coupon-list">
            <div className="coupon-card">
              <div className="coupon-left">
                <h3>{visibleCoupon.couponName || visibleCoupon.name}</h3>
                <p>
                  <b>{(visibleCoupon.couponCost || visibleCoupon.discount || visibleCoupon.amount || 0).toLocaleString()}원</b> 할인<br />
                  {visibleCoupon.minPurchase
                    ? `₩${visibleCoupon.minPurchase.toLocaleString()} 이상 구매 시`
                    : "제한 없음"}
                </p>
              </div>
              <div className="coupon-right">
                <p>유효기간</p>
                <span>{visibleCoupon.expireAt || "-"}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
