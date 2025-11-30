package com.ssf.project.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ssf_item")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_key")
    private Long itemKey;

    @Column(name = "category_id", length = 5, nullable = false)
    private String categoryId;

    @Column(name = "product_id", length = 100, nullable = false)
    private String productId;

    @Column(name = "item_name", length = 150, nullable = false)
    private String itemName;

    @Column(name = "item_list", columnDefinition = "json", nullable = false)
    private String itemList; // JSON 문자열로 저장

    @Column(name = "item_content", length = 1000)
    private String itemContent;

    @Column(name = "item_price", nullable = false)
    private Integer itemPrice;

    @Column(name = "item_sale", nullable = false)
    private Integer itemSale;

    @Column(name = "item_rdate")
    private LocalDateTime itemRdate;

    @Column(name = "item_cnt", nullable = false)
    private Integer itemCnt;

    @Column(name = "item_deleted", length = 1)
    @Builder.Default
    private String itemDeleted = "N";

    @Column(name = "item_brand", length = 100)
    private String itemBrand;

    @Column(name = "item_category", length = 150)
    private String itemCategory;

    @Column(name = "item_subcategory", length = 150)
    private String itemSubcategory;
}
