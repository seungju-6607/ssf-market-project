package com.ssf.project.service;

import com.ssf.project.dto.CouponDto;

public interface CouponService {
    CouponDto issueSignupCoupon(String email);
    CouponDto getCouponInfo(String email);
    boolean consumeCoupon(String email, String couponId);
}

