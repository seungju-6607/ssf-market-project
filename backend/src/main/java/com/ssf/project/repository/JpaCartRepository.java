package com.ssf.project.repository;

import com.ssf.project.dto.CartCheckQtyDto;
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


    /* 장바구니 아이템 카운트 (Header icon) */
    @Query(value= """
            select ifnull(sum(cart_qty), 0) as sumQty
            from ssf_cart c
            inner join ssf_user u on c.user_key = u.user_key
            where u.email = :email
            """, nativeQuery = true)
    int countByEmail(@Param("email") String email);


    /* 장바구니 아이템 수량 (+/-) */
    @Modifying
    @Query("update CartItem c set c.cartQty = c.cartQty + 1 where c.cartKey = :cartKey")
    int updateQtyPlus(@Param("cartKey") int cartKey);

    @Modifying
    @Query("update CartItem c set c.cartQty = c.cartQty - 1 where c.cartKey = :cartKey")
    int updateQtyMinus(@Param("cartKey") int cartKey);


    /* 장바구니에 담으려는 상품+사이즈가 이미 있는지 체크 */
   @Query("""
           select new com.ssf.project.dto.CartCheckQtyDto(
               v.cartKey,
               count(v)
           )
           from CartListView v
           where v.itemKey = :itemKey
             and v.cartSize = :size
             and v.email = :email
           group by v.cartKey
           """)
   CartCheckQtyDto checkQty(@Param("itemKey") int itemKey, @Param("size") String size, @Param("email") String email);


   /* email로 user_key를 추출하는 쿼리 */
   @Query(value = "select user_key from ssf_user where email = :email limit 1", nativeQuery = true)
   String findUserKeyByEmail(@Param("email") String email);


   /* 장바구니에 상품 추가 */
   CartItem save(CartItem cartItem);

}

