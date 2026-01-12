import { login, setUser, logout } from './authSlice.js';
import { axiosPost } from '../../utils/dataFetch.js';
import axiosJWT from '../../api/axiosJWT.js';
import { getCartCount } from '../../feature/cart/cartAPI.js';
import { resetCartCount } from '../../feature/cart/cartSlice.js';
import { validateFormCheck, validateSignupFormCheck } from '../../utils/validate.js';

/** =========================
 *  전체 회원 검색
 * ========================= */
export const getFindAll = () => async () => {
    const url = "/member/findAll";
    return await axiosPost(url, {});
};

/** =========================
 *  회원 탈퇴
 * ========================= */
export const deleteMember = (email) => async () => {
    const payload = { email };
    const url = "/member/deleteByEmail";
    return await axiosPost(url, payload);
};

/** =========================
 *  아이디 찾기
 * ========================= */
export const getFindId = (payload) => async () => {
    const url = "/member/findId";
    return await axiosPost(url, payload);
};

/** =========================
 *  비밀번호 찾기
 * ========================= */
export const getFindPwd = (payload) => async () => {
    const url = "/member/findPwd";
    return await axiosPost(url, payload);
};

/** =========================
 *  비밀번호 변경
 * ========================= */
export const updatePwd = (payload) => async () => {
    const url = "/member/updatePwd";
    return await axiosPost(url, payload);
};

/** =========================
 *  이메일 중복 체크
 * ========================= */
export const getIdCheck = (email) => async () => {
    const data = { email };
    const url = "/member/idcheck";
    return await axiosPost(url, data);
};

/** =========================
 *  회원가입
 * ========================= */
export const getSignup = (formData, logInType) => async () => {
    let url = "/member/signup";
    if (logInType !== "ssf") {
        url = "/member/apiSignup";
    }
    return await axiosPost(url, formData);
};

/** =========================
 *  API 로그인 (카카오/소셜)
 * ========================= */
export const getApiLogin = (email) => async (dispatch) => {
    const payload = { email, password: "api" };
    const url = "/member/login";
    const result = await axiosPost(url, payload);

    if (result?.token) {
        localStorage.setItem("accessToken", result.token);
        localStorage.setItem("isLogin", "true");

        const me = await axiosJWT.post("/member/me");
        const data = me.data || {};
        const role = data.role || "user";

        dispatch(setUser({
            authenticated: true,
            email: data.email,
            role
        }));
        dispatch(getCartCount(email));
        dispatch(login({ userId: email }));
        return true;
    }

    return false;
};

/** =========================
 *  일반 로그인
 * ========================= */
export const getLogin = (formData, param) => async (dispatch) => {

    // 관리자 계정 테스트
    if (formData.id === "admin" && formData.password === "1234") {
        dispatch(login({ userId: formData.id }));
        dispatch(setUser({
            authenticated: true,
            email: formData.id,
            role: "admin"
        }));
        localStorage.setItem("isLogin", "true");
        return true;
    }

    if (!validateFormCheck(param)) return false;

    const payload = {
        email: formData.id?.trim(),
        password: formData.password
    };

    const url = "/member/login";
    const result = await axiosPost(url, payload);

    if (result?.token) {
        localStorage.setItem("accessToken", result.token);
        localStorage.setItem("isLogin", "true");

        const me = await axiosJWT.post("/member/me");
        const data = me.data || {};
        const role = data.role || "user";

        dispatch(setUser({
            authenticated: true,
            email: data.email,
            role
        }));
        dispatch(getCartCount(formData.id));
        dispatch(login({ userId: formData.id }));
        return true;
    }

    return false;
};

/** =========================
 *  로그아웃
 * ========================= */
export const getLogout = () => async (dispatch) => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("isLogin");

    dispatch(resetCartCount());
    dispatch(setUser({ authenticated: false }));
    dispatch(logout());

    return true;
};

/** =========================
 *  앱 초기화 시 로그인 복원
 * ========================= */
export const fetchCurrentUser = () => async (dispatch) => {
    try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            dispatch(setUser({ authenticated: false }));
            return;
        }

        const me = await axiosJWT.post("/member/me");
        dispatch(setUser(me.data));
    } catch (e) {
        dispatch(setUser({ authenticated: false }));
    }
};
