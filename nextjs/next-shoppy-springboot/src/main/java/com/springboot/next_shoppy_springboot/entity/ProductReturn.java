package com.springboot.next_shoppy_springboot.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name="product_return")
@Getter @Setter
public class ProductReturn {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int rid;

    private String title;
    private String description;

    @Column(columnDefinition = "JSON")
    private String list;
}










