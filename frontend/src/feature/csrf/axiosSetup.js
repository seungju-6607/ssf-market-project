// src/feature/csrf/axiosSetup.js
import axios from "axios";

axios.defaults.withCredentials = true;

// ✅ 배포용: Vercel 환경변수 REACT_APP_API_BASE_URL 사용
// ✅ 개발용: .env.development 또는 proxy 쓰면 됨
axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL || "";

export default axios;
