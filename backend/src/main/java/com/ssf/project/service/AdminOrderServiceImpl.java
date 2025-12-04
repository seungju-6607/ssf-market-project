package com.ssf.project.service;

import com.ssf.project.dto.AdminOrderPageDto;
import com.ssf.project.dto.AdminOrderRowDto;
import com.ssf.project.dto.MonthlyRevenuePointDto;
import com.ssf.project.dto.OrderDetailResponseDto;
import com.ssf.project.repository.JpaCouponRepository;
import com.ssf.project.repository.JpaOrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.OptionalInt;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
public class AdminOrderServiceImpl implements AdminOrderService {

    private final JpaOrderRepository jpaOrderRepository;
    private final OrderService orderService;
    private final JpaCouponRepository jpaCouponRepository;

    public AdminOrderServiceImpl(JpaOrderRepository jpaOrderRepository,
                                 OrderService orderService,
                                 JpaCouponRepository jpaCouponRepository) {
        this.jpaOrderRepository = jpaOrderRepository;
        this.orderService = orderService;
        this.jpaCouponRepository = jpaCouponRepository;
    }

    @Override
    public AdminOrderPageDto getOrders(String startDate, String endDate, int page, int size) {
        LocalDate start = parseDate(startDate);
        LocalDate end = parseDate(endDate);

        int safePage = Math.max(page, 1);
        int safeSize = Math.max(size, 1); //안전로직 : 최소값이 1
        int offset = (safePage - 1) * safeSize;

        long total = jpaOrderRepository.countOrdersForAdmin(start, end);
        List<AdminOrderRowDto> rows = jpaOrderRepository
                .findOrdersForAdmin(start, end, safeSize, offset)
                .stream()
                .map(this::toRowDto)
                .collect(Collectors.toList());

        boolean hasNext = total > (long) safePage * safeSize;

        return new AdminOrderPageDto(
                total,
                safePage,
                safeSize,
                hasNext,
                startDate,
                endDate,
                rows
        );
    }

    @Override
    public List<MonthlyRevenuePointDto> getMonthlyRevenue(int year) {
        Map<Integer, Integer> raw = jpaOrderRepository.findMonthlyRevenue(year)
                .stream()
                .collect(Collectors.toMap(
                        r -> ((Number) r[0]).intValue(),
                        r -> ((Number) r[1]).intValue()
                ));

        return IntStream.rangeClosed(1, 12)
                .mapToObj(m -> new MonthlyRevenuePointDto(m, raw.getOrDefault(m, 0)))
                .collect(Collectors.toList());
    }

    @Override
    public OrderDetailResponseDto getOrderDetail(String orderId) {
        return orderService.findOrderDetailForAdmin(orderId);
    }

    private LocalDate parseDate(String raw) {
        if (raw == null || raw.isBlank()) {
            return null;
        }
        try {
            return LocalDate.parse(raw);
        } catch (DateTimeParseException e) {
            return null;
        }
    }

    //DB에서 꺼낸 raw data를 dto객체로 만들어줌
    private AdminOrderRowDto toRowDto(Object[] row) {
        String orderId = (String) row[0];
        LocalDateTime orderedAt = toLocalDateTime(row[1]);
        String ordererName = (String) row[2];
        String receiverName = (String) row[3];
        int price = toInt(row[4]);
        String orderStatus = row[5] != null ? (String) row[5] : "S";
        return new AdminOrderRowDto(orderId, orderedAt, ordererName, receiverName, price, orderStatus);
    }

    //DB에서 받아온 number 객체를 int로 변환해줌
    private int toInt(Object value) {
        if (value instanceof Number number) {
            return number.intValue();
        }
        return 0;
    }

    //DB에서 timestamp를 가져오므로 java의 localDateTime으로 변환
    private LocalDateTime toLocalDateTime(Object value) {
        if (value instanceof Timestamp timestamp) {
            return timestamp.toLocalDateTime();
        }
        if (value instanceof LocalDateTime ldt) {
            return ldt;
        }
        return null;
    }

    //올해, 작년 매출 금액
    @Override
    public Map<String, Integer> getTotalRevenue() {
        List<Object[]> revenueList = jpaOrderRepository.sumRevenueThisAndLastYear();
        Object[] revenue = revenueList.get(0);
        Number thisYear = (Number)revenue[0];
        Number lastYear = (Number)revenue[1];

        Map<String, Integer> result = new HashMap<>();
        result.put("thisYear",  thisYear.intValue());
        result.put("lastYear", lastYear.intValue());

        return result;
    }

    @Override
    @Transactional
    public boolean cancelOrder(String orderId) {
        if (orderId == null || orderId.isBlank()) {
            return false;
        }

        // 1. 주문의 사용자 키와 할인 금액 조회 (주문 취소 전에 조회)
        String userKey = jpaOrderRepository.findUserKeyByOrderId(orderId);
        if (userKey == null || userKey.isBlank()) {
            return false;
        }

        // 2. 주문 상태를 'C'로 변경
        int updated = jpaOrderRepository.cancelOrder(orderId);
        if (updated == 0) {
            return false;
        }

        // 3. 해당 주문에서 사용된 쿠폰 찾기 (최근 사용된 쿠폰)
        String usedCouponId = jpaCouponRepository.findLatestUsedCouponId(userKey, orderId);
        if (usedCouponId != null && !usedCouponId.isBlank()) {
            try {
                // 4. 쿠폰 사용 취소 시도 (used_yn을 'N'으로 변경)
                int restored = jpaCouponRepository.restoreCoupon(userKey, usedCouponId);
                if (restored == 0) {
                    // 사용 취소 실패 시 새로운 쿠폰 발급
                    jpaCouponRepository.insertCouponUsed(usedCouponId, userKey);
                }
            } catch (Exception e) {
                // 쿠폰 복원 실패 시에도 새 쿠폰 발급 시도
                try {
                    jpaCouponRepository.insertCouponUsed(usedCouponId, userKey);
                } catch (Exception ex) {
                    // 쿠폰 재발급 실패는 로그만 남기고 주문 취소는 성공으로 처리
                    System.err.println("쿠폰 재발급 실패: " + ex.getMessage());
                }
            }
        }

        return true;
    }
}


