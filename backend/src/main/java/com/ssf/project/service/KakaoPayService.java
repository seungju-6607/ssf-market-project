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

    // ✅ 배포/로컬 base url (Render: https://ssf-market-project.onrender.com)
    @Value("${app.base-url}")
    private String APP_BASE_URL;

    // ✅ 승인 후 프론트로 보낼 base url (Vercel: https://ssf-market-project.vercel.app)
    @Value("${app.front-base-url}")
    private String FRONT_BASE_URL;

    private final RestTemplate restTemplate = new RestTemplate();

    // ⚠️ Render 재시작/슬립 시 날아갈 수 있음 (임시용)
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
        return url.endsWith("/") ? url.substring(0, url.length() - 1) : url;
    }

    // ----------------------------------------------------
    // 1) 결제 준비 (Ready)
    // ----------------------------------------------------
    public KakaoReadyResponse kakaoPayReady(KakaoPayDto kakaoPay) {

        String orderId = kakaoPay.getOrderId();
        String userId = kakaoPay.getUserId();

        if (orderId == null || orderId.isBlank()) throw new IllegalArgumentException("orderId is required");
        if (userId == null || userId.isBlank()) throw new IllegalArgumentException("userId is required");

        String baseUrl = trimTrailingSlash(APP_BASE_URL);

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("cid", CID);
        params.add("partner_order_id", orderId);
        params.add("partner_user_id", userId);
        params.add("item_name", kakaoPay.getItemName());

        // KakaoPayDto가 String이면 그대로 문자열로
        params.add("quantity", String.valueOf(kakaoPay.getQty()));
        params.add("total_amount", String.valueOf(kakaoPay.getTotalAmount()));
        params.add("tax_free_amount", "0");

        // ✅ localhost 금지. 무조건 배포 도메인/로컬 도메인 baseUrl 사용
        params.add("approval_url", baseUrl + "/payment/qr/success?orderId=" + orderId);
        params.add("cancel_url",   baseUrl + "/payment/qr/cancel?orderId=" + orderId);
        params.add("fail_url",     baseUrl + "/payment/qr/fail?orderId=" + orderId);

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
            // 카카오에서 내려주는 에러 바디가 여기 들어있음(로그에 찍으면 원인 파악 쉬움)
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
    // 3) 승인 후 프론트로 보낼 URL 만들어주기
    // ----------------------------------------------------
    public String buildFrontSuccessRedirectUrl(String orderId) {
        String front = trimTrailingSlash(FRONT_BASE_URL);
        return front + "/payment/success?orderId=" + orderId;
    }

    public String buildFrontFailRedirectUrl(String orderId) {
        String front = trimTrailingSlash(FRONT_BASE_URL);
        return front + "/payment/fail?orderId=" + orderId;
    }

    public String buildFrontCancelRedirectUrl(String orderId) {
        String front = trimTrailingSlash(FRONT_BASE_URL);
        return front + "/payment/cancel?orderId=" + orderId;
    }
}
