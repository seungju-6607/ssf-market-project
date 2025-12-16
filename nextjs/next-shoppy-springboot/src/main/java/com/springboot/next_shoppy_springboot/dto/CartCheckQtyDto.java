package com.springboot.next_shoppy_springboot.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
public class CartCheckQtyDto {
    private int cid;
    private Long count;

    //클래스의 필드에 데이터를 주입(Injection) 방법 2가지
    //1. 생성자
    //2. 기본생성자 + Setter 메소드
//    public CartCheckQtyDto() {}
//    public CartCheckQtyDto(int cid, Long count) {
//        this.cid = cid;
//        this.count = count;
//    }
}
