package com.ssf.project.service;

import com.ssf.project.dto.MemberDto;
import com.ssf.project.dto.MemberAddrDto;
import com.ssf.project.entity.MemberAddr;
import com.ssf.project.repository.JpaMemberAddrRepository;
import com.ssf.project.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service // memberServiceImpl
@Transactional  // DB가 auto-commit 모드이면 생략가능
public class MemberServiceImpl implements MemberService{    // MemberService memberService

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final JpaMemberAddrRepository jpaMemberAddrRepository;

    @Autowired
    public MemberServiceImpl(MemberRepository memberRepository, PasswordEncoder passwordEncoder
                            , JpaMemberAddrRepository jpaMemberAddrRepository) {
        this.memberRepository = memberRepository;
        this.passwordEncoder = passwordEncoder;
        this.jpaMemberAddrRepository = jpaMemberAddrRepository;
    }

    @Override
    public boolean idCheck(String id){
        boolean result = true;
        Long count = memberRepository.countById(id);
        if(count == 0) result = false;
        return result;
    };

    @Override
    public int signup (MemberDto member){
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
    public int apiSignup (MemberDto member){
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
    public boolean login(MemberDto member) {

        String encodePwd = memberRepository.findById(member.getEmail());
        boolean result = passwordEncoder.matches(member.getUserpwd(), encodePwd);

        return result;
    }

    /* 저장된 배송지 목록 */
    @Override
    public List<MemberAddrDto> findAddrListByUserEmail(String email) {

        return jpaMemberAddrRepository.findAddrListByUserEmail(email)
                .stream()
                .map(MemberAddrDto::new) // new MemberAddrDto(entity); 와 동일함.
                .collect(Collectors.toList());
    }

    /* 기본 배송지 */
    @Override
    public MemberAddrDto findAddrByUserEmail(String email) {
        MemberAddr addr = jpaMemberAddrRepository.findAddrByUserEmail(email);
        if (addr == null) {
            return null;
        }
        
        return new MemberAddrDto(addr);
    }

    /* 배송지 삭제 */
    @Override
    public void deleteAddress(Integer addrKey) {
        jpaMemberAddrRepository.deleteById(addrKey);
    }
}

