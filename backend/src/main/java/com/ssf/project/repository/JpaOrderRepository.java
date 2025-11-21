package com.ssf.project.repository;

import com.ssf.project.dto.OrderDto;
import com.ssf.project.dto.OrderListResponseDto;
import com.ssf.project.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JpaOrderRepository extends JpaRepository<Order, Integer> {
    @Modifying
    @Query(value = """
            insert into ssf_order (
                  order_uuid, user_key, order_price, order_status, order_name,
                 order_zipcode, order_addr, order_addr_detail, order_tel,
                 order_req
            )
            select
                :#{#order.order_code}, u.user_key, :#{#order.order_price}, :#{#order.order_status}, :#{#order.order_name},
                 :#{#order.order_zipcode}, :#{#order.order_addr}, :#{#order.order_addr_detail}, :#{#order.order_tel},
                 :#{#order.order_req}
            from ssf_user u
            where u.email = :email
            """, nativeQuery = true)
    int saveOrder(@Param("order") Order order, @Param("email") String email);


    @Modifying
    @Query(value = """
            insert into ssf_order_detail (
                order_uuid, item_key, order_detail_price, order_detail_cnt
            )
            select :orderUUID, c.item_key, i.item_sale, c.cart_qty
            from ssf_cart c
            inner join ssf_item i on i.item_key = c.item_key
            inner join ssf_order o on o.user_key = c.user_key
            where c.cart_key in (:cartKeys) and o.order_uuid = :orderUUID
            """, nativeQuery = true)
    int saveOrderDetail(@Param("orderUUID") String orderUUID,
                        @Param("cartKeys") List<Integer> cartKeys);
    @Modifying
    @Query(value = """
            insert into ssf_order_detail (
                order_uuid, item_key, order_detail_price, order_detail_cnt
            )
            values (:orderUUID, :itemKey, :price, :qty)
            """, nativeQuery = true)
    int saveOrderDetailDirect(@Param("orderUUID") String orderUUID,
                              @Param("itemKey") Integer itemKey,
                              @Param("price") Integer price,
                              @Param("qty") Integer qty);

    @Query(value = """
                    select
                        u.user_key AS userKey,
                        u.username AS userName,
                        u.email AS email,
                        o.order_zipcode AS addrZipCode,
                        o.order_addr AS addrMain,
                        o.order_addr_detail AS addrDetail,
                        o.order_tel AS addrTel,
                        o.order_req AS addrReq,
                        i.item_name AS itemName,
                        i.item_list AS itemList,
                        i.item_content AS itemContent,
                        i.item_price AS itemPrice,
                        i.item_sale AS itemSale,
                        o.order_price AS totalPrice,
                        SUM(d.order_detail_cnt) AS orderQty,
                        d.order_detail_cnt AS itemQty
                    from ssf_user u
                    inner join ssf_order o ON u.user_key = o.user_key
                    left join ssf_order_detail d ON o.order_uuid = d.order_uuid
                    left join ssf_item i ON d.item_key = i.item_key
                    where o.order_uuid = :orderId
                    group by u.user_key, u.username, u.email, o.order_zipcode, o.order_addr,
                             o.order_addr_detail, o.order_tel, o.order_req, i.item_name,
                             i.item_list, i.item_content, i.item_price, i.item_sale, o.order_price,
                             d.order_detail_cnt
                    """, nativeQuery = true)
    List<OrderListResponseDto> findOrderListByOrderId(@Param("orderId") String orderId);
}
