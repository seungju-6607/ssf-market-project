package com.ssf.project.service;

import com.ssf.project.dto.MemberAddrDto;
import com.ssf.project.dto.MemberDto;
import com.ssf.project.entity.MemberAddr;
import com.ssf.project.repository.JpaMemberAddrRepository;
import com.ssf.project.repository.JpaOrderRepository;
import com.ssf.project.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.List;
import java.util.stream.Collectors;

@Service // memberServiceImpl
@Transactional  // DB가 auto-commit 모드이면 생략가능
public class MemberServiceImpl implements MemberService{    // MemberService memberService

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final JpaMemberAddrRepository jpaMemberAddrRepository;

    @Autowired
    public MemberServiceImpl(MemberRepository memberRepository,
                             PasswordEncoder passwordEncoder,
                             JpaMemberAddrRepository jpaMemberAddrRepository) {
        this.memberRepository = memberRepository;
        this.passwordEncoder = passwordEncoder;
        this.jpaMemberAddrRepository = jpaMemberAddrRepository;
    }

    @Override
    public List<MemberDto> findAll() {
        return memberRepository.findAll();
    };

    @Override
    public int updatePwd(MemberDto member){
        // 패스워드 인코딩
        String encodePwd = passwordEncoder.encode(member.getUserpwd());
        member.setUserpwd(encodePwd);

        return memberRepository.updatePwd(member);
    };

    @Override
    public int deleteByEmail(MemberDto member){
        member.setSignout("Y");
        return memberRepository.deleteByEmail(member);
    };

    @Override
    public boolean findPwd(MemberDto member){
        boolean result = true;
        Long count = memberRepository.findPwd(member);
        if(count == 0) result = false;
        return result;
    };

    @Override
    public MemberDto findId(MemberDto member){
        return memberRepository.findId(member);
    };

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

    /* 배송지 추가 */
    @Override
    public int saveAddr(MemberAddrDto memberaddrDto) {
        int result = 0;
        MemberAddr memberAddr = new MemberAddr(memberaddrDto);
        
        // 1. 중복 배송지 체크
        MemberAddr existing = jpaMemberAddrRepository.findDuplicateAddr(
            memberaddrDto.getEmail(),
            memberaddrDto.getAddrZipcode(),
            memberaddrDto.getAddrMain(),
            memberaddrDto.getAddrDetail(),
            memberaddrDto.getAddrTel()
        );
        
        // 2. 기본 배송지 설정 시 기존 기본 배송지 해제
        if ("Y".equals(memberaddrDto.getAddrDef())) {
            jpaMemberAddrRepository.clearDefaultAddr(memberaddrDto.getEmail());
        }
        
        // 3. 중복이 있으면 업데이트, 없으면 새로 저장
        if (existing != null) {
            // 기존 주소 업데이트
            memberAddr.setAddrKey(existing.getAddrKey());
            int updateResult = jpaMemberAddrRepository.updateAddr(memberAddr, existing.getAddrKey());
            if (updateResult != 0) result = 1;
        } else {
            // 새 주소 저장
            int saveResult = jpaMemberAddrRepository.saveAddr(memberAddr, memberaddrDto.getEmail());
            if (saveResult != 0) result = 1;
        }

        return result;
    }
}

