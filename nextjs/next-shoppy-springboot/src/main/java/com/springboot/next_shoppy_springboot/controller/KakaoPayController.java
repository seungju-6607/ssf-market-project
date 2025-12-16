package com.springboot.next_shoppy_springboot.controller;

import com.springboot.next_shoppy_springboot.dto.KakaoPayDto;
import com.springboot.next_shoppy_springboot.dto.KakaoApproveResponse;
import com.springboot.next_shoppy_springboot.dto.KakaoReadyResponse;
import com.springboot.next_shoppy_springboot.dto.MemberDto;
import com.springboot.next_shoppy_springboot.service.JwtUtilService;
import com.springboot.next_shoppy_springboot.service.KakaoPayService;
import com.springboot.next_shoppy_springboot.service.OrderService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.Arrays;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/payment")
public class KakaoPayController {

    private final KakaoPayService kakaoPayService;
    private final OrderService orderService;
    private KakaoPayDto payInfo = null;
    private final UserDetailsService userDetailsService;
    private final JwtUtilService jwtUtilService;

    @Autowired
    public KakaoPayController(KakaoPayService kakaoPayService,
                              OrderService orderService,
                              UserDetailsService userDetailsService,
                              JwtUtilService jwtUtilService) {
        this.kakaoPayService = kakaoPayService;
        this.orderService = orderService;
        this.userDetailsService = userDetailsService;
        this.jwtUtilService = jwtUtilService;
    }

    /**
     * 카카오페이 결제 준비 요청 (프론트에서 호출)
     * - 카카오페이 결제 ready API 호출
     */
    @PostMapping("/kakao/ready")
    public KakaoReadyResponse paymentKakao(@RequestBody KakaoPayDto kakaoPay) {
        payInfo = kakaoPay;   //kakaoPay 객체 주소를 payInfo 복사, 전역으로 확대
        kakaoPay.setOrderId(UUID.randomUUID().toString());
        String TEMP_TID = null;
        KakaoReadyResponse response = kakaoPayService.kakaoPayReady(kakaoPay);
        System.out.println("paymentKakao------------" + response);
        if (response != null) {
            TEMP_TID = response.getTid(); // 발급받은 TID 저장
        } else {
            System.out.println("결제 준비 실패.");
        }

        return response;
    }

    /**
     * 카카오페이 결제 성공
     */
    @GetMapping("/qr/success")
    public ResponseEntity<?> success( @RequestParam String orderId,
                                         @RequestParam("pg_token") String pgToken,
                                         HttpServletRequest request) {

        // 카카오페이 결제 성공 후 인증 복원을 위한 새로운 accessToken 생성
        String refreshToken = null;
        Cookie[] cookies = request.getCookies();

        // 1. cookie 확인
        if (cookies != null) {
            refreshToken = Arrays.stream(cookies)
                    .filter(c -> "refreshToken".equals(c.getName()))
                    .map(Cookie::getValue)
                    .findFirst()
                    .orElse(null);
        }

        if (refreshToken == null || !jwtUtilService.validate(refreshToken)) {
            // refreshToken 만료 시 → 로그인 화면으로 보내거나 에러 페이지로
            URI redirect = URI.create("http://localhost:3030/payresult?status=unauthorized");
            HttpHeaders headers = new HttpHeaders();
            headers.setLocation(redirect);
            return new ResponseEntity<>(headers, HttpStatus.SEE_OTHER);
        }

        // 2. refreshToken에서 member 정보 추출 및 새로운 accessToken 생성
        Claims claims = jwtUtilService.getClaims(refreshToken);
        String userId = claims.getSubject();
        String role = claims.get("role", String.class);
        role = role.replace("[", "").replace("]", "").trim();

        MemberDto memberDto = new MemberDto(userId, role);
        String newAccess = jwtUtilService.createAccessToken(memberDto);

        // 3. 카카오 결제 승인 (tid 조회 + approve 요청)
        String tid = kakaoPayService.findByTid(orderId);
        KakaoApproveResponse approve = kakaoPayService.approve(tid, userId, orderId, pgToken);

        // 4. DB 저장 - 주문, 주문상세, 장바구니 트랜잭션 처리 필수!!
        int result = orderService.save(payInfo);

        // 5. Next.js 페이지로 리다이렉트
        URI redirect = URI.create(
                "http://localhost:3030/payresult"
                        + "?orderId=" + orderId
                        + "&status=success"
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(redirect);

        return new ResponseEntity<>(headers, HttpStatus.SEE_OTHER);
    }


    /**
     * 카카오페이 결제 취소 콜백
     */
    @GetMapping("/qr/cancel")
    public ResponseEntity<?> cancel(@RequestParam String orderId) {
        return ResponseEntity.ok(Map.of("status", "CANCEL", "orderId", orderId));
    }

    /**
     * 카카오페이 결제 실패 콜백
     */
    @GetMapping("/qr/fail")
    public ResponseEntity<?> fail(@RequestParam String orderId) {
        return ResponseEntity.ok(Map.of("status", "FAIL", "orderId", orderId));
    }
}
