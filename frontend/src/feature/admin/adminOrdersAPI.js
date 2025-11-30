import { axiosGet, axiosPatch } from "../../utils/dataFetch.js";

/*
* 관리자 페이지에서 주문 목록 조회
*/
export const fetchAdminOrders = async (params = {}) => {

  //URLSearchParams를 이용하여 쿼리 스트링을 다루기 쉽게 변환 ( key - value )
  const query = new URLSearchParams({
    page: String(params.page ?? 1),
    size: String(params.size ?? 10),
    ...(params.startDate ? { startDate: params.startDate } : {}), //값이 없으면 빈객체를 풀게되어 오류 방지
    ...(params.endDate ? { endDate: params.endDate } : {}),
  }).toString();

  return axiosGet(`/admin/orders?${query}`);
};

export const fetchAdminOrderDetail = async (orderId) => {
  return axiosGet(`/admin/orders/${orderId}`);
};

export const fetchMonthlyRevenue = async (year) => {
  return axiosGet(`/admin/orders/revenue?year=${year}`);
};

//매출 조회용
export const fetchTotalRevenue = async () => {
    const data = await axiosGet(`/admin/orders/revenue/total`);
    return data;
}

//주문 취소
export const cancelOrder = async (orderId) => {
  return axiosPatch(`/admin/orders/${orderId}/cancel`);
}


