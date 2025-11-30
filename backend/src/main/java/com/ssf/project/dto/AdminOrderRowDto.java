package com.ssf.project.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

/**
 * 관리자 > 주문관리 > 주문내역
 */
@Getter
@AllArgsConstructor
public class AdminOrderRowDto {
    private final String orderId;
    private final LocalDateTime orderedAt;
    private final String ordererName;
    private final String receiverName;
    private final int orderPrice;
    private final String orderStatus;
}


