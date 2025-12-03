package com.ssf.project.service;

import com.ssf.project.dto.MemberAddrDto;
import com.ssf.project.dto.MemberDto;

import java.util.List;

public interface MemberService {
    List<MemberDto> findAll();
    int updatePwd(MemberDto member);
    int deleteByEmail(MemberDto member);
    MemberDto findId(MemberDto member);
    boolean findPwd(MemberDto member);
    boolean idCheck(String id);
    int signup(MemberDto member);
    int apiSignup(MemberDto member);
    boolean login(MemberDto member);
    List<MemberAddrDto> findAddrListByUserEmail(String email);
    MemberAddrDto findAddrByUserEmail(String email);
    void deleteAddress(Integer addrKey);
    int saveAddr(MemberAddrDto memberAddrDto);
}
