package com.springboot.next_shoppy_springboot.repository;

import com.springboot.next_shoppy_springboot.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    /** step1 : 주문/결제 - 주문(Orders) 테이블 저장 **/
    Order save(Order entity);

    /** step2 : 주문/결제 - 주문상세(Order_detail) 테이블 저장, 서브쿼리, Native-Query  **/
    @Modifying
    @Query(value= """
            INSERT INTO 
                order_detail(order_code, pid, pname, size, qty, pid_total_price, discount)
            SELECT 
                :orderCode, pid, name AS pname, size, qty, total_price AS pid_total_price, 
                :discount
            FROM view_cartlist
            WHERE cid IN (:cidList)
            """, nativeQuery = true)
    int saveOrderDetail(@Param("orderCode") String orderCode,
                        @Param("discount") Integer discount,
                        @Param("cidList") List<Integer> cidList);
}











