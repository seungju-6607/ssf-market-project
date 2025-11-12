package com.ssf.project.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class CartItemDto {
    private int cartKey;
    private String userKey;
    private String email;
    private int itemKey;
    private int cartQty;
    private String cartSize; //옷 사이즈
    private LocalDate cartRdate;


    /* cart 에 담긴 아이템 중복체크 */
    private Long checkQty;

    /* cart 에 담긴 총 수량 */
    private int sumQty;

    /* cart 아이콘 위에 수량 +/- 여부 */
    private String type;


}
