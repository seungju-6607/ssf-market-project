"use client";

import {useState, useRef, useEffect} from 'react';
import { useRouter } from "next/navigation";
import { FaRegUser } from "react-icons/fa6";
import { FaLock } from "react-icons/fa";
import { getLogin } from '@/utils/authAPI.js';
import { getCartCount } from '@/utils/cartAPI.js';
import { useAuthStore } from "@/store/authStore.js";

export default function LoginForm() {
    const router = useRouter();
    const idRef = useRef(null);
    const pwdRef = useRef(null);
    const [formData, setFormData] = useState({id:'', pwd:''});
    const [errors, setErrors] = useState({id:'', pwd:''});
    const login = useAuthStore((s) => s.login);


    /** 입력 폼 데이터 변경 이벤트 처리 **/
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({...formData, [name]:value});
        setErrors({id:'', pwd:''});
    }

    /** 로그인 버튼 이벤트 처리 **/
    const handleLoginSubmit = async (e) => {
        e.preventDefault();

        const param = {
            idRef: idRef,
            pwdRef: pwdRef,
            setErrors: setErrors,
            errors: errors
        }

        const result = await getLogin(formData, param);
        console.log("result-->> ", result);
        if(result?.login) {
                login({
                    userId: result.userId,
                    role: result.role,
                    accessToken: result.accessToken});

            alert("로그인에 성공하셨습니다.");
            router.push("/");
        } else {
            alert("로그인에 실패, 확인후 다시 진행해주세요.");
            setFormData({id:'', pwd:''});
            idRef.current.focus();
        }
    }

    return (
        <form onSubmit={handleLoginSubmit}>
            <ul>
                <li>
                    <p>아이디 비밀번호를 입력하신 후, 로그인 버튼을 클릭해 주세요.</p>
                </li>
                <li>
                    <div className="login-form-input">
                        <FaRegUser />
                        <input  type="text"
                                name="id"
                                value={formData.id}
                                ref={idRef}
                                onChange={handleFormChange}
                                placeholder="아이디를 입력해주세요" />
                    </div>
                    <span style={{color:"red", fontSize:"0.8rem"}}>{errors.id}</span>
                </li>
                <li>
                    <div className="login-form-input">
                        <FaLock />
                        <input  type="password"
                                name="pwd"
                                value={formData.pwd}
                                ref={pwdRef}
                                onChange={handleFormChange}
                                placeholder="패스워드를 입력해주세요" />
                    </div>
                    <span style={{color:"red", fontSize:"0.8rem"}}>{errors.pwd}</span>
                </li>
                <li>
                    <button type="submit"
                            className="btn-main-color"
                    >로그인</button>
                </li>
                <li>
                    <div>
                        <input type="checkbox" name="status" />
                        <label htmlFor="id">아이디 저장</label>
                    </div>
                    <div>
                        <a href="#">아이디 찾기</a>
                        <span>&gt;</span>
                        <a href="#">비밀번호 찾기</a>
                        <span>&gt;</span>
                    </div>
                </li>
                <li>
                    <button className="btn-main-color-naver">네이버 로그인</button>
                </li>
            </ul>
            <div style={{marginTop:"30px"}}>
                <img src="https://adimg.cgv.co.kr//images/202206/loginplus/350x300.png" alt=""/>
            </div>
        </form>
    );
}