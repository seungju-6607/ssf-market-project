package com.ssf.project.controller;

import com.ssf.project.dto.Member;
import com.ssf.project.repositoty.MemberRepository;
import com.ssf.project.service.MemberService;
import com.ssf.project.repositoty.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.servlet.http.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.stream.Collectors;
import java.util.Arrays;

@RestController
@RequestMapping("/member")
//@CrossOrigin(origins = {"http://localhost:3000"})
public class MemberController {

    private final AuthenticationManager authenticationManager;
    private final HttpSessionSecurityContextRepository contextRepository;
    private final MemberRepository memberRepository;

    // 서비스 객체 가져오기
    private final MemberService memberService;

    // controller 객체 생성
    @Autowired
    public MemberController(MemberService memberService,
                            AuthenticationManager authenticationManager,
                            HttpSessionSecurityContextRepository contextRepository,
                            MemberRepository memberRepository) {
        this.memberService = memberService;
        this.authenticationManager = authenticationManager;
        this.contextRepository = contextRepository;
        this.memberRepository = memberRepository;
    }

    @PostMapping("/idcheck")
    public boolean idcheck(@RequestBody Member member) {
        return memberService.idCheck(member.getEmail());
    }

    @PostMapping("/signup")
    public boolean signup(@RequestBody Member member) {
        System.out.println("member 확인 => " + member);
        boolean result = false;
        
        // 서비스 호출
        int rows = memberService.signup(member);
        if(rows == 1) result = true;
        
        return result;
    }

    /**
     * Spring-Security 라이브러리를 이용한 로그인 진행 :
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Member member,
                                   HttpServletRequest request,
                                   HttpServletResponse response) {

        try {
            //1. 인증요청
            Authentication authenticationRequest =
                    UsernamePasswordAuthenticationToken.unauthenticated(member.getEmail(), member.getUserpwd());

            //2. 인증처리
            Authentication authenticationResponse =
                    this.authenticationManager.authenticate(authenticationRequest);

            System.out.println("인증 성공: " + authenticationResponse.getPrincipal());

            // 3. 컨텍스트에 보관
            var context = SecurityContextHolder.createEmptyContext();
            context.setAuthentication(authenticationResponse);
            SecurityContextHolder.setContext(context);

            // SecurityContext 세션에 "명시 저장" (requireExplicitSave(true)일 때 필수)
            contextRepository.saveContext(context, request, response);

            //4. 로그인 성공 시 CSRF 토큰을 재발행을 위해 브라우저 토큰 null 처리
            var xsrf = new Cookie("XSRF-TOKEN", null); //호불호 갈리는 var 의 사용
            xsrf.setPath("/");                // <- 기존과 동일
            xsrf.setMaxAge(0);                // <- 즉시 만료 (유효기간)
            xsrf.setHttpOnly(false);           // 재발행
            // xsrf.setSecure(true);          // HTTPS에서만. 로컬 http면 주석
            // xsrf.setDomain("localhost");   // 기존 쿠키가 domain=localhost였다면 지정
            response.addCookie(xsrf); //브라우저에 붙어서 넘어가는 값

            return ResponseEntity.ok(Map.of("login", true,
                    "userId", member.getEmail()));

        } catch(Exception e) {
            //로그인 실패
            e.printStackTrace();
            return ResponseEntity.ok(Map.of("login", false, "reason", e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> Logout(HttpServletRequest request,
                                    HttpServletResponse response) { //쿠키도 추가하려면 얘를 자동으로 받아서 주면됨
        // 1. 세션이 없으면 생성하지 않고 null 반환 (로그아웃 시 표준 방식)
        HttpSession session = request.getSession(false);

        // 2. 세션이 존재하면 무효화
        if(session != null) {
            session.invalidate(); // 서버 세션 무효화 (JSESSIONID 삭제 명령 포함)
        }

        // 3. JSESSIONID 만료 쿠키 전송 (Path/Domain 꼭 기존과 동일)
        var cookie = new Cookie("JSESSIONID", null);
        cookie.setPath("/");               // ← 기존과 동일
        cookie.setMaxAge(0);               // ← 즉시 만료
        cookie.setHttpOnly(true);          // 개발 중에도 HttpOnly 유지 권장
        // cookie.setSecure(true);         // HTTPS에서만. 로컬 http면 주석
        // cookie.setDomain("localhost");  // 기존 쿠키가 domain=localhost였다면 지정
        response.addCookie(cookie);

        // 4. CSRF 토큰을 재발행하여 출력
        var xsrf = new Cookie("XSRF-TOKEN", null);
        xsrf.setPath("/");               // ← 기존과 동일
        xsrf.setMaxAge(0);               // ← 즉시 만료
        xsrf.setHttpOnly(false);          // 개발 중에도 HttpOnly 유지 권장
        // xsrf.setSecure(true);         // HTTPS에서만. 로컬 http면 주석
        // xsrf.setDomain("localhost");  // 기존 쿠키가 domain=localhost였다면 지정
        response.addCookie(xsrf);


        // 3. 응답: 세션이 있었든 없었든, 클라이언트에게 로그아웃 요청이 성공했음을 알림 (200 OK)
        //    JSESSIONID 쿠키 삭제는 session.invalidate() 시 서블릿 컨테이너가 처리합니다.
        return ResponseEntity.ok(Map.of("logout", true));
    }

    /**
     * 현재 로그인한 사용자 정보 조회 (세션)
     */
    @PostMapping("/me")
    public ResponseEntity<?> me() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.ok(Map.of("authenticated", false));
        }

        String email = auth.getName();

        var memberOpt = memberRepository.findByMember(email);
        String username = memberOpt.map(Member::getUsername).orElse("");
        String rawRole = memberOpt.map(Member::getRole).orElse("");
        if (rawRole == null || rawRole.isBlank()) rawRole = "user";
        String role = rawRole.trim().toLowerCase();

        return ResponseEntity.ok(Map.of(
                "authenticated", true,
                "email", email,
                "username", username,
                "role", role
        ));
    }
}
