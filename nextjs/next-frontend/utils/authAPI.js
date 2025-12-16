import { validateFormCheck,  validateSignupFormCheck } from '@/utils/validate.js';
import { axiosPost } from '@/utils/dataFetch.js';

/** Login */
export const getLogin = async(formData, param) => {
    if(validateFormCheck(param)) {
        const url = "/auth/login";
        const result = await axiosPost(url, formData);
        return result;
    }
    return false;
}

/** Logout */
export const getLogout = async()  => {
    const url = "/auth/logout";
    const result = await axiosPost(url, {});
    return result;
}

/** Signup */
export const getSignup = async (formData, param) =>  {
    console.log(formData, param);
    let result = null;
    if(validateSignupFormCheck(param)) {
        const url = "/member/signup";
        result = await axiosPost(url, formData);
    }
    return result;
}

/** Id 중복 체크 */
export const getIdCheck = async(id) =>  {
    const data = { "id": id };
    const url = "/member/idcheck";
    const result = await axiosPost(url, data);
    return result;
}