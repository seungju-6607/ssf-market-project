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
            where v.fleaKey = :fleaKey and v.buyerId = :buyerId and v.sellerId = :sellerId
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
            where v.fleaKey = :fleaKey and v.buyerId = :buyerId and v.sellerId = :sellerId
            """)
    List<FleamarketMsgDto> findMsgBySeller(@Param("fleaKey") Integer fleaKey,
                                           @Param("buyerId") String buyerId,
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

    /* 판매글 등록 */
    Fleamarket save(Fleamarket fleamarket);
}
