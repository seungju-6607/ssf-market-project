package com.springboot.next_shoppy_springboot.dto;

import lombok.Data;

import java.util.List;

@Data
public class KakaoPayDto {
    private String orderId;
    private String userId;
    private String itemName;
    private String qty;
    private String totalAmount;
    private Receiver receiver;
    private PaymentInfo paymentInfo;
    private List<Integer> cidList;

    @Data
    public static class Receiver {
        private String name;
        private String phone;
        private String zipcode;
        private String address1;
        private String address2;
        private String memo;
    }//Receiver

    @Data
    public static class PaymentInfo {
        private int shippingFee;
        private int discountAmount;
        private int totalAmount;
    }

}//KakaoPay dto

