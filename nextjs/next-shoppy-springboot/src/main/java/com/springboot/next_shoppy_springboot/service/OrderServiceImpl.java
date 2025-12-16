package com.springboot.next_shoppy_springboot.service;

import com.springboot.next_shoppy_springboot.dto.KakaoPayDto;
import com.springboot.next_shoppy_springboot.entity.Member;
import com.springboot.next_shoppy_springboot.entity.Order;
import com.springboot.next_shoppy_springboot.repository.CartRepository;
import com.springboot.next_shoppy_springboot.repository.UserRepository;
import com.springboot.next_shoppy_springboot.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class OrderServiceImpl implements OrderService {
    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;

    @Autowired
    public OrderServiceImpl(OrderRepository orderRepository,
                            CartRepository cartRepository,
                            UserRepository userRepository){
        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
    }

    @Override
    public int save(KakaoPayDto kakaoPayDto) {
        int result = 0;
        //Step1 : Orders 테이블 저장
        Optional<Member> member = userRepository.findById(kakaoPayDto.getUserId());
        Order entity = orderRepository.save(new Order(kakaoPayDto, member.get()));
        if(entity == null) new Exception("step1 주문테이블 저장 실패!!");

        //Step2 : Order_detail 테이블 저장
        int rows = orderRepository.saveOrderDetail(kakaoPayDto.getOrderId(),
                                kakaoPayDto.getPaymentInfo().getDiscountAmount(),
                                kakaoPayDto.getCidList());
        if(rows == 0) new Exception("step2 주문 상세 테이블 저장 실패!!");

        //Step3 : Cart 테이블 아이템 삭제 - JpaCartRepository에서 삭제 진행
        int cartRows = cartRepository.deleteItemList(kakaoPayDto.getCidList());
        if(cartRows == 0) new Exception("step3 장바구니 아이템 삭제 실패!!");

        result = 1;

        return result;
    }

}
