package com.springboot.next_shoppy_springboot.entity;

import com.springboot.next_shoppy_springboot.dto.CartItemDto;
import com.springboot.next_shoppy_springboot.dto.CartItemRequestDto;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name="cart")
@Setter @Getter
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int cid;
    private String size;
    private int qty;
    private LocalDate cdate;

    //FK: product.pid
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="pid", nullable = false)
    private Product product;

    //FK: member.id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="id", nullable = false)
    private Member member;


    //DTO <=> Entity 변환
    public CartItem() {}

    //add : 상품추가 생성자
    public CartItem(CartItemRequestDto dto, Product product, Member member) {
        this.cid = dto.getCid();
        this.size = dto.getSize();
        this.qty = dto.getQty();
        this.product = product;
        this.member = member;
        this.cdate = LocalDate.now();
    }

}
