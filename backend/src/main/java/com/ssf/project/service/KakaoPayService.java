package com.ssf.project.service;

import com.ssf.project.dto.KakaoApproveResponse;
import com.ssf.project.dto.KakaoPayDto;
import com.ssf.project.dto.KakaoReadyResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
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
    private String ADMIN_KEY;               // ✅ (실제로는 카카오페이 Secret key 값이 들어감)

    @Value("${kakao.pay.cid}")
    private String CID;                     // TC0ONETIME

    @Value("${kakao.pay.ready-path}")
    private String READY_PATH;              // /payment/ready

    @Value("${kakao.pay.approve-path}")
    private String APPROVE_PATH;            // /payment/approve

    // ✅ 백엔드 base url (Render / local) - (카카오가 콜백으로 때리는 주소)
    @Value("${app.base-url}")
    private String APP_BASE_URL;

    // ✅ 프론트 base url (Vercel / local) - (승인 완료 후 프론트로 보내는 주소)
    @Value("${app.front-base-url}")
    private String FRONT_BASE_URL;

    private final RestTemplate restTemplate = new RestTemplate();

    // ⚠️ 임시 저장소 (서버 재시작 시 날아감)
    private final Map<String, String> tidStore = new ConcurrentHashMap<>();
    private final Map<String, String> userIdStore = new ConcurrentHashMap<>();

    private HttpHeaders getHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        // ✅ 카카오페이 결제 API: Secret key를 그대로 Authorization에 넣음 (KakaoAK 붙이면 401)
        headers.set("Authorization", ADMIN_KEY);

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

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("cid", CID);
        params.add("partner_order_id", orderId);
        params.add("partner_user_id", userId);
        params.add("item_name", kakaoPay.getItemName());
        params.add("quantity", String.valueOf(kakaoPay.getQty()));
        params.add("total_amount", String.valueOf(kakaoPay.getTotalAmount()));
        params.add("tax_free_amount", "0");

        // ✅ 카카오가 돌아올 URL (카카오 → 백엔드 콜백)
        // - 카카오페이 콘솔 Redirect URL에 아래 3개가 등록되어 있어야 함:
        //   {APP_BASE_URL}/payment/qr/success
        //   {APP_BASE_URL}/payment/qr/cancel
        //   {APP_BASE_URL}/payment/qr/fail
        //
        // - 결제 완료 후 카카오가 백엔드로 리다이렉트:
        //   {APP_BASE_URL}/payment/qr/success?orderId=...&pg_token=...
        //
        // 그 다음 백엔드가 프론트(payConfirm)로 302 리다이렉트 시켜줌.
        String backend = trimTrailingSlash(APP_BASE_URL);

        params.add("approval_url", backend + "/payment/qr/success?orderId=" + enc(orderId));
        params.add("cancel_url", backend + "/payment/qr/cancel?orderId=" + enc(orderId));
        params.add("fail_url", backend + "/payment/qr/fail?orderId=" + enc(orderId));

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

    // ----------------------------------------------------
    // 2) 승인(Approve)
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
