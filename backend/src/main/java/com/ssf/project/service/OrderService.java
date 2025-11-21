package com.ssf.project.service;

import com.ssf.project.dto.KakaoPayDto;
import com.ssf.project.dto.OrderListResponseDto;

import java.util.List;

public interface OrderService {
    int saveOrder(KakaoPayDto kakaoPay, String email);
    List<OrderListResponseDto> findOrderListByOrderId(String orderId);
}
