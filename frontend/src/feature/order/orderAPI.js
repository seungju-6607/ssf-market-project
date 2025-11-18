import { setDefaultAddress, setAddressList } from './orderSlice.js';
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

