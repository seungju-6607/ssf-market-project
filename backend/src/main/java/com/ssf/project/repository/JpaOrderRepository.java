package com.ssf.project.repository;

import com.ssf.project.dto.OrderDto;
import com.ssf.project.dto.OrderDetailRow;
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
                 order_req, order_date, order_couponid
            )
            select
                :#{#order.order_code}, u.user_key, :#{#order.order_price}, :#{#order.order_status}, :#{#order.order_name},
                 :#{#order.order_zipcode}, :#{#order.order_addr}, :#{#order.order_addr_detail}, :#{#order.order_tel},
                 :#{#order.order_req}, NOW(), :#{#order.order_couponid}
            from ssf_user u
            where u.email = :email
            """, nativeQuery = true)
    int saveOrder(@Param("order") Order order, @Param("email") String email);


    @Modifying
    @Query(value = """
            insert into ssf_order_detail (
                order_uuid, item_key, order_detail_price, order_detail_cnt, order_detail_size
            )
            select :orderUUID, c.item_key, i.item_sale, c.cart_qty, c.cart_size
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
                order_uuid, item_key, order_detail_price, order_detail_cnt, order_detail_size
            )
            values (:orderUUID, :itemKey, :price, :qty, :size)
            """, nativeQuery = true)
    int saveOrderDetailDirect(@Param("orderUUID") String orderUUID,
                              @Param("itemKey") Integer itemKey,
                              @Param("price") Integer price,
                              @Param("qty") Integer qty,
                              @Param("size") String size);

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

    @Query(value = """
            select
                o.order_uuid  AS orderId,
                o.order_price AS totalPrice,
                o.order_date AS orderedAt,
                i.item_name AS itemName,
                d.order_detail_cnt AS itemQty,
                i.item_sale AS itemPrice,
                i.item_list AS itemList,
                d.order_detail_size AS itemSize
            from ssf_order o
            join ssf_order_detail d on o.order_uuid = d.order_uuid
            join ssf_item i on d.item_key = i.item_key
            where o.user_key = (
                select u.user_key from ssf_user u where u.email = :email
            )
            and (:startDate is null or date(o.order_date) >= :startDate)
            and (:endDate is null or date(o.order_date) <= :endDate)
            order by o.order_key desc
            """, nativeQuery = true)
    List<Object[]> findOrderHistory(@Param("email") String email,
                                    @Param("startDate") java.time.LocalDate startDate,
                                    @Param("endDate") java.time.LocalDate endDate);

    @Query(value = """
            select
                o.order_uuid as orderId,
                o.order_date as orderedAt,
                o.order_price as orderPrice,
                2500 as shippingFee,
                coalesce(
                    ( sum(i.item_price * d.order_detail_cnt) over(partition by o.order_uuid) + 2500 )
                    - o.order_price,
                    0
                ) as discountAmount,
                o.order_name as receiverName,
                o.order_tel as receiverPhone,
                o.order_zipcode as receiverZipcode,
                o.order_addr as receiverAddress,
                o.order_addr_detail as receiverAddrDetail,
                o.order_req as receiverMemo,
                u.username as customerName,
                u.email as customerEmail,
                u.phone as customerPhone,
                coalesce((
                    select sum(o2.order_price)
                    from ssf_order o2
                    where o2.user_key = o.user_key
                ), 0) as totalPurchase,
                coalesce((
                    select count(*)
                    from ssf_coupon_used cu
                    where cu.user_key = o.user_key
                      and cu.used_yn = 'N'
                ), 0) as couponCount,
                0 as pointBalance,
                sum(d.order_detail_price * d.order_detail_cnt)
                    over(partition by o.order_uuid) as productTotal,
                i.item_name as itemName,
                i.item_list as itemList,
                d.order_detail_price as itemPrice,
                d.order_detail_cnt as itemQty,
                d.order_detail_size as itemSize,
                o.order_status as orderStatus
            from ssf_order o
            join ssf_user u on u.user_key = o.user_key
            join ssf_order_detail d on o.order_uuid = d.order_uuid
            join ssf_item i on d.item_key = i.item_key
            where o.order_uuid = :orderId
              and u.email = :email
            order by d.order_detail_key asc
            """, nativeQuery = true)
    List<OrderDetailRow> findOrderDetail(@Param("email") String email,
                                         @Param("orderId") String orderId);

    @Query(value = """
            select
                o.order_uuid as orderId,
                o.order_date as orderedAt,
                o.order_price as orderPrice,
                2500 as shippingFee,
                coalesce(
                    ( sum(i.item_price * d.order_detail_cnt) over(partition by o.order_uuid) + 2500 )
                    - o.order_price,
                    0
                ) as discountAmount,
                o.order_name as receiverName,
                o.order_tel as receiverPhone,
                o.order_zipcode as receiverZipcode,
                o.order_addr as receiverAddress,
                o.order_addr_detail as receiverAddrDetail,
                o.order_req as receiverMemo,
                u.username as customerName,
                u.email as customerEmail,
                u.phone as customerPhone,
                coalesce((
                    select sum(o2.order_price)
                    from ssf_order o2
                    where o2.user_key = o.user_key
                ), 0) as totalPurchase,
                coalesce((
                    select count(*)
                    from ssf_coupon_used cu
                    where cu.user_key = o.user_key
                      and cu.used_yn = 'N'
                ), 0) as couponCount,
                0 as pointBalance,
                sum(d.order_detail_price * d.order_detail_cnt)
                    over(partition by o.order_uuid) as productTotal,
                i.item_name as itemName,
                i.item_list as itemList,
                d.order_detail_price as itemPrice,
                d.order_detail_cnt as itemQty,
                d.order_detail_size as itemSize,
                o.order_status as orderStatus
            from ssf_order o
            join ssf_user u on u.user_key = o.user_key
            join ssf_order_detail d on o.order_uuid = d.order_uuid
            join ssf_item i on d.item_key = i.item_key
            where o.order_uuid = :orderId
            order by d.order_detail_key asc
            """, nativeQuery = true)
    List<OrderDetailRow> findOrderDetailForAdmin(@Param("orderId") String orderId);

    @Query(value = """
            select count(*)
            from ssf_order o
            where (:start is null or date(o.order_date) >= :start)
              and (:end   is null or date(o.order_date) <= :end)
              and order_status = 's'
            """, nativeQuery = true)
    long countOrdersForAdmin(@Param("start") java.time.LocalDate start,
                             @Param("end") java.time.LocalDate end);

    @Query(value = """
            select
                o.order_uuid  as orderId,
                o.order_date  as orderedAt,
                u.username    as ordererName,
                o.order_name  as receiverName,
                o.order_price as orderPrice,
                o.order_status as orderStatus
            from ssf_order o
            join ssf_user u on u.user_key = o.user_key
            where (:start is null or date(o.order_date) >= :start)
              and (:end   is null or date(o.order_date) <= :end)
            order by o.order_key desc
            limit :limit offset :offset
            """, nativeQuery = true)
    List<Object[]> findOrdersForAdmin(@Param("start") java.time.LocalDate start,
                                                @Param("end") java.time.LocalDate end,
                                                @Param("limit") int limit,
                                                @Param("offset") int offset);

    @Query(value = """
            select
                month(o.order_date) as month,
                sum(o.order_price)  as totalAmount
            from ssf_order o
            where year(o.order_date) = :year
            and o.order_status = 'S'
            group by month(o.order_date)
            order by month(o.order_date)
            """, nativeQuery = true)
    List<Object[]> findMonthlyRevenue(@Param("year") int year);


    @Query(value = """
            select
                coalesce(sum(case when year(order_date) = year(now()) then order_price else 0 end), 0) as thisYearSales,
                coalesce(sum(case when year(order_date) = year(now()) - 1 then order_price else 0 end), 0) as lastYearSales
            from ssf_order
            where order_status = 's';
            """, nativeQuery = true)
    List<Object[]> sumRevenueThisAndLastYear();

    @Modifying
    @Query(value = """
            update ssf_order
            set order_status = 'C'
            where order_uuid = :orderId
            """, nativeQuery = true)
    int cancelOrder(@Param("orderId") String orderId);

    @Query(value = """
            select user_key
            from ssf_order
            where order_uuid = :orderId
            """, nativeQuery = true)
    String findUserKeyByOrderId(@Param("orderId") String orderId);
}
