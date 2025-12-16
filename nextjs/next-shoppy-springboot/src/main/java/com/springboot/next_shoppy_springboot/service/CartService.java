package com.springboot.next_shoppy_springboot.service;

import com.springboot.next_shoppy_springboot.dto.CartItemDto;
import com.springboot.next_shoppy_springboot.dto.CartItemRequestDto;
import com.springboot.next_shoppy_springboot.dto.CartItemResponseDto;
import com.springboot.next_shoppy_springboot.dto.CartListResponseDto;

import java.util.List;

public interface CartService {
    int deleteItem(CartItemRequestDto requestDto);
    List<CartListResponseDto> findList(CartItemRequestDto requestDto);
    CartItemResponseDto getCount(CartItemRequestDto requestDto);
    int updateQty(CartItemRequestDto requestDto);
    CartItemResponseDto checkQty(CartItemRequestDto requestDto);
    int add(CartItemRequestDto requestDto);
}
