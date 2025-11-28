package com.ssf.project.service;

import com.ssf.project.dto.KakaoPayDto;
import com.ssf.project.dto.OrderDetailResponseDto;
import com.ssf.project.dto.OrderHistoryDto;
import com.ssf.project.dto.OrderListResponseDto;

import java.util.List;

public interface OrderService {
    int saveOrder(KakaoPayDto kakaoPay, String email);
    List<OrderListResponseDto> findOrderListByOrderId(String orderId);
    List<List<OrderHistoryDto>> findOrderHistory(String email, String startDate, String endDate);
    OrderDetailResponseDto findOrderDetail(String email, String orderId);
    OrderDetailResponseDto findOrderDetailForAdmin(String orderId);
}
