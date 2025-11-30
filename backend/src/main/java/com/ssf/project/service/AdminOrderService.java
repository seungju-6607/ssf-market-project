package com.ssf.project.service;

import com.ssf.project.dto.AdminOrderPageDto;
import com.ssf.project.dto.MonthlyRevenuePointDto;
import com.ssf.project.dto.OrderDetailResponseDto;

import java.util.List;
import java.util.Map;

public interface AdminOrderService {

    AdminOrderPageDto getOrders(String startDate, String endDate, int page, int size);
    List<MonthlyRevenuePointDto> getMonthlyRevenue(int year);
    OrderDetailResponseDto getOrderDetail(String orderId);
    Map<String, Integer> getTotalRevenue();
    boolean cancelOrder(String orderId);
}


