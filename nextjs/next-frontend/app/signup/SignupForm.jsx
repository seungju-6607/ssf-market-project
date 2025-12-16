"use client";

import React,{ useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getSignup, getIdCheck } from "@/utils/authAPI.js";


const initForm = (initArray) => {
    return initArray.reduce((acc,cur) => {
        acc[cur] = "";
        return acc;
    }, {});
}


export default function SignupForm() {
    const router = useRouter();
    const initArray = ['id', 'pwd', 'cpwd', 'name', 'phone', 'emailName', 'emailDomain'];
    const refs = useMemo(() => {
        return initArray.reduce((acc,cur) => {
            acc[`${cur}Ref`] = React.createRef();
            return acc;
        }, {});
    }, [initArray]);

    const [form, setForm] = useState(initForm(initArray));  //{id:"hong", ...}
    const [errors, setErrors] = useState({...initForm(initArray), emailDomain: ""});

    /** 폼 입력값 변경 이벤트 처리 **/
    const handleChangeForm = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value});
        setErrors({...initForm(initArray), emailDomain: ""});
    }

    /** 입력 폼 초기화 **/
    const handleResetForm = () => {
        setForm(initForm(initArray));
    }

    /** 가입하기 버튼 이벤트 처리 **/
    const handleSubmit = async(e) => {
        e.preventDefault();
        const param = {  refs: refs,   setErrors: setErrors }

        //concat 메소드 바로 호출 ❌, 값의 존재여부 체크후 concat 호출 ⭕
        const emailName = form.emailName ?? "";
        const emailDomain = form.emailDomain ?? "";
        const email = emailName.concat(emailDomain);

        const formData = { ...form, email: email }
        const result = await getSignup(formData, param);
        if(result) {
            alert("회원가입 성공!!");
            router.push("/login");
        }
    }//handleSubmit

    /** 아이디 중복체크 */
    const handleDupulicateIdCheck = async() => {
        const result = await getIdCheck(form.id);
        alert(result);
    }

    return (
          <form onSubmit={handleSubmit}>
            <ul>
                <li>
                    <label htmlFor="id" ><b>아이디</b></label>
                    { !form.id && <span style={{color:"red", fontSize:"0.8rem"}}>{errors.id}</span>}
                    <div>
                        <input type="text"
                               id="id"
                               name="id"
                               value={form.id}
                               ref={refs.idRef}
                               onChange={handleChangeForm}
                               placeholder = "아이디 입력(6~20자)" />
                        <button type="button"
                                onClick={handleDupulicateIdCheck}
                        > 중복확인</button>
                        <input type="hidden" id="idCheckResult" value="default" />
                    </div>
                </li>
                <li>
                    <label htmlFor="pwd"><b>비밀번호</b></label>
                    <div>
                        <input type="password"
                               id="pwd"
                               name="pwd"
                               // ref={refs.pwdRef}
                               value={form.pwd}
                               onChange={handleChangeForm}
                               placeholder="비밀번호 입력(문자,숫자,특수문자 포함 6~12자)"/>
                    </div>
                </li>
                <li>
                    <label htmlFor="cpwd"><b>비밀번호 확인</b></label>
                    <div>
                        <input type="password"
                               id="cpwd"
                               name="cpwd"
                               value={form.cpwd}
                               // ref={refs.cpwdRef}
                               onChange={handleChangeForm}
                               placeholder="비밀번호 재입력"/>
                    </div>
                </li>
                <li>
                    <label htmlFor="name"><b>이름</b></label>
                    <div>
                        <input type="text"
                               id="name"
                               name="name"
                               value={form.name}
                               // ref={refs.nameRef}
                               onChange={handleChangeForm}
                               placeholder="이름을 입력해주세요"/>
                    </div>
                </li>
                <li>
                    <label htmlFor="phone"><b>전화번호</b></label>
                    <div>
                        <input type="text"
                               id="phone"
                               name="phone"
                               value={form.phone}
                               // ref={refs.phoneRef}
                               onChange={handleChangeForm}
                               placeholder="휴대폰 번호 입력('-' 포함)"/>
                    </div>
                </li>
                <li>
                    <label htmlFor="emailName"><b>이메일 주소</b></label>
                    <span style={{color:"red", fontSize:"0.8rem"}}>{errors.emailDomain}</span>
                    <div>
                        <input type="text"
                               id="emailName"
                               name="emailName"
                               value={form.emailName}
                               ref={refs.emailNameRef}
                               onChange={handleChangeForm}
                               placeholder="이메일 주소"/>
                        <span>@</span>
                        <select name="emailDomain"
                                value={form.emailDomain}
                                ref={refs.emailDomainRef}
                                onChange={handleChangeForm}
                        >
                            <option value="default">선택</option>
                            <option value="naver.com">naver.com</option>
                            <option value="gmail.com">gmail.com</option>
                            <option value="daum.net">daum.net</option>
                        </select>
                    </div>
                </li>
                <li>
                    <button type="submit">가입하기</button>
                    <button type="reset"
                            onClick={handleResetForm}>다시쓰기</button>
                </li>
            </ul>
        </form>
    );
}

