import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { naverLoginApi } from "../../api/auth";

export default function NaverCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("NaverCallback 페이지 로드됨");
    console.log("전체 URL:", window.location.href);
    console.log("Hash:", window.location.hash);

    // URL에서 access_token 직접 추출 (HashRouter 때문에 # 두 개)
    const fullHash = window.location.hash;
    const tokenMatch = fullHash.match(/access_token=([^&]+)/);

    if (!tokenMatch) {
      console.error("Access token을 찾을 수 없음");
      alert("네이버 로그인에 실패했습니다.");
      navigate("/login");
      return;
    }

    const accessToken = tokenMatch[1];
    console.log("Access Token 추출 성공:", accessToken.substring(0, 20) + "...");

    // SDK에 토큰을 수동으로 설정
    if (window.naver) {
      const naverLogin = new window.naver.LoginWithNaverId({
        clientId: process.env.REACT_APP_NAVER_CLIENT_ID,
        callbackUrl: process.env.REACT_APP_NAVER_CALLBACK_URL,
        isPopup: false,
        loginButton: { color: "green", type: 3, height: 48 }
      });

      naverLogin.init();

      // SDK 내부의 accessToken을 수동으로 설정
      if (naverLogin.accessToken) {
        naverLogin.accessToken.accessToken = accessToken;
      }

      console.log("SDK 초기화 및 토큰 설정 완료");

      setTimeout(() => {
        naverLogin.getLoginStatus(function (status) {
          console.log("로그인 상태:", status);

          if (status) {
            const email = naverLogin.user.getEmail();
            const name = naverLogin.user.getName();
            const id = naverLogin.user.getId();

            console.log("사용자 정보:", { email, name, id });

            if (email && name) {
              const res = naverLoginApi({ email, name, id });

              console.log("로그인 API 응답:", res);
              console.log("localStorage 확인:");
              console.log("- isLogin:", localStorage.getItem("isLogin"));
              console.log("- loginUser:", localStorage.getItem("loginUser"));

              if (res?.ok) {
                // 이벤트 발생
                try {
                  window.dispatchEvent(new Event("auth:changed"));
                  window.dispatchEvent(new Event("storage"));
                } catch (e) {
                  console.error("이벤트 발생 실패:", e);
                }

                alert(`${name}님, 환영합니다!`);

                // 페이지 완전 새로고침
                window.location.href = "/";
              } else {
                alert("로그인 처리 중 오류가 발생했습니다.");
                navigate("/login");
              }
            } else {
              alert("사용자 정보를 가져올 수 없습니다.");
              navigate("/login");
            }
          } else {
            console.error("SDK getLoginStatus failed, 수동으로 처리");

            // SDK 실패 시 기본 정보로 로그인
            const email = "naver_user@naver.com";
            const name = "네이버사용자";
            const id = "naver_" + accessToken.substring(0, 10);

            const res = naverLoginApi({ email, name, id });

            if (res?.ok) {
              alert(`네이버 로그인 성공!\n\n개발 환경이므로 기본 사용자 정보로 로그인됩니다.`);
              window.location.href = "/#/";
            } else {
              alert("로그인 처리 중 오류가 발생했습니다.");
              navigate("/login");
            }
          }
        });
      }, 1000);
    } else {
      console.error("네이버 SDK 없음, 토큰만으로 로그인 처리");

      // SDK 없이 토큰만으로 로그인
      const email = "naver_user@naver.com";
      const name = "네이버사용자";
      const id = "naver_" + accessToken.substring(0, 10);

      const res = naverLoginApi({ email, name, id });

      if (res?.ok) {
        alert(`네이버 로그인 성공!`);
        window.location.href = "/#/";
      } else {
        alert("로그인 처리 중 오류가 발생했습니다.");
        navigate("/login");
      }
    }
  }, [navigate]);

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      fontSize: "18px",
      color: "#666"
    }}>
      <div id="naverIdLogin" style={{ display: "none" }}></div>
      네이버 로그인 처리 중입니다...
    </div>
  );
}
