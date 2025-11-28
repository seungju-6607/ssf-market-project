package com.ssf.project.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "ssf_coupon_used")
@Data
public class CouponUsed {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coupon_id")
    private Coupon coupon;

    @Column(name = "user_key")
    private String userKey;

    @Column(name = "used_yn")
    private String usedYn = "N";
}

