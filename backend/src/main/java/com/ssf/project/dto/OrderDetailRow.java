package com.ssf.project.dto;

import java.sql.Timestamp;

//DB에서 조회되는 Raw Data - 서비스에서 재가공하여 Dto 완성
public interface OrderDetailRow {
    String getOrderId();
    Timestamp getOrderedAt();
    Integer getOrderPrice();
    Integer getShippingFee();
    Integer getDiscountAmount();
    String getReceiverName();
    String getReceiverPhone();
    String getReceiverZipcode();
    String getReceiverAddress();
    String getReceiverAddrDetail();
    String getReceiverMemo();
    String getCustomerName();
    String getCustomerEmail();
    String getCustomerPhone();
    Integer getTotalPurchase();
    Integer getCouponCount();
    Integer getPointBalance();
    Integer getProductTotal();
    String getItemName();
    String getItemList();
    Integer getItemPrice();
    Integer getItemQty();
    String getItemSize();
    String getOrderStatus();
}

