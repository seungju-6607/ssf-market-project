package com.ssf.project.controller;

import com.ssf.project.entity.Item;
import com.ssf.project.service.ItemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/items")
public class ItemController {

    private final ItemService service;

    public ItemController(ItemService service) {
        this.service = service;
    }

    // 카테고리 + 서브카테고리 상품 조회
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Item>> getItemsByCategory(
            @PathVariable String category,
            @RequestParam(required = false) String subcategory
    ) {
        List<Item> items = service.getItemsByCategory(category, subcategory);
        return ResponseEntity.ok(items);
    }

    // 단일 상품 조회
    @GetMapping("/{itemKey}")
    public ResponseEntity<Item> getItemDetail(@PathVariable Long itemKey) {
        Item item = service.getItemDetail(itemKey);
        if (item != null) {
            return ResponseEntity.ok(item);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 단일 상품 조회 by productId
    @GetMapping("/product/{productId}")
    public ResponseEntity<Item> getItemByProductId(@PathVariable String productId) {
        Item item = service.getItemByProductId(productId);
        if (item != null) {
            return ResponseEntity.ok(item);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
