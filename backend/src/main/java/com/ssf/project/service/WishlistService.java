package com.ssf.project.service;

import com.ssf.project.dto.WishlistItemDto;

import java.util.List;

public interface WishlistService {

    List<WishlistItemDto> getWishlist(String email);

    boolean toggleWishlist(WishlistItemDto dto);

    void clearWishlist(String email);
}
