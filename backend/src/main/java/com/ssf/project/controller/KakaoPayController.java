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
import org.springframework.beans.factory.annotation.Value;
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

    // ✅ 프론트 주소 (로컬/배포 분기)
    @Value("${app.front-base-url:http://localhost:3000}")
    private String frontBaseUrl;

    // ⚠️ 전역 payInfo는 동시결제 시 꼬일 수 있음(일단 요청대로 유지)
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
     * ✅ 결제 준비 요청 (프론트에서 호출)
     */
    @PostMapping("/kakao/ready")
    public KakaoReadyResponse paymentKakao(@RequestBody KakaoPayDto kakaoPay) {
        // orderId 생성
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
     * ✅ 결제 성공 콜백
     */
    @GetMapping("/qr/success")
    public ResponseEntity<Void> success(@RequestParam String orderId,
                                        @RequestParam("pg_token") String pgToken,
                                        HttpServletRequest request) {

        /*********************  카카오 페이 결제 성공 후 세션 복원 시작 ******************/
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
                System.out.println("✅ 카카오 결제 성공 시 Authentication 복원 완료: " + auth.getName());
            } else {
                System.out.println("⚠️ userId 조회 실패 - 세션 복원 불가");
            }
        } else {
            System.out.println("✅ 기존 Authentication 유지됨: " + auth.getName());
        }
        /*********************  카카오 페이 결제 성공 후 세션 복원 종료 ******************/

        // 1) tid, userId 조회
        String tid = kakaoPayService.findByTid(orderId);
        String userId = kakaoPayService.findByUserId(orderId);

        // 2) 최종 승인 요청
        KakaoApproveResponse approve = kakaoPayService.approve(tid, userId, orderId, pgToken);
        System.out.println("Kakao Approve Success --> " + approve);

        // 2-1) 실제 결제 금액 반영
        if (approve != null && approve.getAmount() != null && approve.getAmount().getTotal() != null) {
            int actualPaidAmount = approve.getAmount().getTotal();
            if (payInfo != null) {
                payInfo.setTotalAmount(String.valueOf(actualPaidAmount));
            }
            System.out.println("실제 결제 금액 반영: " + actualPaidAmount);
        }

        // payInfo null 방어 (콜백만 들어온 경우 등)
        if (payInfo == null) {
            // 최소한의 안전장치: 프론트로 실패/예외 리다이렉트
            URI redirect = URI.create(frontBaseUrl + "/payConfirm?orderId=" + orderId + "&status=fail");
            HttpHeaders headers = new HttpHeaders();
            headers.setLocation(redirect);
            return new ResponseEntity<>(headers, HttpStatus.FOUND);
        }

        // 3) 결제 완료 처리 (주문 저장/카트 삭제 등)
        String email = payInfo.getUserId();
        int result = orderService.saveOrder(payInfo, email);

        // 4) 쿠폰 사용 처리
        String couponId = payInfo.getCouponId();
        if (couponId != null && !couponId.isBlank()) {
            boolean couponUsed = couponService.consumeCoupon(email, couponId);
            System.out.println("쿠폰 사용 처리 완료: " + couponUsed);
        }

        System.out.println("kakaopay ::: result========>> " + result);

        // ✅ 핵심: 로컬/배포 모두 대응되는 프론트 주소로 리다이렉트
        // 혹시 double slash 방지
        String base = frontBaseUrl != null ? frontBaseUrl.replaceAll("/+$", "") : "http://localhost:3000";

        URI redirect = URI.create(
                base + "/payConfirm"
                        + "?orderId=" + orderId
                        + "&status=success"
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(redirect);
        return new ResponseEntity<>(headers, HttpStatus.FOUND);
    }

    /**
     * ✅ 결제 취소 콜백
     */
    @GetMapping("/qr/cancel")
    public ResponseEntity<?> cancel(@RequestParam String orderId) {
        return ResponseEntity.ok(Map.of("status", "CANCEL", "orderId", orderId));
    }

    /**
     * ✅ 결제 실패 콜백
     */
    @GetMapping("/qr/fail")
    public ResponseEntity<?> fail(@RequestParam String orderId) {
        return ResponseEntity.ok(Map.of("status", "FAIL", "orderId", orderId));
    }

    /**
     * 결제 후 주문 완료 화면 데이터
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
