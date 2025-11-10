package com.ssf.project.service;

import com.ssf.project.dto.CartItemDto;
import com.ssf.project.dto.CartListResponseDto;
import com.ssf.project.repository.JpaCartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final JpaCartRepository jpaCartRepository;

    @Override
    public List<CartListResponseDto> findCartListByEmail(CartItemDto cartItemDto) {
        if (cartItemDto == null) {
            return Collections.emptyList();
        }
        String email = cartItemDto.getEmail();
        if (email == null || email.isBlank()) {
            email = cartItemDto.getUserKey(); // fallback for legacy clients
        }
        return jpaCartRepository.findCartListByEmail(email);
    }

    @Override
    public int deleteItem(List<CartItemDto> cartItem) {
        List<Integer> cartKeys = cartItem.stream()
                .map(CartItemDto::getCartKey)
                .collect(Collectors.toList());
        return jpaCartRepository.deleteItem(cartKeys);
    }
}

