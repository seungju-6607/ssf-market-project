package com.ssf.project.repository;

import com.ssf.project.dto.Member;

import java.util.Optional;

public interface MemberRepository {
    Long countById(String id);
    public int save(Member member);
    String findById(String id);
    Optional<Member> findByMember(String id);
}
