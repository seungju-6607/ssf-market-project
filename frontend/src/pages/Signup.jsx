// src/pages/Signup.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const navigate = useNavigate();
  const { login, issueWelcomeCouponIfNeeded } = useAuth();
  const [form, setForm] = useState({ name: "", email: "" });

  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return;

    // 간단 로그인 대체
    login({ id: `u_${Date.now()}`, name: form.name, email: form.email });

    // 웰컴쿠폰 발급
    setTimeout(() => {
      issueWelcomeCouponIfNeeded();
    }, 0);

    navigate("/mypage/coupons");
  };

  return (
    <div className="container" style={{ maxWidth: 480, padding: "40px 16px" }}>
      <h2>회원가입</h2>
      <form onSubmit={onSubmit}>
        <label>이름</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
          required
        />
        <label>이메일</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
          required
        />
        <button type="submit" style={{ marginTop: 16 }}>가입하기</button>
      </form>
    </div>
  );
}
