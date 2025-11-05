/**
 * Login Form Check
 */
export const validateFormCheck = ({ idRef, passwordRef, setErrors, errors }) => {
    if(idRef.current.value === "") {
        setErrors({...errors, id: "아이디를 입력해주세요"});
        idRef.current.focus();
        return false;
    } else if(passwordRef.current.value === "") {
        setErrors({...errors, pwd: "패스워드를 입력해주세요"});
        passwordRef.current.focus();
        return false;
    }
    return true;
}
