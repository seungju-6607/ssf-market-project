// src/pages/MyPageCoupons.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";

function statusText(c) {
  if (c.used) return "사용됨";
  const expired = c.expiresAt && new Date(c.expiresAt).getTime() < Date.now();
  if (expired) return "만료";
  return "사용 가능";
}

export default function MyPageCoupons() {
  const { user, coupons } = useAuth();

  if (!user) {
    return (
      <div className="container" style={{ padding: 24 }}>
        <h2>내 쿠폰</h2>
        <p>로그인이 필요합니다.</p>
        <a className="btn" href="/login?redirect=/mypage/coupons">로그인하기</a>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: 24 }}>
      <h2>내 쿠폰</h2>
      {coupons.length === 0 ? (
        <p>보유한 쿠폰이 없습니다.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: 8 }}>쿠폰명</th>
              <th style={{ textAlign: "left", padding: 8 }}>코드</th>
              <th style={{ textAlign: "right", padding: 8 }}>금액</th>
              <th style={{ textAlign: "left", padding: 8 }}>유효기간</th>
              <th style={{ textAlign: "left", padding: 8 }}>상태</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c.id} style={{ borderTop: "1px solid #eee" }}>
                <td style={{ padding: 8 }}>{c.name}</td>
                <td style={{ padding: 8 }}>{c.code}</td>
                <td style={{ padding: 8, textAlign: "right" }}>
                  {Number(c.amount).toLocaleString()}원
                </td>
                <td style={{ padding: 8 }}>
                  ~ {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : "-"}
                </td>
                <td style={{ padding: 8 }}>{statusText(c)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div style={{ marginTop: 16 }}>
        <a className="btn" href="/checkout">결제하러 가기</a>
      </div>
    </div>
  );
}
