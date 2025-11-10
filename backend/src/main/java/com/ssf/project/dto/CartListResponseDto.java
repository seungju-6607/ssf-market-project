package com.ssf.project.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartListResponseDto {

    private int cartKey;
    private String userKey;
    private String userName;
    private String email;
    private int itemKey;
    private String itemName;
    private String itemList;
    private String itemContent;
    private int itemPrice;
    private int itemSale;
    private int cartQty;
    private String cartSize;
    private LocalDateTime cartRdate;
    private int lineTotalSale;
    private int lineTotalPrice;
    private int totalSaleAmount;
    private int totalItemCount;
}

