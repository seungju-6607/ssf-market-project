package com.ssf.project.dto;

//하나의 상품 데이터 (주문내역 중)
public record OrderDetailItemDto(
        String name,
        String itemList,
        int price,
        int quantity,
        String size
) {}

