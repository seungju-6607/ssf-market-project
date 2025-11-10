package com.ssf.project.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "view_cartlist")
@Getter
@Setter
@NoArgsConstructor
public class CartListView {

    @Id
    @Column(name = "cart_key")
    private int cartKey;

    @Column(name = "user_key")
    private String userKey;

    @Column(name = "username")
    private String userName;

    @Column(name = "email")
    private String email;

    @Column(name = "item_key")
    private int itemKey;

    @Column(name = "item_name")
    private String itemName;

    @Column(name = "item_list")
    private String itemList;

    @Column(name = "item_content")
    private String itemContent;

    @Column(name = "item_price")
    private int itemPrice;

    @Column(name = "item_sale")
    private int itemSale;

    @Column(name = "cart_qty")
    private int cartQty;

    @Column(name = "cart_size")
    private String cartSize;

    @Column(name = "cart_rdate")
    private LocalDateTime cartRdate;

    @Column(name = "line_total_sale")
    private int lineTotalSale;

    @Column(name = "line_total_price")
    private int lineTotalPrice;

    @Column(name = "total_sale_amount")
    private int totalSaleAmount;

    @Column(name = "total_item_count")
    private int totalItemCount;
}

