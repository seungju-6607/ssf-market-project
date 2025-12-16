package com.springboot.next_shoppy_springboot.service;

import com.springboot.next_shoppy_springboot.dto.MemberDto;
import com.springboot.next_shoppy_springboot.entity.Member;
import com.springboot.next_shoppy_springboot.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional  //: DB가 auto-commit 모드이면 생략가능
public class MemberServiceImpl implements MemberService{
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired //IOC 컨테이너에서 생성자 주입!!
    public MemberServiceImpl(PasswordEncoder passwordEncoder,
                             UserRepository userRepository) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
    }

    /**
     * Spring-Security를 이용하여 로그인 처리시 UserDetailsService 객체 사용하므로
     * login 메소드는 호출 ❌
     */
//    @Override
//    public boolean login(MemberDto member) {
//        String encodePwd = memberRepository.login(member.getId());
//        boolean result = passwordEncoder.matches(member.getPwd(), encodePwd);
//
//        return result;
//    }

    @Override
    public int signup(MemberDto memberDto){
        int result = 0;
        String encodePwd = passwordEncoder.encode(memberDto.getPwd());  //UUID 타입으로 생성됨
        memberDto.setPwd(encodePwd);

        //memberDto ---> member 엔티티로 저장
        Member member = new Member(memberDto);
        Member saveMember = userRepository.save(member);
        if(saveMember != null) result = 1;

        return result;
    }

    @Override
    public boolean idCheck(String id) {
        boolean result = true;
        Long count = userRepository.countById(id);
        
        if(count == 0) result = false;
        return result;
    }

}
