import React from "react";
import { getAuth, logoutApi } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import "../Page.css";

export default function AdminDashboard() {
  const auth = getAuth();
  const navigate = useNavigate();
  if (!auth || auth.role !== "admin") {
    navigate("/login");
    return null;
  }
  const logout = () => {
    logoutApi();
    navigate("/");
  };
  return (
    <div className="auth-wrap">
      <h1 className="page-title">관리자 대시보드</h1>
      <div className="card-simple">
        <div>관리자: {auth.email}</div>
        <button className="btn-secondary" onClick={logout}>로그아웃</button>
      </div>
    </div>
  );
}
