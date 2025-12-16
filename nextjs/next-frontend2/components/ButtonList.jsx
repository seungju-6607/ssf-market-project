"use client";

import {useState} from "react";

export default function ButtonList() {
    const [isLogin,setIsLogin] = useState(false);

    const handleLogin = () => {
        alert("로그인 버튼 클릭");
        setIsLogin(!isLogin);
    }
    console.log(isLogin);
    return (
        <ul>
            <li>
                <label>ID</label>
                <input type="text" name="id"/>
            </li>
            <li>
                <label>Password</label>
                <input type="password" name="pwd"/>
            </li>
            <li>
                <button onClick={handleLogin}>Login</button>
                <button onClick={() => {}}>Reset</button>
            </li>

        </ul>
    )
}