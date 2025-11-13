import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { naverLoginApi } from "../../api/auth";
import { getIdCheck, getSignup, getApiLogin } from '../../feature/auth/authAPI.js';

export default function NaverCallback() {
  const dispatch = useDispatch();
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
      // ✅ 네이버 로그인 객체 생성
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

      // ✅ Promise로 감싸서 await 사용 가능하게 변환
      const getLoginStatusAsync = () => {
        return new Promise((resolve) => {
          naverLogin.getLoginStatus((status) => resolve(status));
        });
      };

      const checkLoginStatus = async () => {
        const status = await getLoginStatusAsync();

          if (status) {
            const email = naverLogin.user.getEmail();
            const name = naverLogin.user.getName();
            const id = naverLogin.user.getId();

            //console.log("사용자 정보:", { email, name, id });

            if (email && name) {
              const param = {
                "name" : name,
                 "email" : email,
                 "snsprov" : "naver",
                 "password" : "api"
              }

              // 로그인 처리
              const idResult = await dispatch(getIdCheck(email));

              if (!idResult) {
                const signResult = await dispatch(getSignup(param, "naver"));
                navigate("/");
              } else {
                alert("로그인에 성공하였습니다.");
                navigate("/");
              }

              const success = await dispatch(getApiLogin(email));
              if (success) {
                window.dispatchEvent(new Event("auth:changed"));
              }

            } else {
              alert("사용자 정보를 가져올 수 없습니다.");
              navigate("/login");
            }
          } else {
              alert("로그인 처리 중 오류가 발생했습니다.");
              navigate("/login");
          }
      };

      // SDK가 초기화된 후 로그인 상태 확인
      setTimeout(checkLoginStatus, 100);

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
