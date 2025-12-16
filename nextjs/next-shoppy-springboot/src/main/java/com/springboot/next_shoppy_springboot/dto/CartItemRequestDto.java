package com.springboot.next_shoppy_springboot.dto;

import lombok.Data;

/**
 * 사용자의 요청 데이터를 매핑하는 DTO
 */
@Data
public class CartItemRequestDto {
    private int cid;
    private String size;
    private int qty;
    private int pid;
    private String id;
    private String cdate;
    private String type;
}
