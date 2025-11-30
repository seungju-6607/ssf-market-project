package com.ssf.project.controller;

import com.ssf.project.dto.AdminOrderPageDto;
import com.ssf.project.dto.MonthlyRevenuePointDto;
import com.ssf.project.dto.OrderDetailResponseDto;
import com.ssf.project.service.AdminOrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/orders")
public class AdminOrderController {

    private final AdminOrderService adminOrderService;

    public AdminOrderController(AdminOrderService adminOrderService) {
        this.adminOrderService = adminOrderService;
    }

    @GetMapping
    public ResponseEntity<AdminOrderPageDto> list(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        AdminOrderPageDto dto = adminOrderService.getOrders(startDate, endDate, page, size);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/revenue")
    public ResponseEntity<List<MonthlyRevenuePointDto>> revenue(@RequestParam int year) {
        return ResponseEntity.ok(adminOrderService.getMonthlyRevenue(year));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<?> detail(@PathVariable String orderId) {
        OrderDetailResponseDto dto = adminOrderService.getOrderDetail(orderId);
        if (dto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/revenue/total")
    public ResponseEntity<Map<String, Integer>> totalRevenue() {
        Map<String, Integer> revenue = adminOrderService.getTotalRevenue();
        return ResponseEntity.ok(revenue);
    }

    @PatchMapping("/{orderId}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable String orderId) {
        boolean success = adminOrderService.cancelOrder(orderId);
        if (success) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().build();
    }
}


