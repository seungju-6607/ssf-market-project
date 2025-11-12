package com.ssf.project.entity;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
import jakarta.persistence.*;


@Entity
@Getter
@Setter
@Table(name = "ssf_cart")
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int cartKey;

    private String userKey;
    private int itemKey;
    private int cartQty;
    private String cartSize; //옷 사이즈
    private LocalDate cartRdate;

    public CartItem() {}
}
