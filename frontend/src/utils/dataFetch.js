import axios from '../feature/csrf/axiosSetup.js';

/**
 *  fetch 함수를 이용하여 데이터 가져오기
 */
export const fetchData = async (url) => {
    const response = await fetch(url);
    const jsonData = await response.json(); // json 타입으로 파싱
    return jsonData;
}

/**
 * axiosGet 함수를 이용하여 백엔드 연동 처리
 */
export const axiosGet = async (url) => {
    const response = await axios.get(url);
    return response.data;
}

/**
 *  axiosPost 함수를 이용하여 백엔드 연동 처리
 */
export const axiosPost = async (url, formData) => {
    console.log("url, formData -> ", url, formData)
    const response = await axios.post(url, formData, { headers: { "Content-Type" : "application/json" } });

    return response.data;
}

/**
 *  axiosPatch 함수를 이용하여 백엔드 연동 처리
 */
export const axiosPatch = async (url, formData = null) => {
    const config = { headers: { "Content-Type" : "application/json" } };
    const response = formData 
        ? await axios.patch(url, formData, config)
        : await axios.patch(url, null, config);
    return response.data;
}

/**
 *  axios 함수를 이용하여 데이터 가져오기
 */
export const axiosData = async (url) => {
    const response = await axios.get(url);
    return response.data;
}

/**
 *  배열의 rows 그룹핑
 */
export const groupByRows = (array, number) => {
    // 출력 포맷 함수 : 한줄에 3개씩 출력!

    /* 방법(1) for문 이용하기 */
    // const rows = []; // [[{}, {}, {}], [{}, {}, {}], [{}]]
    // for(let i=0; i < array.length; i+=3){
    //     // const row = array.slice(i, i+3);   // 0 ~ 2, slice 새로운 배열 반환
    //     rows.push(array.slice(i, i+3));
    // }

    /* 방법(2) 누적합 이용하기 */
    const rows = array.reduce((acc, cur, idx) => {
        if(idx % number === 0) acc.push([cur])
        else acc[acc.length-1].push(cur);

        return acc;
    }, [])

    return rows;
}
