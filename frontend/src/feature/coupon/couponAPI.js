import { axiosPost } from "../../utils/dataFetch.js";

export const fetchCouponInfo = async (email) => {
  if (!email) return null;
  return axiosPost("/member/coupon/info", { email });
};

export const consumeCoupon = async ({ email, couponId }) => {
  if (!email || !couponId) return { success: false };
  return axiosPost("/member/coupon/use", { email, couponId });
};

