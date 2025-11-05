package com.ssf.project.repositoty;

import com.ssf.project.dto.Member;

import java.util.Optional;

public interface MemberRepository {
    public int save(Member member);
    String findById(String id);
    Optional<Member> findByMember(String id);
}
