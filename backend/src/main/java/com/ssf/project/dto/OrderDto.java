package com.ssf.project.dto;

import lombok.Data;

@Data
public class OrderDto {
    private String userKey;
    private String zipcode;
    private String tel;
    private String req;
    private Integer price;
    private String name;
    private String addr;
    private String addrDetail;
    private String couponid;
}
