package com.ssf.project.repository;

import com.ssf.project.entity.MemberAddr;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JpaMemberAddrRepository extends JpaRepository<MemberAddr, Integer> {

    /* 기본 배송지 가져오기 */
    @Query(value = """
            select a.*
            from ssf_addr a
            inner join ssf_user u on a.user_key = u.user_key
            where u.email = :email and a.addr_def = 'Y'
            order by a.addr_key desc
            limit 1
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

    /* 중복 배송지 체크 */
    @Query(value = """
            select a.*
            from ssf_addr a
            inner join ssf_user u on a.user_key = u.user_key
            where u.email = :email
              and a.addr_zipcode = :zipcode
              and a.addr_main = :main
              and a.addr_detail = :detail
              and a.addr_tel = :tel
            limit 1
            """, nativeQuery = true)
    MemberAddr findDuplicateAddr(@Param("email") String email,
                                  @Param("zipcode") String zipcode,
                                  @Param("main") String main,
                                  @Param("detail") String detail,
                                  @Param("tel") String tel);

    /* 기본 배송지 해제 */
    @Modifying
    @Query(value = """
            update ssf_addr a
            inner join ssf_user u on a.user_key = u.user_key
            set a.addr_def = 'N'
            where u.email = :email and a.addr_def = 'Y'
            """, nativeQuery = true)
    int clearDefaultAddr(@Param("email") String email);

    /* 배송지 업데이트 */
    @Modifying
    @Query(value = """
            update ssf_addr
            set addr_name = :#{#addr.addrName},
                addr_zipcode = :#{#addr.addrZipcode},
                addr_main = :#{#addr.addrMain},
                addr_detail = :#{#addr.addrDetail},
                addr_tel = :#{#addr.addrTel},
                addr_req = :#{#addr.addrReq},
                addr_def = :#{#addr.addrDef}
            where addr_key = :addrKey
            """, nativeQuery = true)
    int updateAddr(@Param("addr") MemberAddr memberAddr, @Param("addrKey") int addrKey);

    /* 배송지 저장하기 */
    @Modifying
    @Query(value = """
            insert into ssf_addr (
                user_key, addr_name, addr_zipcode, addr_main, addr_detail, addr_tel,
                addr_req, addr_def
            )
            select
                user_key,
                :#{#addr.addrName},
                :#{#addr.addrZipcode},
                :#{#addr.addrMain},
                :#{#addr.addrDetail},
                :#{#addr.addrTel},
                :#{#addr.addrReq},
                :#{#addr.addrDef}
            from ssf_user
            where email = :email
            """, nativeQuery = true)
    int saveAddr(@Param("addr") MemberAddr memberAddr, @Param("email") String email);

}
