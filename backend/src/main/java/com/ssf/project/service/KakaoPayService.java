package com.ssf.project.service;

import com.ssf.project.dto.KakaoApproveResponse;
import com.ssf.project.dto.KakaoPayDto;
import com.ssf.project.dto.KakaoReadyResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class KakaoPayService {

    @Value("${kakao.pay.host}")
    private String KAKAO_PAY_HOST;          // https://kapi.kakao.com

    @Value("${kakao.pay.admin-key}")
    private String ADMIN_KEY;               // KakaoAK {adminKey}

    @Value("${kakao.pay.cid}")
    private String CID;                     // TC0ONETIME

    @Value("${kakao.pay.ready-path}")
    private String READY_PATH;              // /payment/ready

    @Value("${kakao.pay.approve-path}")
    private String APPROVE_PATH;            // /payment/approve

    // ✅ 백엔드 base url (Render / local) - (approve API 호출용 등)
    @Value("${app.base-url}")
    private String APP_BASE_URL;

    // ✅ 프론트 base url (Vercel / local) - (카카오 리다이렉트 받는 콜백용)
    @Value("${app.front-base-url}")
    private String FRONT_BASE_URL;

    private final RestTemplate restTemplate = new RestTemplate();

    // ⚠️ 임시 저장소 (서버 재시작 시 날아감)
    private final Map<String, String> tidStore = new ConcurrentHashMap<>();
    private final Map<String, String> userIdStore = new ConcurrentHashMap<>();

    private HttpHeaders getHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.set("Authorization", "KakaoAK " + ADMIN_KEY);
        headers.setAccept(MediaType.parseMediaTypes("application/json;charset=UTF-8"));
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

        // ✅ 카카오 리다이렉트는 "프론트"로 받는 게 정석 (도메인 불일치(-799) 방지)
        String front = trimTrailingSlash(FRONT_BASE_URL);

        // (참고) 백엔드 base url은 필요하면 다른 곳에서 사용 가능
        // String backend = trimTrailingSlash(APP_BASE_URL);

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("cid", CID);
        params.add("partner_order_id", orderId);
        params.add("partner_user_id", userId);
        params.add("item_name", kakaoPay.getItemName());
        params.add("quantity", String.valueOf(kakaoPay.getQty()));
        params.add("total_amount", String.valueOf(kakaoPay.getTotalAmount()));
        params.add("tax_free_amount", "0");

        /**
         * ✅ 카카오가 돌아올 URL (프론트 콜백)
         * - 카카오페이 콘솔 Redirect URL에 아래 경로가 등록되어 있어야 함:
         *   https://ssf-market-project.vercel.app/kakao-callback
         *
         * - 결제 완료 후:
         *   front/kakao-callback?orderId=...&pg_token=...
         *   (cancel/fail은 status로 구분)
         */
        params.add("approval_url", front + "/kakao-callback?orderId=" + enc(orderId));
        params.add("cancel_url",   front + "/kakao-callback?orderId=" + enc(orderId) + "&status=cancel");
        params.add("fail_url",     front + "/kakao-callback?orderId=" + enc(orderId) + "&status=fail");

        HttpEntity<MultiValueMap<String, String>> body = new HttpEntity<>(params, getHeaders());

        String url = KAKAO_PAY_HOST + "/v1" + READY_PATH;

        try {
            KakaoReadyResponse res = restTemplate.postForObject(url, body, KakaoReadyResponse.class);
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

    public String findByTid(String orderId) {
        return tidStore.get(orderId);
    }

    public String findByUserId(String orderId) {
        return userIdStore.get(orderId);
    }

    // ----------------------------------------------------
    // 2) 최종 승인 (Approve)
    // ----------------------------------------------------
    public KakaoApproveResponse approve(String tid, String userId, String orderId, String pgToken) {

        if (tid == null || tid.isBlank()) throw new IllegalArgumentException("tid is required");
        if (userId == null || userId.isBlank()) throw new IllegalArgumentException("userId is required");
        if (orderId == null || orderId.isBlank()) throw new IllegalArgumentException("orderId is required");
        if (pgToken == null || pgToken.isBlank()) throw new IllegalArgumentException("pgToken is required");

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("cid", CID);
        params.add("tid", tid);
        params.add("partner_order_id", orderId);
        params.add("partner_user_id", userId);
        params.add("pg_token", pgToken);

        HttpEntity<MultiValueMap<String, String>> body = new HttpEntity<>(params, getHeaders());
        String url = KAKAO_PAY_HOST + "/v1" + APPROVE_PATH;

        try {
            return restTemplate.postForObject(url, body, KakaoApproveResponse.class);
        } catch (RestClientResponseException e) {
            System.err.println("Kakao Approve error: " + e.getRawStatusCode() + " " + e.getResponseBodyAsString());
            throw e;
        }
    }

    // ----------------------------------------------------
    // 3) 승인 후 프론트(payConfirm) 리다이렉트 URL
    // ----------------------------------------------------
    public String buildFrontPayConfirmUrl(String orderId, String status) {
        String front = trimTrailingSlash(FRONT_BASE_URL);
        return front + "/payConfirm?orderId=" + enc(orderId) + "&status=" + enc(status);
    }
}
