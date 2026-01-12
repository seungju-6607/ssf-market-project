import axios from "../feature/csrf/axiosSetup.js";

/**
 * fetch 함수를 이용하여 데이터 가져오기
 * ✅ 크로스 도메인(Verce↔Render)에서 세션/쿠키 유지하려면 credentials: 'include' 필수
 */
export const fetchData = async (url) => {
  const response = await fetch(url, {
    method: "GET",
    credentials: "include", // ✅ 세션 쿠키 포함
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`fetchData failed: ${response.status} ${response.statusText} ${text}`);
  }

  return await response.json();
};

/**
 * axiosGet 함수를 이용하여 백엔드 연동 처리
 * ✅ withCredentials: true 로 세션 쿠키 포함
 */
export const axiosGet = async (url) => {
  const response = await axios.get(url, { withCredentials: true });
  return response.data;
};

/**
 * axiosPost 함수를 이용하여 백엔드 연동 처리
 * ✅ withCredentials: true 로 세션 쿠키 포함
 * ✅ JSON 전송 헤더 유지
 */
export const axiosPost = async (url, formData) => {
  console.log("url, formData -> ", url, formData);

  const response = await axios.post(url, formData, {
    withCredentials: true, // ✅ 세션 쿠키 포함
    headers: { "Content-Type": "application/json" },
  });

  return response.data;
};

/**
 * axiosPatch 함수를 이용하여 백엔드 연동 처리
 * ✅ withCredentials: true 로 세션 쿠키 포함
 */
export const axiosPatch = async (url, formData = null) => {
  const config = {
    withCredentials: true, // ✅ 세션 쿠키 포함
    headers: { "Content-Type": "application/json" },
  };

  const response = formData
    ? await axios.patch(url, formData, config)
    : await axios.patch(url, null, config);

  return response.data;
};

/**
 * axios 함수를 이용하여 데이터 가져오기
 * ✅ withCredentials: true 로 세션 쿠키 포함
 */
export const axiosData = async (url) => {
  const response = await axios.get(url, { withCredentials: true });
  return response.data;
};

/**
 * 배열의 rows 그룹핑
 */
export const groupByRows = (array, number) => {
  const rows = array.reduce((acc, cur, idx) => {
    if (idx % number === 0) acc.push([cur]);
    else acc[acc.length - 1].push(cur);
    return acc;
  }, []);
  return rows;
};
