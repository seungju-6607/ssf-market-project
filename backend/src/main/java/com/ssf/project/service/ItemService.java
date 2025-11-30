package com.ssf.project.service;

import com.ssf.project.entity.Item;
import com.ssf.project.repository.ItemRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ItemService {

    private final ItemRepository repo;
    private final Logger logger = LoggerFactory.getLogger(ItemService.class);

    public ItemService(ItemRepository repo) {
        this.repo = repo;
    }

    // 카테고리 + 서브카테고리 상품 조회
    public List<Item> getItemsByCategory(String category, String subcategory) {
        List<Item> items;

        if (subcategory == null || subcategory.isEmpty() || subcategory.equals("main")) {
            items = repo.findByItemCategoryAndItemDeleted(category, "N");
            logger.info("getItemsByCategory({}) -> {} items found", category, items.size());
        } else {
            items = repo.findByItemCategoryAndItemSubcategoryAndItemDeleted(category, subcategory, "N");
            logger.info("getItemsByCategory({},{}) -> {} items found", category, subcategory, items.size());
        }

        // 중간 데이터 확인
        items.forEach(item -> logger.debug("Item: {} - {} - {}", item.getItemKey(), item.getItemName(), item.getItemPrice()));

        return items;
    }

    // 단일 상품 조회
    public Item getItemDetail(Long itemKey) {
        Item item = repo.findByItemKeyAndItemDeleted(itemKey, "N");
        if (item != null) {
            logger.info("getItemDetail({}) -> {}", itemKey, item.getItemName());
            logger.debug("Item full info: {}", item);
        } else {
            logger.warn("getItemDetail({}) -> Item not found", itemKey);
        }
        return item;
    }

    // 단일 상품 조회 by productId
    public Item getItemByProductId(String productId) {
        Item item = repo.findByProductIdAndItemDeleted(productId, "N");
        if (item != null) {
            logger.info("getItemByProductId({}) -> {}", productId, item.getItemName());
            logger.debug("Item full info: {}", item);
        } else {
            logger.warn("getItemByProductId({}) -> Item not found", productId);
        }
        return item;
    }
}
