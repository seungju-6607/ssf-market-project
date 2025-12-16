package com.springboot.next_shoppy_springboot.service;

import com.springboot.next_shoppy_springboot.entity.Member;
import com.springboot.next_shoppy_springboot.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class MyUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    @Autowired
    public MyUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override  //DB연동
    public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
        Optional<Member> member = userRepository.findById(userId);
        User.UserBuilder b = null;
        if(!member.isEmpty()) {
            //member가 null이 아니면 USER 객체 즉 회원으로 인증되어 SecurityContext에 저장됨
            b = User.withUsername(member.get().getId())
                    .password(member.get().getPwd())    // BCrypt로 저장되어 있어야 함
                    .roles(member.get().getRole());     // 필요 시 DB에서 권한 매핑 : 'ROLE_' 자동매핑
        }
        return b.build();
    }
}
