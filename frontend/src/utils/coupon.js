// src/utils/coupon.js
// 쿠폰 적용 계산: 할인액 = min(coupon.amount, subtotal)
export function getDiscountByCoupon(subtotal, coupon) {
  if (!coupon || coupon.used) return 0;
  const now = Date.now();
  if (coupon.expiresAt && new Date(coupon.expiresAt).getTime() < now) return 0;
  return Math.min(coupon.amount || 0, subtotal || 0);
}
