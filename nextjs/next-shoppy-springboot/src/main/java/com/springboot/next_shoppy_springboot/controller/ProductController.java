package com.springboot.next_shoppy_springboot.controller;

import com.springboot.next_shoppy_springboot.dto.ProductDto;
import com.springboot.next_shoppy_springboot.dto.ProductDetailinfoDto;
import com.springboot.next_shoppy_springboot.dto.ProductQnaDto;
import com.springboot.next_shoppy_springboot.dto.ProductReturnDto;
import com.springboot.next_shoppy_springboot.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/product")
public class ProductController {
    private ProductService productService;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/return")
    public ProductReturnDto getReturn() {
        return productService.findReturn();
    }

    @PostMapping("/qna")
    public List<ProductQnaDto> qna(@RequestBody ProductDto product) {
        return productService.findQna(product.getPid());
    }

    @PostMapping("/detailinfo")
    public ProductDetailinfoDto detailinfo(@RequestBody ProductDto product) {
        return productService.findDetailinfo(product.getPid());
    }

    @GetMapping("/{pid}")
    public ProductDto pid(@PathVariable int pid) {
        ProductDto dto = productService.findByPid(pid);
        return dto;
    }

    @GetMapping("/all")
    public List<ProductDto> all() {
        return productService.findAll();
    }
}
