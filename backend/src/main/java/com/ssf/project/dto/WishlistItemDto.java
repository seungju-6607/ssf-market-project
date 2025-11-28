package com.ssf.project.dto;

import lombok.Data;

@Data
public class WishlistItemDto {
    private String email;          // 프론트에서 받는 email
    private String productId;
    private String productName;
    private String productBrand;
    private String productImage;
    private int productPrice;
    private int productPriceOri;
}
