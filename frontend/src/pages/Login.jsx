// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");

  const redirect = new URLSearchParams(location.search).get("redirect") || "/";

  const onSubmit = (e) => {
    e.preventDefault();
    // 데모용 간단 로그인
    login({ id: `u_${Date.now()}`, name: email.split("@")[0] || "사용자", email });
    navigate(redirect);
  };

  return (
    <div className="container" style={{ maxWidth: 420, padding: 24 }}>
      <h2>로그인</h2>
      <form onSubmit={onSubmit}>
        <label>이메일</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        <button type="submit" style={{ marginTop: 12 }}>로그인</button>
      </form>
      <p style={{ marginTop: 12 }}>
        처음이신가요? <a href="/signup">회원가입</a>
      </p>
    </div>
  );
}
