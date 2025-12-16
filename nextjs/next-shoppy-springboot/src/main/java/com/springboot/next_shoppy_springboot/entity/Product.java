package com.springboot.next_shoppy_springboot.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name="product")
@Getter @Setter
public class Product {
    @Id  @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int pid;
    private String name;
    private long price;
    private String info;
    private double rate;
    private String image;

    @Column(columnDefinition = "JSON")
    private String imgList;

    /**
     * 연관관계 매핑 : ProductDetailinfo(1 or N) <=> (1)Product(1) <=> (N)ProductQna
     */
    // Product(1) : (1 or N)ProductDetailinfo
    @OneToOne(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private ProductDetailinfo detailInfo;

    // Product(1) : (N) ProductQna
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProductQna> qnaList = new ArrayList<>();

    // Product(1) : (N) CartItem
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<CartItem> cartItemList = new ArrayList<>();

}
