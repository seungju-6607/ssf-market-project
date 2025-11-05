/**
 * 네이버 로그인 버튼 컴포넌트
 *
 * 역할:
 * - 네이버 LoginWithNaverId SDK 초기화
 * - 네이버 로그인 버튼 렌더링 및 클릭 처리
 *
 * 사용법:
 * <NaverLoginButton />
 */

import React, { useEffect } from "react";

export default function NaverLoginButton() {
  useEffect(() => {
    initNaverLogin();
  }, []);

  // 네이버 SDK 초기화 함수
  const initNaverLogin = () => {
    if (!window.naver) {
      console.log("네이버 SDK 아직 로드 안됨");
      return;
    }

    const naverIdLoginDiv = document.getElementById("naverIdLogin");
    if (!naverIdLoginDiv) {
      console.error("naverIdLogin 요소를 찾을 수 없음");
      return;
    }

    const naverLogin = new window.naver.LoginWithNaverId({
      clientId: process.env.REACT_APP_NAVER_CLIENT_ID,
      callbackUrl: process.env.REACT_APP_NAVER_CALLBACK_URL,
      isPopup: false,
      loginButton: { color: "green", type: 3, height: 48 }
    });

    console.log("네이버 SDK 초기화 시작");
    naverLogin.init();
    console.log("네이버 SDK 초기화 완료");
  };

  // 네이버 로그인 버튼 클릭 핸들러
  const handleNaverLogin = () => {
    console.log("네이버 로그인 버튼 클릭됨");

    if (!window.naver) {
      alert("네이버 로그인 SDK를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    // 네이버 SDK가 생성한 로그인 버튼 클릭 트리거
    const naverLoginButton = document.getElementById("naverIdLogin_loginButton");
    console.log("네이버 SDK 버튼:", naverLoginButton);

    if (naverLoginButton) {
      console.log("SDK 버튼 클릭");
      naverLoginButton.click();
    } else {
      console.log("SDK 버튼 없음, 직접 URL 이동");
      // 버튼이 없으면 직접 네이버 로그인 페이지로 이동
      const clientId = process.env.REACT_APP_NAVER_CLIENT_ID;
      const callbackUrl = encodeURIComponent(process.env.REACT_APP_NAVER_CALLBACK_URL);
      const state = Math.random().toString(36).substr(2, 11);
      const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=token&client_id=${clientId}&redirect_uri=${callbackUrl}&state=${state}`;
      console.log("이동할 URL:", naverAuthUrl);
      window.location.href = naverAuthUrl;
    }
  };

  return (
    <>
      {/* 네이버 SDK가 로그인 버튼을 렌더링할 컨테이너 */}
      <div id="naverIdLogin" style={{ display: "none" }}></div>

      {/* 실제 사용자에게 보이는 커스텀 버튼 */}
      <button type="button" className="sns-btn sns-naver" onClick={handleNaverLogin}>
        <div className="sns-icon-box">
          <span className="sns-icon">N</span>
        </div>
        <span className="sns-text">네이버 로그인</span>
      </button>
    </>
  );
}
