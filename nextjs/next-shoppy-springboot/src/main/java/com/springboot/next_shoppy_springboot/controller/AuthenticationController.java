package com.springboot.next_shoppy_springboot.controller;

import com.springboot.next_shoppy_springboot.dto.MemberDto;
import com.springboot.next_shoppy_springboot.service.JwtUtilService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    private final AuthenticationManager authenticationManager;
    private final JwtUtilService jwtUtilService;


    /**
     * 로그인
     * - 로그인 성공 후 accessToken과 refreshToken을 생성, refreshToken은 HttpOnly 방식으로 쿠키로 전송
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody MemberDto member) {
        try {
            //1. 인증요청
            Authentication authenticationRequest =
                    UsernamePasswordAuthenticationToken.unauthenticated(member.getId(), member.getPwd());

            //2. 인증처리
            Authentication authenticationResponse =
                    this.authenticationManager.authenticate(authenticationRequest);

            //3. 인증 후 member 객체에 role 추가 => JWT 생성
            member.setRole(authenticationResponse.getAuthorities().toString());
            String access = jwtUtilService.createAccessToken(member);
            String refresh = jwtUtilService.createRefreshToken(member);

            //4. HttpOnly 쿠키 전송 객체 생성
            ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", refresh)
                    .httpOnly(true)
                    .path("/")
                    .maxAge(60 * 60 * 24 * 14)
                    //.sameSite("None") //📌 SameSite=Strict 는 cross-site 요청에서 쿠키 전송 ❌, None or Lax 변경
                    //.secure(false)  //📌로컬 개발이라 http, https 아님, 배포 시 true
                    .build();


            //5. ResponseBody로 결과 전송 : access 토큰 포함 객체 생성
            Map<String, Object> body = Map.of(
                    "accessToken", access,
                    "tokenType", "Bearer",
                    "login", true,
                    "userId", member.getId(),
                    "role", member.getRole()
            );
            
            //6. 결과 전송
            return ResponseEntity
                    .ok()
                    .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                    .body(body);

        }catch(Exception e) {
            //로그인 실패
            return ResponseEntity.ok(Map.of("login", false));
        }
    }

    /**
     * accessToken 재발급
     * - accessToken 만료 시 refreshToken을 이용하여 accessToken을 재발급
     */
    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(HttpServletRequest request) {
        String refreshToken = null;
        Cookie[] cookies = request.getCookies();

        if (cookies != null) {
            refreshToken = Arrays.stream(cookies)
                    .filter(c -> "refreshToken".equals(c.getName()))
                    .map(Cookie::getValue)
                    .findFirst()
                    .orElse(null);
        }

        if (refreshToken == null || !jwtUtilService.validate(refreshToken)) {
            return ResponseEntity.status(401).body(Map.of("message", "invalid refresh"));
        }

        Claims claims = jwtUtilService.getClaims(refreshToken);
        String userId = claims.getSubject();
        String role = claims.get("role", String.class);
        role = role.replace("[", "").replace("]", "").trim();

        MemberDto memberDto = new MemberDto(userId, role);
        String newAccess = jwtUtilService.createAccessToken(memberDto);

        return ResponseEntity.ok(Map.of(
                "accessToken", newAccess,
                "tokenType", "Bearer",
                "userId", userId,
                "role", role
        ));
    }

    /**
     * 새로고침 호출 시 accessToken 재발급
     * - accessToken 만료 시 refreshToken을 이용하여 accessToken을 재발급
     */
    @GetMapping("/me")
    public ResponseEntity<?> me(HttpServletRequest request) {
        String refreshToken = null;
        Cookie[] cookies = request.getCookies();

        if (cookies != null) {
            refreshToken = Arrays.stream(cookies)
                    .filter(c -> "refreshToken".equals(c.getName()))
                    .map(Cookie::getValue)
                    .findFirst()
                    .orElse(null);
        }

        if (refreshToken == null || !jwtUtilService.validate(refreshToken)) {
        System.out.println("--------------------------------- 1-2: /auth/me refresh token null");
            return ResponseEntity.ok(Map.of(
                    "authenticated", false
            ));
        }

        Claims claims = jwtUtilService.getClaims(refreshToken);
        String userId = claims.getSubject();
        String role = claims.get("role", String.class);
        role = role.replace("[", "").replace("]", "").trim();

        MemberDto memberDto = new MemberDto(userId, role);
        String newAccessToken = jwtUtilService.createAccessToken(memberDto);

        return ResponseEntity.ok(Map.of(
                "authenticated", true,
                "userId", userId,
                "role", role,
                "accessToken", newAccessToken
        ));
    }

    /**
     * 로그아웃
     * - 쿠키로 전송된 refreshToken의 maxAge를 0으로 설정한 후 브라우저에 전송하여 즉시삭제
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {

        // 1. refreshToken 쿠키 삭제 (만료)
        ResponseCookie deleteRefreshCookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .path("/")
                .maxAge(0)
                //.sameSite("None")
                //.secure(false)
                .build();

        response.addHeader("Set-Cookie", deleteRefreshCookie.toString());

        // 2. (선택) refreshToken을 DB에 삭제 처리 - 토큰 관리 정책에 따름!!
        // 예: userService.deleteRefreshToken(userId);

        // 3. 클라이언트로 성공 응답
        return ResponseEntity.ok(Map.of(
                "logout", true
        ));
    }

}
