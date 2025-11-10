package com.ssf.project.repository;

import com.ssf.project.dto.CartListResponseDto;
import com.ssf.project.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JpaCartRepository extends JpaRepository<CartItem, Integer> {

    /* 장바구니 리스트 조회 */
    @Query("""
            select new com.ssf.project.dto.CartListResponseDto(
                v.cartKey,
                v.userKey,
                v.userName,
                v.email,
                v.itemKey,
                v.itemName,
                v.itemList,
                v.itemContent,
                v.itemPrice,
                v.itemSale,
                v.cartQty,
                v.cartSize,
                v.cartRdate,
                v.lineTotalSale,
                v.lineTotalPrice,
                v.totalSaleAmount,
                v.totalItemCount
            )
            from CartListView v
            where v.email = :email
            """)
    List<CartListResponseDto> findCartListByEmail(@Param("email") String email);

    /* 장바구니 리스트 삭제 */
    @Modifying
    @Query("""
            delete from CartItem c where c.cartKey in :cartKey
            """)
    int deleteItem(@Param("cartKey") List<Integer> cartKey);
}

