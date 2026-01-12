package com.ssf.project.controller;

import com.ssf.project.dto.CouponDto;
import com.ssf.project.dto.MemberAddrDto;
import com.ssf.project.dto.MemberDto;
import com.ssf.project.dto.OrderDetailResponseDto;
import com.ssf.project.dto.OrderHistoryDto;
import com.ssf.project.repository.MemberRepository;
import com.ssf.project.security.JwtTokenProvider;
import com.ssf.project.service.CouponService;
import com.ssf.project.service.MemberService;
import com.ssf.project.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/member")
public class MemberController {

    private final AuthenticationManager authenticationManager;
    private final MemberRepository memberRepository;
    private final OrderService orderService;
    private final CouponService couponService;
    private final MemberService memberService;
    private final JwtTokenProvider jwtTokenProvider;

    @Autowired
    public MemberController(
            MemberService memberService,
            AuthenticationManager authenticationManager,
            MemberRepository memberRepository,
            OrderService orderService,
            CouponService couponService,
            JwtTokenProvider jwtTokenProvider
    ) {
        this.memberService = memberService;
        this.authenticationManager = authenticationManager;
        this.memberRepository = memberRepository;
        this.orderService = orderService;
        this.couponService = couponService;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @PostMapping("/findAll")
    public List<MemberDto> findAll() {
        return memberService.findAll();
    }

    @PostMapping("/updatePwd")
    public int updatePwd(@RequestBody MemberDto member) {
        return memberService.updatePwd(member);
    }

    @PostMapping("/deleteByEmail")
    public int deleteByEmail(@RequestBody MemberDto member) {
        return memberService.deleteByEmail(member);
    }

    @PostMapping("/findPwd")
    public boolean findPwd(@RequestBody MemberDto member) {
        return memberService.findPwd(member);
    }

    @PostMapping("/findId")
    public MemberDto findId(@RequestBody MemberDto member) {
        return memberService.findId(member);
    }

    @PostMapping("/idcheck")
    public boolean idcheck(@RequestBody MemberDto member) {
        return memberService.idCheck(member.getEmail());
    }

    @PostMapping("/signup")
    public boolean signup(@RequestBody MemberDto member) {
        System.out.println("member 확인 => " + member);
        boolean result = false;

        int rows = memberService.signup(member);
        if (rows == 1) {
            result = true;
            couponService.issueSignupCoupon(member.getEmail());
        }
        return result;
    }

    @PostMapping("/apiSignup")
    public boolean apiSignup(@RequestBody MemberDto member) {
        System.out.println("member 확인 => " + member);
        boolean result = false;

        int rows = memberService.apiSignup(member);
        if (rows == 1) {
            result = true;
            couponService.issueSignupCoupon(member.getEmail());
        }
        return result;
    }

    /**
     * ✅ JWT 로그인: 성공 시 token 발급해서 반환
     * - 세션/쿠키 저장 안 함
     * - 프론트는 token을 localStorage 등에 저장 후 Authorization 헤더로 보냄
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody MemberDto member) {
        try {
            Authentication authenticationRequest =
                    UsernamePasswordAuthenticationToken.unauthenticated(member.getEmail(), member.getUserpwd());

            Authentication authenticationResponse =
                    this.authenticationManager.authenticate(authenticationRequest);

            String email = authenticationResponse.getName();

            // role/username 넣고 싶으면 DB에서 읽어오면 됨
            var memberOpt = memberRepository.findByMember(email);
            String username = memberOpt.map(MemberDto::getUsername).orElse("");
            String rawRole = memberOpt.map(MemberDto::getRole).orElse("user");
            String role = (rawRole == null || rawRole.isBlank()) ? "user" : rawRole.trim().toLowerCase();

            // ✅ JWT 발급
            String token = jwtTokenProvider.createToken(email, role);

            return ResponseEntity.ok(Map.of(
                    "login", true,
                    "token", token,
                    "email", email,
                    "username", username,
                    "role", role
            ));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(Map.of("login", false, "reason", e.getMessage()));
        }
    }

    /**
     * ✅ JWT 로그아웃
     * - 서버 세션이 없으니 서버에서 할 게 거의 없음
     * - 프론트에서 localStorage의 token 제거하면 끝
     * (진짜 강제 로그아웃이 필요하면 블랙리스트/리프레시토큰 구조가 필요)
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok(Map.of("logout", true));
    }

    /**
     * ✅ 현재 로그인한 사용자 정보 조회 (JWT)
     * - Authorization: Bearer <token> 이 있어야 authenticated=true
     */
    @PostMapping("/me")
    public ResponseEntity<?> me() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getName())) {
            return ResponseEntity.ok(Map.of("authenticated", false));
        }

        String email = auth.getName();

        var memberOpt = memberRepository.findByMember(email);
        String username = memberOpt.map(MemberDto::getUsername).orElse("");
        String rawRole = memberOpt.map(MemberDto::getRole).orElse("user");
        String role = (rawRole == null || rawRole.isBlank()) ? "user" : rawRole.trim().toLowerCase();

        return ResponseEntity.ok(Map.of(
                "authenticated", true,
                "email", email,
                "username", username,
                "role", role
        ));
    }

    // =========================
    // 아래부터는 기존 API 유지 + JWT로 email 대체(프론트 안 깨지게)
    // =========================

    private String emailFromBodyOrToken(HttpServletRequest http, Map<String, ?> body) {
        Object v = body == null ? null : body.get("email");
        if (v != null && !v.toString().isBlank()) return v.toString();

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getName())) {
            return auth.getName();
        }
        return null;
    }

    @PostMapping("/addr")
    public MemberAddrDto addr(@RequestBody Map<String, String> request, HttpServletRequest http) {
        String email = emailFromBodyOrToken(http, request);
        return memberService.findAddrByUserEmail(email);
    }

    @PostMapping("/addrList")
    public List<MemberAddrDto> addrList(@RequestBody Map<String, String> request, HttpServletRequest http) {
        String email = emailFromBodyOrToken(http, request);
        return memberService.findAddrListByUserEmail(email);
    }

    @PostMapping("/addrDelete")
    public ResponseEntity<Map<String, String>> addrDelete(@RequestBody Map<String, Object> request) {
        Integer addrKey = Integer.valueOf(request.get("addrKey").toString());
        memberService.deleteAddress(addrKey);
        return ResponseEntity.ok(Map.of("success", "true", "message", "배송지가 삭제되었습니다."));
    }

    @PostMapping("/saveAddr")
    public int saveAddr(@RequestBody MemberAddrDto memberAddrDto) {
        return memberService.saveAddr(memberAddrDto);
    }

    @PostMapping("/orderhistory")
    public List<List<OrderHistoryDto>> orderHistory(@RequestBody Map<String, String> request, HttpServletRequest http) {
        String email = emailFromBodyOrToken(http, request);
        String startDate = request.get("startDate");
        String endDate = request.get("endDate");
        return orderService.findOrderHistory(email, startDate, endDate);
    }

    @PostMapping("/orderhistory/detail")
    public ResponseEntity<?> orderHistoryDetail(@RequestBody Map<String, String> request, HttpServletRequest http) {
        String email = emailFromBodyOrToken(http, request);
        String orderId = request.get("orderId");

        if (email == null || email.isBlank() || orderId == null || orderId.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "email and orderId are required"));
        }
        OrderDetailResponseDto detail = orderService.findOrderDetail(email, orderId);
        if (detail == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(detail);
    }

    @PostMapping("/coupon/info")
    public ResponseEntity<?> couponInfo(@RequestBody Map<String, String> request, HttpServletRequest http) {
        String email = emailFromBodyOrToken(http, request);
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "email is required"));
        }
        CouponDto coupon = couponService.getCouponInfo(email);
        return ResponseEntity.ok(coupon);
    }

    @PostMapping("/coupon/use")
    public ResponseEntity<?> consumeCoupon(@RequestBody Map<String, String> request, HttpServletRequest http) {
        String email = emailFromBodyOrToken(http, request);
        String couponId = request.get("couponId");
        if (email == null || email.isBlank() || couponId == null || couponId.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "email and couponId are required"));
        }
        boolean success = couponService.consumeCoupon(email, couponId);
        return ResponseEntity.ok(Map.of("success", success));
    }
}
