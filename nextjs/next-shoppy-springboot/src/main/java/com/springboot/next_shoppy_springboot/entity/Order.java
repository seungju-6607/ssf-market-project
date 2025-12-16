package com.springboot.next_shoppy_springboot.entity;

import com.springboot.next_shoppy_springboot.dto.KakaoPayDto;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Getter @Setter
@AllArgsConstructor
public class Order {
    @Id  @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer oid;

    @Enumerated(EnumType.STRING)  @Column(nullable = false, length = 20)
    private OrderStatus status = OrderStatus.대기중; // enum('대기중',...)
    private String orderCode;
    private Integer shippingFee = 0;
    private Integer discountAmount = 0;
    private Integer totalAmount;
    private String receiverName;
    private String receiverPhone;
    private String zipcode;
    private String address1;
    private String address2;
    private String memo;
    private LocalDateTime odate;
//    private String memberId;

    //FK : Member.id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="id", nullable = false)
    private Member member;

    public Order() {}
    public Order(KakaoPayDto dto, Member member) {
        this.orderCode = dto.getOrderId();
        this.member = member;
        this.shippingFee = dto.getPaymentInfo().getShippingFee();
        this.discountAmount = dto.getPaymentInfo().getDiscountAmount();
        this.totalAmount = dto.getPaymentInfo().getTotalAmount();
        this.receiverName = dto.getReceiver().getName();
        this.receiverPhone = dto.getReceiver().getPhone();
        this.zipcode = dto.getReceiver().getZipcode();
        this.address1 = dto.getReceiver().getAddress1();
        this.address2 = dto.getReceiver().getAddress2();
        this.memo = dto.getReceiver().getMemo();
        this.odate = LocalDateTime.now();
    }
}
