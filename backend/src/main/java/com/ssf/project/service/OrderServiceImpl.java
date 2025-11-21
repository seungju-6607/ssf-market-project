package com.ssf.project.service;

import com.ssf.project.dto.KakaoPayDto;
import com.ssf.project.dto.OrderDto;
import com.ssf.project.dto.OrderListResponseDto;
import com.ssf.project.entity.Order;
import com.ssf.project.repository.JpaCartRepository;
import com.ssf.project.repository.JpaOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;

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
                        item.getItemQty()
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


}
