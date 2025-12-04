package com.ssf.project.repository;

import com.ssf.project.dto.CouponDto;
import com.ssf.project.entity.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface JpaCouponRepository extends JpaRepository<Coupon, String> {

    @Query(
            value = """
        SELECT
            c.coupon_id   AS couponId,
            c.coupon_name AS couponName,
            c.coupon_cost AS couponCost,
            c.expire_at   AS expireAt,
            cu.used_yn    AS usedYn
        FROM ssf_coupon c
        JOIN ssf_coupon_used cu
          ON cu.coupon_id = c.coupon_id
        WHERE cu.user_key = :userKey
        ORDER BY cu.id DESC
        LIMIT 1
        """, nativeQuery = true
    )
    CouponDto findLatestCouponByUserKey(@Param("userKey") String userKey);


    @Modifying
    @Transactional
    @Query(value =
            "INSERT INTO ssf_coupon_used (coupon_id, user_key, used_yn) VALUES (:couponId, :userKey, 'N')",
            nativeQuery = true)
    void insertCouponUsed(@Param("couponId") String couponId,
                          @Param("userKey") String userKey);


    @Modifying
    @Transactional
    @Query(value = """
        UPDATE ssf_coupon_used
        SET used_yn = 'Y'
        WHERE user_key = :userKey
          AND coupon_id = :couponId
        """, nativeQuery = true)
    int consumeCouponUpdate(@Param("userKey") String userKey,
                            @Param("couponId") String couponId);

    @Query(value = """
        SELECT o.order_couponid
        FROM ssf_order o
        WHERE o.user_key = :userKey
          AND o.order_uuid = :orderId
          AND o.order_couponid IS NOT NULL
        ORDER BY o.order_date DESC
        LIMIT 1
        """, nativeQuery = true)
    String findLatestUsedCouponId(@Param("userKey") String userKey,
                                  @Param("orderId") String orderId);

    @Modifying
    @Transactional
    @Query(value = """
        UPDATE ssf_coupon_used
        SET used_yn = 'N'
        WHERE id = (
            SELECT id FROM (
                SELECT id
                FROM ssf_coupon_used
                WHERE user_key = :userKey
                  AND coupon_id = :couponId
                  AND used_yn = 'Y'
                ORDER BY id DESC
                LIMIT 1
            ) AS temp
        )
        """, nativeQuery = true)
    int restoreCoupon(@Param("userKey") String userKey,
                      @Param("couponId") String couponId);

}
