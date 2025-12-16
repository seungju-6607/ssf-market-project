package com.springboot.next_shoppy_springboot.dto;

import com.springboot.next_shoppy_springboot.entity.CartItem;
import com.springboot.next_shoppy_springboot.entity.Member;
import com.springboot.next_shoppy_springboot.entity.Product;
import lombok.Data;

import java.time.LocalDate;

/**
 * DB에서 처리한 결과를 응답하는 DTO <=> Entity
 */
@Data
public class CartItemResponseDto {
    private int cid;
    private String size;
    private int qty;
    private Product product;
    private Member member;
    private LocalDate cdate;
    private Long checkQty;  //상품 유무 체크 결과 반환
    private int sumQty;     //상품 갯수 반환

    public CartItemResponseDto() {}
    public CartItemResponseDto(int sumQty) {
        this.sumQty = sumQty;
    }
    public CartItemResponseDto(CartItem entity) {
        this.cid = entity.getCid();
        this.size = entity.getSize();
        this.qty = entity.getQty();
        this.product = entity.getProduct();
        this.member = entity.getMember();
        this.cdate = entity.getCdate();
    }

}
