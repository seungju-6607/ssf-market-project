package com.ssf.project.dto;

import java.time.LocalDateTime;

public record OrderHistoryDto(
        String orderId,
        int totalPrice,
        LocalDateTime orderedAt,
        String itemName,
        int itemQty,
        int itemPrice,
        String itemList,
        String itemSize
) {}

