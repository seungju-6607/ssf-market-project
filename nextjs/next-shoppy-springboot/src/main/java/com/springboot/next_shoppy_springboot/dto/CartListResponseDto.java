package com.springboot.next_shoppy_springboot.dto;

import com.springboot.next_shoppy_springboot.entity.CartItem;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Setter @Getter
@AllArgsConstructor
public class CartListResponseDto {
    private String id;
    private String mname;
    private String phone;
    private String email;
    private int pid;
    private String name;
    private String info;
    private String image;
    private long price;
    private String size;
    private int qty;
    private int cid;
    private long totalPrice;

    public CartListResponseDto(){}
    public CartListResponseDto(CartItem entity, long totalPrice){
        this.id = entity.getMember().getId();
        this.mname = entity.getMember().getName();
        this.phone = entity.getMember().getPhone();
        this.email = entity.getMember().getEmail();
        this.pid = entity.getProduct().getPid();
        this.name = entity.getProduct().getName();
        this.info = entity.getProduct().getInfo();
        this.image = entity.getProduct().getImage();
        this.price = entity.getProduct().getPrice();
        this.size = entity.getSize();
        this.qty = entity.getQty();
        this.cid = entity.getCid();
        this.totalPrice = totalPrice;
    }
}










