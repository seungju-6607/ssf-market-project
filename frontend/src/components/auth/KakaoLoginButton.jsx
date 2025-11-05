/**
 * 카카오 로그인 버튼 컴포넌트
 *
 * 역할:
 * - 카카오 OAuth 2.0 인증 URL 생성
 * - 카카오 로그인 버튼 렌더링 및 클릭 처리
 *
 * 사용법:
 * <KakaoLoginButton />
 */

import React from "react";

export default function KakaoLoginButton() {
  // 카카오 로그인 버튼 클릭 핸들러
  const handleKakaoLogin = () => {
    console.log("카카오 로그인 버튼 클릭됨");

    const restApiKey = process.env.REACT_APP_KAKAO_REST_API_KEY;
    const redirectUri = encodeURIComponent(process.env.REACT_APP_KAKAO_REDIRECT_URI);
    // scope 파라미터: profile_nickname만 요청 (이메일 제외)
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${restApiKey}&redirect_uri=${redirectUri}&response_type=code&scope=profile_nickname`;

    console.log("카카오 인증 URL:", kakaoAuthUrl);
    window.location.href = kakaoAuthUrl;
  };

  return (
    <button type="button" className="sns-btn sns-kakao" onClick={handleKakaoLogin}>
      <div className="sns-icon-box">
        <span className="sns-icon">💬</span>
      </div>
      <span className="sns-text">카카오 로그인</span>
    </button>
  );
}
