import { setDefaultAddress, setAddressList, setOrderHistory } from './orderSlice.js';
import { axiosPost } from '../../utils/dataFetch.js';

/** 기본 배송지 조회 */
export const fetchDefaultAddress = () => async (dispatch) => {
    const loginUser = JSON.parse(localStorage.getItem("loginUser") || "{}");

    try {
        const url = "/member/addr";
        const data = await axiosPost(url, { email: loginUser.email });
        dispatch(setDefaultAddress(data));
        return data;
    } catch (error) {
        console.error("기본 배송지 조회 실패:", error);
        dispatch(setDefaultAddress(null));
        return null;
    }
}

/** 배송지 목록 조회 */
export const fetchAddressList = () => async (dispatch) => {
    const loginUser = JSON.parse(localStorage.getItem("loginUser") || "{}");

    try {
        const url = "/member/addrList";
        const data = await axiosPost(url, { email: loginUser.email });
        dispatch(setAddressList(data || []));
        return data || [];
    } catch (error) {
        console.error("배송지 목록 조회 실패:", error);
        dispatch(setAddressList([]));
        return [];
    }
}

/** 배송지 삭제 */
export const deleteAddress = (addrKey) => async (dispatch) => {
    try {
        const url = "/member/addrDelete";
        await axiosPost(url, { addrKey });
        return true;
    } catch (error) {
        console.error("배송지 삭제 실패:", error);
        throw error;
    }
}

/** 배송지 저장 */
export const saveAddress = (formData = {}) => async () => {
    const { email } = JSON.parse(localStorage.getItem("loginUser") || "{}");

    const payload = {
        ...formData,
        email,
    };

    try {
        const url = "/member/saveAddr";
        const data = await axiosPost(url, payload);
        return data;
    } catch (error) {
        console.error("배송지 저장 실패: ", error);
        return [];
    }
}

/** 주문 내역 조회 */
export const fetchOrderHistory = (filters = {}) => async (dispatch) => {
    const loginUser = JSON.parse(localStorage.getItem("loginUser") || "{}");
    const { email } = loginUser;

    const payload = {
        email,
        startDate: filters.startDate || null,
        endDate: filters.endDate || null,
    };
    
    try {
        const data = await axiosPost("/member/orderhistory", payload);
        dispatch(setOrderHistory(data));
        return data;
    } catch (error) {
        console.error("주문 내역 조회 실패:", error);
        dispatch(setOrderHistory([]));
        return [];
    }
}

/** 주문 상세 조회 */
export const fetchOrderDetail = (orderId) => async () => {
    const loginUser = JSON.parse(localStorage.getItem("loginUser") || "{}");
    const { email } = loginUser;

    if (!email || !orderId) {
        throw new Error("email and orderId are required");
    }

    try {
        const payload = { email, orderId };
        return await axiosPost("/member/orderhistory/detail", payload);
    } catch (error) {
        console.error("주문 상세 조회 실패:", error);
        throw error;
    }
}

