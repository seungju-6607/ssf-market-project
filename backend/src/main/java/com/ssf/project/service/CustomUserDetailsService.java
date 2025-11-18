package com.ssf.project.service;

import com.ssf.project.dto.MemberDto;
import com.ssf.project.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import java.util.Arrays;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    private final MemberRepository memberRepository;

    @Autowired
    public CustomUserDetailsService(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    @Override //DB 연동
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        MemberDto member = memberRepository.findByMember(email)
                .orElseThrow(() -> new UsernameNotFoundException("not found: " + email));

        String rawRole = member.getRole();
        if (rawRole == null || rawRole.isBlank()) {
            rawRole = "USER";
        }
        String[] roles = Arrays.stream(rawRole.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .map(r -> r.startsWith("ROLE_") ? r.substring(5) : r)
                .toArray(String[]::new);

        User.UserBuilder b = User.withUsername(member.getEmail())
                .password(member.getUserpwd())
                .roles(roles);

        return b.build();
    }
}
