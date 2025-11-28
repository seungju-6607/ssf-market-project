package com.ssf.project.service;

import com.ssf.project.dto.CouponDto;
import com.ssf.project.repository.JpaCouponRepository;
import com.ssf.project.repository.MemberRepository;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class CouponServiceImpl implements CouponService {

    private final MemberRepository memberRepository;
    private final JpaCouponRepository couponRepository;

    public CouponServiceImpl(MemberRepository memberRepository,
                             JpaCouponRepository couponRepository) {

        this.memberRepository = memberRepository;
        this.couponRepository = couponRepository;
    }

    // email -> user_key로 변환
    private String getUserKeyOrNull(String email) {
        if (email == null || email.isBlank()) return null;
        return memberRepository.findUserKey(email);
    }

    @Override
    @Transactional
    public CouponDto issueSignupCoupon(String email) {

        String userKey = getUserKeyOrNull(email);

        // 쿠폰 발급 된거 있는지 확인
        CouponDto existing = getCouponInfo(email);
        if (existing != null && "Y".equalsIgnoreCase(existing.getCouponYn())) {
            return existing;
        }

        String signupCouponId = "0d8c39a1-77fc-4a3e-a29d-1acb311e97f4"; // 추후에 다양한 쿠폰 추가시 변경 필요

        // ssf_coupon_used insert 쿠폰 발급
        couponRepository.insertCouponUsed(signupCouponId, userKey);

        return getCouponInfo(email);
    }


    @Override
    public CouponDto getCouponInfo(String email) {

        String userKey = getUserKeyOrNull(email);

        CouponDto dto = couponRepository.findLatestCouponByUserKey(userKey);

        //쿠폰 없음
        if (dto == null) {
            CouponDto empty = new CouponDto();
            empty.setCouponYn("N");
            return empty;
        }

        //쿠폰 있으나 사용
        if ("Y".equalsIgnoreCase(dto.getUsedYn())) {
            dto.setCouponYn("N");
            return dto;
        }

        //쿠폰 있고 미사용
        dto.setCouponYn("Y");
        return dto;
    }


    @Override
    @Transactional
    public boolean consumeCoupon(String email, String couponId) {

        if (couponId == null || couponId.isBlank()) return false;

        String userKey = getUserKeyOrNull(email);

        // ssf_coupon_used 사용 처리
        int updated = couponRepository.consumeCouponUpdate(userKey, couponId);

        return updated > 0;
    }


}

