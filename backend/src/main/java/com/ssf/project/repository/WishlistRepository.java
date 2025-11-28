package com.ssf.project.repository;

import com.ssf.project.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {

    List<Wishlist> findByUserKey(String userKey);

    Wishlist findByUserKeyAndProductId(String userKey, String productId);

    @Modifying
    @Transactional
    @Query("DELETE FROM Wishlist w WHERE w.userKey = :userKey")
    void deleteAllByUserKey(@Param("userKey") String userKey);
}
