package com.ssf.project.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 관리자 > 매출현황
 */
@Getter
@AllArgsConstructor
public class MonthlyRevenuePointDto {
    private final int month;
    private final int totalAmount;
}


