package com.springboot.next_shoppy_springboot.dto;

import lombok.Data;

@Data
public class CartItemDto {
    private int cid;
    private String size;
    private int qty;
    private int pid;
    private String id;
    private String cdate;
    private Long checkQty;
    private String type;
    private int sumQty;
}
