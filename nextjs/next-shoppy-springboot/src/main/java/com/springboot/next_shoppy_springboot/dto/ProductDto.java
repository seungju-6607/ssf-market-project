package com.springboot.next_shoppy_springboot.dto;

import com.springboot.next_shoppy_springboot.entity.Product;
import lombok.Data;

@Data
public class ProductDto {
    private int pid;
    private String name;
    private long price;
    private String info;
    private double rate;
    private String image;
    private String imgList;

    //Entity <=> Dto 변환
    public ProductDto() {}
    public ProductDto(Product entity) {
        this.pid = entity.getPid();
        this.name = entity.getName();
        this.price = entity.getPrice();
        this.info = entity.getInfo();
        this.rate = entity.getRate();
        this.image = entity.getImage();
        this.imgList = entity.getImgList();
    }
}

