package com.ssf.project.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class OrderListResponseDto {

    private String userKey;
    private String userName;
    private String email;
    private String addrZipCode;
    private String addrMain;
    private String addrDetail;
    private String addrTel;
    private String addrReq;
    private String itemName;
    private String itemList;
    private String itemContent;
    private Integer itemPrice;
    private Integer itemSale;
    private Integer totalPrice;
    private BigDecimal orderQty;
    private Integer itemQty;

    public OrderListResponseDto(String userKey,
                                String userName,
                                String email,
                                String addrZipCode,
                                String addrMain,
                                String addrDetail,
                                String addrTel,
                                String addrReq,
                                String itemName,
                                String itemList,
                                String itemContent,
                                Integer itemPrice,
                                Integer itemSale,
                                Integer totalPrice,
                                BigDecimal orderQty,
                                Integer itemQty) {
        this.userKey = userKey;
        this.userName = userName;
        this.email = email;
        this.addrZipCode = addrZipCode;
        this.addrMain = addrMain;
        this.addrDetail = addrDetail;
        this.addrTel = addrTel;
        this.addrReq = addrReq;
        this.itemName = itemName;
        this.itemList = itemList;
        this.itemContent = itemContent;
        this.itemPrice = itemPrice;
        this.itemSale = itemSale;
        this.totalPrice = totalPrice;
        this.orderQty = orderQty;
        this.itemQty = itemQty;
    }
}
