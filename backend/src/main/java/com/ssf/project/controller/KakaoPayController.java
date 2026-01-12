package com.ssf.project.controller;

import com.ssf.project.dto.KakaoApproveResponse;
import com.ssf.project.dto.KakaoReadyResponse;
import com.ssf.project.dto.OrderListResponseDto;
import com.ssf.project.dto.KakaoPayDto;
import com.ssf.project.service.CouponService;
import com.ssf.project.service.KakaoPayService;
import com.ssf.project.service.OrderService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/payment")
public class KakaoPayController {

    private final KakaoPayService kakaoPayService;
    private final OrderService orderService;
    private final UserDetailsService userDetailsService;
    private final CouponService couponService;

    // ⚠️ 동시결제 시 꼬일 수 있음(지금 구조 유지)
    private KakaoPayDto payInfo = null;

    @Autowired
    public KakaoPayController(KakaoPayService kakaoPayService,
                              OrderService orderService,
                              UserDetailsService userDetailsService,
                              CouponService couponService) {
        this.kakaoPayService = kakaoPayService;
        this.orderService = orderService;
        this.userDetailsService = userDetailsService;
        this.couponService = couponService;
    }

    /**
     * ✅ 결제 준비 요청
     */
    @PostMapping("/kakao/ready")
    public KakaoReadyResponse paymentKakao(@RequestBody KakaoPayDto kakaoPay) {
        payInfo = kakaoPay;
        kakaoPay.setOrderId(UUID.randomUUID().toString());

        System.out.println("[DEBUG] payInfo 객체 생성: " + payInfo);

        KakaoReadyResponse response = kakaoPayService.kakaoPayReady(kakaoPay);

        if (response == null) {
            System.out.println("결제 준비 실패.");
        }

        return response;
    }

    /**
     * ✅ 결제 성공 콜백 (카카오 → 백엔드)
     */
    @GetMapping("/qr/success")
    public ResponseEntity<Void> success(@RequestParam String orderId,
                                        @RequestParam("pg_token") String pgToken,
                                        HttpServletRequest request) {

        /*********************  세션 복원 시작 ******************/
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()
                || "anonymousUser".equals(String.valueOf(auth.getPrincipal()))) {

            String userId = kakaoPayService.findByUserId(orderId);
            System.out.println("카카오 결제 성공 시 세션 복원 시작 - userId = " + userId);

            if (userId != null) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(userId);

                UsernamePasswordAuthenticationToken newAuth =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );

                SecurityContext context = SecurityContextHolder.createEmptyContext();
                context.setAuthentication(newAuth);
                SecurityContextHolder.setContext(context);

                HttpSession session = request.getSession(true);
                session.setAttribute(
                        HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
                        context
                );

                auth = newAuth;
                System.out.println("✅ Authentication 복원 완료: " + auth.getName());
            } else {
                System.out.println("⚠️ userId 조회 실패 - 세션 복원 불가");
            }
        } else {
            System.out.println("✅ 기존 Authentication 유지됨: " + auth.getName());
        }
        /*********************  세션 복원 종료 ******************/

        // 1) tid, userId 조회
        String tid = kakaoPayService.findByTid(orderId);
        String userId = kakaoPayService.findByUserId(orderId);

        // 2) 카카오 최종 승인
        KakaoApproveResponse approve = kakaoPayService.approve(tid, userId, orderId, pgToken);
        System.out.println("Kakao Approve Success --> " + approve);

        // payInfo null이면 프론트로 실패 보내고 종료
        if (payInfo == null) {
            URI redirectFail = URI.create(kakaoPayService.buildFrontPayConfirmUrl(orderId, "fail"));
            HttpHeaders headers = new HttpHeaders();
            headers.setLocation(redirectFail);
            return new ResponseEntity<>(headers, HttpStatus.FOUND);
        }

        // 실제 결제금액 반영
        if (approve != null && approve.getAmount() != null && approve.getAmount().getTotal() != null) {
            int actualPaidAmount = approve.getAmount().getTotal();
            payInfo.setTotalAmount(String.valueOf(actualPaidAmount));
            System.out.println("실제 결제 금액 반영: " + actualPaidAmount);
        }

        // 3) 주문 저장
        String email = payInfo.getUserId();
        int result = orderService.saveOrder(payInfo, email);

        // 4) 쿠폰 사용 처리
        String couponId = payInfo.getCouponId();
        if (couponId != null && !couponId.isBlank()) {
            boolean couponUsed = couponService.consumeCoupon(email, couponId);
            System.out.println("쿠폰 사용 처리 완료: " + couponUsed);
        }

        System.out.println("kakaopay ::: result========>> " + result);

        // 5) 프론트 payConfirm로 이동
        URI redirect = URI.create(kakaoPayService.buildFrontPayConfirmUrl(orderId, "success"));
        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(redirect);

        return new ResponseEntity<>(headers, HttpStatus.FOUND);
    }

    /**
     * ✅ 결제 취소 콜백
     */
    @GetMapping("/qr/cancel")
    public ResponseEntity<Void> cancel(@RequestParam String orderId) {
        URI redirect = URI.create(kakaoPayService.buildFrontPayConfirmUrl(orderId, "cancel"));
        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(redirect);
        return new ResponseEntity<>(headers, HttpStatus.FOUND);
    }

    /**
     * ✅ 결제 실패 콜백
     */
    @GetMapping("/qr/fail")
    public ResponseEntity<Void> fail(@RequestParam String orderId) {
        URI redirect = URI.create(kakaoPayService.buildFrontPayConfirmUrl(orderId, "fail"));
        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(redirect);
        return new ResponseEntity<>(headers, HttpStatus.FOUND);
    }

    /**
     * ✅ payConfirm에서 주문목록 조회 (orderId 기반)
     */
    @PostMapping("/orderList")
    public List<OrderListResponseDto> findOrderListByEmail(@RequestBody Map<String, String> payload) {
        String orderId = payload.get("orderId");
        if (orderId == null) {
            return Collections.emptyList();
        }
        return orderService.findOrderListByOrderId(orderId);
    }
}
