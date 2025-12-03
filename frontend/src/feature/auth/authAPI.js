import { login, setUser, logout } from './authSlice.js';
import { axiosPost } from '../../utils/dataFetch.js';
import axios from '../csrf/axiosSetup.js';
import { getCartCount } from '../../feature/cart/cartAPI.js';
import { resetCartCount } from '../../feature/cart/cartSlice.js';
import { createCsrfToken, refreshCsrfToken } from '../csrf/manageCsrfToken.js';
import { validateFormCheck, validateSignupFormCheck } from '../../utils/validate.js';

/** 전체 회원 검색 */
export const getFindAll = () => async (dispatch) => {
    const url = "/member/findAll";
    const result = await axiosPost(url, {});
    return result;
};

/** 회원 탈퇴 */
export const deleteMember = (email) => async (dispatch) => {
    const payload = { "email" : email };
    const url = "/member/deleteByEmail";
    const result = await axiosPost(url, payload);
    return result;
};

/** 아이디 찾기 */
export const getFindId = (payload) => async (dispatch) => {
    const url = "/member/findId";
    const result = await axiosPost(url, payload);
    return result;
};

/** 비밀번호 찾기 */
export const getFindPwd = (payload) => async (dispatch) => {
    const url = "/member/findPwd";
    const result = await axiosPost(url, payload);
    return result;
};

/** 비밀번호 변경 */
export const updatePwd = (payload) => async (dispatch) => {
    console.log("payload -> ", payload);
    const url = "/member/updatePwd";
    const result = await axiosPost(url, payload);
    return result;
};

/** email 중복 체크 */
export const getIdCheck = (email) => async (dispatch) => {
    const data = { "email" : email };
    const url = "/member/idcheck";
    const result = await axiosPost(url, data);
    return result;
}

/** Signup */
export const getSignup = (formData, logInType) => async (dispatch) => {
console.log("formData : ", formData);
    let result = null;
    if(logInType === "ssf"){
        const url = "/member/signup";
        result = await axiosPost(url, formData);
    } else {
        const url = "/member/apiSignup";
        result = await axiosPost(url, formData);
    }
    return result;
}

/** apiLogin */
export const getApiLogin = (email) => async(dispatch) => {

    const payload = { email: email, password: "api" };
    const url = "/member/login";
    const result = await axiosPost(url, payload);

    await refreshCsrfToken();
    try {
        const me = await axios.post('/member/me');
        const data = me.data || {};
        const role = data.role || 'user';
        dispatch(setUser({ authenticated: data.authenticated, email: data.email, role }));
        dispatch(getCartCount(email));
    } catch (e) {
        dispatch(setUser({ authenticated: false }));
    }
    dispatch(login({"userId": email}));
    return true;
};

/** Login */
export const getLogin = (formData, param) => async(dispatch) => {

    //관리자 계정 테스트
    if(formData.id === "admin" && formData.password === "1234") {
        dispatch(login({"userId": formData.id}));
        dispatch(setUser({ authenticated: true, email: formData.id, role: 'admin' }));
        return true;
    }

    //유효성 체크 후 서버에 로그인 요청
    if(validateFormCheck(param)) {
        const payload = { email: formData.id?.trim(), password: formData.password };
        const url = "/member/login";
        const result = await axiosPost(url, payload);

        if(result.login) {
            await refreshCsrfToken();
            try {
                const me = await axios.post('/member/me');
                const data = me.data || {};
                const role = data.role || 'user';
                dispatch(setUser({ authenticated: data.authenticated, email: data.email, role }));
                dispatch(getCartCount(formData.id));
            } catch (e) {
                dispatch(setUser({ authenticated: false }));
            }
            dispatch(login({"userId": formData.id}));
            return true;
        }
    }

    return false;
}


/** Logout */
export const getLogout = () => async(dispatch) => {
    const url = "/member/logout";
    const result = await axiosPost(url, {});

    if(result) {
            refreshCsrfToken();
            dispatch(resetCartCount());
            dispatch(setUser({ authenticated: false }));
            dispatch(logout());
        }

    return result;
}

/** 앱 초기화 시 현재 사용자 복원 */
export const fetchCurrentUser = () => async(dispatch) => {
    try {
        // POST 요청에 필요한 CSRF 토큰 - 다른 페이지 넘어갈때 에러 방지지
        await createCsrfToken();
        
        // 비로그인 상태면 /member/me 호출하지 않음
        const isLogin = localStorage.getItem("isLogin") === "true";
        if (!isLogin) {
            dispatch(setUser({ authenticated: false }));
            return;
        }
        
        const me = await axios.post('/member/me');
        dispatch(setUser(me.data));
        
    } catch (e) {
        dispatch(setUser({ authenticated: false }));
    }
}