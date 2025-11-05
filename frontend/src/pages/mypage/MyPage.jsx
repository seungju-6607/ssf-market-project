// src/pages/mypage/MyPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../../styles/MyPage.css";

export default function MyPage() {
  const loginUser = JSON.parse(localStorage.getItem("loginUser") || "null");

  if (!loginUser) {
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

  const isAdmin = loginUser.role === "admin";

  return (
    <div className="mypage-wrapper">
      <div className="mypage-box">
        <h2>{loginUser.name || loginUser.id || "회원"} 님의 마이페이지</h2>
        <div className="mypage-menu">
          <Link to="/mypage/orders" className="mypage-item">🧾 주문 내역</Link>
          <Link to="/wishlist" className="mypage-item">💜 위시리스트</Link>
          <Link to="/mypage/coupons" className="mypage-item">🎟️ 쿠폰함</Link>
          <Link to="/account/recovery" className="mypage-item">🔑 비밀번호 변경</Link>
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
