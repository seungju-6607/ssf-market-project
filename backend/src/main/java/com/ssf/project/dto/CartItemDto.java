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


    /********* 아래 필수 dto 인지 확인 필요 **********/
    /* cart 아이템 수량체크 */
    //private Long checkQty;

    /* cart 아이콘 위에 수량 +/- 여부 */
    //private String type;

    /* cart 에 담긴 총 수량 */
    //private int sumQty;

}
