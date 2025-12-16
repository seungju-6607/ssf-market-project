package com.springboot.next_shoppy_springboot.dto;

import com.springboot.next_shoppy_springboot.entity.ProductQna;
import lombok.Data;

@Data
public class ProductQnaDto {
    private int qid;
    private String title;
    private String content;
    private boolean isComplete;
    private boolean isLock;
    private String id;
    private int pid;
    private String cdate;

    //Entity <=> Dto 변환
    public ProductQnaDto() {}
    public ProductQnaDto(ProductQna entity) {
        this.qid = entity.getQid();
        this.title = entity.getTitle();
        this.content = entity.getContent();
        this.isComplete = entity.isComplete();
        this.isLock = entity.isLock();
        this.id = entity.getId();
        this.pid = entity.getProduct().getPid();
        this.cdate = entity.getCdate();
    }
}
