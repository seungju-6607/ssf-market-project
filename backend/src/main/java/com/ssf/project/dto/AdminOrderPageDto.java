package com.ssf.project.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

/**
 * 관리자 주문관리 페이징 처리 DTO
 * */
@Getter
@AllArgsConstructor
public class AdminOrderPageDto {
    private final long totalCount;
    private final int page;
    private final int size;
    private final boolean hasNext;
    private final String startDate;
    private final String endDate;
    private final List<AdminOrderRowDto> rows;
}


