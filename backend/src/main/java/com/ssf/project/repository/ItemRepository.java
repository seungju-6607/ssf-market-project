package com.ssf.project.repository;

import com.ssf.project.entity.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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

    // ✅ 검색 (이름/설명/브랜드/상품ID)
    @Query("""
        SELECT i
        FROM Item i
        WHERE i.itemDeleted = 'N'
          AND (
              LOWER(i.itemName) LIKE LOWER(CONCAT('%', :q, '%'))
           OR LOWER(i.itemContent) LIKE LOWER(CONCAT('%', :q, '%'))
           OR LOWER(i.itemBrand) LIKE LOWER(CONCAT('%', :q, '%'))
           OR LOWER(i.productId) LIKE LOWER(CONCAT('%', :q, '%'))
          )
        ORDER BY i.itemKey DESC
    """)
    List<Item> search(@Param("q") String q);
}
