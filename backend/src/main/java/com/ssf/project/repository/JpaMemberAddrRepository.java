package com.ssf.project.repository;

import com.ssf.project.entity.MemberAddr;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JpaMemberAddrRepository extends JpaRepository<MemberAddr, Integer> {

    /* 기본 배송지 가져오기 */
    @Query(value = """
            select a.*
            from ssf_addr a
            inner join ssf_user u on a.user_key = u.user_key
            where u.email = :email and a.addr_def = 'Y'
            """, nativeQuery = true)
    MemberAddr findAddrByUserEmail(@Param("email") String email);

    /* 배송지 목록을 가져오기 */
    @Query(value = """
            select a.*
            from ssf_addr a
            inner join ssf_user u on a.user_key = u.user_key
            where u.email = :email
            """, nativeQuery = true)
    List<MemberAddr> findAddrListByUserEmail(@Param("email") String email);
}
