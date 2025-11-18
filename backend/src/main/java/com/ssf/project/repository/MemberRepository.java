package com.ssf.project.repository;

import com.ssf.project.dto.MemberDto;

import java.util.Optional;

public interface MemberRepository {
    Long countById(String id);
    public int save(MemberDto member);
    String findById(String id);
    Optional<MemberDto> findByMember(String id);
}
