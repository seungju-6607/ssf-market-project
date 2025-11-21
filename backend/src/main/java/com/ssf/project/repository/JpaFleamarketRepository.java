package com.ssf.project.repository;

import com.ssf.project.dto.FleamarketListResponseDto;
import com.ssf.project.entity.Fleamarket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JpaFleamarketRepository extends JpaRepository<Fleamarket, Integer> {

    /* 판매글 전체 목록 조회 */
    @Query("""
            select new com.ssf.project.dto.FleamarketListResponseDto(
                v.fleaKey,
                v.userKey,
                v.fleaSale,
                v.fleaName,
                v.fleaEmail,
                v.fleaId,
                v.fleaTitle,
                v.fleaPrice,
                v.fleaCategory,
                v.fleaContent,
                v.fleaList,
                v.fleaRdate
            )
            from Fleamarket v
            """)
    List<FleamarketListResponseDto> findAllList();

    /* 판매글 등록 */
    Fleamarket save(Fleamarket fleamarket);
}
