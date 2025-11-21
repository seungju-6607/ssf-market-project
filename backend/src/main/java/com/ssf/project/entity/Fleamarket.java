package com.ssf.project.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "flea_market")
public class Fleamarket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int fleaKey;

    private String userKey;         // 회원고유번호
    private String fleaSale;        // 판매여부
    private String fleaName;        // 판매자성명
    private String fleaEmail;       // 판매자이메일
    private String fleaId;          // 판매자회원id
    private String fleaTitle;       // 판매글제목
    private int fleaPrice;          // 플리마켓가격
    private String fleaCategory;    // 판매글카테고리
    private String fleaContent;     // 판매글설명
    private String fleaList;        // 이미지리스트
    private LocalDateTime fleaRdate;    // 판매글등록날짜

    public Fleamarket() {}
}
