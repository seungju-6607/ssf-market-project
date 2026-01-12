import axios from "../api/axiosJWT";

/**
 * fetch 함수를 이용하여 데이터 가져오기
 * (JWT 필요 없는 공개 API용)
 */
export const fetchData = async (url) => {
    const response = await fetch(url);
    const jsonData = await response.json();
    return jsonData;
};

/**
 * axios GET
 */
export const axiosGet = async (url) => {
    const response = await axios.get(url);
    return response.data;
};

/**
 * axios POST
 */
export const axiosPost = async (url, formData) => {
    console.log("url, formData -> ", url, formData);
    const response = await axios.post(
        url,
        formData,
        { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
};

/**
 * axios PATCH
 */
export const axiosPatch = async (url, formData = null) => {
    const config = { headers: { "Content-Type": "application/json" } };
    const response = formData
        ? await axios.patch(url, formData, config)
        : await axios.patch(url, null, config);
    return response.data;
};

/**
 * axios GET (alias)
 */
export const axiosData = async (url) => {
    const response = await axios.get(url);
    return response.data;
};

/**
 * 배열 rows 그룹핑 (UI 유틸)
 */
export const groupByRows = (array, number) => {
    const rows = array.reduce((acc, cur, idx) => {
        if (idx % number === 0) acc.push([cur]);
        else acc[acc.length - 1].push(cur);
        return acc;
    }, []);

    return rows;
};
