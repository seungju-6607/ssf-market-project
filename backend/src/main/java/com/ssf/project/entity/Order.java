package com.ssf.project.entity;

import com.ssf.project.dto.KakaoPayDto;
import com.ssf.project.dto.OrderDto;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "ssf_order")
@Getter
@Setter
@NoArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer order_key;

    private String user_key;        // 회원 UUID
    private String order_name;      // 받는 사람 이름
    private String order_zipcode;
    private String order_tel;
    private String order_status = "S";    // C: 취소, S: 성공
    private String order_req;
    private Integer order_price;    // 총 상품 금액
    private String order_addr;
    private String order_addr_detail;
    private String order_couponid;

    // 카카오페이
    private String order_code;      // KakaoPay 주문 ID
    private Integer shipping_fee;
    private Integer discount_amount;
    private LocalDateTime odate;



    // OrderDto 생성자 (기본 주문)
    public Order(OrderDto dto) {
        this.user_key = dto.getUserKey();
        this.order_name = dto.getName();          // 받는 사람 이름
        this.order_zipcode = dto.getZipcode();
        this.order_tel = dto.getTel();
        this.order_req = dto.getReq();
        this.order_price = dto.getPrice();
        this.order_addr = dto.getAddr();
        this.order_addr_detail = dto.getAddrDetail();
        this.odate = LocalDateTime.now();
        this.order_couponid = dto.getCouponid();
    }

    // KakaoPayDto 생성자
    public Order(KakaoPayDto dto) {
        this.order_code = dto.getOrderId();
        this.order_name = dto.getReceiver().getName();  // 받는 사람 이름
        this.order_tel = dto.getReceiver().getPhone();
        this.order_zipcode = dto.getReceiver().getZipcode();
        this.order_addr = dto.getReceiver().getAddress1();
        this.order_addr_detail = dto.getReceiver().getAddress2();
        this.order_req = dto.getReceiver().getMemo();
        this.shipping_fee = dto.getPaymentInfo().getShippingFee();
        this.discount_amount = dto.getPaymentInfo().getDiscountAmount();
        this.order_price = Integer.parseInt(dto.getTotalAmount()); // 총 주문금액
        this.odate = LocalDateTime.now();
        this.order_couponid = dto.getCouponId();
    }
}
