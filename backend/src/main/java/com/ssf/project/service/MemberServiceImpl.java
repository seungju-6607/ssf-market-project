package com.ssf.project.service;

import com.ssf.project.dto.Member;
import com.ssf.project.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service // memberServiceImpl
@Transactional  // DB가 auto-commit 모드이면 생략가능
public class MemberServiceImpl implements MemberService{    // MemberService memberService

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public MemberServiceImpl(MemberRepository memberRepository, PasswordEncoder passwordEncoder) {
        this.memberRepository = memberRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public boolean idCheck(String id){
        boolean result = true;
        Long count = memberRepository.countById(id);
        if(count == 0) result = false;
        return result;
    };

    @Override
    public int signup (Member member){
        System.out.println("member :: " + member);
        // 패스워드 인코딩
        String encodePwd = passwordEncoder.encode(member.getUserpwd());
        member.setUserpwd(encodePwd);

        //role 미입력 시 USER로 저장장
        if (member.getRole() == null || member.getRole().isBlank()) {
            member.setRole("USER");
        }
        return memberRepository.save(member);
    };

    @Override
    public int apiSignup (Member member){
        System.out.println("member :: api" + member);
        String encodePwd = passwordEncoder.encode(member.getUserpwd());
        member.setUserpwd(encodePwd);

        //role 미입력 시 USER로 저장장
        if (member.getRole() == null || member.getRole().isBlank()) {
            member.setRole("USER");
        }
        return memberRepository.save(member);
    };

    @Override
    public boolean login(Member member) {

        String encodePwd = memberRepository.findById(member.getEmail());
        boolean result = passwordEncoder.matches(member.getUserpwd(), encodePwd);

        return result;
    }
}
