package com.springboot.next_shoppy_springboot.dto;

import com.springboot.next_shoppy_springboot.entity.ProductDetailinfo;
import lombok.Data;

@Data
public class ProductDetailinfoDto {
    private int did;
    private int pid;
    private String list;
    private String titleEn;
    private String titleKo;

    //Entity <=> Dto 변환
    public ProductDetailinfoDto() {}
    public ProductDetailinfoDto(ProductDetailinfo entity) {
        this.did = entity.getDid();
        this.pid = entity.getProduct().getPid();
        this.list = entity.getList();
        this.titleEn = entity.getTitleEn();
        this.titleKo = entity.getTitleKo();
    }
}
