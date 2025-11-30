package com.ssf.project.repository;

import com.ssf.project.entity.Item;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ItemRepository extends JpaRepository<Item, Long> {

    // 카테고리 조회
    List<Item> findByItemCategoryAndItemDeleted(String category, String itemDeleted);

    // 카테고리 + 서브카테고리 조회
    List<Item> findByItemCategoryAndItemSubcategoryAndItemDeleted(
            String category, String subcategory, String itemDeleted
    );

    // 단일 상품 조회
    Item findByItemKeyAndItemDeleted(Long itemKey, String itemDeleted);

    // 단일 상품 조회 by productId
    Item findByProductIdAndItemDeleted(String productId, String itemDeleted);
}
