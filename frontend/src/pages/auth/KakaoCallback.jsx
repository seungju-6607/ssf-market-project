import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { kakaoLoginApi } from "../../api/auth";

export default function KakaoCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🟢 [1/7] KakaoCallback React 컴포넌트 로드됨");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("전체 URL:", window.location.href);
    console.log("location.search:", location.search);
    console.log("location.hash:", location.hash);

    // URL에서 인가 코드 추출 (HashRouter에서는 location.search 사용)
    const params = new URLSearchParams(location.search);
    const code = params.get("code");

    console.log("\n🟢 [2/7] 인가 코드 추출");
    console.log("인가 코드:", code);

    if (!code) {
      console.error("❌ 인가 코드를 찾을 수 없음");
      alert("카카오 로그인에 실패했습니다.");
      navigate("/login");
      return;
    }

    // 카카오 토큰 발급 API 호출
    const getKakaoToken = async () => {
      try {
        console.log("\n🟢 [3/7] 카카오 토큰 요청 시작");
        console.log("요청 파라미터:");
        console.log("- client_id:", process.env.REACT_APP_KAKAO_REST_API_KEY);
        console.log("- client_secret:", process.env.REACT_APP_KAKAO_CLIENT_SECRET);
        console.log("- redirect_uri:", process.env.REACT_APP_KAKAO_REDIRECT_URI);
        console.log("- code:", code);

        const tokenResponse = await fetch("https://kauth.kakao.com/oauth/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
          },
          body: new URLSearchParams({
            grant_type: "authorization_code",
            client_id: process.env.REACT_APP_KAKAO_REST_API_KEY,
            client_secret: process.env.REACT_APP_KAKAO_CLIENT_SECRET,
            redirect_uri: process.env.REACT_APP_KAKAO_REDIRECT_URI,
            code: code
          })
        });

        const tokenData = await tokenResponse.json();
        console.log("\n🟢 [4/7] 토큰 응답 받음");
        console.log("HTTP 상태:", tokenResponse.status);
        console.log("토큰 데이터:", JSON.stringify(tokenData, null, 2));

        // 에러 체크
        if (tokenData.error) {
          console.error("❌ 카카오 토큰 에러:");
          console.error("- error:", tokenData.error);
          console.error("- error_description:", tokenData.error_description);
          console.error("- error_code:", tokenData.error_code);
        }

        if (tokenData.access_token) {
          console.log("✅ Access Token 발급 성공:", tokenData.access_token.substring(0, 20) + "...");

          // 사용자 정보 요청
          console.log("\n🟢 [5/7] 사용자 정보 요청 시작");
          const userResponse = await fetch("https://kapi.kakao.com/v2/user/me", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${tokenData.access_token}`,
              "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
            }
          });

          const userData = await userResponse.json();
          console.log("카카오 원본 사용자 정보:", userData);

          if (userData.id) {
            const email = userData.kakao_account?.email || `kakao_${userData.id}@kakao.user`;
            const name = userData.kakao_account?.profile?.nickname || "카카오사용자";
            const id = userData.id.toString();

            console.log("\n🟢 [6/7] 사용자 정보 추출 완료");
            console.log("추출된 정보:");
            console.log("- ID:", id);
            console.log("- 이름:", name);
            console.log("- 이메일:", email);

            // 로그인 처리
            console.log("\n🟢 [7/7] kakaoLoginApi 호출");
            const res = kakaoLoginApi({ email, name, id });

            console.log("✅ 로그인 API 응답:", res);
            console.log("\n📦 localStorage 저장 확인:");
            console.log("- isLogin:", localStorage.getItem("isLogin"));
            console.log("- loginUser:", localStorage.getItem("loginUser"));
            console.log("- auth:", localStorage.getItem("auth"));

            if (res?.ok) {
              // 이벤트 발생
              console.log("\n🔔 이벤트 디스패치 시작");
              try {
                window.dispatchEvent(new Event("auth:changed"));
                console.log("✅ auth:changed 이벤트 발생");
                window.dispatchEvent(new Event("storage"));
                console.log("✅ storage 이벤트 발생");
              } catch (e) {
                console.error("❌ 이벤트 발생 실패:", e);
              }

              console.log("\n🎉 카카오 로그인 완료! 메인 페이지로 이동");
              console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
              alert(`${name}님, 환영합니다!`);
              window.location.href = "/";
            } else {
              console.error("❌ 로그인 API 응답 실패");
              alert("로그인 처리 중 오류가 발생했습니다.");
              navigate("/login");
            }
          } else {
            console.error("❌ 사용자 ID 없음");
            alert("사용자 정보를 가져올 수 없습니다.");
            navigate("/login");
          }
        } else {
          console.error("❌ 토큰 발급 실패");
          console.error("토큰 응답 데이터:", tokenData);
          alert("카카오 토큰 발급에 실패했습니다.");
          navigate("/login");
        }
      } catch (error) {
        console.error("❌❌❌ 카카오 로그인 처리 중 오류 발생 ❌❌❌");
        console.error("에러 상세:", error);
        console.error("에러 메시지:", error.message);
        console.error("에러 스택:", error.stack);
        alert("카카오 로그인 처리 중 오류가 발생했습니다.");
        navigate("/login");
      }
    };

    getKakaoToken();
  }, [navigate, location]);

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      fontSize: "18px",
      color: "#666"
    }}>
      카카오 로그인 처리 중입니다...
    </div>
  );
}
