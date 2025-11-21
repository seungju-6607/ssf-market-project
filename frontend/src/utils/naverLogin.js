let naverLoginInstance = null;

export const initNaverLogin = () => {
  return new Promise((resolve, reject) => {
    if (naverLoginInstance) {
      // 이미 초기화된 경우 바로 반환
      resolve(naverLoginInstance);
      return;
    }

    const interval = setInterval(() => {
      if (window.naver && window.naver.LoginWithNaverId) {
        const naverIdLoginDiv = document.getElementById("naverIdLogin");
        if (!naverIdLoginDiv) {
          console.error("naverIdLogin 요소를 찾을 수 없음");
          clearInterval(interval);
          reject("naverIdLogin 요소 없음");
          return;
        }

        naverLoginInstance = new window.naver.LoginWithNaverId({
          clientId: process.env.REACT_APP_NAVER_CLIENT_ID,
          callbackUrl: process.env.REACT_APP_NAVER_CALLBACK_URL,
          isPopup: false,
          loginButton: { color: "green", type: 3, height: 48 },
        });

        naverLoginInstance.init();
        window.naverLogin = naverLoginInstance; // 기존 호환용
        clearInterval(interval);
        resolve(naverLoginInstance);
      } else {
        console.log("네이버 SDK 로드를 기다리는 중...");
      }
    }, 200);
  });
};

export const getNaverLogin = () => {
  return naverLoginInstance;
};

// 로그아웃 함수 추가
export const logoutNaver = () => {
  if (!naverLoginInstance) {
    console.warn("네이버 로그인 인스턴스가 없습니다.");
    return;
  }

  // naverLoginInstance.logout() 은 SDK에 따라 팝업 혹은 쿠키 세션 제거 방식
  if (window.naver && window.naver.LoginWithNaverId) {
    naverLoginInstance.logout();

    // 네이버 관련 토큰/정보 삭제
    localStorage.removeItem("naver_access_token");
    localStorage.removeItem("naver_state_token");

  } else {
    console.warn("네이버 SDK가 로드되지 않아 로그아웃할 수 없습니다.");
  }
};