package com.ssf.project.service;

import com.ssf.project.dto.Member;

public interface MemberService {
    boolean idCheck(String id);
    int signup(Member member);
    boolean login(Member member);
}
