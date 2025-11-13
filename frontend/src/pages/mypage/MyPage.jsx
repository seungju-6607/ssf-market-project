// src/pages/mypage/MyPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../../styles/MyPage.css";
import { useAuth } from "../../context/AuthContext.js";

export default function MyPage() {
  const { user: authUser, isAuthenticated, ready } = useAuth();

 
  let backupUser: any = null;
  try {
    backupUser = JSON.parse(localStorage.getItem("loginUser") || "null");
  } catch {}

  const user = authUser || backupUser;


  if (!ready) {
    return (
      <div className="mypage-wrapper">
        <div className="mypage-box">
          <h2>마이페이지</h2>
          <p>불러오는 중…</p>
        </div>
      </div>
    );
  }


  if (!user) {
    return (
      <div className="mypage-wrapper">
        <div className="mypage-box">
          <h2>마이페이지</h2>
          <p>로그인이 필요합니다.</p>
          <Link to="/login" className="mypage-btn">로그인하기</Link>
        </div>
      </div>
    );
  }


  const displayName =
    user.name ||
    user.nickname ||
    user.username ||
    user.id ||
    (user.email ? user.email.split("@")[0] : "회원");


  const role =
    user.role ||
    user.authority ||
    user.auth ||
    (Array.isArray(user.roles) ? user.roles[0] : null) ||
    "";
  const isAdmin = String(role).toLowerCase().includes("admin");

  return (
    <div className="mypage-wrapper">
      <div className="mypage-box">
        <h2>{displayName} 님의 마이페이지</h2>

        <div className="mypage-menu">
          <Link to="/mypage/orders" className="mypage-item">🧾 주문 내역</Link>
          <Link to="/wishlist" className="mypage-item">💜 위시리스트</Link>
          <Link to="/mypage/coupons" className="mypage-item">🎟️ 쿠폰함</Link>
          <Link to="/account/recovery" className="mypage-item">🔑 비밀번호 변경</Link>
          <Link to="/market/my" className="mypage-item">🧺 내 플리마켓</Link>
          <Link to="/market/new" className="mypage-item">➕ 판매글 올리기</Link>

          {isAdmin && (
            <>
              <Link to="/admin" className="mypage-item admin">🛡️ 관리자 대시보드</Link>
              <Link to="/admin/orders" className="mypage-item admin">📦 주문 관리</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
