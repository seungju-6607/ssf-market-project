package com.springboot.next_shoppy_springboot.service;

import com.springboot.next_shoppy_springboot.dto.ProductDto;
import com.springboot.next_shoppy_springboot.dto.ProductDetailinfoDto;
import com.springboot.next_shoppy_springboot.dto.ProductQnaDto;
import com.springboot.next_shoppy_springboot.dto.ProductReturnDto;

import java.util.List;

public interface ProductService {
    ProductReturnDto findReturn();
    List<ProductQnaDto>  findQna(int pid);
    ProductDetailinfoDto findDetailinfo(int pid);
    ProductDto findByPid(int pid);
    List<ProductDto> findAll();
}
