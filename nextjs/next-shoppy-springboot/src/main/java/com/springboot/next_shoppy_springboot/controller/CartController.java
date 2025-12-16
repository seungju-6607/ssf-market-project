package com.springboot.next_shoppy_springboot.controller;

import com.springboot.next_shoppy_springboot.dto.CartItemRequestDto;
import com.springboot.next_shoppy_springboot.dto.CartItemResponseDto;
import com.springboot.next_shoppy_springboot.dto.CartListResponseDto;
import com.springboot.next_shoppy_springboot.service.CartService;
import com.springboot.next_shoppy_springboot.service.KakaoPayService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cart")
public class CartController {
    private CartService cartService;
    private KakaoPayService kakaoPayService;

    @Autowired
    public CartController(CartService cartService) {
        this.cartService = cartService;
        this.kakaoPayService = kakaoPayService;
    }

    @PostMapping("/deleteItem")
    public int deleteItem(@RequestBody CartItemRequestDto requestDto) {
        return cartService.deleteItem(requestDto);
    }

    @PostMapping("/list")
    public List<CartListResponseDto> findList(@RequestBody CartItemRequestDto requestDto,
                                              HttpServletRequest request) {
        return cartService.findList(requestDto);
    }

    @PostMapping("/count")
    public CartItemResponseDto count(@RequestBody CartItemRequestDto requestDto) {
        return cartService.getCount(requestDto);
    }

    @PostMapping("/updateQty")
    public int  updateQty(@RequestBody CartItemRequestDto requestDto) {
        return cartService.updateQty(requestDto);
    }

    @PostMapping("/checkQty")
    public CartItemResponseDto checkQty(@RequestBody CartItemRequestDto requestDto) {
        return cartService.checkQty(requestDto);
    }

    @PostMapping("/add")
    public int add(@RequestBody CartItemRequestDto requestDto) {
        return cartService.add(requestDto);
    }
}
