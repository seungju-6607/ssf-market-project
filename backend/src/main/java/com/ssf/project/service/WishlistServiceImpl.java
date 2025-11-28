package com.ssf.project.service;

import com.ssf.project.dto.WishlistItemDto;
import com.ssf.project.entity.Wishlist;
import com.ssf.project.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WishlistServiceImpl implements WishlistService {

    private final WishlistRepository wishlistRepository;

    @Override
    public List<WishlistItemDto> getWishlist(String email) {
        List<Wishlist> list = wishlistRepository.findByUserKey(email);
        return list.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public boolean toggleWishlist(WishlistItemDto dto) {
        String email = dto.getEmail();
        Wishlist existing = wishlistRepository
                .findByUserKeyAndProductId(email, dto.getProductId());

        if (existing != null) {
            // 이미 있으면 삭제
            wishlistRepository.delete(existing);
            return false;
        }

        // 없으면 추가
        Wishlist w = new Wishlist();
        w.setUserKey(email);
        w.setProductId(dto.getProductId());
        w.setProductName(dto.getProductName());
        w.setProductBrand(dto.getProductBrand());
        w.setProductImage(dto.getProductImage());
        w.setProductPrice(dto.getProductPrice());
        w.setProductPriceOri(dto.getProductPriceOri());
        wishlistRepository.save(w);
        return true;
    }

    @Override
    public void clearWishlist(String email) {
            wishlistRepository.deleteAllByUserKey(email);
        }

    private WishlistItemDto toDto(Wishlist w) {
        WishlistItemDto dto = new WishlistItemDto();
        dto.setEmail(w.getUserKey());
        dto.setProductId(w.getProductId());
        dto.setProductName(w.getProductName());
        dto.setProductBrand(w.getProductBrand());
        dto.setProductImage(w.getProductImage());
        dto.setProductPrice(w.getProductPrice());
        dto.setProductPriceOri(w.getProductPriceOri());
        return dto;
    }
}
