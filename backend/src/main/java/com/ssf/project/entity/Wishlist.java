package com.ssf.project.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "ssf_wishlist",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_key", "product_id"})
)
@Getter
@Setter
public class Wishlist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "wish_key")
    private Long wishKey;


    @Column(name = "user_key", nullable = false, length = 50)
    private String userKey;

    @Column(name = "product_id", nullable = false, length = 100)
    private String productId;

    @Column(name = "product_name", nullable = false, length = 255)
    private String productName;

    @Column(name = "product_brand", nullable = false, length = 100)
    private String productBrand;

    @Column(name = "product_image", length = 500)
    private String productImage;

    @Column(name = "product_price", nullable = false)
    private int productPrice;

    @Column(name = "product_price_ori", nullable = false)
    private int productPriceOri;

    @Column(name = "wish_rdate", insertable = false, updatable = false)
    private LocalDateTime wishRdate;
}
