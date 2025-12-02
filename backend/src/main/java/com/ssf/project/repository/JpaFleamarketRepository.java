package com.ssf.project.repository;

import com.ssf.project.dto.FleamarketListResponseDto;
import com.ssf.project.dto.FleamarketMsgDto;
import com.ssf.project.entity.Fleamarket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

    /* 판매글 필터링 목록 조회 */
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
            where (:fleaSale = 'Y' or v.fleaSale = :fleaSale)
                and (:fleaCategory = 'all' or v.fleaCategory LIKE CONCAT('%', :fleaCategory, '%'))
                and ( v.fleaTitle LIKE CONCAT('%', :filterWord, '%')
                      or v.fleaContent LIKE CONCAT('%', :filterWord, '%')
                      or v.fleaName LIKE CONCAT('%', :filterWord, '%'))
            """)
    List<FleamarketListResponseDto> findFilterList(@Param("fleaSale") String fleaSale,
                                                   @Param("fleaCategory") String fleaCategory,
                                                   @Param("filterWord") String filterWord);

    /* 판매글 상세 내용 조회 */
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
            where v.fleaKey = :fleaKey
            """)
    List<FleamarketListResponseDto> getByFleaKey(@Param("fleaKey") int fleaKey);

    /* 구매자 문의 내용 조회 */
    @Query("""
            select new com.ssf.project.dto.FleamarketMsgDto(
                m.msgId,
                m.fleaKey,
                m.buyerId,
                m.sellerId,
                m.senderId,
                m.senderName,
                m.inquiryMsg,
                m.createdAt,
                m.readFlag
            )
            from Message m
            where m.fleaKey = :fleaKey
              and m.buyerId = :buyerId
              and m.sellerId = :sellerId
            order by m.createdAt asc
            """)
    List<FleamarketMsgDto> findMsgByBuyer(@Param("fleaKey") Integer fleaKey,
                                          @Param("buyerId") String buyerId,
                                          @Param("sellerId") String sellerId);

    /* 판매자 문의함 내용 조회 */
    @Query("""
            select new com.ssf.project.dto.FleamarketMsgDto(
                v.msgId,
                v.fleaKey,
                v.buyerId,
                v.sellerId,
                v.senderId,
                v.senderName,
                v.inquiryMsg,
                v.createdAt,
                v.readFlag
            )
            from Message v
            where v.fleaKey = :fleaKey and v.sellerId = :sellerId
            """)
    List<FleamarketMsgDto> findMsgBySeller(@Param("fleaKey") Integer fleaKey,
                                           @Param("sellerId") String sellerId);

    @Modifying
    @Query(value = """
            insert into flea_messages (
                flea_key, buyer_id, seller_id, sender_id, sender_name, inquiry_msg
            )
            values (:fleaKey, :buyerId, :sellerId, :senderId , :senderName , :inquiryMsg)
            """, nativeQuery = true)
    int msgBuySave(@Param("fleaKey") Integer fleaKey,
                @Param("buyerId") String buyerId,
                @Param("sellerId") String sellerId,
                @Param("senderId") String senderId,
                @Param("senderName") String senderName,
                @Param("inquiryMsg") String inquiryMsg);

    /* 판매글 삭제 */
    @Modifying
    @Query("DELETE FROM Fleamarket f WHERE f.fleaKey = :fleaKey")
    int deleteByFleaKey(@Param("fleaKey") Integer fleaKey);

    /* 판매글 수정 */
    @Modifying
    @Query(value = """
                    update flea_market v
                    set v.flea_category = CASE WHEN :fleaCategory IS NOT NULL THEN :fleaCategory ELSE v.flea_category END,
                        v.flea_sale     = CASE WHEN :fleaSale IS NOT NULL     THEN :fleaSale     ELSE v.flea_sale END,
                        v.flea_content  = CASE WHEN :fleaContent IS NOT NULL  THEN :fleaContent  ELSE v.flea_content END,
                        v.flea_title    = CASE WHEN :fleaTitle IS NOT NULL    THEN :fleaTitle    ELSE v.flea_title END,
                        v.flea_list     = CASE WHEN :fleaList IS NOT NULL     THEN :fleaList     ELSE v.flea_list END,
                        v.flea_price    = CASE WHEN :fleaPrice <> 0 THEN :fleaPrice ELSE v.flea_price END,
                        v.flea_rdate    = now()
                    where v.flea_key = :fleaKey
                """, nativeQuery = true)
    int updateList(@Param("fleaKey") Integer fleaKey,
                   @Param("fleaSale") String fleaSale,
                   @Param("fleaCategory") String fleaCategory,
                   @Param("fleaTitle") String fleaTitle,
                   @Param("fleaContent") String fleaContent,
                   @Param("fleaList") String fleaList,
                   @Param("fleaPrice") Integer fleaPrice);

    /* 판매글 등록 */
    Fleamarket save(Fleamarket fleamarket);
}
