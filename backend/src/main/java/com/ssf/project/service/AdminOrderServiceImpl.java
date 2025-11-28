package com.ssf.project.service;

import com.ssf.project.dto.AdminOrderPageDto;
import com.ssf.project.dto.AdminOrderRowDto;
import com.ssf.project.dto.MonthlyRevenuePointDto;
import com.ssf.project.dto.OrderDetailResponseDto;
import com.ssf.project.repository.JpaOrderRepository;
import org.springframework.stereotype.Service;

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

    public AdminOrderServiceImpl(JpaOrderRepository jpaOrderRepository,
                                 OrderService orderService) {
        this.jpaOrderRepository = jpaOrderRepository;
        this.orderService = orderService;
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
        return new AdminOrderRowDto(orderId, orderedAt, ordererName, receiverName, price);
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
        Object[] revenue = jpaOrderRepository.sumRevenueThisAndLastYear();

        Integer thisYear = ((Number)revenue[0]).intValue();
        Integer lastYear = ((Number)revenue[1]).intValue();

        Map<String, Integer> result = new HashMap<>();
        result.put("thisYear",  thisYear);
        result.put("lastYear", lastYear);

        return result;
    }
}


