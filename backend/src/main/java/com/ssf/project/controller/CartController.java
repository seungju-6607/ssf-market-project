package com.ssf.project.controller;

import com.ssf.project.dto.CartItemDto;
import com.ssf.project.dto.CartListResponseDto;
import com.ssf.project.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    /* 장바구니 리스트 */
    @PostMapping("/list")
    public List<CartListResponseDto> findCartListByEmail(@RequestBody CartItemDto cartItemDto) {
        if (cartItemDto == null) {
            return Collections.emptyList();
        }
        return cartService.findCartListByEmail(cartItemDto);
    }

    /* 장바구니 목록 삭제 */
    @PostMapping("/deleteItem")
    public int deleteItem(@RequestBody List<CartItemDto> cartItem) {
        return cartService.deleteItem(cartItem);
    }
}

