package com.ssf.project.service;

import com.ssf.project.dto.KakaoApproveResponse;
import com.ssf.project.dto.KakaoPayDto;
import com.ssf.project.dto.KakaoReadyResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class KakaoPayService {

    @Value("${kakao.pay.host}")
    private String KAKAO_PAY_HOST;

    @Value("${kakao.pay.admin-key}")
    private String ADMIN_KEY;

    @Value("${kakao.pay.cid}")
    private String CID;

    @Value("${kakao.pay.ready-path}")
    private String READY_PATH;

    @Value("${kakao.pay.approve-path}")
    private String APPROVE_PATH;

    // ✅ 추가: 로컬/배포 베이스 URL (예: http://localhost:8080 또는 https://<render-domain>)
    @Value("${app.base-url}")
    private String APP_BASE_URL;

    private final RestTemplate restTemplate = new RestTemplate();
    private final Map<String, String> tidStore = new ConcurrentHashMap<>();
    private final Map<String, String> userIdStore = new ConcurrentHashMap<>();

    private HttpHeaders getHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.set("Authorization", "KakaoAK " + ADMIN_KEY);
        headers.set("Accept", "application/json;charset=UTF-8");
        return headers;
    }

    public KakaoReadyResponse kakaoPayReady(KakaoPayDto kakaoPay) {
        String orderId = kakaoPay.getOrderId();
        String userId = kakaoPay.getUserId();

        if (orderId == null || orderId.isBlank()) {
            throw new IllegalArgumentException("orderId is required");
        }
        if (userId == null || userId.isBlank()) {
            throw new IllegalArgumentException("userId is required");
        }

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("cid", CID);
        params.add("partner_order_id", orderId);
        params.add("partner_user_id", userId);
        params.add("item_name", kakaoPay.getItemName());

        // KakaoPayDto가 String이니까 안전하게 문자열로만 넣음
        params.add("quantity", String.valueOf(kakaoPay.getQty()));
        params.add("total_amount", String.valueOf(kakaoPay.getTotalAmount()));
        params.add("tax_free_amount", "0");

        // ✅ localhost 제거 → 배포/로컬 자동 분기
        params.add("approval_url", APP_BASE_URL + "/payment/qr/success?orderId=" + orderId);
        params.add("cancel_url",   APP_BASE_URL + "/payment/qr/cancel?orderId=" + orderId);
        params.add("fail_url",     APP_BASE_URL + "/payment/qr/fail?orderId=" + orderId);

        HttpEntity<MultiValueMap<String, String>> body = new HttpEntity<>(params, getHeaders());

        String url = KAKAO_PAY_HOST + "/v1" + READY_PATH;

        KakaoReadyResponse res = restTemplate.postForObject(url, body, KakaoReadyResponse.class);
        if (res == null || res.getTid() == null) {
            throw new IllegalStateException("Kakao Pay Ready response is null");
        }

        tidStore.put(orderId, res.getTid());
        userIdStore.put(orderId, userId);

        return res;
    }

    public String findByTid(String orderId) {
        return tidStore.get(orderId);
    }

    public String findByUserId(String orderId) {
        return userIdStore.get(orderId);
    }

    public KakaoApproveResponse approve(String tid, String userId, String orderId, String pgToken) {
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("cid", CID);
        params.add("tid", tid);
        params.add("partner_order_id", orderId);
        params.add("partner_user_id", userId);
        params.add("pg_token", pgToken);

        HttpEntity<MultiValueMap<String, String>> body = new HttpEntity<>(params, getHeaders());
        String url = KAKAO_PAY_HOST + "/v1" + APPROVE_PATH;

        return restTemplate.postForObject(url, body, KakaoApproveResponse.class);
    }
}
