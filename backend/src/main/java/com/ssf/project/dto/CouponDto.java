package com.ssf.project.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
public class CouponDto {
    private String couponId;
    private String couponName;
    private Integer couponCost;
    private LocalDate expireAt;
    private String usedYn; //변환된 String 타입으로 저장
    private String couponYn;

    public CouponDto(String couponId,
                     String couponName,
                     Integer couponCost,
                     java.sql.Date expireAt,
                     Character usedYn) { //char 형태로 리턴됨
        this.couponId = couponId;
        this.couponName = couponName;
        this.couponCost = couponCost;
        this.expireAt = expireAt != null ? expireAt.toLocalDate() : null;
        this.usedYn = usedYn != null ? usedYn.toString() : null; //string으로 변환
    }
}

