import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getIdCheck, getSignup, getApiLogin } from "../../feature/auth/authAPI.js";

export default function NaverCallback() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      // 1. URL에서 access_token 추출
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

      // 2. Naver SDK가 있는 경우
      if (window.naver) {
        const naverLogin = new window.naver.LoginWithNaverId({
          clientId: process.env.REACT_APP_NAVER_CLIENT_ID,
          callbackUrl: process.env.REACT_APP_NAVER_CALLBACK_URL,
          isPopup: false,
          loginButton: { color: "green", type: 3, height: 48 },
        });

        naverLogin.init();

        // SDK 내부의 accessToken 설정
        if (naverLogin.accessToken) {
          naverLogin.accessToken.accessToken = accessToken;
        }

        // 3. 로그인 상태 확인
        const status = await new Promise((resolve) => {
          naverLogin.getLoginStatus((status) => resolve(status));
        });

        if (status) {
          const email = naverLogin.user.getEmail();
          const name = naverLogin.user.getName();

          if (email && name) {
            const param = { name, email, snsprov: "naver", password: "api" };

            try {
              // 4. 회원 가입 및 로그인 처리
              const idResult = await dispatch(getIdCheck(email));

              if (!idResult) {
                await dispatch(getSignup(param, "naver"));
                alert("회원가입이 완료되었습니다.");
              } else {
                alert("로그인에 성공하였습니다.");
              }

              // 5. API 로그인 처리
              const success = await dispatch(getApiLogin(email));
              if (success) {
                window.dispatchEvent(new Event("auth:changed"));
              }

              navigate("/"); // 홈으로 리다이렉트
            } catch (error) {
              console.error("로그인 처리 중 오류가 발생했습니다:", error);
              alert("로그인 처리 중 오류가 발생했습니다.");
              navigate("/login");
            }
          } else {
            alert("사용자 정보를 가져올 수 없습니다.");
            navigate("/login");
          }
        } else {
          alert("로그인 상태를 확인할 수 없습니다.");
          navigate("/login");
        }
      } else {
        alert("네이버 SDK가 없습니다.");
        navigate("/login");
      }
    };

    checkLoginStatus();
  }, [dispatch, navigate]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontSize: "18px",
        color: "#666",
      }}
    >
      <div id="naverIdLogin" style={{ display: "none" }}></div>
      네이버 로그인 처리 중입니다...
    </div>
  );
}
