package com.ssf.project.service;

import com.ssf.project.dto.KakaoPayDto;
import com.ssf.project.dto.OrderDto;
import com.ssf.project.dto.OrderHistoryDto;
import com.ssf.project.dto.OrderListResponseDto;
import com.ssf.project.entity.Order;
import com.ssf.project.repository.JpaCartRepository;
import com.ssf.project.repository.JpaOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
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
        int row = jpaOrderRepository.saveOrder(new Order(kakaoPayDto), email);
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
    public List<List<OrderHistoryDto>> findOrderHistory(String email) {
        List<OrderHistoryDto> dtos = jpaOrderRepository.findOrderHistory(email).stream()
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

    // Object로 받은 Number를 Int로 안전하게 변환 (number -> int, string -> 0)
    private static int toInt(Object value) {
        if (value instanceof Number number) {
            return number.intValue();
        }
        return 0;
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
