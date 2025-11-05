import React from "react";
import { Link } from "react-router-dom";

export default function OrderSuccess() {
  return (
    <div style={{ maxWidth: 720, margin: "40px auto", padding: 24, textAlign: "center" }}>
      <h1 style={{ fontSize: 28, marginBottom: 12 }}>결제가 완료되었습니다!</h1>
      <p>주문 내역은 마이페이지에서 확인하실 수 있어요.</p>
      <div style={{ marginTop: 24, display: "flex", gap: 12, justifyContent: "center" }}>
        <Link to="/mypage" className="btn">마이페이지</Link>
        <Link to="/" className="btn">쇼핑 계속하기</Link>
      </div>
    </div>
  );
}
