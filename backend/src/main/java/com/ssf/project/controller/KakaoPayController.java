package com.ssf.project.controller;

import com.ssf.project.dto.KakaoApproveResponse;
import com.ssf.project.dto.KakaoReadyResponse;
import com.ssf.project.dto.OrderListResponseDto;
import com.ssf.project.service.CouponService;
import com.ssf.project.service.CouponServiceImpl;
import com.ssf.project.service.KakaoPayService;
import com.ssf.project.service.OrderService;
import com.ssf.project.dto.KakaoPayDto;
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
    private KakaoPayDto payInfo = null; //KaKaoPay DTO 클래스를 전역으로 선언
    private final UserDetailsService userDetailsService;
    private final CouponService couponService;

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
     *    카카오페이 결제 ready API 호출
     */
    @PostMapping("/kakao/ready")
    public KakaoReadyResponse paymentKakao(@RequestBody KakaoPayDto kakaoPay) {
        //orderId(주문번호) 생성 : UUID 클래스 사용
        payInfo = kakaoPay;   //kakaoPay 객체 주소를 payInfo 복사, 전역으로 확대
        kakaoPay.setOrderId(UUID.randomUUID().toString());

        System.out.println("[DEBUG] payInfo 객체 생성: " + payInfo);

        String TEMP_TID = null;
        KakaoReadyResponse response = kakaoPayService.kakaoPayReady(kakaoPay);

        if (response != null) {
            TEMP_TID = response.getTid(); // 발급받은 TID 저장
        } else {
            System.out.println("결제 준비 실패.");
        }

        return response;
    }

    /**
     * ✅ 결제 성공
     */
    @GetMapping("/qr/success")
    public ResponseEntity<Void> success( @RequestParam String orderId,
                                         @RequestParam("pg_token") String pgToken,
                                         HttpServletRequest request) {

        /*********************  카카오 페이 결제 성공 후 세션 복원 시작 ******************/
        // 0. 현재 SecurityContext에 Authentication이 있는지 확인
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // anonymousUser 이거나 null 이면, 세션이 끊겼다고 보고 수동 복원 시도
        if (auth == null || !auth.isAuthenticated()
                || "anonymousUser".equals(String.valueOf(auth.getPrincipal()))) {

            // 0-1. orderId 기반으로 결제 요청 시 사용했던 userId 조회
            String userId = kakaoPayService.findByUserId(orderId);  // 이미 사용 중인 메서드라고 하셨음
            System.out.println("카카오 결제 성공 시 세션 복원 시작 - userId = " + userId);

            if (userId != null) {
                // 0-2. userId로 UserDetails 조회 (Spring Security 표준)
                UserDetails userDetails = userDetailsService.loadUserByUsername(userId);

                // 0-3. 새 Authentication 객체 생성
                UsernamePasswordAuthenticationToken newAuth =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );

                // 0-4. SecurityContext 생성 및 설정
                SecurityContext context = SecurityContextHolder.createEmptyContext();
                context.setAuthentication(newAuth);
                SecurityContextHolder.setContext(context);

                // 0-5. HttpSession에도 SecurityContext 저장 (명시적 세션 바인딩)
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

        // 1. tid, userId 조회
        String tid = kakaoPayService.findByTid(orderId);
        String userId = kakaoPayService.findByUserId(orderId);

        // 2. 조회된 tid를 Approve 서비스에 넘겨 최종 승인 요청
        KakaoApproveResponse approve = kakaoPayService.approve(tid, userId, orderId, pgToken);
        System.out.println("Kakao Approve Success --> " + approve);

        // 2-1. 실제 카카오 결제 성공 후 리턴되는 금액을 payInfo에 반영
        if (approve != null && approve.getAmount() != null && approve.getAmount().getTotal() != null) {
            int actualPaidAmount = approve.getAmount().getTotal();
            payInfo.setTotalAmount(String.valueOf(actualPaidAmount));
            System.out.println("실제 결제 금액 반영: " + actualPaidAmount);
        }

        // 3. 결제 완료 처리 (DB 상태 업데이트 등)
        //DB 상태 업데이트 - 주문상품을 order, order_detail 테이블에 저장, cart에서는 삭제
        String email = payInfo.getUserId();
        int result = orderService.saveOrder(payInfo, email);

        //쿠폰 사용 처리
        String couponId = payInfo.getCouponId();
        if (couponId != null && !couponId.isBlank()) {
            boolean couponUsed = couponService.consumeCoupon(email, couponId);
            System.out.println("쿠폰 사용 처리 완료: " + couponUsed);
        }

        System.out.println("kakaopay ::: result========>> " + result);

        URI redirect = URI.create(
                "http://localhost:3000/payConfirm"
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
     * 결제 후 주문 완료 화면
     */
    @PostMapping("/orderList")
    public List<OrderListResponseDto> findOrderListByEmail(@RequestBody Map<String, String> payload) {
        String orderId = payload.get("orderId");
        if(orderId == null) {
            return Collections.emptyList();
        }
        return orderService.findOrderListByOrderId(orderId);
    }
}
