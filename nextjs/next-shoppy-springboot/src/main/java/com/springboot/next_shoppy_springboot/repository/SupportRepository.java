package com.springboot.next_shoppy_springboot.repository;

import com.springboot.next_shoppy_springboot.entity.Support;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface SupportRepository extends JpaRepository<Support, Integer> {
    Page<Support> findAll(Pageable pageable);

    @Query("select s from Support s where s.stype = :stype")
    Page<Support> findByType(@Param("stype") String stype, Pageable pageable);

    @Query("""
            select s from Support s
            where 
                (:type = 'title' and s.title like :keyword ) or
                (:type = 'content' and s.content like :keyword ) or
                (:type = 'cdate' and s.rdate like :keyword ) 
            """)
    Page<Support> search(@Param("type") String type,
                         @Param("keyword") String keyword,
                         Pageable pageable);

}



