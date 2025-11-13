package com.ssf.project.repository;

import com.ssf.project.entity.MemberAddr;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface JpaMemberAddrRepository extends JpaRepository<MemberAddr, Integer> {

    /* 주문 배송지를 가져온다 */
    @Query(value = """
            select a.*
            from ssf_addr a
            inner join ssf_user u on a.user_key = u.user_key
            where u.email = :email
            """, nativeQuery = true)
    Optional<MemberAddr> findByUserEmail(@Param("email") String email);
}
