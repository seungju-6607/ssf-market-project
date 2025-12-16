package com.springboot.next_shoppy_springboot.dto;

import com.springboot.next_shoppy_springboot.entity.ProductReturn;
import lombok.Data;

@Data
public class ProductReturnDto {
    private int rid;
    private String title;
    private String description;
    private String list;

    public ProductReturnDto() {}
    public ProductReturnDto(ProductReturn entity) {
        this.rid = entity.getRid();
        this.title = entity.getTitle();
        this.description = entity.getDescription();
        this.list = entity.getList();
    }
}
