package com.ssf.project.service;

import com.ssf.project.dto.KakaoApproveResponse;
import com.ssf.project.dto.KakaoPayDto;
import com.ssf.project.dto.KakaoReadyResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class KakaoPayService {

    // ✅ open-api host (application.yml의 kakaopay.host)
    @Value("${kakaopay.host}")
    private String KAKAOPAY_HOST; // https://open-api.kakaopay.com

    // ✅ 카카오페이 Developers의 Secret key(dev)
    @Value("${kakaopay.secret-key}")
    private String SECRET_KEY;

    @Value("${kakaopay.cid}")
    private String CID; // TC0ONETIME

    @Value("${kakaopay.ready-path}")
    private String READY_PATH; // /online/v1/payment/ready

    @Value("${kakaopay.approve-path}")
    private String APPROVE_PATH; // /online/v1/payment/approve

    // ✅ 백엔드 base url (Render / local)
    @Value("${app.base-url}")
    private String APP_BASE_URL;

    // ✅ 프론트 base url (Vercel / local)
    @Value("${app.front-base-url}")
    private String FRONT_BASE_URL;

    private final RestTemplate restTemplate = new RestTemplate();

    // ⚠️ 임시 저장소 (서버 재시작 시 날아감)
    private final Map<String, String> tidStore = new ConcurrentHashMap<>();
    private final Map<String, String> userIdStore = new ConcurrentHashMap<>();

    private HttpHeaders getHeaders() {
        HttpHeaders headers = new HttpHeaders();

        // ✅ open-api는 JSON으로 보내는 걸 기본으로
        headers.setContentType(MediaType.APPLICATION_JSON);

        // ✅ 핵심: SECRET_KEY 방식 (KakaoAK ❌)
        headers.set("Authorization", "SECRET_KEY " + SECRET_KEY);

        headers.setAccept(MediaType.parseMediaTypes("application/json"));
        return headers;
    }

    private String trimTrailingSlash(String url) {
        if (url == null) return null;
        return url.replaceAll("/+$", "");
    }

    private String enc(String v) {
        return URLEncoder.encode(String.valueOf(v), StandardCharsets.UTF_8);
    }

    // ----------------------------------------------------
    // 1) 결제 준비 (Ready)
    // ----------------------------------------------------
    public KakaoReadyResponse kakaoPayReady(KakaoPayDto kakaoPay) {

        String orderId = kakaoPay.getOrderId();
        String userId = kakaoPay.getUserId();

        if (orderId == null || orderId.isBlank()) throw new IllegalArgumentException("orderId is required");
        if (userId == null || userId.isBlank()) throw new IllegalArgumentException("userId is required");

        String backend = trimTrailingSlash(APP_BASE_URL);

        // ✅ 리다이렉트 URL (카카오 → 백엔드 콜백)
        String approvalUrl = backend + "/payment/qr/success?orderId=" + enc(orderId);
        String cancelUrl   = backend + "/payment/qr/cancel?orderId=" + enc(orderId);
        String failUrl     = backend + "/payment/qr/fail?orderId=" + enc(orderId);

        // ✅ JSON 바디 (필드명이 다르면 400으로 알려줌 -> 그때 맞추면 됨)
        Map<String, Object> bodyMap = Map.of(
                "cid", CID,
                "partner_order_id", orderId,
                "partner_user_id", userId,
                "item_name", kakaoPay.getItemName(),
                "quantity", kakaoPay.getQty(),
                "total_amount", kakaoPay.getTotalAmount(),
                "tax_free_amount", 0,
                "approval_url", approvalUrl,
                "cancel_url", cancelUrl,
                "fail_url", failUrl
        );

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(bodyMap, getHeaders());

        // ✅ URL 조합: host + ready-path (중간에 /v1 붙이지 마!)
        String url = KAKAOPAY_HOST + READY_PATH;

        try {
            KakaoReadyResponse res = restTemplate.postForObject(url, entity, KakaoReadyResponse.class);
            if (res == null || res.getTid() == null) {
                throw new IllegalStateException("Kakao Pay Ready response is null");
            }

            tidStore.put(orderId, res.getTid());
            userIdStore.put(orderId, userId);

            return res;
        } catch (RestClientResponseException e) {
            System.err.println("Kakao Ready error: " + e.getRawStatusCode() + " " + e.getResponseBodyAsString());
            throw e;
        }
    }

    // ----------------------------------------------------
    // 2) 승인(Approve)
    // ----------------------------------------------------
    public KakaoApproveResponse approve(String tid, String userId, String orderId, String pgToken) {

        if (tid == null || tid.isBlank()) throw new IllegalArgumentException("tid is required");
        if (userId == null || userId.isBlank()) throw new IllegalArgumentException("userId is required");
        if (orderId == null || orderId.isBlank()) throw new IllegalArgumentException("orderId is required");
        if (pgToken == null || pgToken.isBlank()) throw new IllegalArgumentException("pgToken is required");

        Map<String, Object> bodyMap = Map.of(
                "cid", CID,
                "tid", tid,
                "partner_order_id", orderId,
                "partner_user_id", userId,
                "pg_token", pgToken
        );

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(bodyMap, getHeaders());

        String url = KAKAOPAY_HOST + APPROVE_PATH;

        try {
            return restTemplate.postForObject(url, entity, KakaoApproveResponse.class);
        } catch (RestClientResponseException e) {
            System.err.println("Kakao Approve error: " + e.getRawStatusCode() + " " + e.getResponseBodyAsString());
            throw e;
        }
    }

    // tid / userId 조회
    public String findByTid(String orderId) {
        return tidStore.get(orderId);
    }

    public String findByUserId(String orderId) {
        return userIdStore.get(orderId);
    }

    // ----------------------------------------------------
    // 3) 승인 후 프론트(payConfirm) 리다이렉트 URL
    // ----------------------------------------------------
    public String buildFrontPayConfirmUrl(String orderId, String status) {
        String front = trimTrailingSlash(FRONT_BASE_URL);
        return front + "/payConfirm?orderId=" + enc(orderId) + "&status=" + enc(status);
    }
}
