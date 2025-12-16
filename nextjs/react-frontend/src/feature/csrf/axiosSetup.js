/**
    전역으로 사용하는 axios 설정
    csrf 토큰 요청시 주의사항
    - 쿠키 요청을 항상 true로 설정
    - CRA Proxy 사용여부에 따라 ip 주소 변경
*/
import axios from "axios";

// 쿠키를 보내야 하므로
axios.defaults.withCredentials = true;

// 응답 인터셉터
axios.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;

    if (status === 403) {
      window.location.href = "/error/forbidden";  // 403 전용
    }
    if (status === 500) {
      window.location.href = "/error/common";      // 공통 에러
    }
    return Promise.reject(err);
  }
);


export default axios;