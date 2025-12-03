package com.ssf.project.repository;

import com.ssf.project.dto.MemberDto;

import java.util.List;
import java.util.Optional;

public interface MemberRepository {
    List<MemberDto> findAll();
    int updatePwd(MemberDto member);
    int deleteByEmail(MemberDto member);
    MemberDto findId(MemberDto member);
    Long findPwd(MemberDto member);
    Long countById(String id);
    int save(MemberDto member);
    String findById(String id);

    // 로그인 등에서 사용: id 로 MemberDto 조회
    Optional<MemberDto> findByMember(String id);

    // email로 user_key 조회
    String findUserKey(String email);
}
