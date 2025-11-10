package com.ssf.project.service;

import com.ssf.project.dto.CartItemDto;
import com.ssf.project.dto.CartListResponseDto;

import java.util.List;

public interface CartService {

    List<CartListResponseDto> findCartListByEmail(CartItemDto cartItemDto);
    int deleteItem(List<CartItemDto> cartItem);
}

