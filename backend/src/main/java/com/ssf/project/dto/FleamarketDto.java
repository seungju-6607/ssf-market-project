package com.ssf.project.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class FleamarketDto {
    private int fleaKey;            // 판매글번호
    private String userKey;         // 회원고유번호

    @JsonProperty("onlyAvailable")
    private String fleaSale;        // 판매여부

    @JsonProperty("sellerName")
    private String fleaName;        // 판매자성명

    @JsonProperty("sellerEmail")
    private String fleaEmail;       // 판매자이메일

    @JsonProperty("sellerId")
    private String fleaId;          // 판매자회원id

    @JsonProperty("title")
    private String fleaTitle;       // 판매글제목

    @JsonProperty("price")
    private int fleaPrice;          // 플리마켓가격

    @JsonProperty("category")
    private String fleaCategory;    // 판매글카테고리

    @JsonProperty("description")
    private String fleaContent;     // 판매글설명

    @JsonProperty("images")
    private String fleaList;        // 이미지리스트

    @JsonProperty("createdAt")
    private LocalDateTime fleaRdate;    // 판매글등록날짜

    @JsonProperty("q")
    private String filterWord;
}