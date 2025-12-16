package com.springboot.next_shoppy_springboot.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name="product_qna")
@Getter @Setter
public class ProductQna {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int qid;
    private String title;
    private String content;
    private boolean isComplete;
    private boolean isLock;
    private String id;
    private String cdate;

    //FK: product.pid
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="pid", nullable = false)
    private Product product;
}

