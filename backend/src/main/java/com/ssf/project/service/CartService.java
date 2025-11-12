package com.ssf.project.service;

import com.ssf.project.dto.CartItemDto;
import com.ssf.project.dto.CartListResponseDto;

import java.util.List;

public interface CartService {

    List<CartListResponseDto> findCartListByEmail(CartItemDto cartItemDto);
    int deleteItem(List<CartItemDto> cartItem);
    CartItemDto getCount(CartItemDto cartItem);
    int updateQty(CartItemDto cartItem);
    CartItemDto checkQty(CartItemDto cartItem);
    int add(CartItemDto cartItem);
}

