package com.springboot.next_shoppy_springboot.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name="product_detailinfo")
@Getter  @Setter
public class ProductDetailinfo {
    @Id  @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int did;

    // FK: product.pid
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pid", nullable = false)
    private Product product;

    private String list;
    private String titleEn;
    private String titleKo;

}
