import React, { useEffect } from "react";
import { initNaverLogin } from "../../utils/naverLogin.js";

export default function NaverLoginButton() {
  useEffect(() => {
    initNaverLogin().then(() => {
    }).catch(err => console.error(err));
  }, []);

  // 네이버 로그인 버튼 클릭 핸들러
  const handleNaverLogin = async () => {
    console.log("네이버 로그인 버튼 클릭됨");

    if (!window.naver) {
      alert("네이버 로그인 SDK를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    // SDK에서 생성된 로그인 버튼을 클릭하는 방법
    const naverLoginButton = document.getElementById("naverIdLogin_loginButton");
    console.log("네이버 SDK 버튼:", naverLoginButton);

    if (naverLoginButton) {
      console.log("SDK 버튼 클릭");
      naverLoginButton.click();
    } else {
      // SDK 버튼이 없으면 직접 URL로 이동
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
      {/* 네이버 SDK가 로그인 버튼을 렌더링할 컨테이너 (React 관리 X, 숨김 처리) */}
      <div id="naverIdLogin" style={{ display: "none" }}></div>

      {/* React에서 관리하는 실제 커스텀 로그인 버튼 */}
      <button
        type="button"
        className="sns-btn sns-naver"
        onClick={handleNaverLogin}
        style={{ display: "inline-flex", alignItems: "center" }}
      >
        <div className="sns-icon-box">
          <span className="sns-icon">N</span>
        </div>
        <span className="sns-text">네이버 로그인</span>
      </button>
    </>
  );
}
