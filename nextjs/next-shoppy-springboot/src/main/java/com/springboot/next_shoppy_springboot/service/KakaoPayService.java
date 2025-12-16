package com.springboot.next_shoppy_springboot.service;

import com.springboot.next_shoppy_springboot.dto.KakaoPayDto;
import com.springboot.next_shoppy_springboot.dto.KakaoApproveResponse;
import com.springboot.next_shoppy_springboot.dto.KakaoReadyResponse;
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

    // application.yml에서 값 주입
    @Value("${kakao.pay.host}")
    private String KAKAO_PAY_HOST;

    @Value("${kakao.pay.admin-key}")
    private String ADMIN_KEY;

    @Value("${kakao.pay.cid}")
    private String CID;

    @Value("${kakao.pay.ready-path}")
    private String READY_PATH; // /payment/ready

    @Value("${kakao.pay.approve-path}")
    private String APPROVE_PATH; // /payment/approve

    private final RestTemplate restTemplate = new RestTemplate();
    private final Map<String, String> tidStore = new ConcurrentHashMap<>();
    private final Map<String, String> userIdStore = new ConcurrentHashMap<>();

    // 헤더 생성 (kapi 규격: KakaoAK + x-www-form-urlencoded)
    private HttpHeaders getHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.set("Authorization", "KakaoAK " + ADMIN_KEY);
        headers.set("Accept", "application/json;charset=UTF-8");
        return headers;
    }

    /**
     * 결제 준비
     * @param kakaoPay
     */
    public KakaoReadyResponse kakaoPayReady(KakaoPayDto kakaoPay) {
        String orderId = kakaoPay.getOrderId();

        // 1) 요청 바디 (kapi는 Form-URL-Encoded)
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("cid", CID);                                     //가맹점 코드 (테스트용)
        params.add("partner_order_id", kakaoPay.getOrderId());      //주문번호 필수
        params.add("partner_user_id", kakaoPay.getUserId());        //회원아이디 필수
        params.add("item_name", kakaoPay.getItemName());
        params.add("quantity", String.valueOf(kakaoPay.getQty()));  //문자열로 처리
        params.add("total_amount", String.valueOf(kakaoPay.getTotalAmount()));
        params.add("tax_free_amount", "0"); // 필요 시 사용

        // 콜백 URL에 orderId를 함께 전달 (승인 단계에서 사용)
        params.add("approval_url", "http://localhost:9000/payment/qr/success?orderId=" + orderId);
        params.add("cancel_url",   "http://localhost:9000/payment/qr/cancel?orderId=" + orderId);
        params.add("fail_url",     "http://localhost:9000/payment/qr/fail?orderId=" + orderId);
        HttpEntity<MultiValueMap<String, String>> body = new HttpEntity<>(params, getHeaders());

        // 2) API 호출
        try {
            String url = KAKAO_PAY_HOST + "/v1" + READY_PATH;
            KakaoReadyResponse res = restTemplate.postForObject(url, body, KakaoReadyResponse.class);

            // ✅ 결제 준비 성공 시 TID, userId 저장
            tidStore.put(orderId, res.getTid());
            userIdStore.put(orderId, kakaoPay.getUserId());

            return res;

        } catch (Exception e) {
            System.err.println("Kakao Pay Ready 실패: " + e.getMessage());
            throw e; // 로깅/예외 처리 전략에 맞게 변환
        }
    }

    /**
     * 주문번호를 이용하여 tid, userId 조회
     */
    public String findByTid(String orderId) {
        return tidStore.get(orderId);
    }

    public String findByUserId(String orderId) {
        return userIdStore.get(orderId);
    }


    /**
     * 최종 결제 승인 (Approve)
     */
    public KakaoApproveResponse approve( String tid, String userId, String orderId, String pgToken) {

        // 1. 요청 바디 설정
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("cid", CID);
        params.add("tid", tid);
        params.add("partner_order_id", orderId);
        params.add("partner_user_id", userId);
        params.add("pg_token", pgToken);

        // 2. HTTP 엔티티 생성
        HttpEntity<MultiValueMap<String, String>> body = new HttpEntity<>(params, getHeaders());

        // 3. API 호출
        try {
            // URL 조합: https://kapi.kakao.com + /v1/payment/approve
            String url = KAKAO_PAY_HOST + "/v1" + APPROVE_PATH;

            KakaoApproveResponse res =  restTemplate.postForObject(
                                                    url,
                                                    body,
                                                    KakaoApproveResponse.class
                                            );
            return res;

        } catch (Exception e) {
            System.err.println("Kakao Pay Approve 실패: " + e.getMessage());
            return null;
        }
    }
}