package com.ssf.project.controller;

import com.ssf.project.dto.WishlistItemDto;
import com.ssf.project.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/wishlist")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping("/list")
    public List<WishlistItemDto> getList(@RequestParam String email) {
        return wishlistService.getWishlist(email);
    }

    @PostMapping("/toggle")
    public boolean toggle(@RequestBody WishlistItemDto dto) {
        System.out.println("dto 확인 : "+ dto);
        return wishlistService.toggleWishlist(dto);
    }

    @PostMapping("/clear")
    public void clear(@RequestBody WishlistItemDto dto) {
        wishlistService.clearWishlist(dto.getEmail());
    }
}
