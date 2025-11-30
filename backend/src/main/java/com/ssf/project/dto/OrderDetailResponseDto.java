package com.ssf.project.dto;

import java.time.LocalDateTime;
import java.util.List;

//주문 상세 페이지에 필요한 데이터를 모두 모음
public record OrderDetailResponseDto(
        String orderId,
        LocalDateTime orderedAt,
        String customerName,
        String customerEmail,
        String customerPhone,
        int totalPurchase,
        int couponCount,
        int pointBalance,
        String orderStatus,
        Buyer buyer,
        Shipping shipping,
        Amounts amounts,
        List<OrderDetailItemDto> items //하나의 상품데이터
) {
    public record Buyer(
            String name,
            String phone,
            String email
    ) {}

    public record Shipping(
            String recipient,
            String phone,
            String zipcode,
            String address,
            String addressDetail,
            String memo
    ) {}

    public record Amounts(
            int product,
            int shippingFee,
            int discount,
            int payTotal
    ) {}
}

