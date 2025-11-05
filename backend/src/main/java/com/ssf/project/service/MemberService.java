package com.ssf.project.service;

import com.ssf.project.dto.Member;

public interface MemberService {
    int signup(Member member);
    boolean login(Member member);
}
