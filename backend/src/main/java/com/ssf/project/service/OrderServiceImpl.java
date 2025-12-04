package com.ssf.project.service;

import com.ssf.project.dto.KakaoPayDto;
import com.ssf.project.dto.OrderDetailItemDto;
import com.ssf.project.dto.OrderDetailResponseDto;
import com.ssf.project.dto.OrderDetailRow;
import com.ssf.project.dto.OrderHistoryDto;
import com.ssf.project.dto.OrderListResponseDto;
import com.ssf.project.entity.Order;
import com.ssf.project.repository.JpaCartRepository;
import com.ssf.project.repository.JpaOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrderServiceImpl implements OrderService {

    private final JpaOrderRepository jpaOrderRepository;
    private final JpaCartRepository jpaCartRepository;

    @Autowired
    public OrderServiceImpl(JpaOrderRepository jpaOrderRepository,
                            JpaCartRepository jpaCartRepository) {
        this.jpaOrderRepository = jpaOrderRepository;
        this.jpaCartRepository = jpaCartRepository;
    }

    @Override
    public int saveOrder(KakaoPayDto kakaoPayDto, String email) {
        int result = 0;

        //Step 1 : 결제 후 Orders 테이블 저장
        int finalAmount = Integer.parseInt(kakaoPayDto.getTotalAmount());
        Order order = new Order(kakaoPayDto);
        order.setOrder_price(finalAmount);

        int row = jpaOrderRepository.saveOrder(order, email);
        if(row == 0) new Exception("step1 주문 테이블 저장 실패!");

        List<Integer> cartKeys = kakaoPayDto.getCidList();
        boolean hasCartItems = cartKeys != null && !cartKeys.isEmpty();

        //Step 2 : Order_detail 테이블 저장
        if (hasCartItems) {
            int rows = jpaOrderRepository.saveOrderDetail(kakaoPayDto.getOrderId(), cartKeys);
            if(rows == 0) new Exception("step2 주문 상세 테이블 저장 실패!!");

            //Step 3 : Cart 테이블 아이템 삭제
            int cartRows = jpaCartRepository.deleteItem(cartKeys);
            if(cartRows == 0) new Exception("step3 장바구니 아이템 삭제 실패!");
        } else {
            List<KakaoPayDto.DirectItem> directItems = kakaoPayDto.getDirectItems();
            if (directItems == null || directItems.isEmpty()) {
                throw new IllegalArgumentException("주문 상세 정보가 존재하지 않습니다.");
            }
            for (KakaoPayDto.DirectItem item : directItems) {
                if (item == null) continue;
                int rows = jpaOrderRepository.saveOrderDetailDirect(
                        kakaoPayDto.getOrderId(),
                        item.getItemKey(),
                        item.getItemPrice(),
                        item.getItemQty(),
                        item.getItemSize()
                );
                if(rows == 0) new Exception("step2 주문 상세 테이블 저장 실패!!");
            }
        }

        result = 1;

        return result;
    }

    @Override
    public List<OrderListResponseDto> findOrderListByOrderId(String orderId) {
        if(orderId == null) {
            return Collections.emptyList();
        }

        return jpaOrderRepository.findOrderListByOrderId(orderId);

    }

    @Override
    public List<List<OrderHistoryDto>> findOrderHistory(String email, String startDate, String endDate) {

        // 날짜 파싱 함수 이용
        LocalDate parsedStart = parseLocalDate(startDate);
        LocalDate parsedEnd = parseLocalDate(endDate);

        List<OrderHistoryDto> dtos = jpaOrderRepository.findOrderHistory(email, parsedStart, parsedEnd).stream()
                .map(row -> {

                    String orderId = (String) row[0];
                    int totalPrice = toInt(row[1]) + 2500; //배송비 2500원으로 고정
                    var orderedAt = toLocalDateTime(row[2]);
                    String itemName = (String) row[3];
                    int itemQty = toInt(row[4]);
                    int itemPrice = toInt(row[5]);
                    String itemList = row[6] != null ? (String) row[6] : null;
                    String itemSize = (String) row[7];

                    return new OrderHistoryDto(orderId, totalPrice, orderedAt, itemName, itemQty, itemPrice, itemList, itemSize);

                })
                .toList();

        Map<String, List<OrderHistoryDto>> groupByOrderUUID = dtos.stream()
                .collect(Collectors.groupingBy(
                        OrderHistoryDto::orderId, //order_UUID 기준으로 묶겠다.
                        LinkedHashMap::new,       //주문 내역 순서를 보장해야해서 LinkedHashMap 사용
                        Collectors.toList())      //같은 UUID를 가진 요소를 List<OrderHistoryDto>로 모은다.
                );

        return new ArrayList<>(groupByOrderUUID.values()); //key 제외하고 주문 상품 목록인 values만 필요함.
    }

    @Override
    public OrderDetailResponseDto findOrderDetail(String email, String orderId) {
        if (email == null || email.isBlank() || orderId == null || orderId.isBlank()) {
            return null;
        }

        // Raw Data를 rows에 담은 뒤 List로 반환 > Dto에 세팅
        List<OrderDetailRow> rows = jpaOrderRepository.findOrderDetail(email, orderId);
        return buildOrderDetail(rows);
    }

    @Override
    public OrderDetailResponseDto findOrderDetailForAdmin(String orderId) {
        if (orderId == null || orderId.isBlank()) {
            return null;
        }
        // Raw Data를 rows에 담은 뒤 List로 반환 > Dto에 세팅
        List<OrderDetailRow> rows = jpaOrderRepository.findOrderDetailForAdmin(orderId);
        return buildOrderDetail(rows);
    }

    /**
     * 공통정보 + 상세상품목록 포함하는 최종 DTO로 반환
     */
    private OrderDetailResponseDto buildOrderDetail(List<OrderDetailRow> rows) {
        if (rows == null || rows.isEmpty()) {
            return null;
        }

        // Raw Data중 첫번째 로우 : 주문공통정보를 head에 담음.
        OrderDetailRow head = rows.get(0);

        // 주문공통정보 중 하나인 총금액을 head에서 가져오나 없을 시 계산함.
        int productTotal = optionalInt(head.getProductTotal())
                .orElse(rows.stream()
                        .mapToInt(r -> toInt(r.getItemPrice()) * toInt(r.getItemQty()))
                        .sum());

        // Raw Data를 순회하며 주문한 상품 데이터를 Dto에 담음
        List<OrderDetailItemDto> items = rows.stream()
                .map(r -> new OrderDetailItemDto(
                        r.getItemName(),
                        r.getItemList(),
                        toInt(r.getItemPrice()),
                        toInt(r.getItemQty()),
                        r.getItemSize()
                ))
                .toList();

        // head에 담긴 주문공통정보 : 배송비, 할인금액, 주문금액을  Dto에 담음.
        OrderDetailResponseDto.Amounts amounts = new OrderDetailResponseDto.Amounts(
                productTotal,
                optionalInt(head.getShippingFee()).orElse(0),
                optionalInt(head.getDiscountAmount()).orElse(0),
                optionalInt(head.getOrderPrice()).orElse(0)
        );

        // head에 담긴 주문공통정보 : 구매자 정보를 Dto에 담음.
        OrderDetailResponseDto.Buyer buyer = new OrderDetailResponseDto.Buyer(
                head.getCustomerName(),
                head.getCustomerPhone(),
                head.getCustomerEmail()
        );

        // head에 담긴 주문공통정보 : 받으시는분 정보를 Dto에 담음.
        OrderDetailResponseDto.Shipping shipping = new OrderDetailResponseDto.Shipping(
                head.getReceiverName(),
                head.getReceiverPhone(),
                head.getReceiverZipcode(),
                head.getReceiverAddress(),
                head.getReceiverAddrDetail(),
                head.getReceiverMemo()
        );

        // 위에서 담은 정보를 리턴
        String orderStatus = head.getOrderStatus() != null ? head.getOrderStatus() : "S";
        return new OrderDetailResponseDto(
                head.getOrderId(),
                toLocalDateTime(head.getOrderedAt()),
                head.getCustomerName(),
                head.getCustomerEmail(),
                head.getCustomerPhone(),
                optionalInt(head.getTotalPurchase()).orElse(0),
                optionalInt(head.getCouponCount()).orElse(0),
                optionalInt(head.getPointBalance()).orElse(0),
                orderStatus,
                buyer,
                shipping,
                amounts,
                items
        );
    }

    // 날짜 형식으로 파싱
    private LocalDate parseLocalDate(String raw) {

        if (raw == null || raw.isBlank()) return null;

        try {
            return LocalDate.parse(raw);
        } catch (DateTimeParseException ex) {
            return null;
        }

    }

    // Object로 받은 Number를 Int로 안전하게 변환 (number -> int, string -> 0)
    private static int toInt(Object value) {
        if (value instanceof Number number) {
            return number.intValue();
        }
        return 0;
    }

    // null일 경우 에러가 나지않도록 처리.
    private static OptionalInt optionalInt(Number value) {
        if (value == null) {
            return OptionalInt.empty();
        }
        return OptionalInt.of(value.intValue());
    }

    // java.sql.Timestamp로 받은 객체를 java.time.LocalDateTime으로 변환
    private static java.time.LocalDateTime toLocalDateTime(Object value) {
        if (value instanceof Timestamp timestamp) {
            return timestamp.toLocalDateTime();
        } //Timestamp로 들어오면 변환
        if (value instanceof java.time.LocalDateTime ldt) {
            return ldt;
        } //LocalDateTime으로 들어오면 그대로 사용
        return null;
    }
}
