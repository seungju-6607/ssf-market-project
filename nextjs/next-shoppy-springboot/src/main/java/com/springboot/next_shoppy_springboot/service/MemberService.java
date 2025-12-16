package com.springboot.next_shoppy_springboot.service;

import com.springboot.next_shoppy_springboot.dto.MemberDto;

public interface MemberService {
    int signup(MemberDto member);
    boolean idCheck(String id);
}
